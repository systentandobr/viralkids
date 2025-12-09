import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Building, Smartphone } from "lucide-react";
import type { Franchise } from "@/services/franchise/franchiseService";

interface FranchiseMapProps {
  franchises: Franchise[];
}

export const FranchiseMap = ({ franchises }: FranchiseMapProps) => {
  // Componente de mapa simplificado - pode ser substituído por react-leaflet ou Google Maps
  // Por enquanto, mostra uma visualização de lista com marcadores

  return (
    <Card className="h-[600px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Mapa de Unidades
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-80px)] overflow-auto">
        {/* Placeholder para mapa real - pode ser integrado com react-leaflet ou Google Maps */}
        <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-dashed border-purple-300 flex items-center justify-center">
          <div className="text-center space-y-4 p-8">
            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto">
              <MapPin className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Mapa Interativo
              </h3>
              <p className="text-base text-muted-foreground mb-4">
                Integração com biblioteca de mapas (Leaflet/Google Maps)
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {franchises.map((franchise) => (
                  <Badge
                    key={franchise.id}
                    variant="secondary"
                    className="bg-white/80 border border-purple-200"
                  >
                    {franchise.location.type === 'physical' ? (
                      <Building className="h-3 w-3 mr-1" />
                    ) : (
                      <Smartphone className="h-3 w-3 mr-1" />
                    )}
                    {franchise.location.city}, {franchise.location.state}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Lista de unidades abaixo do mapa */}
        <div className="mt-4 space-y-2">
          <h4 className="text-base font-semibold text-foreground mb-2">
            Unidades no Mapa ({franchises.length})
          </h4>
          {franchises.map((franchise) => (
            <div
              key={franchise.id}
              className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {franchise.location.type === 'physical' ? (
                      <Building className="h-4 w-4 text-purple-600" />
                    ) : (
                      <Smartphone className="h-4 w-4 text-blue-600" />
                    )}
                    <span className="font-medium text-base">{franchise.name}</span>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {franchise.location.address}, {franchise.location.city} - {franchise.location.state}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Coordenadas: {franchise.location.lat.toFixed(4)}, {franchise.location.lng.toFixed(4)}
                  </div>
                </div>
                <Badge variant="secondary" className="ml-2">
                  {franchise.metrics && franchise.metrics.totalSales > 0
                    ? `R$ ${(franchise.metrics.totalSales / 1000).toFixed(0)}k`
                    : 'Novo'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

