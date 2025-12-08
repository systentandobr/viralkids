import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { 
  Package, 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  Filter,
  Download,
  TrendingUp,
  Link2,
  RefreshCw,
  FileSpreadsheet
} from "lucide-react";
import { useState, useMemo } from "react";
import { useAuthContext } from "@/features/auth";
import { CategoryManager } from "./components/CategoryManager";
import { AffiliateProductForm } from "./components/AffiliateProductForm";
import { ProcessingStatusTab } from "./components/ProcessingStatusTab";
import { BulkProductForm } from "./components/BulkProductForm";
import { CreateProductForm } from "@/pages/Admin/components/products/CreateProductForm";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  ProductCategory,
  CreateCategoryData,
  UpdateCategoryData,
  AffiliateProduct,
  CreateAffiliateProductData,
  BulkProductItem,
} from "./types";
import { CategoryService } from "@/services/products/categoryService";
import { AffiliateProductService } from "@/services/products/affiliateProductService";
import { BulkProductService } from "@/services/products/bulkProductService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Mock de dados - em produção, isso viria de uma API filtrada por unitId
const allProducts = [
  { id: "SKU-001", name: "Cela Especial Dino K-ing", category: "Bicicletas 3D", price: 450.00, stock: 12, status: "ativo", unitId: "unit-001" },
  { id: "SKU-002", name: "Bicicleta Homem Aranha", category: "Bicicletas 3D", price: 425.00, stock: 8, status: "ativo", unitId: "unit-001" },
  { id: "SKU-003", name: "Balanço Aranha 3D", category: "Balanços 3D", price: 380.00, stock: 5, status: "baixo", unitId: "unit-002" },
  { id: "SKU-004", name: "City View Hydro-Glide", category: "Bicicletas 3D", price: 520.00, stock: 15, status: "ativo", unitId: "unit-001" },
  { id: "SKU-005", name: "Balanço Aranha Homem Folha", category: "Balanços 3D", price: 410.00, stock: 3, status: "baixo", unitId: "unit-002" },
  { id: "SKU-006", name: "Cavaleiro Torre do Castelo Oost", category: "Castelos 3D", price: 650.00, stock: 0, status: "esgotado", unitId: "unit-001" }
];

const ProductsManagement = () => {
  const { user } = useAuthContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("products");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const queryClient = useQueryClient();
  
  // Query para categorias - carrega automaticamente ao abrir a página
  const { data: categoriesData, isLoading: isLoadingCategories, error: categoriesError } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const response = await CategoryService.list();
        console.log('[ProductsManagement] Resposta de categorias:', response);
        
        if (response.success && response.data) {
          return response.data;
        }
        
        // Se não teve sucesso, mostrar erro
        if (!response.success) {
          console.error('[ProductsManagement] Erro ao carregar categorias:', response.error);
          toast.error(response.error || 'Erro ao carregar categorias');
        }
        
        return [];
      } catch (error: any) {
        console.error('[ProductsManagement] Erro na requisição de categorias:', error);
        toast.error(error.message || 'Erro ao carregar categorias');
        return [];
      }
    },
    // Configurações para carregar imediatamente ao abrir a página
    enabled: true, // Sempre habilitada
    staleTime: 5 * 60 * 1000, // Considera os dados válidos por 5 minutos
    gcTime: 10 * 60 * 1000, // Mantém em cache por 10 minutos
    retry: 2,
    retryDelay: 1000, // Espera 1 segundo antes de tentar novamente
    refetchOnWindowFocus: false, // Não recarrega ao focar na janela (já tem cache)
    refetchOnMount: 'always', // Sempre recarrega quando o componente é montado
  });

  const categories: ProductCategory[] = categoriesData || [];
  
  // Log de erro se houver
  if (categoriesError) {
    console.error('[ProductsManagement] Erro na query de categorias:', categoriesError);
  }

  // Query para produtos afiliados
  const { data: affiliateProductsData, isLoading: isLoadingAffiliate } = useQuery({
    queryKey: ['affiliate-products'],
    queryFn: async () => {
      const response = await AffiliateProductService.list();
      if (response.success && response.data) {
        return response.data.items;
      }
      return [];
    },
    refetchInterval: 5000, // Atualizar a cada 5 segundos para ver status
    initialData: [],
  });

  const affiliateProducts: AffiliateProduct[] = affiliateProductsData || [];

  // Filtrar produtos pelo unitId do usuário autenticado
  const products = useMemo(() => {
    if (!user?.unitId) return [];
    return allProducts.filter(p => p.unitId === user.unitId);
  }, [user?.unitId]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  // Mutations para categorias
  const createCategoryMutation = useMutation({
    mutationFn: (data: CreateCategoryData) => CategoryService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Categoria criada com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao criar categoria');
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryData }) =>
      CategoryService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Categoria atualizada com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao atualizar categoria');
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => CategoryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Categoria excluída com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao excluir categoria');
    },
  });

  // Handlers para categorias
  const handleCategoryCreate = async (data: CreateCategoryData) => {
    await createCategoryMutation.mutateAsync(data);
  };

  const handleCategoryUpdate = async (id: string, data: UpdateCategoryData) => {
    await updateCategoryMutation.mutateAsync({ id, data });
  };

  const handleCategoryDelete = async (id: string) => {
    await deleteCategoryMutation.mutateAsync(id);
  };

  // Mutations para produtos afiliados
  const createAffiliateProductMutation = useMutation({
    mutationFn: (data: CreateAffiliateProductData) => AffiliateProductService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['affiliate-products'] });
      toast.success('Produto afiliado cadastrado! Processamento iniciado.');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao cadastrar produto afiliado');
    },
  });

  const retryProcessingMutation = useMutation({
    mutationFn: (id: string) => AffiliateProductService.retry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['affiliate-products'] });
      toast.success('Reprocessamento iniciado!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao reprocessar produto');
    },
  });

  // Handlers para produtos afiliados
  const handleAffiliateProductSubmit = async (data: CreateAffiliateProductData) => {
    if (!user?.unitId) {
      toast.error('unitId não encontrado. Faça login novamente.');
      return;
    }
    // O unitId será incluído automaticamente pelo backend via JWT
    // Mas garantimos que o usuário está autenticado
    await createAffiliateProductMutation.mutateAsync(data);
  };

  const handleRetryProcessing = async (id: string) => {
    await retryProcessingMutation.mutateAsync(id);
  };

  const handleRefreshProcessing = async () => {
    queryClient.invalidateQueries({ queryKey: ['affiliate-products'] });
  };

  // Mutation para cadastro massivo
  const bulkCreateMutation = useMutation({
    mutationFn: async (products: BulkProductItem[]) => {
      if (!user?.unitId) {
        throw new Error('unitId não encontrado. Faça login novamente.');
      }

      const createData = {
        products: products.map((p) => {
          const { id, errors, isValid, ...productData } = p;
          return productData;
        }),
        unitId: user.unitId,
      };

      return BulkProductService.createBulk(createData);
    },
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['products'] });
        toast.success(
          `${response.data?.created || 0} produto(s) criado(s) com sucesso!`
        );
        if (response.data?.failed && response.data.failed > 0) {
          toast.warning(`${response.data.failed} produto(s) falharam`);
        }
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao cadastrar produtos em lote');
    },
  });

  const handleBulkProductSubmit = async (products: BulkProductItem[]) => {
    await bulkCreateMutation.mutateAsync(products);
  };

  return (
    <div id="content" className="min-h-screen p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-neon-blue to-neon-cyan flex items-center justify-center shadow-neon">
            <Package className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Gerenciamento de Produtos</h1>
            <p className="text-muted-foreground">
              Controle seu estoque e catálogo de produtos 3D
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <CategoryManager
            categories={categories}
            onCategoryCreate={handleCategoryCreate}
            onCategoryUpdate={handleCategoryUpdate}
            onCategoryDelete={handleCategoryDelete}
            isLoading={isLoadingCategories}
          />
          <Button 
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition-opacity shadow-neon"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Produto
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 bg-gradient-to-br from-neon-blue/10 to-neon-cyan/10 border-neon-blue/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-blue to-neon-cyan flex items-center justify-center">
              <Package className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-base text-muted-foreground">Total Produtos</p>
              <h2 className="text-2xl font-bold text-neon-cyan">{products.length}</h2>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-neon-green/10 to-emerald-500/10 border-neon-green/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-green to-emerald-500 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-base text-muted-foreground">Em Estoque</p>
              <h2 className="text-2xl font-bold text-neon-green">
                {products.filter(p => p.status === "ativo").length}
              </h2>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
              <Package className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-base text-muted-foreground">Estoque Baixo</p>
              <h2 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {products.filter(p => p.status === "baixo").length}
              </h2>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-neon-red/10 to-red-500/10 border-neon-red/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-red to-red-500 flex items-center justify-center">
              <Package className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-base text-muted-foreground">Esgotados</p>
              <h2 className="text-2xl font-bold text-neon-red">
                {products.filter(p => p.status === "esgotado").length}
              </h2>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background border-border/50 focus:border-neon-cyan"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 border-border/50 hover:border-neon-blue">
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
            <Button variant="outline" className="gap-2 border-border/50 hover:border-neon-cyan">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="products">
            <Package className="h-4 w-4 mr-2" />
            Produtos
          </TabsTrigger>
          <TabsTrigger value="affiliate">
            <Link2 className="h-4 w-4 mr-2" />
            Produtos Afiliados
          </TabsTrigger>
          <TabsTrigger value="bulk">
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Cadastro Massivo
          </TabsTrigger>
          <TabsTrigger value="processing">
            <RefreshCw className="h-4 w-4 mr-2" />
            Status Processamento
          </TabsTrigger>
        </TabsList>

        {/* Tab: Produtos */}
        <TabsContent value="products" className="space-y-6">
          <Card className="p-6">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-muted/50">
                  <TableHead className="text-foreground font-semibold">Código</TableHead>
                  <TableHead className="text-foreground font-semibold">Produto</TableHead>
                  <TableHead className="text-foreground font-semibold">Categoria</TableHead>
                  <TableHead className="text-foreground font-semibold text-right">Preço</TableHead>
                  <TableHead className="text-foreground font-semibold text-center">Estoque</TableHead>
                  <TableHead className="text-foreground font-semibold text-center">Status</TableHead>
                  <TableHead className="text-foreground font-semibold text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      Nenhum produto encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id} className="border-border/50 hover:bg-muted/30 transition-colors">
                      <TableCell className="font-mono text-base text-muted-foreground">
                        {product.id}
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell className="text-muted-foreground">{product.category}</TableCell>
                      <TableCell className="text-right font-semibold text-neon-cyan">
                        R$ {product.price.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={product.stock <= 5 ? "text-yellow-600 dark:text-yellow-400 font-semibold" : ""}>
                          {product.stock}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant="secondary"
                          className={
                            product.status === "ativo"
                              ? "bg-neon-green/10 text-neon-green border-neon-green/20"
                              : product.status === "baixo"
                              ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20"
                              : "bg-neon-red/10 text-neon-red border-neon-red/20"
                          }
                        >
                          {product.status === "ativo" ? "Ativo" : product.status === "baixo" ? "Baixo" : "Esgotado"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-neon-blue/10 hover:text-neon-blue"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-neon-red/10 hover:text-neon-red"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Tab: Produtos Afiliados */}
        <TabsContent value="affiliate" className="space-y-6">
          <AffiliateProductForm
            categories={categories}
            onCategoryCreate={handleCategoryCreate}
            onCategoryUpdate={handleCategoryUpdate}
            onCategoryDelete={handleCategoryDelete}
            onSubmit={handleAffiliateProductSubmit}
            isLoading={createAffiliateProductMutation.isPending}
            showPreview={true}
          />
        </TabsContent>

        {/* Tab: Cadastro Massivo */}
        <TabsContent value="bulk" className="space-y-6">
          <BulkProductForm
            categories={categories}
            onSubmit={handleBulkProductSubmit}
            isLoading={bulkCreateMutation.isPending}
          />
        </TabsContent>

        {/* Tab: Status de Processamento */}
        <TabsContent value="processing" className="space-y-6">
          <ProcessingStatusTab
            affiliateProducts={affiliateProducts}
            onRetry={handleRetryProcessing}
            onRefresh={handleRefreshProcessing}
            isLoading={isLoadingAffiliate || retryProcessingMutation.isPending}
          />
        </TabsContent>
      </Tabs>

      {/* Modal de criação de produto */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <CreateProductForm
            onSuccess={() => {
              setIsCreateModalOpen(false);
              queryClient.invalidateQueries({ queryKey: ['products'] });
            }}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsManagement;
