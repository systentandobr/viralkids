import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload,
  FileSpreadsheet,
  Plus,
  X,
  CheckCircle2,
  XCircle,
  Eye,
  Loader2,
  Download,
  FileText,
} from "lucide-react";
import { BulkProductItem, ProductCategory, MarketplaceSettings } from "../types";
import { ImageManager } from "./ImageManager";
import { MarketplaceControls } from "./MarketplaceControls";
import { useAuthContext } from "@/features/auth";
import { toast } from "sonner";

interface BulkProductFormProps {
  categories: ProductCategory[];
  onSubmit: (products: BulkProductItem[]) => Promise<void>;
  isLoading?: boolean;
}

const generateId = () => `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const defaultMarketplaceSettings: MarketplaceSettings = {
  isActive: true,
  isFeatured: false,
  displayOrder: 0,
  showInHomepage: true,
  showInCategoryPage: true,
};

const createEmptyProduct = (categories: ProductCategory[]): BulkProductItem => {
  const firstCategory = categories.find((c) => c.isActive)?.id || categories[0]?.id || "";
  
  return {
    id: generateId(),
    name: "",
    description: "",
    shortDescription: "",
    price: 0,
    images: [],
    categoryId: firstCategory,
    tags: [],
    features: [],
    specifications: {},
    availability: "in_stock",
    stockQuantity: 0,
    sku: "",
    isPersonalizable: false,
    marketplace: { ...defaultMarketplaceSettings },
    isValid: false,
  };
};

export const BulkProductForm = ({
  categories,
  onSubmit,
  isLoading = false,
}: BulkProductFormProps) => {
  const { user, isLoading: isAuthLoading } = useAuthContext();
  const [products, setProducts] = useState<BulkProductItem[]>([
    createEmptyProduct(categories),
  ]);
  const [activeTab, setActiveTab] = useState<string>("form");
  const [selectedProductIndex, setSelectedProductIndex] = useState<number>(0);

  const validateProduct = (product: BulkProductItem): string[] => {
    const errors: string[] = [];

    if (!product.name || product.name.trim() === "") {
      errors.push("Nome é obrigatório");
    }

    if (!product.description || product.description.trim() === "") {
      errors.push("Descrição é obrigatória");
    }

    if (!product.price || product.price <= 0) {
      errors.push("Preço deve ser maior que zero");
    }

    if (!product.categoryId) {
      errors.push("Categoria é obrigatória");
    }

    if (!product.sku || product.sku.trim() === "") {
      errors.push("SKU é obrigatório");
    }

    if (product.stockQuantity < 0) {
      errors.push("Estoque não pode ser negativo");
    }

    if (product.images.length === 0) {
      errors.push("Adicione pelo menos uma imagem");
    }

    return errors;
  };

  const updateProduct = useCallback(
    (index: number, updates: Partial<BulkProductItem>) => {
      setProducts((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], ...updates };
        const errors = validateProduct(updated[index]);
        updated[index].errors = errors;
        updated[index].isValid = errors.length === 0;
        return updated;
      });
    },
    []
  );

  const addProduct = useCallback(() => {
    setProducts((prev) => [...prev, createEmptyProduct(categories)]);
    setSelectedProductIndex(products.length);
  }, [categories, products.length]);

  const removeProduct = useCallback((index: number) => {
    if (products.length === 1) {
      toast.error("Você precisa ter pelo menos um produto");
      return;
    }
    setProducts((prev) => prev.filter((_, i) => i !== index));
    if (selectedProductIndex >= products.length - 1) {
      setSelectedProductIndex(Math.max(0, products.length - 2));
    }
  }, [products.length, selectedProductIndex]);

  const handleCSVImport = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Aqui você implementaria a lógica de parsing CSV
    // Por enquanto, apenas um placeholder
    toast.info("Importação CSV será implementada em breve");
    e.target.value = "";
  }, []);

  const handleExcelImport = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Aqui você implementaria a lógica de parsing Excel
    // Por enquanto, apenas um placeholder
    toast.info("Importação Excel será implementada em breve");
    e.target.value = "";
  }, []);

  const handleSubmit = async () => {
    if (!user?.unitId) {
      toast.error("Você precisa estar autenticado para cadastrar produtos.");
      return;
    }

    // Validar todos os produtos
    const validatedProducts = products.map((product) => {
      const errors = validateProduct(product);
      return { ...product, errors, isValid: errors.length === 0 };
    });

    const invalidProducts = validatedProducts.filter((p) => !p.isValid);
    if (invalidProducts.length > 0) {
      toast.error(
        `${invalidProducts.length} produto(s) com erros. Corrija antes de continuar.`
      );
      setProducts(validatedProducts);
      return;
    }

    await onSubmit(validatedProducts);
  };

  const currentProduct = products[selectedProductIndex] || products[0];

  // Mostrar loading enquanto autenticação está sendo verificada
  if (isAuthLoading) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Verificando autenticação...</p>
        </div>
      </Card>
    );
  }

  // Verificar se usuário está autenticado e tem unitId
  if (!user || !user.unitId) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          <p className="font-medium mb-2">Você precisa estar autenticado para cadastrar produtos.</p>
          <p className="text-base">
            {!user ? "Faça login para continuar." : "Seu usuário não possui unitId. Entre em contato com o suporte."}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-blue to-neon-cyan flex items-center justify-center">
            <FileSpreadsheet className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Cadastro Massivo de Produtos</h2>
            <p className="text-base text-muted-foreground">
              Cadastre múltiplos produtos de uma vez
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {products.filter((p) => p.isValid).length} / {products.length} válidos
          </Badge>
          <Button onClick={addProduct} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Produto
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="form">
            <FileText className="h-4 w-4 mr-2" />
            Formulário Múltiplo
          </TabsTrigger>
          <TabsTrigger value="import">
            <Upload className="h-4 w-4 mr-2" />
            Importar CSV/Excel
          </TabsTrigger>
        </TabsList>

        <TabsContent value="form" className="space-y-4">
          {/* Lista de Produtos */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {products.map((product, index) => (
              <Card
                key={product.id}
                className={`min-w-[200px] p-3 cursor-pointer transition-all ${
                  selectedProductIndex === index
                    ? "ring-2 ring-neon-cyan"
                    : "hover:bg-muted/50"
                }`}
                onClick={() => setSelectedProductIndex(index)}
              >
                <div className="flex items-start justify-between mb-2">
                  <Badge variant={product.isValid ? "default" : "destructive"}>
                    {product.isValid ? (
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                    ) : (
                      <XCircle className="h-3 w-3 mr-1" />
                    )}
                    Produto {index + 1}
                  </Badge>
                  {products.length > 1 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeProduct(index);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="text-base font-medium truncate">
                  {product.name || "Sem nome"}
                </p>
                {product.errors && product.errors.length > 0 && (
                  <p className="text-sm text-destructive mt-1">
                    {product.errors.length} erro(s)
                  </p>
                )}
              </Card>
            ))}
          </div>

          {/* Formulário do Produto Selecionado */}
          {currentProduct && (
            <Card className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">
                  Produto {selectedProductIndex + 1} de {products.length}
                </h3>
                {currentProduct.errors && currentProduct.errors.length > 0 && (
                  <div className="flex flex-col gap-1">
                    {currentProduct.errors.map((error, idx) => (
                      <Badge key={idx} variant="destructive" className="text-sm">
                        {error}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome do Produto *</Label>
                    <Input
                      id="name"
                      value={currentProduct.name}
                      onChange={(e) =>
                        updateProduct(selectedProductIndex, { name: e.target.value })
                      }
                      placeholder="Nome do produto"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição *</Label>
                    <Textarea
                      id="description"
                      value={currentProduct.description}
                      onChange={(e) =>
                        updateProduct(selectedProductIndex, {
                          description: e.target.value,
                        })
                      }
                      placeholder="Descrição completa do produto"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shortDescription">Descrição Curta</Label>
                    <Textarea
                      id="shortDescription"
                      value={currentProduct.shortDescription}
                      onChange={(e) =>
                        updateProduct(selectedProductIndex, {
                          shortDescription: e.target.value,
                        })
                      }
                      placeholder="Descrição curta (até 200 caracteres)"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Preço *</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={currentProduct.price}
                        onChange={(e) =>
                          updateProduct(selectedProductIndex, {
                            price: parseFloat(e.target.value) || 0,
                          })
                        }
                        placeholder="0.00"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stockQuantity">Estoque</Label>
                      <Input
                        id="stockQuantity"
                        type="number"
                        value={currentProduct.stockQuantity}
                        onChange={(e) =>
                          updateProduct(selectedProductIndex, {
                            stockQuantity: parseInt(e.target.value) || 0,
                          })
                        }
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU *</Label>
                    <Input
                      id="sku"
                      value={currentProduct.sku}
                      onChange={(e) =>
                        updateProduct(selectedProductIndex, { sku: e.target.value })
                      }
                      placeholder="Código SKU"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="categoryId">Categoria *</Label>
                    <select
                      id="categoryId"
                      value={currentProduct.categoryId}
                      onChange={(e) =>
                        updateProduct(selectedProductIndex, {
                          categoryId: e.target.value,
                        })
                      }
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background"
                    >
                      {categories
                        .filter((c) => c.isActive)
                        .map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="availability">Disponibilidade</Label>
                    <select
                      id="availability"
                      value={currentProduct.availability}
                      onChange={(e) =>
                        updateProduct(selectedProductIndex, {
                          availability: e.target.value as any,
                        })
                      }
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background"
                    >
                      <option value="in_stock">Em Estoque</option>
                      <option value="out_of_stock">Fora de Estoque</option>
                      <option value="pre_order">Pré-venda</option>
                    </select>
                  </div>

                  {/* Gerenciamento de Imagens */}
                  <div className="space-y-2">
                    <ImageManager
                      images={currentProduct.images}
                      onImagesChange={(images) =>
                        updateProduct(selectedProductIndex, { images })
                      }
                    />
                  </div>

                  {/* Controle de Marketplace */}
                  <div className="space-y-2">
                    <MarketplaceControls
                      settings={currentProduct.marketplace}
                      onSettingsChange={(marketplace) =>
                        updateProduct(selectedProductIndex, { marketplace })
                      }
                      categories={categories.map((c) => ({
                        id: c.id,
                        name: c.name,
                      }))}
                    />
                  </div>
                </div>
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="import" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold mb-2">Importar de Arquivo</h3>
                <p className="text-base text-muted-foreground">
                  Faça upload de um arquivo CSV ou Excel com os dados dos produtos
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="csv-upload">Importar CSV</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="csv-upload"
                      type="file"
                      accept=".csv"
                      onChange={handleCSVImport}
                      className="hidden"
                    />
                    <Label
                      htmlFor="csv-upload"
                      className="flex items-center gap-2 px-4 py-2 border border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors flex-1"
                    >
                      <FileText className="h-4 w-4" />
                      <span>Selecionar CSV</span>
                    </Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excel-upload">Importar Excel</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="excel-upload"
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleExcelImport}
                      className="hidden"
                    />
                    <Label
                      htmlFor="excel-upload"
                      className="flex items-center gap-2 px-4 py-2 border border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors flex-1"
                    >
                      <FileSpreadsheet className="h-4 w-4" />
                      <span>Selecionar Excel</span>
                    </Label>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-base font-medium mb-2">Formato esperado:</p>
                <ul className="text-base text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Nome, Descrição, Preço, SKU, Categoria, Estoque</li>
                  <li>Primeira linha deve conter os cabeçalhos</li>
                  <li>Campos obrigatórios: Nome, Descrição, Preço, SKU, Categoria</li>
                </ul>
              </div>

              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Baixar Template CSV
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Ações */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t">
        <div className="flex-1 text-base text-muted-foreground">
          {products.filter((p) => p.isValid).length} de {products.length} produtos válidos
        </div>
        <Button
          onClick={handleSubmit}
          disabled={
            isLoading ||
            products.length === 0 ||
            products.filter((p) => p.isValid).length === 0
          }
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
              Cadastrar {products.filter((p) => p.isValid).length} Produto(s)
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};

