import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import { GoogleMapsAutocomplete, AddressData } from '@/components/franchises/GoogleMapsAutocomplete';
import { MapView } from '@/components/franchises/MapView';
import { Loader2 } from 'lucide-react';
import { UseFormSetValue, UseFormRegister, FieldErrors } from 'react-hook-form';

interface AddressStepProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  errors: FieldErrors<any>;
  watchedValues: {
    address?: string;
    city?: string;
    state?: string;
    latitude?: number;
    longitude?: number;
    postalCode?: string;
    neighborhood?: string;
    number?: string;
    complement?: string;
  };
  addressLabel?: string;
  addressPlaceholder?: string;
}

export function AddressStep({
  register,
  setValue,
  errors,
  watchedValues,
  addressLabel = 'Endereço Completo',
  addressPlaceholder = 'Digite o endereço...',
}: AddressStepProps) {
  const [addressData, setAddressData] = useState<AddressData | null>(null);
  const { isLoaded: mapsLoaded, loadError: mapsError } = useGoogleMaps();

  const handleAddressSelect = (data: AddressData) => {
    setAddressData(data);
    setValue('address', data.fullAddress);
    setValue('street', data.street);
    setValue('city', data.city);
    setValue('state', data.state);
    setValue('postalCode', data.postalCode);
    setValue('latitude', data.latitude);
    setValue('longitude', data.longitude);
    setValue('neighborhood', data.neighborhood);
    setValue('number', data.number);
  };

  const handleCoordinatesChange = (lat: number, lng: number) => {
    setValue('latitude', lat);
    setValue('longitude', lng);
  };

  return (
    <div className='space-y-6'>
      {mapsError && (
        <div className='p-4 bg-destructive/10 border border-destructive rounded-md'>
          <p className='text-base text-destructive'>
            ⚠️ Google Maps não disponível. Configure VITE_GOOGLE_MAPS_API_KEY no .env
          </p>
        </div>
      )}

      {mapsLoaded && (
        <>
          <GoogleMapsAutocomplete
            onAddressSelect={handleAddressSelect}
            defaultValue={watchedValues.address}
            error={errors.address?.message}
          />

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Label htmlFor='city'>Cidade *</Label>
              <Input
                id='city'
                {...register('city')}
                className={errors.city ? 'border-destructive' : ''}
                readOnly
                value={watchedValues.city || ''}
              />
              {errors.city && (
                <p className='text-base text-destructive mt-1'>{errors.city.message as string}</p>
              )}
            </div>

            <div>
              <Label htmlFor='state'>Estado *</Label>
              <Input
                id='state'
                {...register('state')}
                className={errors.state ? 'border-destructive' : ''}
                readOnly
                value={watchedValues.state || ''}
              />
              {errors.state && (
                <p className='text-base text-destructive mt-1'>{errors.state.message as string}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor='complement'>Complemento</Label>
            <Input
              id='complement'
              {...register('complement')}
              placeholder='Apto, Bloco, etc.'
            />
          </div>

          {addressData && (
            <MapView
              latitude={watchedValues.latitude || addressData.latitude}
              longitude={watchedValues.longitude || addressData.longitude}
              onCoordinatesChange={handleCoordinatesChange}
              draggable
            />
          )}
        </>
      )}

      {!mapsLoaded && !mapsError && (
        <div className='flex items-center justify-center h-40'>
          <Loader2 className='w-8 h-8 animate-spin text-primary' />
          <span className='ml-2'>Carregando Google Maps...</span>
        </div>
      )}
    </div>
  );
}

