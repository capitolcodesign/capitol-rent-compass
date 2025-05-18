
// Property Details
export interface PropertyDetails {
  rent: number;
  squareFeet: number;
  bedrooms: number;
  bathrooms: number;
  location: string;
  locationDetails?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    lat: number;
    lng: number;
  };
  amenities: string[];
  condition: string;
}

// Market Data
export interface ComparableProperty {
  rent: number;
  squareFeet: number;
  bedrooms: number;
  bathrooms: number;
  distance?: number; // distance from main property in miles
  address?: string;
}

export interface MarketData {
  averageRent: number;
  comparableProperties: ComparableProperty[];
}

// Fairness Evaluation Metrics
export interface Metrics {
  locationImportance: number;
  conditionImportance: number;
  sizeImportance: number;
  amenitiesImportance: number;
  marketRateImportance: number;
}

// API Request payload
export interface FairnessEvalRequest {
  propertyDetails: PropertyDetails;
  metrics: Metrics;
  marketData?: MarketData;
}

// API Response
export interface EvaluationResult {
  fairnessScore: number;
  analysis: string;
  recommendations: string[] | string;
  fairPriceRange: {
    min: number;
    max: number;
  };
  summary: string;
}

// API Integration settings
export interface ApiIntegration {
  name: string;
  key: string;
  enabled: boolean;
  description: string;
  category: 'property' | 'demographic' | 'maps' | 'other';
}
