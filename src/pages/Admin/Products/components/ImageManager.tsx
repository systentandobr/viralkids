import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  X, 
  Star, 
  GripVertical, 
  Image as ImageIcon,
  Loader2 
} from "lucide-react";
import { ImageItem, ImageManagerProps } from "../types";
import { ProductService } from "@/services/products/productService";
import { toast } from "sonner";

export const ImageManager = ({
  images,
  onImagesChange,
  maxImages = 10,
  allowUpload = true,
}: ImageManagerProps) => {
  const [uploading, setUploading] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const generateId = () => `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;

    if (images.length + files.length > maxImages) {
      toast.error(`Você pode adicionar no máximo ${maxImages} imagens`);
      return;
    }

    const newImages: ImageItem[] = [];

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} não é uma imagem válida`);
        continue;
      }

      const id = generateId();
      const imageItem: ImageItem = {
        id,
        url: URL.createObjectURL(file),
        file,
        isMain: images.length === 0 && newImages.length === 0,
        order: images.length + newImages.length,
      };

      newImages.push(imageItem);
    }

    if (newImages.length > 0) {
      const updatedImages = [...images, ...newImages];
      onImagesChange(updatedImages);
    }

    // Reset input
    e.target.value = '';
  }, [images, maxImages, onImagesChange]);

  const handleUpload = useCallback(async (imageItem: ImageItem) => {
    if (!imageItem.file) return;

    setUploading(imageItem.id);

    try {
      const response = await ProductService.uploadProductImage(imageItem.file, (progress) => {
        // Progress callback pode ser usado para mostrar progresso
        console.log(`Upload progress: ${progress}%`);
      });

      if (response.success && response.data) {
        const updatedImages = images.map(img =>
          img.id === imageItem.id
            ? { ...img, url: response.data.url, file: undefined }
            : img
        );
        onImagesChange(updatedImages);
        toast.success('Imagem enviada com sucesso!');
      } else {
        throw new Error('Erro ao fazer upload da imagem');
      }
    } catch (error: any) {
      console.error('Erro ao fazer upload:', error);
      toast.error(error.message || 'Erro ao fazer upload da imagem');
    } finally {
      setUploading(null);
    }
  }, [images, onImagesChange]);

  const handleRemove = useCallback((id: string) => {
    const updatedImages = images
      .filter(img => img.id !== id)
      .map((img, index) => ({ ...img, order: index }));
    
    // Se removemos a imagem principal, definir a primeira como principal
    const removedImage = images.find(img => img.id === id);
    if (removedImage?.isMain && updatedImages.length > 0) {
      updatedImages[0].isMain = true;
    }

    onImagesChange(updatedImages);
  }, [images, onImagesChange]);

  const handleSetMain = useCallback((id: string) => {
    const updatedImages = images.map(img => ({
      ...img,
      isMain: img.id === id,
    }));
    onImagesChange(updatedImages);
  }, [images, onImagesChange]);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null) return;

    if (draggedIndex !== index) {
      const newImages = [...images];
      const draggedItem = newImages[draggedIndex];
      newImages.splice(draggedIndex, 1);
      newImages.splice(index, 0, draggedItem);
      
      const reordered = newImages.map((img, idx) => ({
        ...img,
        order: idx,
      }));

      onImagesChange(reordered);
      setDraggedIndex(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Imagens do Produto</Label>
        <Badge variant="outline">
          {images.length} / {maxImages}
        </Badge>
      </div>

      {allowUpload && (
        <div className="flex items-center gap-2">
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="image-upload"
            disabled={images.length >= maxImages}
          />
          <Label
            htmlFor="image-upload"
            className="flex items-center gap-2 px-4 py-2 border border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
          >
            <Upload className="h-4 w-4" />
            <span>Adicionar Imagens</span>
          </Label>
        </div>
      )}

      {images.length === 0 ? (
        <Card className="p-12 border-dashed">
          <div className="flex flex-col items-center justify-center text-center">
            <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">
              Nenhuma imagem adicionada
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Adicione imagens para o produto
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <Card
              key={image.id}
              className={`relative group overflow-hidden ${
                draggedIndex === index ? 'opacity-50' : ''
              } ${image.isMain ? 'ring-2 ring-neon-cyan' : ''}`}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
            >
              <div className="aspect-square relative">
                <img
                  src={image.url}
                  alt={`Imagem ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 text-white hover:text-white hover:bg-white/20"
                    onClick={() => handleSetMain(image.id)}
                    title="Definir como principal"
                  >
                    <Star className={`h-4 w-4 ${image.isMain ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                  </Button>
                  {image.file && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="opacity-0 group-hover:opacity-100 text-white hover:text-white hover:bg-white/20"
                      onClick={() => handleUpload(image)}
                      disabled={uploading === image.id}
                      title="Fazer upload"
                    >
                      {uploading === image.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 text-white hover:text-white hover:bg-red-500/50"
                    onClick={() => handleRemove(image.id)}
                    title="Remover"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {image.isMain && (
                  <Badge className="absolute top-2 left-2 bg-neon-cyan text-white">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Principal
                  </Badge>
                )}
                <div className="absolute top-2 right-2">
                  <GripVertical className="h-4 w-4 text-white/50" />
                </div>
              </div>
              <div className="p-2 text-xs text-center text-muted-foreground">
                {index + 1} de {images.length}
              </div>
            </Card>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Arraste as imagens para reordenar. Clique na estrela para definir como imagem principal.
        </p>
      )}
    </div>
  );
};

