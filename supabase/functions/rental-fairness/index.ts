
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { corsHeaders } from "../_shared/cors.ts";

interface PropertyDetails {
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

interface Metrics {
  locationImportance: number;
  conditionImportance: number;
  sizeImportance: number;
  amenitiesImportance: number;
  marketRateImportance: number;
}

interface MarketData {
  averageRent: number;
  comparableProperties: {
    rent: number;
    squareFeet: number;
    bedrooms: number;
    bathrooms: number;
    distance?: number;
    address?: string;
  }[];
}

interface RequestPayload {
  propertyDetails: PropertyDetails;
  metrics: Metrics;
  marketData?: MarketData;
}

interface EvaluationResult {
  fairnessScore: number;
  analysis: string;
  recommendations: string[] | string;
  fairPriceRange: {
    min: number;
    max: number;
  };
  summary: string;
}

// Function to fetch comparable properties from database
async function fetchComparableProperties(
  supabase: any,
  propertyDetails: PropertyDetails
): Promise<MarketData["comparableProperties"]> {
  // If we have location coordinates, use them for distance calculation
  let query = supabase.from("properties").select("*");

  // Filter by similar properties (bedrooms +/- 1, same city if available)
  if (propertyDetails.bedrooms) {
    query = query
      .gte("bedrooms", propertyDetails.bedrooms - 1)
      .lte("bedrooms", propertyDetails.bedrooms + 1);
  }

  if (propertyDetails.locationDetails?.city) {
    query = query.eq("city", propertyDetails.locationDetails.city);
  }

  // Limit results
  query = query.limit(5);

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching comparable properties:", error);
    return [];
  }

  // Transform the data to match the expected format
  return (data || []).map((property: any) => ({
    rent: property.rent || 1500, // Default value if not available
    squareFeet: property.square_feet || 1000,
    bedrooms: property.bedrooms || propertyDetails.bedrooms,
    bathrooms: property.bathrooms || propertyDetails.bathrooms,
    address: property.address,
  }));
}

// Function to calculate rental fairness score
function calculateFairnessScore(
  propertyDetails: PropertyDetails,
  metrics: Metrics,
  marketData?: MarketData
): EvaluationResult {
  // Default market data if not provided
  const market = marketData || {
    averageRent: 1500, // Default average rent
    comparableProperties: [],
  };

  // Calculate average for comparable properties
  let compAvgRent = 0;
  let compAvgSqFtRate = 0;
  let totalComps = market.comparableProperties.length;

  if (totalComps > 0) {
    compAvgRent =
      market.comparableProperties.reduce((sum, prop) => sum + prop.rent, 0) /
      totalComps;
    compAvgSqFtRate =
      market.comparableProperties.reduce(
        (sum, prop) => sum + prop.rent / prop.squareFeet,
        0
      ) / totalComps;
  } else {
    // Default values if no comparables
    compAvgRent = market.averageRent;
    compAvgSqFtRate = market.averageRent / 1000; // Assume 1000 sqft as baseline
  }

  // Calculate price per square foot
  const pricePerSqFt = propertyDetails.rent / propertyDetails.squareFeet;
  const marketPricePerSqFt = compAvgSqFtRate;

  // Calculate base fairness score based on price comparison
  let baseScore = 100 - Math.min(100, Math.abs((pricePerSqFt / marketPricePerSqFt - 1) * 100));

  // Adjust score based on metrics importance
  const locationMultiplier = propertyDetails.locationDetails ? 1.0 : 0.9;
  const conditionMultiplier = propertyDetails.condition
    ? ["excellent", "good", "very good"].includes(
        propertyDetails.condition.toLowerCase()
      )
      ? 1.1
      : ["fair", "average"].includes(propertyDetails.condition.toLowerCase())
      ? 1.0
      : 0.9
    : 1.0;
  
  const amenitiesMultiplier = 1.0 + Math.min(0.2, propertyDetails.amenities.length * 0.02);

  // Apply importance weights from metrics
  const weightedScore =
    baseScore *
    (locationMultiplier * (metrics.locationImportance / 100) +
      conditionMultiplier * (metrics.conditionImportance / 100) +
      amenitiesMultiplier * (metrics.amenitiesImportance / 100) +
      (marketPricePerSqFt / pricePerSqFt) * (metrics.marketRateImportance / 100) +
      (propertyDetails.squareFeet > 800 ? 1.1 : 0.9) * (metrics.sizeImportance / 100));

  // Normalize score to 0-100 range
  const finalScore = Math.min(100, Math.max(0, Math.round(weightedScore)));

  // Calculate fair price range
  const fairPrice = compAvgSqFtRate * propertyDetails.squareFeet;
  const fairPriceRange = {
    min: Math.round(fairPrice * 0.9),
    max: Math.round(fairPrice * 1.1),
  };

  // Generate analysis
  let analysis = `This property's rent is $${propertyDetails.rent} for ${propertyDetails.squareFeet} square feet, which is $${pricePerSqFt.toFixed(
    2
  )} per square foot. `;
  analysis += `Based on comparable properties in the area, the market rate is approximately $${marketPricePerSqFt.toFixed(
    2
  )} per square foot. `;

  if (pricePerSqFt > marketPricePerSqFt * 1.1) {
    analysis += "The property appears to be priced above market rates. ";
  } else if (pricePerSqFt < marketPricePerSqFt * 0.9) {
    analysis += "The property appears to be priced below market rates. ";
  } else {
    analysis += "The property appears to be priced at fair market value. ";
  }

  // Generate recommendations based on score
  let recommendations: string[] = [];
  if (finalScore < 70) {
    recommendations.push("Consider adjusting the rent to be closer to fair market value.");
    
    if (propertyDetails.rent > fairPriceRange.max) {
      recommendations.push(`Lower the rent closer to the fair price range of $${fairPriceRange.min} - $${fairPriceRange.max}.`);
    }
  }
  
  if (propertyDetails.amenities.length < 3) {
    recommendations.push("Consider adding more amenities to justify the current rent level.");
  }
  
  if (propertyDetails.condition.toLowerCase() === "poor" || propertyDetails.condition.toLowerCase() === "fair") {
    recommendations.push("Improving the property condition could justify a higher rent.");
  }
  
  // Add at least one recommendation
  if (recommendations.length === 0) {
    recommendations.push("Continue monitoring market rates to ensure the property remains competitively priced.");
  }

  // Generate summary
  let summary = "";
  if (finalScore >= 90) {
    summary = "This property is priced exceptionally fairly relative to the market.";
  } else if (finalScore >= 80) {
    summary = "This property is priced fairly relative to the market.";
  } else if (finalScore >= 70) {
    summary = "This property is priced reasonably but could be adjusted to better match the market.";
  } else if (finalScore >= 60) {
    summary = "This property may be somewhat overpriced for its features and location.";
  } else {
    summary = "This property appears to be significantly overpriced relative to the market.";
  }

  return {
    fairnessScore: finalScore,
    analysis,
    recommendations,
    fairPriceRange,
    summary,
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Parse request body
    const { propertyDetails, metrics, marketData }: RequestPayload = await req.json();

    // Validate required inputs
    if (!propertyDetails || !metrics) {
      return new Response(
        JSON.stringify({
          error: "Missing required parameters: propertyDetails or metrics",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Fetch comparable properties if not provided
    let finalMarketData = marketData;
    if (!finalMarketData) {
      const comparableProperties = await fetchComparableProperties(
        supabase,
        propertyDetails
      );
      
      // Calculate average rent from comparables
      let avgRent = 0;
      if (comparableProperties.length > 0) {
        avgRent = comparableProperties.reduce((sum, prop) => sum + prop.rent, 0) / comparableProperties.length;
      } else {
        // Default based on property size and location
        avgRent = propertyDetails.squareFeet * 1.5; // Simple estimation
      }
      
      finalMarketData = {
        averageRent: avgRent,
        comparableProperties,
      };
    }

    // Calculate fairness score
    const result = calculateFairnessScore(propertyDetails, metrics, finalMarketData);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in rental fairness calculation:", error);
    
    return new Response(
      JSON.stringify({
        error: `Server error: ${error.message}`,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
