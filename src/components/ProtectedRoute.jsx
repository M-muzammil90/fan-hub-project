import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isLoading, currentUser } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
          Verifying session...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && currentUser?.role !== 'admin') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-500">
          <ShieldAlert className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-black text-white">Access Denied</h2>
        <p className="text-sm text-zinc-400 max-w-md">
          You need Administrator permissions to view this section.
        </p>
        <button
          onClick={() => window.location.href = '/'}
          className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-500 transition-colors shadow-lg shadow-red-600/30"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return children;
}
