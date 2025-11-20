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
  Package, 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  Filter,
  Download,
  TrendingUp
} from "lucide-react";
import { useState, useMemo } from "react";
import { useAuthContext } from "@/features/auth";

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
        <Button className="bg-gradient-to-r from-neon-cyan to-neon-blue hover:opacity-90 transition-opacity shadow-neon">
          <Plus className="h-4 w-4 mr-2" />
          Novo Produto
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 bg-gradient-to-br from-neon-blue/10 to-neon-cyan/10 border-neon-blue/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-blue to-neon-cyan flex items-center justify-center">
              <Package className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Produtos</p>
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
              <p className="text-sm text-muted-foreground">Em Estoque</p>
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
              <p className="text-sm text-muted-foreground">Estoque Baixo</p>
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
              <p className="text-sm text-muted-foreground">Esgotados</p>
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

      {/* Products Table */}
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
            {filteredProducts.map((product) => (
              <TableRow key={product.id} className="border-border/50 hover:bg-muted/30 transition-colors">
                <TableCell className="font-mono text-sm text-muted-foreground">
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
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default ProductsManagement;
