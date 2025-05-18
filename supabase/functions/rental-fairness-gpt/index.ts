
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface FairnessEvalRequest {
  propertyDetails: {
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
  };
  metrics: {
    locationImportance: number;
    conditionImportance: number;
    sizeImportance: number;
    amenitiesImportance: number;
    marketRateImportance: number;
  };
  marketData?: {
    averageRent: number;
    comparableProperties?: Array<{
      rent: number;
      squareFeet: number;
      bedrooms: number;
      bathrooms: number;
      distance?: number;
      address?: string;
    }>;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { propertyDetails, metrics, marketData }: FairnessEvalRequest = await req.json();

    // Check for required API key
    const openAiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAiApiKey) {
      return new Response(
        JSON.stringify({ 
          error: "OpenAI API key is not configured. Please add it to your project settings." 
        }),
        { 
          status: 400, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    // Enhanced location data
    const locationDetails = propertyDetails.locationDetails || {
      street: '',
      city: '',
      state: '',
      zip: '',
      lat: 0,
      lng: 0
    };

    // Structure the prompt for the AI with enhanced location data
    const prompt = `
      I want you to act as a rental property fairness evaluator. I will provide details about a rental property and you'll evaluate if the rent is fair based on the following metrics:
      
      PROPERTY DETAILS:
      - Monthly Rent: $${propertyDetails.rent}
      - Square Footage: ${propertyDetails.squareFeet} sq ft
      - Bedrooms: ${propertyDetails.bedrooms}
      - Bathrooms: ${propertyDetails.bathrooms}
      - Address: ${propertyDetails.location}
      - Location Details:
        * Street: ${locationDetails.street}
        * City: ${locationDetails.city}
        * State: ${locationDetails.state}
        * Zip: ${locationDetails.zip}
        * Coordinates: ${locationDetails.lat}, ${locationDetails.lng}
      - Amenities: ${propertyDetails.amenities.join(", ")}
      - Property Condition: ${propertyDetails.condition}
      
      EVALUATION METRICS (Importance scale 1-10):
      - Location Value: ${metrics.locationImportance}/10
      - Property Condition: ${metrics.conditionImportance}/10
      - Size and Layout: ${metrics.sizeImportance}/10
      - Amenities: ${metrics.amenitiesImportance}/10
      - Market Rate Comparison: ${metrics.marketRateImportance}/10
      
      ${marketData ? `
      MARKET DATA:
      - Average Rent in Area: $${marketData.averageRent}
      ${marketData.comparableProperties && marketData.comparableProperties.length > 0 ? `
      - Comparable Properties:
        ${marketData.comparableProperties.map((prop, i) => 
          `  ${i+1}. $${prop.rent}/month, ${prop.squareFeet} sq ft, ${prop.bedrooms}bd/${prop.bathrooms}ba${prop.distance ? `, ${prop.distance} miles away` : ''}${prop.address ? `, at ${prop.address}` : ''}`
        ).join('\n')}
      ` : ''}
      ` : ''}
      
      Please provide:
      1. A fairness score from 1-100 (where 100 is perfectly fair)
      2. A detailed analysis based on the above metrics
      3. Recommendations to make the rent more fair if needed
      4. A price range that would be considered fair for this property
      
      Format your response as a JSON object with these keys: fairnessScore, analysis, recommendations (as an array), fairPriceRange (with min and max values), and a summary.
    `;

    // Make API call to OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openAiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Using a capable model for analysis
        messages: [
          { role: "system", content: "You are a rental property fairness evaluation assistant that helps determine if rental prices are fair based on provided metrics and market data. You always respond in valid JSON format." },
          { role: "user", content: prompt }
        ],
        temperature: 0.5,
      }),
    });

    const openAiResponse = await response.json();
    let aiOutput = openAiResponse.choices[0].message.content;
    
    // Try to parse JSON from the response
    try {
      // Find the JSON object in the response
      const jsonMatch = aiOutput.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiOutput = jsonMatch[0];
      }
      
      const parsedOutput = JSON.parse(aiOutput);
      return new Response(JSON.stringify(parsedOutput), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    } catch (parseError) {
      // If JSON parsing fails, return the original text
      console.error("Error parsing JSON from AI response:", parseError);
      return new Response(JSON.stringify({ 
        error: "Failed to parse structured data",
        rawResponse: aiOutput 
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
