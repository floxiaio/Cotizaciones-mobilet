'use client'

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase'
import { Session, SessionContextProvider } from '@supabase/auth-helpers-react'

export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [initialSession, setInitialSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Solo se ejecuta en el cliente
    setIsLoading(true);
    
    // Obtener la sesión actual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setInitialSession(session);
      setIsLoading(false);
    });

    // Escuchar cambios en la autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setInitialSession(session);
    });

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <SessionContextProvider 
      supabaseClient={supabase}
      initialSession={initialSession}
    >
      {children}
    </SessionContextProvider>
  );
}
