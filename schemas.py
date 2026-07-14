from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    full_name: str
    email: str
    primary_business_interest: Optional[str] = None

class UserCreate(UserBase):
    password: str = Field(..., min_length=6, description="Password must be at least 6 characters long")

class UserLogin(BaseModel):
    email: str
    password: str

class UserOut(UserBase):
    id: int

    class Config:
        from_attributes = True


# Product & Category Schemas
class ProductOut(BaseModel):
    id: int
    name: str
    category_id: int

    class Config:
        from_attributes = True

class CategoryOut(BaseModel):
    id: int
    name: str
    products: List[ProductOut] = []

    class Config:
        from_attributes = True

class LocationOut(BaseModel):
    id: int
    name: str
    type: str

    class Config:
        from_attributes = True


# Prediction Schemas
class PredictionQuery(BaseModel):
    specific_product: str = Field(..., description="FUTA-specific product name")
    investment_capital: float = Field(..., ge=0, description="Capital in Naira")
    launch_date: str = Field(..., description="Launch date in YYYY-MM-DD format")
    location_zone: str = Field(..., description="FUTA-specific location zone")

class LocationMetrics(BaseModel):
    saturation_level: float
    footfall_index: float
    viability_status: str

class FinancialForecast(BaseModel):
    recommended_capital_allocation: float
    expected_roi_percentage: float
    profitability_index: bool

class PredictionResponse(BaseModel):
    demand_trend: List[int]
    location_metrics: LocationMetrics
    financial_forecast: FinancialForecast
    ai_strategy: str

class PredictionLogOut(BaseModel):
    id: int
    queried_product: str
    target_location: str
    predicted_demand: int
    suitability_score: float
    timestamp: datetime

    class Config:
        from_attributes = True
