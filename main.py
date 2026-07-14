import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base, SessionLocal
import models
from routers import auth, predict

# Create database tables
Base.metadata.create_all(bind=engine)

def seed_database():
    db = SessionLocal()
    try:
        # Check and Seed Categories and Products
        if db.query(models.Category).first() is None:
            print("Seeding FUTA Categories & Products...")
            seed_data = {
                "Fast Food & Eatery": [
                    "Shawarma", "Burgers", "Fried Rice/Jollof", 
                    "Noodles (Indomie/Egg)", "Meatpie/Pastries", "Roasted Plantain (Boli)"
                ],
                "Electronics & Gadgets": [
                    "Power Banks", "Laptops (Used/New)", "Phone Chargers/Cords", 
                    "AirPods/Earpieces", "Ring Lights"
                ],
                "Fashion & Apparel": [
                    "Branded FUTA Hoodies", "Vintage Shirts", "Sneakers", 
                    "Crocs", "Perfumes/Oils"
                ],
                "Provisions & Groceries": [
                    "Garri", "Spaghetti", "Palm/Groundnut Oil", 
                    "Beverages (Milo/Milk)", "Toiletries"
                ],
                "Services": [
                    "POS Operations", "Laptop Repair", "Phone Screen Replacement", 
                    "Hairdressing/Barbing", "Photocopy/Printing"
                ]
            }
            
            for cat_name, products in seed_data.items():
                category = models.Category(name=cat_name)
                db.add(category)
                db.flush() # populate category.id
                
                for prod_name in products:
                    product = models.Product(name=prod_name, category_id=category.id)
                    db.add(product)
            db.commit()
            print("Categories and Products seeded successfully.")

        # Check and Seed Locations
        if db.query(models.Location).first() is None:
            print("Seeding FUTA Locations...")
            inside_locations = [
                "Student Union Building (SUB)", "ETF Lecture Theatre", "CCE", 
                "Obafemi Awolowo Hall", "Akindeko Hall", "FCSC (Cooperative)"
            ]
            off_locations = [
                "South Gate", "North Gate", "West Gate", "Obanla", 
                "Apatapiti", "Stateline Junction", "FUTA Road"
            ]
            
            for loc_name in inside_locations:
                db.add(models.Location(name=loc_name, type="Inside Campus"))
                
            for loc_name in off_locations:
                db.add(models.Location(name=loc_name, type="Off-Campus"))
                
            db.commit()
            print("Locations seeded successfully.")
            
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

# Seed database
seed_database()

app = FastAPI(
    title="FUTA Market Intelligence Dashboard API",
    description="Backend API for predicting market demand and location suitability for business zones around FUTA.",
    version="1.1.0"
)

# Configure CORS for React Vite frontend
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(predict.router)

@app.get("/")
def read_root():
    return {
        "status": "healthy",
        "message": "FUTA Market Intelligence Dashboard API is running."
    }
