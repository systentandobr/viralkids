import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, Clipboard, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadWithPasteProps {
  onImageUpload: (file: File) => Promise<void>;
  disabled?: boolean;
  accept?: string;
  maxSize?: number; // em bytes
  maxSizeMB?: number; // em MB (mais fácil de usar)
}

export function ImageUploadWithPaste({
  onImageUpload,
  disabled = false,
  accept = 'image/jpeg,image/jpg,image/png,image/webp,image/gif',
  maxSize,
  maxSizeMB = 10,
}: ImageUploadWithPasteProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isPasting, setIsPasting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const maxSizeBytes = maxSize || maxSizeMB * 1024 * 1024;

  // Handler para paste da área de transferência
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      // Só processar se não estiver desabilitado
      if (disabled) return;

      // Verificar se o componente está montado e visível
      if (!dropZoneRef.current) return;

      // Verificar se o foco está na página (não em um input de texto, por exemplo)
      const activeElement = document.activeElement;
      const isInputFocused = activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA';
      
      // Se estiver em um input de texto, não processar (deixa o usuário colar texto normalmente)
      if (isInputFocused && !dropZoneRef.current.contains(activeElement)) {
        return;
      }

      const items = e.clipboardData?.items;
      if (!items) return;

      setIsPasting(true);

      for (let i = 0; i < items.length; i++) {
        const item = items[i];

        // Verificar se é uma imagem
        if (item.type.indexOf('image') !== -1) {
          e.preventDefault();

          const file = item.getAsFile();
          if (!file) continue;

          // Validar tamanho
          if (file.size > maxSizeBytes) {
            toast({
              title: '❌ Arquivo muito grande',
              description: `O arquivo excede o tamanho máximo de ${maxSizeMB}MB`,
              variant: 'destructive',
            });
            setIsPasting(false);
            return;
          }

          // Validar tipo
          if (!accept.split(',').some((type) => file.type.match(type.trim()))) {
            toast({
              title: '❌ Tipo de arquivo não suportado',
              description: `Tipo ${file.type} não é suportado`,
              variant: 'destructive',
            });
            setIsPasting(false);
            return;
          }

          try {
            await onImageUpload(file);
            toast({
              title: '✅ Imagem colada com sucesso!',
              description: 'A imagem foi carregada da área de transferência.',
            });
          } catch (error: any) {
            toast({
              title: '❌ Erro ao colar imagem',
              description: error.message || 'Erro desconhecido',
              variant: 'destructive',
            });
          } finally {
            setIsPasting(false);
          }
          break;
        }
      }

      if (!isPasting) {
        setIsPasting(false);
      }
    };

    // Adicionar listener global para paste
    document.addEventListener('paste', handlePaste);

    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [disabled, onImageUpload, maxSizeBytes, maxSizeMB, accept, toast, isPasting]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await validateAndUpload(file);
      e.target.value = ''; // Reset input
    }
  };

  const validateAndUpload = async (file: File) => {
    // Validar tamanho
    if (file.size > maxSizeBytes) {
      toast({
        title: '❌ Arquivo muito grande',
        description: `O arquivo excede o tamanho máximo de ${maxSizeMB}MB`,
        variant: 'destructive',
      });
      return;
    }

    // Validar tipo
    if (!accept.split(',').some((type) => file.type.match(type.trim()))) {
      toast({
        title: '❌ Tipo de arquivo não suportado',
        description: `Tipo ${file.type} não é suportado`,
        variant: 'destructive',
      });
      return;
    }

    await onImageUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await validateAndUpload(files[0]);
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const formatAcceptTypes = () => {
    const types = accept.split(',').map((t) => {
      const ext = t.split('/')[1]?.toUpperCase();
      return ext || t;
    });
    return types.join(', ');
  };

  return (
    <div className='space-y-2'>
      <Label htmlFor='imageUpload'>Upload de Imagem</Label>
      
      <div
        ref={dropZoneRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`
          relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer
          ${isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          id='imageUpload'
          type='file'
          accept={accept}
          onChange={handleFileSelect}
          className='hidden'
          disabled={disabled}
        />

        <div className='flex flex-col items-center justify-center gap-3'>
          {isPasting ? (
            <>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
              <p className='text-sm text-muted-foreground'>Colando imagem...</p>
            </>
          ) : (
            <>
              <div className='flex gap-2'>
                <Upload className='h-6 w-6 text-muted-foreground' />
                <Clipboard className='h-6 w-6 text-muted-foreground' />
              </div>
              <div className='text-center'>
                <p className='text-sm font-medium'>
                  Arraste e solte uma imagem aqui ou clique para selecionar
                </p>
                <p className='text-xs text-muted-foreground mt-1'>
                  Você também pode colar uma imagem da área de transferência (Ctrl+V / Cmd+V)
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      <p className='text-sm text-muted-foreground'>
        Formatos aceitos: {formatAcceptTypes()}. Tamanho máximo: {maxSizeMB}MB
      </p>
    </div>
  );
}

