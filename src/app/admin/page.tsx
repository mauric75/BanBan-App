"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import AdminLogin from "@/components/AdminLogin";
import AdminDashboard from "@/components/AdminDashboard";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si ya hay sesión en localStorage
    const sessionCheck = () => {
      const hasSession = localStorage.getItem("admin_session");
      if (hasSession) {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    sessionCheck();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin_session");
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-zinc-400">Cargando...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {!isAuthenticated ? (
        <AdminLogin onLogin={() => setIsAuthenticated(true)} />
      ) : (
        <AdminDashboard onLogout={handleLogout} />
      )}
    </main>
  );
}
