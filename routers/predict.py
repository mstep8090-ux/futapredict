import os
from datetime import datetime
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Header, status
from sqlalchemy.orm import Session
import pandas as pd
import numpy as np
import joblib
from jose import jwt, JWTError

import models
import schemas
from database import get_db

router = APIRouter(
    prefix="/api",
    tags=["Predictions"]
)

# JWT configurations (for extracting optional user credentials)
SECRET_KEY = "futa_market_intelligence_dashboard_secret_key"
ALGORITHM = "HS256"

# Load models and preprocessor on startup
MODELS_DIR = os.path.abspath("models")
preprocessor_path = os.path.join(MODELS_DIR, 'preprocessor.pkl')
demand_model_path = os.path.join(MODELS_DIR, 'demand_model.pkl')
location_model_path = os.path.join(MODELS_DIR, 'location_model.pkl')

if not os.path.exists(preprocessor_path) or not os.path.exists(demand_model_path) or not os.path.exists(location_model_path):
    raise RuntimeError("Machine Learning models are not trained yet. Please run train_models.py first.")

preprocessor = joblib.load(preprocessor_path)
demand_model = joblib.load(demand_model_path)
location_model = joblib.load(location_model_path)


# Helper: Extract optional User ID from JWT Token in authorization header
def get_optional_user_id(authorization: Optional[str] = Header(None)) -> Optional[int]:
    if not authorization:
        print("DEBUG AUTH: No authorization header found!")
        return None
    try:
        token = authorization.split(" ")[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print(f"DEBUG AUTH: Decoded successfully. user_id={payload.get('user_id')}")
        return payload.get("user_id")
    except Exception as e:
        print(f"DEBUG AUTH: JWT Decode failed! Error: {e}, Authorization Header: {authorization}")
        return None


# Helper: Generate realistic competitor density and footfall indices for queries
def get_derived_features(zone: str, category: str, phase: str):
    zone_base_density = {
        'South Gate': 12,
        'Obanla': 10,
        'Apatapiti': 7,
        'North Gate': 5,
        'West Gate': 2
    }
    cat_adj_density = {
        'POS/Fintech': 4,
        'Fast Food': 3,
        'Stationery/Printing': 1,
        'Fashion': 0,
        'Electronics': -2
    }
    density = max(0, zone_base_density.get(zone, 5) + cat_adj_density.get(category, 0))
    
    zone_base_footfall = {
        'South Gate': 0.85,
        'Obanla': 0.75,
        'Apatapiti': 0.60,
        'North Gate': 0.50,
        'West Gate': 0.30
    }
    phase_factor = {
        'Resumption': 0.90,
        'Mid-Semester': 1.00,
        'Exams': 0.95,
        'Holidays': 0.25
    }
    footfall = zone_base_footfall.get(zone, 0.5) * phase_factor.get(phase, 1.0)
    footfall = round(min(1.0, max(0.1, footfall)), 3)
    
    return density, footfall


# Helper: Get deterministic academic phase based on month
def get_phase_for_month(month: int) -> str:
    if month in [12, 1, 10, 11]:
        return "Holidays"
    elif month in [2, 6]:
        return "Resumption"
    elif month in [3, 4, 7, 8]:
        return "Mid-Semester"
    elif month in [5, 9]:
        return "Exams"
    return "Mid-Semester"


# Helper: Map granular FUTA product to ML trained base category
def map_product_to_base_category(product_name: str) -> str:
    fast_food_items = ["Shawarma", "Burgers", "Fried Rice/Jollof", "Noodles (Indomie/Egg)", "Meatpie/Pastries", "Roasted Plantain (Boli)"]
    electronics_items = ["Power Banks", "Laptops (Used/New)", "Phone Chargers/Cords", "AirPods/Earpieces", "Ring Lights", "Laptop Repair", "Phone Screen Replacement"]
    fashion_items = ["Branded FUTA Hoodies", "Vintage Shirts", "Sneakers", "Crocs", "Perfumes/Oils", "Hairdressing/Barbing"]
    provisions_items = ["Garri", "Spaghetti", "Palm/Groundnut Oil", "Beverages (Milo/Milk)", "Toiletries"]
    
    if product_name in fast_food_items:
        return "Fast Food"
    elif product_name in electronics_items:
        return "Electronics"
    elif product_name in fashion_items:
        return "Fashion"
    elif product_name in provisions_items:
        return "POS/Fintech"
    elif product_name == "POS Operations":
        return "POS/Fintech"
    elif product_name == "Photocopy/Printing":
        return "Stationery/Printing"
    
    return "Fast Food"


# Helper: Map granular FUTA location to ML trained base zone
def map_location_to_base_zone(location_name: str) -> str:
    mapping = {
        "Student Union Building (SUB)": "South Gate",
        "Akindeko Hall": "South Gate",
        "ETF Lecture Theatre": "North Gate",
        "FCSC (Cooperative)": "North Gate",
        "CCE": "Apatapiti",
        "Obafemi Awolowo Hall": "Obanla",
        "Stateline Junction": "Obanla",
        "FUTA Road": "Apatapiti",
        
        "South Gate": "South Gate",
        "North Gate": "North Gate",
        "West Gate": "West Gate",
        "Obanla": "Obanla",
        "Apatapiti": "Apatapiti"
    }
    return mapping.get(location_name, "South Gate")


# Helper: Product demand volume scaling multiplier
def get_product_demand_multiplier(product_name: str) -> float:
    multipliers = {
        "Shawarma": 0.9,
        "Burgers": 0.8,
        "Fried Rice/Jollof": 1.2,
        "Noodles (Indomie/Egg)": 1.6,
        "Meatpie/Pastries": 1.3,
        "Roasted Plantain (Boli)": 1.1,
        "Power Banks": 0.8,
        "Laptops (Used/New)": 0.15,
        "Phone Chargers/Cords": 1.5,
        "AirPods/Earpieces": 1.1,
        "Ring Lights": 0.6,
        "Branded FUTA Hoodies": 0.75,
        "Vintage Shirts": 1.2,
        "Sneakers": 0.8,
        "Crocs": 1.1,
        "Perfumes/Oils": 1.4,
        "Garri": 1.8,
        "Spaghetti": 1.5,
        "Palm/Groundnut Oil": 1.0,
        "Beverages (Milo/Milk)": 1.4,
        "Toiletries": 1.6,
        "POS Operations": 2.0,
        "Laptop Repair": 0.3,
        "Phone Screen Replacement": 0.4,
        "Hairdressing/Barbing": 1.1,
        "Photocopy/Printing": 2.2
    }
    return multipliers.get(product_name, 1.0)


# Helper: Custom suitability score adjustments for FUTA specific campus zones
def adjust_suitability_score(score: float, location_name: str, product_name: str) -> float:
    adj = 0.0
    if location_name == "Student Union Building (SUB)":
        if product_name in ["Shawarma", "Burgers", "Noodles (Indomie/Egg)", "POS Operations", "Photocopy/Printing"]:
            adj += 12.0
    elif location_name == "ETF Lecture Theatre":
        if product_name in ["Photocopy/Printing", "Phone Chargers/Cords"]:
            adj += 8.0
    elif location_name in ["Obafemi Awolowo Hall", "Akindeko Hall"]:
        if product_name in ["Garri", "Spaghetti", "Noodles (Indomie/Egg)", "POS Operations", "Toiletries"]:
            adj += 15.0
            
    if location_name == "West Gate":
        adj -= 5.0
        
    return min(100.0, max(0.0, score + adj))


# Helper: Generate actionable, FUTA-contextual selling strategy
def generate_ai_strategy(product: str, location: str, phase: str) -> str:
    if "Noodles" in product or "Shawarma" in product or "Burgers" in product:
        return (
            f"Selling {product} at {location} during the {phase} phase requires targeting students "
            f"during peak study hours (5 PM to 11 PM). Consider setting up close to student hostels "
            f"and offering late-night delivery services to capture night-readers."
        )
    elif "Hoodies" in product or "Shirts" in product or "Sneakers" in product:
        return (
            f"To sell {product} at {location}, capitalize on the resumption wave by running targeted WhatsApp "
            f"and Instagram promotions. Setting up group-order discounts for specific student departments or campus clubs "
            f"is highly effective."
        )
    elif "POS" in product:
        return (
            f"Running POS Operations at {location} requires maintaining high cash reserves during "
            f"resumption and exams when campus ATMs are frequently down. Offer reliable service and "
            f"collaborate with surrounding grocery vendors to handle small transactions."
        )
    elif "Photocopy" in product or "Printing" in product:
        return (
            f"Photocopy/Printing services at {location} see a massive volume surge during {phase}. Ensure "
            f"you have backup generators ready for power outages, and print course summaries "
            f"in bulk for quick sales before lectures."
        )
    elif "Garri" in product or "Spaghetti" in product or "Beverages" in product:
        return (
            f"Provisions like {product} sell consistently at {location}, especially during mid-semester. "
            f"Offer student-friendly 'mini-packs' or bundles, and align your inventory levels with student allowance cycles."
        )
    return (
        f"Launching {product} at {location} during {phase} requires targeted campus social media promotions. "
        f"Build brand trust by offering student discounts, and leverage peer-to-peer delivery to halls of residence."
    )


@router.get("/categories", response_model=List[schemas.CategoryOut])
def get_categories(db: Session = Depends(get_db)):
    return db.query(models.Category).all()


@router.get("/locations", response_model=List[schemas.LocationOut])
def get_locations(db: Session = Depends(get_db)):
    return db.query(models.Location).all()


@router.post("/predict", response_model=schemas.PredictionResponse)
def predict_market_metrics(
    query: schemas.PredictionQuery,
    user_id: Optional[int] = Depends(get_optional_user_id),
    db: Session = Depends(get_db)
):
    specific_product = query.specific_product
    location_zone = query.location_zone
    
    # Parse target month from launch date
    try:
        dt = datetime.strptime(query.launch_date, "%Y-%m-%d")
        start_month = dt.month
    except Exception:
        # Fallback to current month if format is incorrect
        start_month = datetime.utcnow().month
        
    primary_phase = get_phase_for_month(start_month)
    
    # Map to base categories for ML model
    base_category = map_product_to_base_category(specific_product)
    base_zone = map_location_to_base_zone(location_zone)
    
    demand_forecast = []
    primary_suitability_score = 0.0
    primary_density = 0
    primary_footfall = 0.0
    
    # Predict for the target month and the subsequent 5 months
    for i in range(6):
        current_month = (start_month + i - 1) % 12 + 1
        current_phase = primary_phase if i == 0 else get_phase_for_month(current_month)
        
        # Derive base features
        density, footfall = get_derived_features(base_zone, base_category, current_phase)
        
        if i == 0:
            primary_density = density
            primary_footfall = footfall
        
        # Create input row
        input_data = pd.DataFrame([{
            'Month': current_month,
            'Academic_Phase': current_phase,
            'Location_Zone': base_zone,
            'Business_Category': base_category,
            'Competitor_Density': density,
            'Base_Footfall_Index': footfall
        }])
        
        # Predict using models
        try:
            processed_data = preprocessor.transform(input_data)
            pred_demand = demand_model.predict(processed_data)[0]
            pred_suitability = location_model.predict(processed_data)[0]
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Model inference failed: {str(e)}"
            )
            
        # Apply product multipliers and adjust suitability
        multiplier = get_product_demand_multiplier(specific_product)
        scaled_demand = int(round(pred_demand * multiplier))
        adjusted_suitability = adjust_suitability_score(pred_suitability, location_zone, specific_product)
        
        demand_forecast.append(scaled_demand)
        
        if i == 0:
            primary_suitability_score = float(round(adjusted_suitability, 2))
            
    # Calculate detailed JSON metrics
    saturation_level = float(round((primary_density / 20.0) * 100.0, 2))
    footfall_index = float(round(primary_footfall * 100.0, 2))
    
    # Determine viability status
    if primary_suitability_score > 75:
        viability_status = "Highly Viable"
    elif primary_suitability_score >= 50:
        viability_status = "Moderate Risk"
    else:
        viability_status = "Saturated/Low Footfall"
        
    # Expected ROI and Recommended Capital Allocation
    # Expect ROI to be relative to the suitability rating (ranges from 10% to 60%)
    expected_roi = float(round(10.0 + (primary_suitability_score / 100.0) * 50.0, 2))
    
    # Capital allocation fraction based on suitability (better suitability -> allocate more)
    allocation_percentage = 0.3 + (primary_suitability_score / 100.0) * 0.6
    recommended_capital = float(round(query.investment_capital * allocation_percentage, 2))
    profitability_index = bool(expected_roi > 18.0)
    
    # Generate Selling Strategy
    ai_strategy = generate_ai_strategy(specific_product, location_zone, primary_phase)
            
    # Log this prediction query into the database
    log_entry = models.PredictionLog(
        user_id=user_id,
        queried_product=specific_product,
        target_location=location_zone,
        predicted_demand=demand_forecast[0],
        suitability_score=primary_suitability_score,
        timestamp=datetime.utcnow()
    )
    db.add(log_entry)
    db.commit()
    db.refresh(log_entry)
    
    return {
        "demand_trend": demand_forecast,
        "location_metrics": {
            "saturation_level": saturation_level,
            "footfall_index": footfall_index,
            "viability_status": viability_status
        },
        "financial_forecast": {
            "recommended_capital_allocation": recommended_capital,
            "expected_roi_percentage": expected_roi,
            "profitability_index": profitability_index
        },
        "ai_strategy": ai_strategy
    }


@router.get("/predictions/history", response_model=List[schemas.PredictionLogOut])
def get_prediction_history(
    user_id: Optional[int] = Depends(get_optional_user_id),
    db: Session = Depends(get_db)
):
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token required to fetch history."
        )
    return db.query(models.PredictionLog).filter(
        models.PredictionLog.user_id == user_id
    ).order_by(models.PredictionLog.timestamp.desc()).all()
