import React from 'react';
import { RagInstruction } from '@/services/api/rag-instructions.service';
import { FileText, Link, File, CheckCircle2, XCircle } from 'lucide-react';

interface InstructionCardProps {
  instruction: RagInstruction;
  onEdit?: () => void;
  onDelete?: () => void;
  onReindex?: () => void;
}

const InstructionCard: React.FC<InstructionCardProps> = ({
  instruction,
  onEdit,
  onDelete,
  onReindex,
}) => {
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

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
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
        </div>
      </div>
    </div>
  );
};

export default InstructionCard;
