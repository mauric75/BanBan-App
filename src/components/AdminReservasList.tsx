"use client";

import { useState } from "react";

interface Reserva {
  id: string;
  fecha: string;
  hora: string;
  barbero: string;
  nombre: string;
  telefono: string;
  estado?: string;
}

interface AdminReservasListProps {
  reservas: Reserva[];
  onActualizarEstado: (id: string, estado: string) => void;
  onEliminar: (id: string) => void;
  isLoading: boolean;
}

export default function AdminReservasList({
  reservas,
  onActualizarEstado,
  onEliminar,
  isLoading,
}: AdminReservasListProps) {
  // Ordenar por fecha y hora
  const reservasOrdenadas = [...reservas].sort((a, b) => {
    const dateA = new Date(`${a.fecha}T${a.hora}`);
    const dateB = new Date(`${b.fecha}T${b.hora}`);
    return dateA.getTime() - dateB.getTime();
  });

  const getEstadoColor = (estado?: string) => {
    switch (estado) {
      case "confirmada":
        return "bg-green-900/30 border-green-500/30 text-green-400";
      case "cancelada":
        return "bg-red-900/30 border-red-500/30 text-red-400";
      default:
        return "bg-yellow-900/30 border-yellow-500/30 text-yellow-400";
    }
  };

  return (
    <div className="bg-zinc-900/50 border border-white/10 rounded-[20px] p-6">
      <h2 className="text-xl font-black mb-6">Reservas</h2>

      {isLoading ? (
        <div className="text-center py-10 text-zinc-400">Cargando...</div>
      ) : reservasOrdenadas.length === 0 ? (
        <div className="text-center py-10 text-zinc-400">
          No hay reservas en este mes
        </div>
      ) : (
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {reservasOrdenadas.map((reserva) => (
            <div
              key={reserva.id}
              className="bg-black/40 border border-white/10 rounded-2xl p-4 hover:border-white/20 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* DATOS PRINCIPALES */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-lg">{reserva.nombre}</h3>
                    <span
                      className={`text-xs uppercase tracking-[0.1em] px-3 py-1 rounded-full border ${getEstadoColor(
                        reserva.estado
                      )}`}
                    >
                      {reserva.estado || "pendiente"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-zinc-400">
                    <div>
                      <p className="text-xs uppercase tracking-[0.1em] text-zinc-500">
                        Fecha
                      </p>
                      <p className="font-semibold text-white">
                        {new Date(reserva.fecha).toLocaleDateString("es-ES", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.1em] text-zinc-500">
                        Hora
                      </p>
                      <p className="font-semibold text-white">{reserva.hora}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.1em] text-zinc-500">
                        Barbero
                      </p>
                      <p className="font-semibold text-white">
                        {reserva.barbero}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.1em] text-zinc-500">
                        Teléfono
                      </p>
                      <p className="font-semibold text-white">
                        <a
                          href={`https://wa.me/598${reserva.telefono.replace(
                            /[^0-9]/g,
                            ""
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-yellow-500 transition-colors"
                        >
                          {reserva.telefono}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>

                {/* ACCIONES */}
                <div className="flex flex-col gap-2 md:w-auto">
                  <select
                    value={reserva.estado || "pendiente"}
                    onChange={(e) =>
                      onActualizarEstado(reserva.id, e.target.value)
                    }
                    className="px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-yellow-500/50"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="confirmada">Confirmada</option>
                    <option value="cancelada">Cancelada</option>
                  </select>

                  <button
                    onClick={() => onEliminar(reserva.id)}
                    className="px-4 py-2 text-sm uppercase tracking-[0.1em] border border-red-500/30 text-red-400 hover:bg-red-900/30 rounded-lg transition-all"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
