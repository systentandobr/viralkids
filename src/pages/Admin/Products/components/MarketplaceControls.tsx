import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Store,
  Star,
  Eye,
  EyeOff,
  Home,
  Grid3x3,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { MarketplaceSettings } from "../types";

interface MarketplaceControlsProps {
  settings: MarketplaceSettings;
  onSettingsChange: (settings: MarketplaceSettings) => void;
  categories?: Array<{ id: string; name: string }>;
}

export const MarketplaceControls = ({
  settings: initialSettings,
  onSettingsChange,
  categories = [],
}: MarketplaceControlsProps) => {
  const [settings, setSettings] = useState<MarketplaceSettings>(initialSettings);

  const handleChange = (field: keyof MarketplaceSettings, value: any) => {
    const updated = { ...settings, [field]: value };
    setSettings(updated);
    onSettingsChange(updated);
  };

  const toggleCategoryVisibility = (categoryId: string) => {
    const visibleCategories = settings.visibleInCategories || [];
    const hiddenCategories = settings.hideFromCategories || [];

    if (visibleCategories.includes(categoryId)) {
      // Remover de visíveis e adicionar em ocultos
      handleChange("visibleInCategories", visibleCategories.filter((id) => id !== categoryId));
      handleChange("hideFromCategories", [...hiddenCategories, categoryId]);
    } else if (hiddenCategories.includes(categoryId)) {
      // Remover de ocultos (tornar visível em todas)
      handleChange("hideFromCategories", hiddenCategories.filter((id) => id !== categoryId));
    } else {
      // Adicionar em visíveis
      handleChange("visibleInCategories", [...visibleCategories, categoryId]);
      handleChange("hideFromCategories", hiddenCategories.filter((id) => id !== categoryId));
    }
  };

  const increaseOrder = () => {
    handleChange("displayOrder", (settings.displayOrder || 0) + 1);
  };

  const decreaseOrder = () => {
    handleChange("displayOrder", Math.max(0, (settings.displayOrder || 0) - 1));
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-blue to-neon-cyan flex items-center justify-center">
          <Store className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold">Controle de Exibição no Marketplace</h3>
          <p className="text-sm text-muted-foreground">
            Configure como este produto será exibido no marketplace
          </p>
        </div>
      </div>

      {/* Status Principal */}
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            {settings.isActive ? (
              <Eye className="h-5 w-5 text-neon-green" />
            ) : (
              <EyeOff className="h-5 w-5 text-muted-foreground" />
            )}
            <div>
              <Label htmlFor="isActive" className="text-base font-medium cursor-pointer">
                Produto Ativo no Marketplace
              </Label>
              <p className="text-sm text-muted-foreground">
                {settings.isActive
                  ? "Produto visível e disponível para compra"
                  : "Produto oculto do marketplace"}
              </p>
            </div>
          </div>
          <Switch
            id="isActive"
            checked={settings.isActive}
            onCheckedChange={(checked) => handleChange("isActive", checked)}
          />
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            <Star
              className={`h-5 w-5 ${
                settings.isFeatured ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"
              }`}
            />
            <div>
              <Label htmlFor="isFeatured" className="text-base font-medium cursor-pointer">
                Produto em Destaque
              </Label>
              <p className="text-sm text-muted-foreground">
                {settings.isFeatured
                  ? "Exibido em posições de destaque"
                  : "Exibição normal"}
              </p>
            </div>
          </div>
          <Switch
            id="isFeatured"
            checked={settings.isFeatured}
            onCheckedChange={(checked) => handleChange("isFeatured", checked)}
          />
        </div>
      </div>

      {/* Ordem de Exibição */}
      <div className="space-y-2">
        <Label htmlFor="displayOrder">Ordem de Exibição</Label>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={decreaseOrder}
            disabled={!settings.isActive}
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
          <Input
            id="displayOrder"
            type="number"
            value={settings.displayOrder || 0}
            onChange={(e) => handleChange("displayOrder", parseInt(e.target.value) || 0)}
            className="w-24 text-center"
            min={0}
            disabled={!settings.isActive}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={increaseOrder}
            disabled={!settings.isActive}
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
          <p className="text-sm text-muted-foreground">
            Produtos com ordem menor aparecem primeiro
          </p>
        </div>
      </div>

      {/* Visibilidade por Página */}
      <div className="space-y-3">
        <Label>Visibilidade por Página</Label>
        <div className="grid md:grid-cols-2 gap-3">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Página Inicial</span>
            </div>
            <Switch
              checked={settings.showInHomepage ?? true}
              onCheckedChange={(checked) => handleChange("showInHomepage", checked)}
              disabled={!settings.isActive}
            />
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              <Grid3x3 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Página de Categoria</span>
            </div>
            <Switch
              checked={settings.showInCategoryPage ?? true}
              onCheckedChange={(checked) => handleChange("showInCategoryPage", checked)}
              disabled={!settings.isActive}
            />
          </div>
        </div>
      </div>

      {/* Controle por Categoria */}
      {categories.length > 0 && (
        <div className="space-y-3">
          <Label>Visibilidade por Categoria</Label>
          <p className="text-sm text-muted-foreground">
            Selecione em quais categorias o produto será exibido ou oculto
          </p>
          <div className="grid md:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border rounded-lg">
            {categories.map((category) => {
              const isVisible = settings.visibleInCategories?.includes(category.id);
              const isHidden = settings.hideFromCategories?.includes(category.id);
              const isDefault = !isVisible && !isHidden;

              return (
                <Button
                  key={category.id}
                  type="button"
                  variant={isVisible ? "default" : isHidden ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => toggleCategoryVisibility(category.id)}
                  disabled={!settings.isActive}
                  className="justify-start"
                >
                  {isVisible && <Eye className="h-3 w-3 mr-2" />}
                  {isHidden && <EyeOff className="h-3 w-3 mr-2" />}
                  {isDefault && <Grid3x3 className="h-3 w-3 mr-2" />}
                  {category.name}
                </Button>
              );
            })}
          </div>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs">
              <Eye className="h-3 w-3 mr-1" />
              Visível
            </Badge>
            <Badge variant="outline" className="text-xs">
              <EyeOff className="h-3 w-3 mr-1" />
              Oculto
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Grid3x3 className="h-3 w-3 mr-1" />
              Padrão
            </Badge>
          </div>
        </div>
      )}

      {/* Resumo */}
      <div className="p-4 bg-muted/50 rounded-lg space-y-2">
        <p className="text-sm font-medium">Resumo das Configurações:</p>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>
            • Status:{" "}
            <span className={settings.isActive ? "text-neon-green" : "text-muted-foreground"}>
              {settings.isActive ? "Ativo" : "Inativo"}
            </span>
          </li>
          <li>
            • Destaque:{" "}
            <span className={settings.isFeatured ? "text-yellow-500" : "text-muted-foreground"}>
              {settings.isFeatured ? "Sim" : "Não"}
            </span>
          </li>
          <li>• Ordem de exibição: {settings.displayOrder || 0}</li>
          <li>
            • Página inicial:{" "}
            {settings.showInHomepage !== false ? (
              <span className="text-neon-green">Visível</span>
            ) : (
              <span className="text-muted-foreground">Oculta</span>
            )}
          </li>
          <li>
            • Página de categoria:{" "}
            {settings.showInCategoryPage !== false ? (
              <span className="text-neon-green">Visível</span>
            ) : (
              <span className="text-muted-foreground">Oculta</span>
            )}
          </li>
        </ul>
      </div>
    </Card>
  );
};

