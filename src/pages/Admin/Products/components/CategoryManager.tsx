import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  FolderTree,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
} from "lucide-react";
import {
  ProductCategory,
  CreateCategoryData,
  UpdateCategoryData,
} from "../types";
import { useAuthContext } from "@/features/auth";

interface CategoryManagerProps {
  categories: ProductCategory[];
  onCategoryCreate: (data: CreateCategoryData) => Promise<void>;
  onCategoryUpdate: (id: string, data: UpdateCategoryData) => Promise<void>;
  onCategoryDelete: (id: string) => Promise<void>;
  onSelectCategories?: (categoryIds: string[]) => void;
  multiple?: boolean;
  isLoading?: boolean;
}

export const CategoryManager = ({
  categories,
  onCategoryCreate,
  onCategoryUpdate,
  onCategoryDelete,
  isLoading = false,
  onSelectCategories,
  multiple = false,
}: CategoryManagerProps) => {
  const { user } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const [formData, setFormData] = useState<CreateCategoryData>({
    name: "",
    description: "",
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const resetForm = () => {
    setFormData({ name: "", description: "" });
    setEditingCategory(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await onCategoryUpdate(editingCategory.id, formData);
      } else {
        await onCategoryCreate(formData);
      }
      resetForm();
    } catch (error) {
      console.error("Erro ao salvar categoria:", error);
    }
  };

  const handleEdit = (category: ProductCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta categoria?")) {
      try {
        await onCategoryDelete(id);
      } catch (error) {
        console.error("Erro ao excluir categoria:", error);
      }
    }
  };

  const handleSelectCategory = (categoryId: string) => {
    if (multiple) {
      setSelectedCategories((prev) =>
        prev.includes(categoryId)
          ? prev.filter((id) => id !== categoryId)
          : [...prev, categoryId]
      );
    } else {
      setSelectedCategories([categoryId]);
      onSelectCategories?.([categoryId]);
      setIsOpen(false);
    }
  };

  const handleConfirmSelection = () => {
    onSelectCategories?.(selectedCategories);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FolderTree className="h-4 w-4" />
          Gerenciar Categorias
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gerenciamento de Categorias</DialogTitle>
          <DialogDescription>
            Crie, edite e remova categorias de produtos
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Formulário de criação/edição */}
          <Card className="p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Categoria *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Ex: Bicicletas 3D"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Descrição opcional"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="gap-2">
                  <Save className="h-4 w-4" />
                  {editingCategory ? "Atualizar" : "Criar"} Categoria
                </Button>
                {editingCategory && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancelar Edição
                  </Button>
                )}
              </div>
            </form>
          </Card>

          {/* Lista de categorias */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Categorias Existentes</h3>
              <Badge variant="secondary">
                {isLoading ? 'Carregando...' : `${categories.length} categorias`}
              </Badge>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  {multiple && <TableHead className="w-12"></TableHead>}
                  <TableHead>Nome</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="text-center">Produtos</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={multiple ? 6 : 5} className="text-center text-muted-foreground py-8">
                      Carregando categorias...
                    </TableCell>
                  </TableRow>
                ) : categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={multiple ? 6 : 5} className="text-center text-muted-foreground">
                      Nenhuma categoria cadastrada
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((category) => (
                    <TableRow key={category.id}>
                      {multiple && (
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(category.id)}
                            onChange={() => handleSelectCategory(category.id)}
                            className="rounded"
                          />
                        </TableCell>
                      )}
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {category.description || "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">{category.productCount || 0}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={category.isActive ? "default" : "secondary"}
                        >
                          {category.isActive ? "Ativa" : "Inativa"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(category)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(category.id)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
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

          {multiple && selectedCategories.length > 0 && (
            <div className="flex justify-end">
              <Button onClick={handleConfirmSelection} className="gap-2">
                <Save className="h-4 w-4" />
                Selecionar {selectedCategories.length} Categoria(s)
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

