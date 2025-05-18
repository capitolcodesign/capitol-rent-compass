
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { corsHeaders } from "../_shared/cors.ts";

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    return new Response(
      JSON.stringify({ error: 'OpenAI API key not found' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }

  try {
    // Parse request payload
    const { message, propertyId, propertyName, address, history } = await req.json();

    if (!message || !propertyId) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: message or propertyId' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Fetch additional property details
    const { data: propertyData, error: propertyError } = await supabase
      .from('properties')
      .select('*, property_amenities(*), property_notes(*), property_custom_fields(*)')
      .eq('id', propertyId)
      .single();

    if (propertyError) {
      console.error("Error fetching property details:", propertyError);
    }

    // Prepare the system prompt with property information
    let systemPrompt = `You are a helpful real estate assistant specializing in rental properties. You're currently discussing a property with the following details:
    
Name: ${propertyName}
Address: ${address}`;

    // Add additional property details if available
    if (propertyData) {
      systemPrompt += `
Type: ${propertyData.type || 'N/A'}
Units: ${propertyData.units || 'N/A'}
Built year: ${propertyData.built_year || 'N/A'}
`;

      // Add amenities if available
      if (propertyData.property_amenities && propertyData.property_amenities.length > 0) {
        systemPrompt += `\nAmenities: ${propertyData.property_amenities.map((a: any) => a.name).join(', ')}`;
      }

      // Add custom fields if available
      if (propertyData.property_custom_fields && propertyData.property_custom_fields.length > 0) {
        systemPrompt += `\nAdditional details:`;
        propertyData.property_custom_fields.forEach((field: any) => {
          systemPrompt += `\n- ${field.field_name}: ${field.field_value || 'N/A'}`;
        });
      }
    }

    systemPrompt += `\n\nProvide helpful, accurate, and concise information about this property. Answer questions based on the property details provided. If asked about information you don't have, politely explain that you don't have that specific detail.`;

    // Prepare conversation history
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
    ];

    // Add conversation history if available
    if (history && Array.isArray(history)) {
      messages.push(...history.map((msg: {role: string, content: string}) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      })));
    }

    // Add the current user message
    messages.push({ role: 'user', content: message });

    console.log("Sending to OpenAI:", JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: 500,
    }));

    // Call OpenAI API
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.json();
      throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`);
    }

    const aiData = await openAIResponse.json();
    const aiReply = aiData.choices[0].message.content;

    // Return the response
    return new Response(
      JSON.stringify({ response: aiReply }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in rental assistant chat:', error);
    
    return new Response(
      JSON.stringify({ error: `Server error: ${(error as Error).message}` }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
