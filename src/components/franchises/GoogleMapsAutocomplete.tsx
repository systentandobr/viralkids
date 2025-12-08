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
  const containerRef = useRef<HTMLDivElement>(null);
  const autocompleteRef = useRef<any>(null);
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    if (!containerRef.current || !window.google) return;

    const initializeAutocomplete = async () => {
      try {
        // Tentar usar o novo PlaceAutocompleteElement
        if (window.google.maps.importLibrary) {
          const { PlaceAutocompleteElement } = (await window.google.maps.importLibrary("places")) as any;
          
          if (PlaceAutocompleteElement && containerRef.current) {
            // Criar instância do PlaceAutocompleteElement
            const autocomplete = new PlaceAutocompleteElement({
              componentRestrictions: { country: "br" },
              requestedResultTypes: ["geocode"],
            });

            // Adicionar ao container
            containerRef.current.innerHTML = "";
            containerRef.current.appendChild(autocomplete);
            autocompleteRef.current = autocomplete;

            // Estilizar o elemento para se integrar com o design
            autocomplete.style.width = "100%";
            autocomplete.style.height = "40px";
            autocomplete.style.border = "none";
            autocomplete.style.outline = "none";
            autocomplete.style.padding = "0 12px";

            // Listener para quando um lugar é selecionado
            autocomplete.addEventListener("gmp-placeselect", async (event: any) => {
              const place = event.place;

              if (!place.geometry) {
                console.error("No geometry found for this place");
                return;
              }

              // Obter detalhes completos do lugar
              const placeDetails = await place.fetchFields({
                fields: ["address_components", "geometry", "formatted_address"],
              });

              const addressData = extractAddressDataFromPlace(placeDetails);
              onAddressSelect(addressData);
              setValue(placeDetails.formattedAddress || "");
            });

            return;
          }
        }
      } catch (err) {
        console.warn("PlaceAutocompleteElement not available, using legacy Autocomplete:", err);
      }

      // Fallback para Autocomplete legado se PlaceAutocompleteElement não estiver disponível
      initializeLegacyAutocomplete();
    };

    const initializeLegacyAutocomplete = () => {
      if (!containerRef.current) return;

      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = "Digite o endereço da franquia...";
      input.className = `flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
        error ? "border-destructive" : "border-input"
      }`;
      input.value = defaultValue;

      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(input);

      const autocomplete = new window.google.maps.places.Autocomplete(input, {
        componentRestrictions: { country: "br" },
        fields: ["address_components", "geometry", "formatted_address"],
      });

      autocompleteRef.current = autocomplete;

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();

        if (!place.geometry) {
          console.error("No geometry found for this place");
          return;
        }

        const addressData = extractAddressData(place);
        onAddressSelect(addressData);
        setValue(place.formatted_address || "");
      });
    };

    initializeAutocomplete();

    return () => {
      if (autocompleteRef.current) {
        // Cleanup será feito pelo React quando o componente desmontar
        if (containerRef.current) {
          containerRef.current.innerHTML = "";
        }
      }
    };
  }, [onAddressSelect, defaultValue, error]);

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

    const location = place.geometry?.location;
    const lat = typeof location?.lat === 'function' ? location.lat() : location?.lat || 0;
    const lng = typeof location?.lng === 'function' ? location.lng() : location?.lng || 0;

    return {
      fullAddress: place.formatted_address || "",
      street: getComponent("route"),
      number: getComponent("street_number"),
      neighborhood: getComponent("sublocality") || getComponent("sublocality_level_1"),
      city: getComponent("locality") || getComponent("administrative_area_level_2"),
      state: getShortComponent("administrative_area_level_1"),
      country: getShortComponent("country"),
      postalCode: getComponent("postal_code"),
      latitude: lat,
      longitude: lng,
    };
  }

  function extractAddressDataFromPlace(place: any): AddressData {
    const components = place.addressComponents || place.address_components || [];
    
    const getComponent = (type: string) => {
      const component = components.find((c: any) => c.types?.includes(type));
      return component?.longText || component?.long_name || "";
    };

    const getShortComponent = (type: string) => {
      const component = components.find((c: any) => c.types?.includes(type));
      return component?.shortText || component?.short_name || "";
    };

    const location = place.geometry?.location;
    const lat = typeof location?.lat === 'function' ? location.lat() : location?.lat || 0;
    const lng = typeof location?.lng === 'function' ? location.lng() : location?.lng || 0;

    return {
      fullAddress: place.formattedAddress || place.formatted_address || "",
      street: getComponent("route"),
      number: getComponent("street_number"),
      neighborhood: getComponent("sublocality") || getComponent("sublocality_level_1"),
      city: getComponent("locality") || getComponent("administrative_area_level_2"),
      state: getShortComponent("administrative_area_level_1"),
      country: getShortComponent("country"),
      postalCode: getComponent("postal_code"),
      latitude: lat,
      longitude: lng,
    };
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="address-autocomplete">
        <MapPin className="inline-block w-4 h-4 mr-2" />
        Endereço Completo
      </Label>
      <div
        ref={containerRef}
        id="address-autocomplete"
        className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ${
          error ? "border-destructive" : "border-input"
        }`}
      />
      {error && <p className="text-base text-destructive">{error}</p>}
      <p className="text-sm text-muted-foreground">
        Comece a digitar e selecione um endereço da lista
      </p>
    </div>
  );
}
