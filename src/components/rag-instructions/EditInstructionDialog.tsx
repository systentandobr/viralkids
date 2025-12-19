import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { ragInstructionsService, RagInstruction } from '@/services/api/rag-instructions.service';

interface EditInstructionDialogProps {
  open: boolean;
  instruction: RagInstruction | null;
  onClose: () => void;
  onSuccess: () => void;
}

const EditInstructionDialog: React.FC<EditInstructionDialogProps> = ({
  open,
  instruction,
  onClose,
  onSuccess,
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [instructions, setInstructions] = useState<string[]>([]);
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (instruction) {
      setInstructions(instruction.instructions || []);
      setActive(instruction.active !== false);
    }
  }, [instruction]);

  const handleSubmit = async () => {
    if (!instruction) return;

    setLoading(true);
    try {
      const response = await ragInstructionsService.update(instruction.id, {
        instructions,
        active,
      });

      if (response.success) {
        toast({
          title: 'Sucesso',
          description: 'Instrução atualizada com sucesso',
        });
        onSuccess();
      } else {
        toast({
          title: 'Erro',
          description: response.error || 'Erro ao atualizar instrução',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Error updating instruction', error);
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar instrução',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addInstruction = () => {
    setInstructions([...instructions, '']);
  };

  const removeInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const updateInstruction = (index: number, value: string) => {
    const newInstructions = [...instructions];
    newInstructions[index] = value;
    setInstructions(newInstructions);
  };

  if (!instruction) return null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Instrução RAG</DialogTitle>
          <DialogDescription>
            {instruction.metadata?.title ||
              instruction.metadata?.description ||
              `Instrução ${instruction.sourceType || 'text'}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Instruções</Label>
            <div className="space-y-2 mt-2">
              {instructions.map((inst, index) => (
                <div key={index} className="flex gap-2">
                  <Textarea
                    value={inst}
                    onChange={(e) => updateInstruction(index, e.target.value)}
                    placeholder={`Instrução ${index + 1}`}
                    rows={3}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeInstruction(index)}
                    className="mt-0"
                  >
                    Remover
                  </Button>
                </div>
              ))}
              <Button variant="outline" onClick={addInstruction} className="w-full">
                Adicionar Instrução
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="active"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="active">Instrução ativa</Label>
          </div>

          {instruction.sourceType && (
            <div className="text-sm text-gray-500">
              <p>
                <strong>Tipo:</strong> {instruction.sourceType}
              </p>
              {instruction.sourceUrl && (
                <p>
                  <strong>URL:</strong> {instruction.sourceUrl}
                </p>
              )}
              {instruction.sourceFileName && (
                <p>
                  <strong>Arquivo:</strong> {instruction.sourceFileName}
                </p>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditInstructionDialog;
