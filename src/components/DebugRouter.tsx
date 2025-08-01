import React from 'react';
import { useRouter } from '@/router';
import { useAuthContext } from '@/features/auth/context/AuthContext';

export const DebugRouter: React.FC = () => {
  const { currentPath } = useRouter();
  const { isAuthenticated, isLoading, user } = useAuthContext();

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs z-50 max-w-xs">
      <h3 className="font-bold mb-2">Debug Router</h3>
      <div className="space-y-1">
        <div><strong>Current Path:</strong> {currentPath}</div>
        <div><strong>Hash:</strong> {window.location.hash}</div>
        <div><strong>Is Loading:</strong> {isLoading ? 'Yes' : 'No'}</div>
        <div><strong>Is Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</div>
        <div><strong>User:</strong> {user?.name || 'None'}</div>
      </div>
    </div>
  );
}; 