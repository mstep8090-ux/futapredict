import numpy as np
import pandas as pd

# Set random seed for reproducibility
np.random.seed(42)

# Number of rows
n_rows = 5000

# 1. Month: Integer (1-12)
months = np.random.randint(1, 13, size=n_rows)

# 2. Academic_Phase (Categorical: Resumption, Mid-Semester, Exams, Holidays)
def get_academic_phase(month):
    # Probabilistic mapping based on typical FUTA academic calendar
    # Resumption usually starts in Jan/Feb, and Jun/Jul
    # Exams usually around April/May, and Aug/Sep
    # Holidays: Dec, Jan, May, Oct
    if month in [12, 1]:
        return np.random.choice(['Holidays', 'Resumption'], p=[0.7, 0.3])
    elif month in [2, 6]:
        return np.random.choice(['Resumption', 'Mid-Semester'], p=[0.8, 0.2])
    elif month in [3, 7]:
        return np.random.choice(['Mid-Semester', 'Exams'], p=[0.9, 0.1])
    elif month in [4, 8]:
        return np.random.choice(['Mid-Semester', 'Exams'], p=[0.3, 0.7])
    elif month in [5, 9]:
        return np.random.choice(['Exams', 'Holidays'], p=[0.7, 0.3])
    elif month in [10, 11]:
        return np.random.choice(['Holidays', 'Resumption'], p=[0.9, 0.1])
    return 'Mid-Semester'

academic_phases = [get_academic_phase(m) for m in months]

# 3. Location_Zone (Categorical: South Gate, North Gate, Obanla, Apatapiti, West Gate)
zones = ['South Gate', 'North Gate', 'Obanla', 'Apatapiti', 'West Gate']
# South Gate is the busiest, followed by Obanla, Apatapiti, North Gate, West Gate.
zone_probs = [0.35, 0.15, 0.25, 0.15, 0.10]
location_zones = np.random.choice(zones, size=n_rows, p=zone_probs)

# 4. Business_Category (Categorical: Fast Food, Electronics, POS/Fintech, Fashion, Stationery/Printing)
categories = ['Fast Food', 'Electronics', 'POS/Fintech', 'Fashion', 'Stationery/Printing']
business_categories = np.random.choice(categories, size=n_rows)

# 5. Competitor_Density: Integer (0 to 20)
def get_competitor_density(zone, category):
    # Base density by zone
    zone_base = {
        'South Gate': 12,
        'Obanla': 10,
        'Apatapiti': 7,
        'North Gate': 5,
        'West Gate': 2
    }
    base = zone_base[zone]
    
    # Category adjustment (POS and Fast Food have higher density)
    cat_adj = {
        'POS/Fintech': 4,
        'Fast Food': 3,
        'Stationery/Printing': 1,
        'Fashion': 0,
        'Electronics': -2
    }
    adj = cat_adj[category]
    
    # Mean of Poisson distribution
    mu = max(1, base + adj)
    # Generate value and clip to [0, 20]
    density = np.random.poisson(mu)
    return min(20, max(0, density))

competitor_densities = [get_competitor_density(z, c) for z, c in zip(location_zones, business_categories)]

# 6. Base_Footfall_Index: Float (0.1 to 1.0)
def get_footfall_index(zone, phase):
    zone_base = {
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
    
    base = zone_base[zone]
    factor = phase_factor[phase]
    
    # Calculate with some noise
    val = base * factor + np.random.normal(0, 0.05)
    return round(min(1.0, max(0.1, val)), 3)

footfall_indices = [get_footfall_index(z, p) for z, p in zip(location_zones, academic_phases)]

# Create dataframe
df = pd.DataFrame({
    'Month': months,
    'Academic_Phase': academic_phases,
    'Location_Zone': location_zones,
    'Business_Category': business_categories,
    'Competitor_Density': competitor_densities,
    'Base_Footfall_Index': footfall_indices
})

# 7. Demand_Volume: Integer (0 to 1000) - ML Target
def calculate_demand(row):
    category = row['Business_Category']
    phase = row['Academic_Phase']
    footfall = row['Base_Footfall_Index']
    density = row['Competitor_Density']
    
    base_demands = {
        'Fast Food': 650,
        'Electronics': 200,
        'POS/Fintech': 700,
        'Fashion': 350,
        'Stationery/Printing': 400
    }
    
    base = base_demands[category]
    
    phase_mods = {
        'Fast Food': {
            'Resumption': 1.0,
            'Mid-Semester': 1.1,
            'Exams': 1.0,
            'Holidays': 0.3
        },
        'Electronics': {
            'Resumption': 1.5,
            'Mid-Semester': 0.9,
            'Exams': 0.5,
            'Holidays': 0.2
        },
        'POS/Fintech': {
            'Resumption': 1.4,
            'Mid-Semester': 1.1,
            'Exams': 1.0,
            'Holidays': 0.25
        },
        'Fashion': {
            'Resumption': 1.3,
            'Mid-Semester': 1.0,
            'Exams': 0.5,
            'Holidays': 0.3
        },
        'Stationery/Printing': {
            'Resumption': 1.2,
            'Mid-Semester': 1.0,
            'Exams': 2.2, # Significant spike during Exams
            'Holidays': 0.15
        }
    }
    
    mod = phase_mods[category][phase]
    
    # Competitor sharing effect (dilution)
    density_factor = max(0.6, 1.0 - (density * 0.02))
    
    expected_demand = base * footfall * mod * density_factor
    
    # Add random noise
    noise = np.random.normal(0, expected_demand * 0.1)
    final_demand = int(expected_demand + noise)
    
    return min(1000, max(0, final_demand))

df['Demand_Volume'] = df.apply(calculate_demand, axis=1)

# 8. Location_Suitability_Score: Float (0 to 100) - ML Target
def calculate_suitability(row):
    category = row['Business_Category']
    zone = row['Location_Zone']
    footfall = row['Base_Footfall_Index']
    density = row['Competitor_Density']
    
    synergy = 50.0 # Base suitability
    
    # Zone inherent suitability
    zone_benefits = {
        'South Gate': 15,
        'Obanla': 10,
        'Apatapiti': 5,
        'North Gate': 5,
        'West Gate': -10
    }
    synergy += zone_benefits[zone]
    
    # Category and Zone synergy matches
    if category == 'Stationery/Printing' and zone in ['South Gate', 'North Gate']:
        synergy += 10
    elif category == 'Fast Food' and zone in ['South Gate', 'Obanla', 'Apatapiti']:
        synergy += 5
    elif category == 'POS/Fintech' and zone in ['South Gate', 'Obanla']:
        synergy += 8
    
    # Footfall impact (higher footfall is positive)
    footfall_impact = (footfall - 0.5) * 35.0
    
    # Competitor density impact: non-linear drop for high density
    if density <= 5:
        density_penalty = density * 1.0
    else:
        density_penalty = 5.0 + (density - 5) * 4.0
        
    score = synergy + footfall_impact - density_penalty
    
    # Add random noise
    noise = np.random.normal(0, 4.0)
    final_score = round(score + noise, 2)
    
    return min(100.0, max(0.0, final_score))

df['Location_Suitability_Score'] = df.apply(calculate_suitability, axis=1)

# Save to CSV
df.to_csv('futa_market_data.csv', index=False)
print("Dataset generation complete. Saved 5000 rows to futa_market_data.csv")
