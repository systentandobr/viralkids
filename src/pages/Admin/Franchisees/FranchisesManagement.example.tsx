/**
 * EXEMPLO DE INTEGRAÇÃO DO FORMULÁRIO DE CRIAÇÃO DE FRANQUIAS
 * 
 * Este arquivo mostra como integrar o CreateFranchiseForm na página FranchisesManagement.tsx
 * 
 * IMPORTANTE: Este é um exemplo. Adapte conforme a estrutura real do seu projeto.
 */

'use client';

import React, { useState } from 'react';
import { CreateFranchiseForm } from '../../../components/franchises/CreateFranchiseForm';
import { FranchiseResponse } from '../../../types/franchise.types';
import { franchisesService } from '../../../services/api/franchises.service';

// Exemplo de componente de modal/drawer (ajuste conforme sua biblioteca de UI)
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Fechar</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          )}

          {/* Content */}
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

/**
 * Exemplo de integração na página FranchisesManagement
 */
export const FranchisesManagementExample: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [franchises, setFranchises] = useState<FranchiseResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Função para recarregar a lista de franquias
  const refreshFranchises = async () => {
    setIsLoading(true);
    try {
      const response = await franchisesService.getFranchises();
      setFranchises(response.data);
    } catch (error) {
      console.error('Erro ao carregar franquias:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar franquias quando o componente montar ou quando refreshTrigger mudar
  React.useEffect(() => {
    refreshFranchises();
  }, [refreshTrigger]);

  // Handler para sucesso na criação
  const handleCreateSuccess = (franchise: FranchiseResponse) => {
    console.log('Franquia criada com sucesso:', franchise);
    
    // Fechar modal
    setIsCreateModalOpen(false);
    
    // Recarregar lista
    setRefreshTrigger((prev) => prev + 1);
    
    // Opcional: Mostrar notificação de sucesso
    // toast.success('Franquia criada com sucesso!');
  };

  // Handler para cancelar criação
  const handleCreateCancel = () => {
    setIsCreateModalOpen(false);
  };

  return (
    <div className="p-6">
      {/* Header da página */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gerenciamento de Franquias
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie todas as franquias do sistema
          </p>
        </div>

        {/* Botão para abrir modal de criação */}
        <button
          onClick={() => { setIsCreateModalOpen(true); alert('Modal aberto'); }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Nova Franquia
        </button>
      </div>

      {/* Lista de franquias */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Carregando franquias...</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {franchises.map((franchise) => (
              <li key={franchise.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {franchise.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {franchise.location.city}, {franchise.location.state}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        franchise.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : franchise.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : franchise.status === 'suspended'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {franchise.status}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Modal de criação */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={handleCreateCancel}
        title="Criar Nova Franquia"
      >
        <CreateFranchiseForm
          onSuccess={handleCreateSuccess}
          onCancel={handleCreateCancel}
        />
      </Modal>
    </div>
  );
};

/**
 * INSTRUÇÕES DE INTEGRAÇÃO:
 * 
 * 1. Copie o conteúdo do componente Modal ou use sua biblioteca de UI preferida
 * 2. Importe o CreateFranchiseForm no seu arquivo FranchisesManagement.tsx
 * 3. Adicione o estado para controlar a abertura/fechamento do modal
 * 4. Adicione o botão "Nova Franquia" no header da página
 * 5. Adicione o Modal com o CreateFranchiseForm
 * 6. Implemente a função de refresh da lista após criação bem-sucedida
 * 7. Ajuste os estilos conforme o design system do seu projeto
 * 
 * EXEMPLO DE USO SIMPLES (sem modal):
 * 
 * const [showForm, setShowForm] = useState(false);
 * 
 * {showForm ? (
 *   <CreateFranchiseForm
 *     onSuccess={(franchise) => {
 *       console.log('Criado:', franchise);
 *       setShowForm(false);
 *       // Recarregar lista
 *     }}
 *     onCancel={() => setShowForm(false)}
 *   />
 * ) : (
 *   <button onClick={() => setShowForm(true)}>
 *     Criar Nova Franquia
 *   </button>
 * )}
 */

export default FranchisesManagementExample;

