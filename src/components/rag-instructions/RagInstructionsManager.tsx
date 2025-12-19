import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, Plus, FileText, Link, File, Edit, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { ragInstructionsService, RagInstruction } from '@/services/api/rag-instructions.service';
import AddInstructionDialog from './AddInstructionDialog';
import EditInstructionDialog from './EditInstructionDialog';
import { useAuthStore } from '@/stores/auth.store';

const RagInstructionsManager: React.FC = () => {
  const { toast } = useToast();
  const [instructions, setInstructions] = useState<RagInstruction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingInstruction, setEditingInstruction] = useState<RagInstruction | null>(null);
  const  user = useAuthStore.getState().user;
  useEffect(() => {
    fetchInstructions();
  }, []);

  const fetchInstructions = async () => {
    setLoading(true);
    try {
      const response = await ragInstructionsService.findByUnitId(user.unitId);
      if (response.success && response.data) {
        setInstructions(response.data as RagInstruction[]);
      } else {
        toast({
          title: 'Erro',
          description: response.error || 'Erro ao carregar instruções',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Error fetching instructions', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar instruções',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta instrução?')) {
      return;
    }

    try {
      const response = await ragInstructionsService.delete(id);
      if (response.success) {
        toast({
          title: 'Sucesso',
          description: 'Instrução excluída com sucesso',
        });
        fetchInstructions();
      } else {
        toast({
          title: 'Erro',
          description: response.error || 'Erro ao excluir instrução',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: 'Erro ao excluir instrução',
        variant: 'destructive',
      });
    }
  };

  const handleReindex = async (id: string) => {
    try {
      const response = await ragInstructionsService.reindex(id);
      if (response.success) {
        toast({
          title: 'Sucesso',
          description: 'Instrução reindexada com sucesso',
        });
        fetchInstructions();
      } else {
        toast({
          title: 'Erro',
          description: response.error || 'Erro ao reindexar instrução',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: 'Erro ao reindexar instrução',
        variant: 'destructive',
      });
    }
  };

  const getSourceIcon = (sourceType?: string) => {
    switch (sourceType) {
      case 'text':
        return <FileText className="h-4 w-4" />;
      case 'url':
        return <Link className="h-4 w-4" />;
      case 'pdf':
        return <File className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getSourceLabel = (sourceType?: string) => {
    switch (sourceType) {
      case 'text':
        return 'Texto';
      case 'url':
        return 'URL';
      case 'pdf':
        return 'PDF';
      default:
        return 'Texto';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="animate-spin text-blue-500 h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Instruções RAG</h2>
          <p className="text-sm text-gray-500 mt-1">
            Gerencie as instruções que alimentam o conhecimento do chatbot
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchInstructions}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Instrução
          </Button>
        </div>
      </div>

      {instructions.length > 0 ? (
        <div className="space-y-4">
          {instructions.map((instruction) => (
            <div
              key={instruction.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getSourceIcon(instruction.sourceType)}
                    <h3 className="font-semibold text-lg">
                      {instruction.metadata?.title ||
                        instruction.metadata?.description ||
                        `Instrução ${getSourceLabel(instruction.sourceType)}`}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        instruction.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {instruction.active ? 'Ativa' : 'Inativa'}
                    </span>
                    {instruction.metadata?.indexedInRAG ? (
                      <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-800 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Indexada
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded text-xs font-semibold bg-yellow-100 text-yellow-800 flex items-center gap-1">
                        <XCircle className="h-3 w-3" />
                        Não Indexada
                      </span>
                    )}
                  </div>

                  <div className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Tipo:</span> {getSourceLabel(instruction.sourceType)}
                    {instruction.sourceUrl && (
                      <>
                        <span className="mx-2">•</span>
                        <span className="font-medium">URL:</span>{' '}
                        <a
                          href={instruction.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {instruction.sourceUrl}
                        </a>
                      </>
                    )}
                    {instruction.sourceFileName && (
                      <>
                        <span className="mx-2">•</span>
                        <span className="font-medium">Arquivo:</span> {instruction.sourceFileName}
                      </>
                    )}
                  </div>

                  <div className="text-sm text-gray-500 mb-3">
                    {instruction.instructions.length} instrução(ões) processada(s)
                  </div>

                  {instruction.metadata?.processingStatus && (
                    <div className="text-xs text-gray-500 mb-2">
                      Status: {instruction.metadata.processingStatus}
                      {instruction.metadata.processingError && (
                        <span className="text-red-600 ml-2">
                          Erro: {instruction.metadata.processingError}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingInstruction(instruction)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    {!instruction.metadata?.indexedInRAG && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReindex(instruction.id)}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Reindexar
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(instruction.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 space-y-4">
          <FileText className="h-16 w-16 text-gray-400 mx-auto" />
          <p className="text-gray-500 text-lg">Nenhuma instrução encontrada</p>
          <p className="text-sm text-gray-400">
            Adicione instruções para construir a base de conhecimento do chatbot
          </p>
          <Button onClick={() => setShowAddDialog(true)} className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Primeira Instrução
          </Button>
        </div>
      )}

      {showAddDialog && (
        <AddInstructionDialog
          open={showAddDialog}
          onClose={() => setShowAddDialog(false)}
          onSuccess={() => {
            setShowAddDialog(false);
            fetchInstructions();
          }}
        />
      )}

      {editingInstruction && (
        <EditInstructionDialog
          open={!!editingInstruction}
          instruction={editingInstruction}
          onClose={() => setEditingInstruction(null)}
          onSuccess={() => {
            setEditingInstruction(null);
            fetchInstructions();
          }}
        />
      )}
    </div>
  );
};

export default RagInstructionsManager;
