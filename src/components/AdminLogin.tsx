"use client";

import { useState } from "react";

interface AdminLoginProps {
  onLogin: () => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // La contraseña debe estar en .env.local como NEXT_PUBLIC_ADMIN_PASSWORD
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (!adminPassword) {
      setError("Error: Contraseña no configurada en el servidor");
      setIsLoading(false);
      return;
    }

    if (password === adminPassword) {
      localStorage.setItem("admin_session", "true");
      onLogin();
    } else {
      setError("Contraseña incorrecta");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="bg-zinc-900/80 border border-white/10 rounded-[30px] p-10 backdrop-blur-xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black tracking-[0.2em] mb-2">
              BANBAN
            </h1>
            <p className="text-zinc-400 text-sm uppercase tracking-[0.1em]">
              Panel de Administración
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-[0.1em] text-zinc-400 mb-3">
                Clave de acceso
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa la clave"
                className="w-full p-4 rounded-2xl bg-black/40 border border-white/10 text-white placeholder:text-zinc-600 focus:outline-none focus:border-yellow-500/50 text-center text-lg"
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-4 text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !password}
              className="w-full bg-yellow-600 hover:bg-yellow-500 disabled:bg-yellow-900/50 disabled:cursor-not-allowed text-black font-bold py-4 rounded-2xl transition-all text-lg"
            >
              {isLoading ? "Verificando..." : "Acceder"}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5">
            <p className="text-xs text-zinc-500 text-center">
              Panel seguro para barberos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
