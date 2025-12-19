import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, FileText, Link, File, Upload } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { ragInstructionsService } from '@/services/api/rag-instructions.service';

interface AddInstructionDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type TabType = 'text' | 'url' | 'pdf';

const AddInstructionDialog: React.FC<AddInstructionDialogProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>('text');
  const [loading, setLoading] = useState(false);

  // Text form
  const [textContent, setTextContent] = useState('');
  const [textTitle, setTextTitle] = useState('');

  // URL form
  const [url, setUrl] = useState('');
  const [urlTitle, setUrlTitle] = useState('');

  // PDF form
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfTitle, setPdfTitle] = useState('');

  const [indexInRAG, setIndexInRAG] = useState(true);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let response;

      switch (activeTab) {
        case 'text':
          if (!textContent.trim()) {
            toast({
              title: 'Erro',
              description: 'O conteúdo de texto é obrigatório',
              variant: 'destructive',
            });
            setLoading(false);
            return;
          }
          response = await ragInstructionsService.createFromText({
            content: textContent,
            title: textTitle || undefined,
            indexInRAG,
          });
          break;

        case 'url':
          if (!url.trim()) {
            toast({
              title: 'Erro',
              description: 'A URL é obrigatória',
              variant: 'destructive',
            });
            setLoading(false);
            return;
          }
          response = await ragInstructionsService.createFromUrl({
            url: url.trim(),
            title: urlTitle || undefined,
            indexInRAG,
          });
          break;

        case 'pdf':
          if (!pdfFile) {
            toast({
              title: 'Erro',
              description: 'Selecione um arquivo PDF',
              variant: 'destructive',
            });
            setLoading(false);
            return;
          }
          response = await ragInstructionsService.createFromPdf(pdfFile, {
            title: pdfTitle || undefined,
            indexInRAG,
          });
          break;
      }

      if (response.success) {
        toast({
          title: 'Sucesso',
          description: 'Instrução criada com sucesso',
        });
        resetForm();
        onSuccess();
      } else {
        toast({
          title: 'Erro',
          description: response.error || 'Erro ao criar instrução',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Error creating instruction', error);
      toast({
        title: 'Erro',
        description: 'Erro ao criar instrução',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTextContent('');
    setTextTitle('');
    setUrl('');
    setUrlTitle('');
    setPdfFile(null);
    setPdfTitle('');
    setActiveTab('text');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({
          title: 'Erro',
          description: 'Apenas arquivos PDF são permitidos',
          variant: 'destructive',
        });
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'Erro',
          description: 'O arquivo deve ter no máximo 10MB',
          variant: 'destructive',
        });
        return;
      }
      setPdfFile(file);
      if (!pdfTitle) {
        setPdfTitle(file.name.replace('.pdf', ''));
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Instrução RAG</DialogTitle>
          <DialogDescription>
            Adicione instruções para construir a base de conhecimento do chatbot
          </DialogDescription>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-2 border-b mb-4">
          <button
            onClick={() => setActiveTab('text')}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              activeTab === 'text'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText className="h-4 w-4 inline mr-2" />
            Texto
          </button>
          <button
            onClick={() => setActiveTab('url')}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              activeTab === 'url'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Link className="h-4 w-4 inline mr-2" />
            URL
          </button>
          <button
            onClick={() => setActiveTab('pdf')}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              activeTab === 'pdf'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <File className="h-4 w-4 inline mr-2" />
            PDF
          </button>
        </div>

        {/* Text Tab */}
        {activeTab === 'text' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="text-title">Título (opcional)</Label>
              <Input
                id="text-title"
                value={textTitle}
                onChange={(e) => setTextTitle(e.target.value)}
                placeholder="Ex: Instruções de Atendimento"
              />
            </div>
            <div>
              <Label htmlFor="text-content">Conteúdo *</Label>
              <Textarea
                id="text-content"
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Digite o conteúdo das instruções..."
                rows={10}
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                O texto será dividido automaticamente em instruções
              </p>
            </div>
          </div>
        )}

        {/* URL Tab */}
        {activeTab === 'url' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="url-title">Título (opcional)</Label>
              <Input
                id="url-title"
                value={urlTitle}
                onChange={(e) => setUrlTitle(e.target.value)}
                placeholder="Ex: Manual de Produtos"
              />
            </div>
            <div>
              <Label htmlFor="url">URL *</Label>
              <Input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/manual.pdf"
              />
              <p className="text-xs text-gray-500 mt-1">
                Suporta URLs de páginas web e PDFs online
              </p>
            </div>
          </div>
        )}

        {/* PDF Tab */}
        {activeTab === 'pdf' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="pdf-title">Título (opcional)</Label>
              <Input
                id="pdf-title"
                value={pdfTitle}
                onChange={(e) => setPdfTitle(e.target.value)}
                placeholder="Ex: Manual de Produtos"
              />
            </div>
            <div>
              <Label htmlFor="pdf-file">Arquivo PDF *</Label>
              <div className="mt-2">
                <label
                  htmlFor="pdf-file"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Clique para fazer upload</span> ou arraste o arquivo
                    </p>
                    <p className="text-xs text-gray-500">PDF (máx. 10MB)</p>
                  </div>
                  <input
                    id="pdf-file"
                    type="file"
                    accept=".pdf,application/pdf"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
                {pdfFile && (
                  <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                    <p className="text-sm text-green-800">
                      <File className="h-4 w-4 inline mr-2" />
                      {pdfFile.name} ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Index in RAG option */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="indexInRAG"
            checked={indexInRAG}
            onChange={(e) => setIndexInRAG(e.target.checked)}
            className="rounded border-gray-300"
          />
          <Label htmlFor="indexInRAG" className="text-sm">
            Indexar automaticamente no sistema RAG
          </Label>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Criar Instrução
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddInstructionDialog;
