"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import AdminCalendar from "./AdminCalendar";
import AdminReservasList from "./AdminReservasList";
import AdminFormNuevaReserva from "./AdminFormNuevaReserva";

interface Reserva {
  id: string;
  fecha: string;
  hora: string;
  barbero: string;
  nombre: string;
  telefono: string;
  estado?: string;
  created_at?: string;
}

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [showNewReserva, setShowNewReserva] = useState(false);
  const [filteredBarbero, setFilteredBarbero] = useState("todos");

  useEffect(() => {
    cargarReservas();
  }, []);

  const cargarReservas = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("reservas")
        .select("*")
        .order("fecha", { ascending: true });

      if (error) throw error;
      setReservas(data || []);
    } catch (error) {
      console.error("Error al cargar reservas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActualizarEstado = async (
    id: string,
    nuevoEstado: string
  ) => {
    try {
      const { error } = await supabase
        .from("reservas")
        .update({ estado: nuevoEstado })
        .eq("id", id);

      if (error) throw error;
      cargarReservas();
    } catch (error) {
      console.error("Error al actualizar estado:", error);
    }
  };

  const handleEliminarReserva = async (id: string) => {
    if (!confirm("¿Eliminar esta reserva?")) return;

    try {
      const { error } = await supabase
        .from("reservas")
        .delete()
        .eq("id", id);

      if (error) throw error;
      cargarReservas();
    } catch (error) {
      console.error("Error al eliminar reserva:", error);
    }
  };

  const handleNuevaReserva = async (datos: any) => {
    try {
      const { error } = await supabase.from("reservas").insert([
        {
          ...datos,
          estado: "pendiente",
        },
      ]);

      if (error) throw error;
      setShowNewReserva(false);
      cargarReservas();
    } catch (error) {
      console.error("Error al crear reserva:", error);
    }
  };

  // Obtener barberos únicos
  const barberos = ["todos", ...new Set(reservas.map((r) => r.barbero))];

  // Filtrar reservas por mes y barbero
  const reservasFiltradas = reservas.filter((r) => {
    const [year, month, day] = r.fecha.split("-");
    const fechaReserva = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day)
    );

    const mismoMes =
      fechaReserva.getFullYear() === selectedMonth.getFullYear() &&
      fechaReserva.getMonth() === selectedMonth.getMonth();

    const sameBarbero =
      filteredBarbero === "todos" || r.barbero === filteredBarbero;

    return mismoMes && sameBarbero;
  });

  return (
    <div className="min-h-screen bg-black">
      {/* HEADER */}
      <header className="fixed top-0 w-full z-40 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <h1 className="text-2xl font-black tracking-[0.2em]">
            BANBAN ADMIN
          </h1>
          <button
            onClick={onLogout}
            className="px-6 py-2 text-sm uppercase tracking-[0.1em] border border-white/20 hover:bg-white/5 rounded-lg transition-all"
          >
            Salir
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto">
          {/* CONTROLES */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
            <div className="flex gap-4">
              <button
                onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1))}
                className="px-4 py-2 text-sm uppercase tracking-[0.1em] border border-white/20 hover:bg-white/5 rounded-lg transition-all"
              >
                ← Mes anterior
              </button>

              <div className="px-6 py-2 bg-zinc-900/50 border border-white/10 rounded-lg text-center">
                <p className="text-sm uppercase tracking-[0.1em] text-zinc-400">
                  {selectedMonth.toLocaleDateString("es-ES", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              <button
                onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1))}
                className="px-4 py-2 text-sm uppercase tracking-[0.1em] border border-white/20 hover:bg-white/5 rounded-lg transition-all"
              >
                Mes siguiente →
              </button>
            </div>

            <button
              onClick={() => setShowNewReserva(!showNewReserva)}
              className="px-6 py-2 bg-yellow-600 hover:bg-yellow-500 text-black font-bold uppercase tracking-[0.1em] rounded-lg transition-all text-sm"
            >
              + Nueva Reserva
            </button>
          </div>

          {/* FILTRO POR BARBERO */}
          <div className="mb-8 flex gap-2 flex-wrap">
            {barberos.map((barbero) => (
              <button
                key={barbero}
                onClick={() => setFilteredBarbero(barbero)}
                className={`px-4 py-2 text-sm uppercase tracking-[0.1em] rounded-lg transition-all ${
                  filteredBarbero === barbero
                    ? "bg-yellow-600 text-black font-bold"
                    : "border border-white/20 hover:bg-white/5"
                }`}
              >
                {barbero === "todos" ? "Todos" : barbero}
              </button>
            ))}
          </div>

          {/* NUEVA RESERVA FORM */}
          {showNewReserva && (
            <div className="mb-8 bg-zinc-900/50 border border-white/10 rounded-[20px] p-8">
              <AdminFormNuevaReserva
                barberos={barberos.filter((b) => b !== "todos")}
                onSubmit={handleNuevaReserva}
                onCancel={() => setShowNewReserva(false)}
              />
            </div>
          )}

          {/* GRID: CALENDARIO + LISTA */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* CALENDARIO */}
            <div className="lg:col-span-1">
              <AdminCalendar
                reservas={reservasFiltradas}
                selectedMonth={selectedMonth}
              />
            </div>

            {/* LISTA DE RESERVAS */}
            <div className="lg:col-span-2">
              <AdminReservasList
                reservas={reservasFiltradas}
                onActualizarEstado={handleActualizarEstado}
                onEliminar={handleEliminarReserva}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
