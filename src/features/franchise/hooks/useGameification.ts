import { useGameification as useGameificationStore } from '@/stores/additional/gameification.store';

interface UseGameificationOptions {
  franchiseeId: string;
}

export const useGameification = ({ franchiseeId }: UseGameificationOptions) => {
  // Hook da store Zustand já faz toda a gestão de estado e persistência
  // Usar useMemo para evitar re-renders desnecessários
  const gameificationData = useGameificationStore(franchiseeId);
  
  return gameificationData;
};
