
import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Address {
  id: string;
  full: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  lat: number;
  lng: number;
}

interface AddressAutocompleteProps {
  onAddressSelect: (address: Address) => void;
  defaultValue?: string;
  placeholder?: string;
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({ 
  onAddressSelect, 
  defaultValue = '', 
  placeholder = "Search for an address..."
}) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  
  // Fetch Google Maps API key from settings
  const { data: apiKeys } = useQuery({
    queryKey: ['api_keys'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('app_settings')
        .select('key, value')
        .in('key', ['google_maps_api_key']);
      
      if (error) throw error;
      
      const keys: Record<string, string> = {};
      data.forEach(item => {
        keys[item.key] = item.value;
      });
      
      return keys;
    }
  });

  // Initialize Google Places Autocomplete after the API key is fetched
  useEffect(() => {
    if (!apiKeys?.google_maps_api_key || window.google?.maps?.places) return;
    
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKeys.google_maps_api_key}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      autocompleteService.current = new google.maps.places.AutocompleteService();
      
      // Create a dummy div for Places Service
      const placesDiv = document.createElement('div');
      placesDiv.style.display = 'none';
      document.body.appendChild(placesDiv);
      
      placesService.current = new google.maps.places.PlacesService(placesDiv);
    };
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, [apiKeys?.google_maps_api_key]);

  // Handle address search with Google Places API
  useEffect(() => {
    if (!searchValue || searchValue.length < 3 || !autocompleteService.current) {
      setSuggestions([]);
      return;
    }
    
    const fetchSuggestions = async () => {
      try {
        autocompleteService.current?.getPlacePredictions(
          {
            input: searchValue,
            types: ['address']
          },
          (predictions, status) => {
            if (status !== google.maps.places.PlacesServiceStatus.OK || !predictions) {
              console.error('Error fetching place predictions:', status);
              return;
            }
            
            const addressSuggestions = predictions.map(prediction => ({
              id: prediction.place_id,
              full: prediction.description,
              street: '', // These will be filled when selected
              city: '',
              state: '',
              zip: '',
              lat: 0,
              lng: 0
            }));
            
            setSuggestions(addressSuggestions);
          }
        );
      } catch (error) {
        console.error('Error getting place predictions:', error);
        setSuggestions([]);
      }
    };
    
    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [searchValue, autocompleteService.current]);

  const handleAddressSelect = (address: Address) => {
    if (!placesService.current) {
      console.error('Places service not initialized');
      return;
    }
    
    placesService.current.getDetails(
      { placeId: address.id },
      (place, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK || !place || !place.geometry) {
          console.error('Error fetching place details:', status);
          return;
        }
        
        // Parse address components
        let street = '';
        let city = '';
        let state = '';
        let zip = '';
        
        place.address_components?.forEach(component => {
          const types = component.types;
          
          if (types.includes('street_number')) {
            street = `${component.long_name} `;
          } else if (types.includes('route')) {
            street += component.long_name;
          } else if (types.includes('locality')) {
            city = component.long_name;
          } else if (types.includes('administrative_area_level_1')) {
            state = component.short_name;
          } else if (types.includes('postal_code')) {
            zip = component.long_name;
          }
        });
        
        const completeAddress: Address = {
          id: address.id,
          full: place.formatted_address || address.full,
          street,
          city,
          state,
          zip,
          lat: place.geometry.location?.lat() || 0,
          lng: place.geometry.location?.lng() || 0
        };
        
        setSelectedAddress(completeAddress);
        setSearchValue(completeAddress.full);
        setOpen(false);
        onAddressSelect(completeAddress);
      }
    );
  };

  // Fallback to mock data if API key isn't available
  const MOCK_ADDRESSES = [
    { id: '1', full: '123 Oak St, Sacramento, CA 95814', street: '123 Oak St', city: 'Sacramento', state: 'CA', zip: '95814', lat: 38.581572, lng: -121.494400 },
    { id: '2', full: '456 Elm Ave, Sacramento, CA 95825', street: '456 Elm Ave', city: 'Sacramento', state: 'CA', zip: '95825', lat: 38.568600, lng: -121.410600 },
    { id: '3', full: '789 Pine Rd, Sacramento, CA 95833', street: '789 Pine Rd', city: 'Sacramento', state: 'CA', zip: '95833', lat: 38.612100, lng: -121.492900 },
    { id: '4', full: '101 Maple Dr, Sacramento, CA 95820', street: '101 Maple Dr', city: 'Sacramento', state: 'CA', zip: '95820', lat: 38.535300, lng: -121.445900 },
    { id: '5', full: '202 Cedar Ln, Sacramento, CA 95823', street: '202 Cedar Ln', city: 'Sacramento', state: 'CA', zip: '95823', lat: 38.478900, lng: -121.447500 },
  ];

  return (
    <div className="relative w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              ref={inputRef}
              placeholder={placeholder}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-10"
              onFocus={() => {
                if (searchValue.length > 2) setOpen(true);
              }}
            />
            <Button
              variant="outline"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
              onClick={() => setOpen(!open)}
            >
              <ChevronsUpDown className="h-4 w-4" />
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[94%] ml-[3%]">
          <Command>
            <CommandInput 
              placeholder="Search address..." 
              value={searchValue} 
              onValueChange={setSearchValue} 
            />
            <CommandList>
              <CommandEmpty>No addresses found.</CommandEmpty>
              <CommandGroup>
                {(suggestions.length > 0 ? suggestions : (!apiKeys?.google_maps_api_key ? MOCK_ADDRESSES : [])).map(address => (
                  <CommandItem
                    key={address.id}
                    value={address.full}
                    onSelect={() => handleAddressSelect(address)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedAddress?.id === address.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {address.full}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AddressAutocomplete;
