import { useState, useEffect, useCallback } from 'react';
import { UserService, User } from '@/services/users/userService';

interface UseUsersByUnitIdOptions {
  unitId?: string;
  enabled?: boolean;
}

export const useUsersByUnitId = ({ unitId, enabled = true }: UseUsersByUnitIdOptions = {}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    if (!unitId || !enabled) {
      setUsers([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await UserService.listByUnitId(unitId);
      
      if (response.success) {
        const usersArray = Array.isArray(response.data) ? response.data : [];
        setUsers(usersArray);
      } else {
        throw new Error(response.error || 'Erro ao buscar usuários');
      }
    } catch (err: any) {
      const errorMessage = err?.message || 'Erro ao carregar usuários';
      setError(errorMessage);
      console.error('Erro ao buscar usuários por unitId:', err);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [unitId, enabled]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const refetch = useCallback(() => {
    return fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    isLoading,
    error,
    refetch,
  } as const;
};

