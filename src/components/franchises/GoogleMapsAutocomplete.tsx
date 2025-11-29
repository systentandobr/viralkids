import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";

export interface AddressData {
  fullAddress: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  latitude: number;
  longitude: number;
}

interface GoogleMapsAutocompleteProps {
  onAddressSelect: (address: AddressData) => void;
  defaultValue?: string;
  error?: string;
}

export function GoogleMapsAutocomplete({
  onAddressSelect,
  defaultValue = "",
  error,
}: GoogleMapsAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    if (!inputRef.current || !window.google) return;

    // Inicializa autocomplete
    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        componentRestrictions: { country: "br" },
        fields: ["address_components", "geometry", "formatted_address"],
      }
    );

    // Listener para quando um lugar é selecionado
    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current.getPlace();

      if (!place.geometry) {
        console.error("No geometry found for this place");
        return;
      }

      const addressData = extractAddressData(place);
      onAddressSelect(addressData);
      setValue(place.formatted_address);
    });

    return () => {
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [onAddressSelect]);

  function extractAddressData(place: any): AddressData {
    const components = place.address_components || [];
    
    const getComponent = (type: string) => {
      const component = components.find((c: any) => c.types.includes(type));
      return component?.long_name || "";
    };

    const getShortComponent = (type: string) => {
      const component = components.find((c: any) => c.types.includes(type));
      return component?.short_name || "";
    };

    return {
      fullAddress: place.formatted_address || "",
      street: getComponent("route"),
      number: getComponent("street_number"),
      neighborhood: getComponent("sublocality") || getComponent("sublocality_level_1"),
      city: getComponent("locality") || getComponent("administrative_area_level_2"),
      state: getShortComponent("administrative_area_level_1"),
      country: getShortComponent("country"),
      postalCode: getComponent("postal_code"),
      latitude: place.geometry.location.lat(),
      longitude: place.geometry.location.lng(),
    };
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="address-autocomplete">
        <MapPin className="inline-block w-4 h-4 mr-2" />
        Endereço Completo
      </Label>
      <Input
        ref={inputRef}
        id="address-autocomplete"
        type="text"
        placeholder="Digite o endereço da franquia..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={error ? "border-destructive" : ""}
      />
      {error && <p className="text-base text-destructive">{error}</p>}
      <p className="text-sm text-muted-foreground">
        Comece a digitar e selecione um endereço da lista
      </p>
    </div>
  );
}
