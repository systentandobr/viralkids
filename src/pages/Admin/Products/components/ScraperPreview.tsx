import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  XCircle, 
  Edit, 
  Save, 
  X,
  Loader2,
  ExternalLink,
  AlertCircle
} from "lucide-react";
import { ScraperPreviewData, ImageItem } from "../types";
import { ImageManager } from "./ImageManager";
import { toast } from "sonner";

interface ScraperPreviewProps {
  previewData: ScraperPreviewData;
  platform: string;
  affiliateUrl: string;
  onConfirm: (data: ScraperPreviewData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ScraperPreview = ({
  previewData: initialData,
  platform,
  affiliateUrl,
  onConfirm,
  onCancel,
  isLoading = false,
}: ScraperPreviewProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ScraperPreviewData>(initialData);
  const [images, setImages] = useState<ImageItem[]>(() => {
    return initialData.images.map((url, index) => ({
      id: `img-${index}`,
      url,
      isMain: index === 0,
      order: index,
    }));
  });

  useEffect(() => {
    setFormData(initialData);
    setImages(
      initialData.images.map((url, index) => ({
        id: `img-${index}`,
        url,
        isMain: index === 0,
        order: index,
      }))
    );
  }, [initialData]);

  const handleFieldChange = (field: keyof ScraperPreviewData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImagesChange = (newImages: ImageItem[]) => {
    setImages(newImages);
    setFormData((prev) => ({
      ...prev,
      images: newImages.map((img) => img.url),
    }));
  };

  const handleSave = () => {
    // Validações básicas
    if (!formData.name || formData.name.trim() === "") {
      toast.error("Nome do produto é obrigatório");
      return;
    }

    if (!formData.price || formData.price <= 0) {
      toast.error("Preço deve ser maior que zero");
      return;
    }

    if (images.length === 0) {
      toast.error("Adicione pelo menos uma imagem");
      return;
    }

    setIsEditing(false);
  };

  const handleConfirm = async () => {
    if (isEditing) {
      toast.error("Salve as alterações antes de confirmar");
      return;
    }

    const finalData: ScraperPreviewData = {
      ...formData,
      images: images.map((img) => img.url),
    };

    await onConfirm(finalData);
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-blue to-neon-cyan flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Preview dos Dados Extraídos</h2>
            <p className="text-base text-muted-foreground">
              Revise e edite os dados antes de confirmar o cadastro
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{platform}</Badge>
          <a
            href={affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neon-cyan hover:underline flex items-center gap-1"
          >
            <ExternalLink className="h-4 w-4" />
            Ver original
          </a>
        </div>
      </div>

      {/* Informações do Produto */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="name">Nome do Produto *</Label>
              {isEditing && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setFormData(initialData);
                    setIsEditing(false);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            {isEditing ? (
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleFieldChange("name", e.target.value)}
                placeholder="Nome do produto"
              />
            ) : (
              <div className="p-2 bg-muted rounded-md">{formData.name}</div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            {isEditing ? (
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleFieldChange("description", e.target.value)}
                placeholder="Descrição completa do produto"
                rows={6}
              />
            ) : (
              <div className="p-2 bg-muted rounded-md text-base">
                {formData.description || "Sem descrição"}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="shortDescription">Descrição Curta</Label>
            {isEditing ? (
              <Textarea
                id="shortDescription"
                value={formData.shortDescription || ""}
                onChange={(e) => handleFieldChange("shortDescription", e.target.value)}
                placeholder="Descrição curta (até 200 caracteres)"
                rows={2}
              />
            ) : (
              <div className="p-2 bg-muted rounded-md text-base">
                {formData.shortDescription || "Sem descrição curta"}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Preço *</Label>
              {isEditing ? (
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleFieldChange("price", parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              ) : (
                <div className="p-2 bg-muted rounded-md">
                  R$ {formData.price.toFixed(2)}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="originalPrice">Preço Original</Label>
              {isEditing ? (
                <Input
                  id="originalPrice"
                  type="number"
                  step="0.01"
                  value={formData.originalPrice || ""}
                  onChange={(e) =>
                    handleFieldChange("originalPrice", e.target.value ? parseFloat(e.target.value) : undefined)
                  }
                  placeholder="0.00"
                />
              ) : (
                <div className="p-2 bg-muted rounded-md">
                  {formData.originalPrice ? `R$ ${formData.originalPrice.toFixed(2)}` : "-"}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sku">SKU</Label>
            {isEditing ? (
              <Input
                id="sku"
                value={formData.sku || ""}
                onChange={(e) => handleFieldChange("sku", e.target.value)}
                placeholder="Código SKU"
              />
            ) : (
              <div className="p-2 bg-muted rounded-md">
                {formData.sku || "Não informado"}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="stockQuantity">Estoque</Label>
            {isEditing ? (
              <Input
                id="stockQuantity"
                type="number"
                value={formData.stockQuantity || 0}
                onChange={(e) => handleFieldChange("stockQuantity", parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            ) : (
              <div className="p-2 bg-muted rounded-md">
                {formData.stockQuantity || 0} unidades
              </div>
            )}
          </div>

          {formData.brand && (
            <div className="space-y-2">
              <Label htmlFor="brand">Marca</Label>
              {isEditing ? (
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => handleFieldChange("brand", e.target.value)}
                  placeholder="Marca do produto"
                />
              ) : (
                <div className="p-2 bg-muted rounded-md">{formData.brand}</div>
              )}
            </div>
          )}

          {formData.tags && formData.tags.length > 0 && (
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Especificações */}
      {formData.specifications && Object.keys(formData.specifications).length > 0 && (
        <div className="space-y-2">
          <Label>Especificações</Label>
          <Card className="p-4">
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(formData.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between border-b pb-2">
                  <span className="text-base font-medium text-muted-foreground">{key}:</span>
                  <span className="text-base">{value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Gerenciamento de Imagens */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Imagens do Produto</Label>
          <Badge variant="outline">{images.length} imagens</Badge>
        </div>
        <ImageManager
          images={images}
          onImagesChange={handleImagesChange}
          allowUpload={false}
        />
      </div>

      {/* Avisos de Validação */}
      {(!formData.name || formData.price <= 0 || images.length === 0) && (
        <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-base font-medium text-yellow-600 dark:text-yellow-400">
              Atenção: Verifique os seguintes campos obrigatórios:
            </p>
            <ul className="text-base text-yellow-600/80 dark:text-yellow-400/80 mt-1 list-disc list-inside">
              {!formData.name && <li>Nome do produto</li>}
              {formData.price <= 0 && <li>Preço válido</li>}
              {images.length === 0 && <li>Pelo menos uma imagem</li>}
            </ul>
          </div>
        </div>
      )}

      {/* Ações */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        {isEditing ? (
          <Button onClick={handleSave} className="bg-neon-blue hover:opacity-90">
            <Save className="h-4 w-4 mr-2" />
            Salvar Alterações
          </Button>
        ) : (
          <>
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              disabled={isLoading}
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isLoading || !formData.name || formData.price <= 0 || images.length === 0}
              className="bg-gradient-to-r from-neon-cyan to-neon-blue hover:opacity-90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Confirmar Cadastro
                </>
              )}
            </Button>
          </>
        )}
      </div>
    </Card>
  );
};

