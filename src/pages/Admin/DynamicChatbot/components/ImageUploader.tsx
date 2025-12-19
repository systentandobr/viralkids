import React, { useRef, useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

interface ImageUploaderProps {
  onImageSelect: (file: File, base64: string) => void;
  disabled?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelect,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const validateFile = useCallback((file: File): boolean => {
    // Validar tamanho
    if (file.size > MAX_FILE_SIZE) {
      toast.error('Imagem muito grande. Tamanho máximo: 2MB');
      return false;
    }

    // Validar tipo
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error('Tipo de arquivo não suportado. Use JPEG, PNG, WebP ou GIF');
      return false;
    }

    return true;
  }, []);

  const compressImage = useCallback(
    (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            // Redimensionar se necessário (máx 1200px)
            const maxDimension = 1200;
            if (width > maxDimension || height > maxDimension) {
              if (width > height) {
                height = (height * maxDimension) / width;
                width = maxDimension;
              } else {
                width = (width * maxDimension) / height;
                height = maxDimension;
              }
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
              reject(new Error('Erro ao processar imagem'));
              return;
            }

            ctx.drawImage(img, 0, 0, width, height);

            // Converter para base64 com qualidade
            let quality = 0.8;
            let base64 = canvas.toDataURL('image/jpeg', quality);

            // Se ainda for muito grande, reduzir qualidade
            while (base64.length > MAX_FILE_SIZE && quality > 0.3) {
              quality -= 0.1;
              base64 = canvas.toDataURL('image/jpeg', quality);
            }

            resolve(base64.split(',')[1]); // Remove data:image/jpeg;base64,
          };
          img.onerror = () => reject(new Error('Erro ao carregar imagem'));
          img.src = e.target?.result as string;
        };
        reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
        reader.readAsDataURL(file);
      });
    },
    []
  );

  const handleFileSelect = useCallback(
    async (file: File) => {
      if (!validateFile(file)) return;

      setSelectedFile(file);

      try {
        // Criar preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);

        // Comprimir e converter para base64
        const base64 = await compressImage(file);
        onImageSelect(file, base64);
      } catch (error: any) {
        console.error('Erro ao processar imagem:', error);
        toast.error('Erro ao processar imagem');
        setSelectedFile(null);
        setPreview(null);
      }
    },
    [validateFile, compressImage, onImageSelect]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileSelect(file);
        e.target.value = ''; // Reset input
      }
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (disabled) return;

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [disabled, handleFileSelect]
  );

  const handleClick = useCallback(() => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  }, [disabled]);

  const handleRemove = useCallback(() => {
    setPreview(null);
    setSelectedFile(null);
  }, []);

  if (preview) {
    return (
      <div className="relative inline-block">
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="max-w-[200px] max-h-[200px] rounded-lg object-cover"
          />
          <button
            onClick={handleRemove}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        disabled={disabled}
        className="h-8 w-8 p-0"
      >
        <ImageIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};
