import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Link2, Plus, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  CreateAffiliateProductData,
  AffiliatePlatform,
  ProductCategory,
  ScraperPreviewData,
} from "../types";
import { CategoryManager } from "./CategoryManager";
import { ScraperPreview } from "./ScraperPreview";
import { AffiliateProductService } from "@/services/products/affiliateProductService";

interface AffiliateProductFormProps {
  categories: ProductCategory[];
  onCategoryCreate: (data: { name: string; description?: string }) => Promise<void>;
  onCategoryUpdate: (id: string, data: any) => Promise<void>;
  onCategoryDelete: (id: string) => Promise<void>;
  onSubmit: (data: CreateAffiliateProductData) => Promise<void>;
  isLoading?: boolean;
  showPreview?: boolean;
}

const PLATFORM_OPTIONS: { value: AffiliatePlatform; label: string; icon?: string }[] = [
  { value: "shopee", label: "Shopee" },
  { value: "amazon", label: "Amazon" },
  { value: "magalu", label: "Magalu" },
  { value: "mercadolivre", label: "Mercado Livre" },
  { value: "americanas", label: "Americanas" },
  { value: "casasbahia", label: "Casas Bahia" },
  { value: "other", label: "Outro" },
];

const detectPlatform = (url: string): AffiliatePlatform => {
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes("shopee")) return "shopee";
  if (lowerUrl.includes("amazon")) return "amazon";
  if (lowerUrl.includes("magalu") || lowerUrl.includes("magazine")) return "magalu";
  if (lowerUrl.includes("mercadolivre") || lowerUrl.includes("mercadolibre")) return "mercadolivre";
  if (lowerUrl.includes("americanas")) return "americanas";
  if (lowerUrl.includes("casasbahia")) return "casasbahia";
  return "other";
};

// Normalizar IDs para comparação (MongoDB pode retornar ObjectId)
const normalizeId = (id: any): string => {
  if (!id) return '';
  if (typeof id === 'object' && id.toString) {
    return id.toString();
  }
  return String(id);
};

export const AffiliateProductForm = ({
  categories,
  onCategoryCreate,
  onCategoryUpdate,
  onCategoryDelete,
  onSubmit,
  isLoading = false,
  showPreview = true,
}: AffiliateProductFormProps) => {
  const [formData, setFormData] = useState<CreateAffiliateProductData>({
    categoryId: "",
    affiliateUrl: "",
    platform: "shopee",
  });
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [previewData, setPreviewData] = useState<ScraperPreviewData | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [affiliateProductId, setAffiliateProductId] = useState<string | null>(null);

  const handleUrlChange = (url: string) => {
    const detectedPlatform = detectPlatform(url);
    setFormData({
      ...formData,
      affiliateUrl: url,
      platform: detectedPlatform,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validações
    if (!formData.categoryId || formData.categoryId.trim() === "") {
      toast.error("Por favor, selecione uma categoria");
      return;
    }

    if (!formData.affiliateUrl || formData.affiliateUrl.trim() === "") {
      toast.error("Por favor, informe a URL do produto afiliado");
      return;
    }

    // Validar formato de URL
    try {
      new URL(formData.affiliateUrl);
    } catch {
      toast.error("Por favor, informe uma URL válida");
      return;
    }

    // Validar se a categoria existe
    const categoryExists = categories.some(c => {
      const categoryId = normalizeId(c.id || (c as any)._id);
      const formCategoryId = normalizeId(formData.categoryId);
      return categoryId === formCategoryId && c.isActive !== false;
    });
    if (!categoryExists) {
      toast.error("Categoria selecionada não é válida ou está inativa");
      return;
    }

    // Se showPreview está ativado, obter preview primeiro
    if (showPreview) {
      setIsLoadingPreview(true);
      try {
        const previewResponse = await AffiliateProductService.preview(formData);
        
        if (previewResponse.success && previewResponse.data) {
          // Criar produto afiliado temporário para ter o ID
          const createResponse = await AffiliateProductService.create(formData);
          
          if (createResponse.success && createResponse.data) {
            setAffiliateProductId(createResponse.data.id);
            setPreviewData(previewResponse.data.data);
          } else {
            throw new Error("Erro ao criar produto afiliado");
          }
        } else {
          throw new Error(previewResponse.error || "Erro ao obter preview");
        }
      } catch (error: any) {
        console.error("Erro ao obter preview:", error);
        toast.error(error.message || "Erro ao processar URL. Tentando cadastro direto...");
        
        // Fallback: cadastrar sem preview
        try {
          await onSubmit(formData);
          resetForm();
        } catch (submitError: any) {
          toast.error(submitError.message || "Erro ao cadastrar produto afiliado");
        }
      } finally {
        setIsLoadingPreview(false);
      }
    } else {
      // Cadastro direto sem preview
      try {
        await onSubmit({
          categoryId: formData.categoryId.trim(),
          affiliateUrl: formData.affiliateUrl.trim(),
          platform: formData.platform,
        });
        resetForm();
        toast.success("Produto afiliado cadastrado com sucesso! Processamento iniciado.");
      } catch (error: any) {
        console.error("Erro ao cadastrar produto afiliado:", error);
        toast.error(error.message || "Erro ao cadastrar produto afiliado. Tente novamente.");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      categoryId: "",
      affiliateUrl: "",
      platform: detectPlatform(""),
    });
    setSelectedCategoryIds([]);
    setPreviewData(null);
    setAffiliateProductId(null);
  };

  const handlePreviewConfirm = async (editedData: ScraperPreviewData) => {
    if (!affiliateProductId) {
      toast.error("ID do produto afiliado não encontrado");
      return;
    }

    setIsLoadingPreview(true);
    try {
      const response = await AffiliateProductService.createFromPreview(
        affiliateProductId,
        editedData
      );

      if (response.success) {
        toast.success("Produto criado com sucesso!");
        resetForm();
      } else {
        throw new Error(response.error || "Erro ao criar produto");
      }
    } catch (error: any) {
      console.error("Erro ao confirmar preview:", error);
      toast.error(error.message || "Erro ao criar produto final");
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handlePreviewCancel = () => {
    if (affiliateProductId) {
      // Opcional: deletar produto afiliado criado
      AffiliateProductService.delete(affiliateProductId).catch(console.error);
    }
    resetForm();
  };

  // Encontrar categoria selecionada (suporta id ou _id)
  const selectedCategory = categories.find((c) => {
    const categoryId = normalizeId(c.id || (c as any)._id);
    const formCategoryId = normalizeId(formData.categoryId);
    return categoryId === formCategoryId && categoryId !== '';
  });

  // Se temos preview data, mostrar preview
  if (previewData && affiliateProductId) {
    return (
      <ScraperPreview
        previewData={previewData}
        platform={formData.platform}
        affiliateUrl={formData.affiliateUrl}
        onConfirm={handlePreviewConfirm}
        onCancel={handlePreviewCancel}
        isLoading={isLoadingPreview}
      />
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-blue to-neon-cyan flex items-center justify-center">
          <Link2 className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Cadastrar Produto Afiliado</h2>
          <p className="text-base text-muted-foreground">
            Adicione produtos de marketplaces para processamento automático
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Seleção de Categoria */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="category">Categoria *</Label>
            <CategoryManager
              categories={categories}
              onCategoryCreate={onCategoryCreate}
              onCategoryUpdate={onCategoryUpdate}
              onCategoryDelete={onCategoryDelete}
              onSelectCategories={(ids) => {
                setSelectedCategoryIds(ids);
                if (ids.length > 0) {
                  setFormData({ ...formData, categoryId: ids[0] });
                }
              }}
              multiple={false}
            />
          </div>
          <Select
            value={formData.categoryId ? normalizeId(formData.categoryId) : undefined}
            onValueChange={(value) => {
              setFormData({ ...formData, categoryId: value });
              setSelectedCategoryIds([value]);
            }}
            required
          >
            <SelectTrigger className="w-full" id="category-select">
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.length === 0 ? (
                <div className="px-2 py-1.5 text-base text-muted-foreground">
                  Nenhuma categoria disponível
                </div>
              ) : (
                categories
                  .filter((c) => c.isActive !== false)
                  .map((category) => {
                    const categoryId = normalizeId(category.id || (category as any)._id);
                    return (
                      <SelectItem key={categoryId} value={categoryId}>
                        {category.name}
                      </SelectItem>
                    );
                  })
              )}
            </SelectContent>
          </Select>
          {selectedCategory && (
            <p className="text-base text-muted-foreground">
              {selectedCategory.description || "Sem descrição"}
            </p>
          )}
        </div>

        {/* URL do Produto */}
        <div className="space-y-2">
          <Label htmlFor="affiliateUrl">URL do Produto Afiliado *</Label>
          <div className="relative">
            <Input
              id="affiliateUrl"
              type="url"
              value={formData.affiliateUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="https://www.shopee.com.br/produto..."
              required
              className="pr-10"
            />
            {formData.affiliateUrl && (
              <a
                href={formData.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Suporta: Shopee, Amazon, Magalu, Mercado Livre, Americanas, Casas Bahia
          </p>
        </div>

        {/* Plataforma (auto-detectada) */}
        <div className="space-y-2">
          <Label htmlFor="platform">Plataforma</Label>
          <Select
            value={formData.platform}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                platform: value as AffiliatePlatform,
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PLATFORM_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-2 flex-wrap">
            {PLATFORM_OPTIONS.map((option) => (
              <Badge
                key={option.value}
                variant={formData.platform === option.value ? "default" : "outline"}
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() =>
                  setFormData({ ...formData, platform: option.value })
                }
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setFormData({ ...formData, platform: option.value });
                  }
                }}
              >
                {option.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Informações */}
        <div className="p-4 bg-muted/50 rounded-lg space-y-2">
          <p className="text-base font-medium">Como funciona:</p>
          <ul className="text-base text-muted-foreground space-y-1 list-disc list-inside">
            <li>O produto será adicionado à fila de processamento</li>
            <li>Um agente automatizado coletará informações do link</li>
            <li>Dados como imagens, preço e descrição serão extraídos</li>
            <li>O produto completo será criado automaticamente</li>
          </ul>
        </div>

        {/* Botão de Submit */}
        <Button
          type="submit"
          className="w-full from-neon-cyan to-neon-blue hover:opacity-90"
          disabled={isLoading || isLoadingPreview || !formData.categoryId || !formData.affiliateUrl}
        >
          {isLoadingPreview ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processando URL...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              {isLoading ? "Cadastrando..." : "Processar e Cadastrar"}
            </>
          )}
        </Button>
      </form>
    </Card>
  );
};

