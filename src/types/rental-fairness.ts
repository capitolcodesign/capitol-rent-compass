
export interface PropertyDetails {
  rent: number;
  squareFeet: number;
  bedrooms: number;
  bathrooms: number;
  location: string;
  amenities: string[];
  condition: string;
}

export interface ComparableProperty {
  rent: number;
  squareFeet: number;
  bedrooms: number;
  bathrooms: number;
}

export interface MarketData {
  averageRent: number;
  comparableProperties: ComparableProperty[];
}

export interface Metrics {
  locationImportance: number;
  conditionImportance: number;
  sizeImportance: number;
  amenitiesImportance: number;
  marketRateImportance: number;
}

export interface FairnessEvalRequest {
  propertyDetails: PropertyDetails;
  metrics: Metrics;
  marketData?: MarketData;
}

export interface EvaluationResult {
  fairnessScore: number;
  analysis: string;
  recommendations: string;
  fairPriceRange: {
    min: number;
    max: number;
  };
  summary: string;
}
