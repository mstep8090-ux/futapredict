import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
import joblib

def main():
    # 1. Load the CSV data
    csv_file = 'futa_market_data.csv'
    if not os.path.exists(csv_file):
        raise FileNotFoundError(f"Required data file '{csv_file}' not found. Please run the data generation script first.")
    
    print(f"Loading dataset from {csv_file}...")
    df = pd.read_csv(csv_file)
    
    # Define features and targets
    categorical_cols = ['Academic_Phase', 'Location_Zone', 'Business_Category']
    numerical_cols = ['Month', 'Competitor_Density', 'Base_Footfall_Index']
    
    X = df[categorical_cols + numerical_cols]
    y_demand = df['Demand_Volume']
    y_suitability = df['Location_Suitability_Score']
    
    # 2. Split data into train and test sets
    X_train, X_test, y_train_demand, y_test_demand = train_test_split(
        X, y_demand, test_size=0.2, random_state=42
    )
    _, _, y_train_suitability, y_test_suitability = train_test_split(
        X, y_suitability, test_size=0.2, random_state=42
    )
    
    # 3. Create preprocessor using ColumnTransformer
    print("Initializing and fitting preprocessor...")
    preprocessor = ColumnTransformer(
        transformers=[
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_cols),
            ('num', StandardScaler(), numerical_cols)
        ]
    )
    
    # Fit the preprocessor on the training data and transform train and test sets
    X_train_processed = preprocessor.fit_transform(X_train)
    X_test_processed = preprocessor.transform(X_test)
    
    # 4. Train Model A: Predicts Demand_Volume
    print("Training Model A (Demand_Volume Regressor)...")
    model_demand = RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42)
    model_demand.fit(X_train_processed, y_train_demand)
    
    # Evaluate Model A
    y_pred_demand = model_demand.predict(X_test_processed)
    rmse_demand = np.sqrt(mean_squared_error(y_test_demand, y_pred_demand))
    r2_demand = r2_score(y_test_demand, y_pred_demand)
    
    print("\n--- Model A Evaluation (Demand_Volume) ---")
    print(f"Root Mean Squared Error (RMSE): {rmse_demand:.4f}")
    print(f"R-squared (R2) Score: {r2_demand:.4f}")
    
    # 5. Train Model B: Predicts Location_Suitability_Score
    print("\nTraining Model B (Location_Suitability_Score Regressor)...")
    model_suitability = RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42)
    model_suitability.fit(X_train_processed, y_train_suitability)
    
    # Evaluate Model B
    y_pred_suitability = model_suitability.predict(X_test_processed)
    rmse_suitability = np.sqrt(mean_squared_error(y_test_suitability, y_pred_suitability))
    r2_suitability = r2_score(y_test_suitability, y_pred_suitability)
    
    print("\n--- Model B Evaluation (Location_Suitability_Score) ---")
    print(f"Root Mean Squared Error (RMSE): {rmse_suitability:.4f}")
    print(f"R-squared (R2) Score: {r2_suitability:.4f}")
    
    # 6. Save models and preprocessor
    models_dir = 'models'
    os.makedirs(models_dir, exist_ok=True)
    
    preprocessor_path = os.path.join(models_dir, 'preprocessor.pkl')
    demand_model_path = os.path.join(models_dir, 'demand_model.pkl')
    location_model_path = os.path.join(models_dir, 'location_model.pkl')
    
    print(f"\nSaving preprocessor and models to '{models_dir}/' folder...")
    joblib.dump(preprocessor, preprocessor_path)
    joblib.dump(model_demand, demand_model_path)
    joblib.dump(model_suitability, location_model_path)
    
    print("Saving complete!")

if __name__ == "__main__":
    main()
