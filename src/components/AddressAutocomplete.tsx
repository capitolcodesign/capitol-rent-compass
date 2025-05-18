
import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock address data - in a real implementation, this would come from an API
const MOCK_ADDRESSES = [
  { id: '1', full: '123 Oak St, Sacramento, CA 95814', street: '123 Oak St', city: 'Sacramento', state: 'CA', zip: '95814', lat: 38.581572, lng: -121.494400 },
  { id: '2', full: '456 Elm Ave, Sacramento, CA 95825', street: '456 Elm Ave', city: 'Sacramento', state: 'CA', zip: '95825', lat: 38.568600, lng: -121.410600 },
  { id: '3', full: '789 Pine Rd, Sacramento, CA 95833', street: '789 Pine Rd', city: 'Sacramento', state: 'CA', zip: '95833', lat: 38.612100, lng: -121.492900 },
  { id: '4', full: '101 Maple Dr, Sacramento, CA 95820', street: '101 Maple Dr', city: 'Sacramento', state: 'CA', zip: '95820', lat: 38.535300, lng: -121.445900 },
  { id: '5', full: '202 Cedar Ln, Sacramento, CA 95823', street: '202 Cedar Ln', city: 'Sacramento', state: 'CA', zip: '95823', lat: 38.478900, lng: -121.447500 },
];

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

  // Simulate address autocomplete
  useEffect(() => {
    if (searchValue.length > 2) {
      // In a real implementation, this would be an API call
      const filtered = MOCK_ADDRESSES.filter(address => 
        address.full.toLowerCase().includes(searchValue.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchValue]);

  const handleAddressSelect = (address: Address) => {
    setSelectedAddress(address);
    setSearchValue(address.full);
    setOpen(false);
    onAddressSelect(address);
  };

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
                {suggestions.map(address => (
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
