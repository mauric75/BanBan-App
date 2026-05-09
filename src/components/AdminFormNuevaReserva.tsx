"use client";

import { useState } from "react";

interface AdminFormNuevaReservaProps {
  barberos: string[];
  onSubmit: (datos: any) => void;
  onCancel: () => void;
}

export default function AdminFormNuevaReserva({
  barberos,
  onSubmit,
  onCancel,
}: AdminFormNuevaReservaProps) {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [barbero, setBarbero] = useState(barberos[0] || "");
  const [isLoading, setIsLoading] = useState(false);

  const horarios = [
    "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre || !telefono || !fecha || !hora || !barbero) {
      alert("Todos los campos son obligatorios");
      return;
    }

    setIsLoading(true);

    try {
      await onSubmit({
        nombre: nombre.trim(),
        telefono: telefono.trim(),
        fecha,
        hora,
        barbero,
      });

      // Limpiar formulario
      setNombre("");
      setTelefono("");
      setFecha("");
      setHora("");
      setBarbero(barberos[0] || "");

      alert("Reserva creada correctamente");
    } catch (error) {
      console.error(error);
      alert("Error al crear la reserva");
    } finally {
      setIsLoading(false);
    }
  };

  // Obtener fecha mínima (hoy)
  const today = new Date().toISOString().split("T")[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-2xl font-black mb-6">Agregar nueva reserva</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* NOMBRE */}
        <div>
          <label className="block text-xs uppercase tracking-[0.1em] text-zinc-400 mb-3">
            Nombre del cliente
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Juan García"
            className="w-full p-4 rounded-2xl bg-black/40 border border-white/10 text-white placeholder:text-zinc-600 focus:outline-none focus:border-yellow-500/50"
          />
        </div>

        {/* TELÉFONO */}
        <div>
          <label className="block text-xs uppercase tracking-[0.1em] text-zinc-400 mb-3">
            Teléfono
          </label>
          <input
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="Ej: 099123456"
            className="w-full p-4 rounded-2xl bg-black/40 border border-white/10 text-white placeholder:text-zinc-600 focus:outline-none focus:border-yellow-500/50"
          />
        </div>

        {/* FECHA */}
        <div>
          <label className="block text-xs uppercase tracking-[0.1em] text-zinc-400 mb-3">
            Fecha
          </label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            min={today}
            className="w-full p-4 rounded-2xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-yellow-500/50"
          />
        </div>

        {/* BARBERO */}
        <div>
          <label className="block text-xs uppercase tracking-[0.1em] text-zinc-400 mb-3">
            Barbero
          </label>
          <select
            value={barbero}
            onChange={(e) => setBarbero(e.target.value)}
            className="w-full p-4 rounded-2xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-yellow-500/50"
          >
            {barberos.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* HORA */}
      <div>
        <label className="block text-xs uppercase tracking-[0.1em] text-zinc-400 mb-3">
          Hora
        </label>
        <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
          {horarios.map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => setHora(h)}
              className={`py-3 rounded-lg text-sm font-bold transition-all ${
                hora === h
                  ? "bg-yellow-600 text-black"
                  : "bg-black/40 border border-white/10 hover:border-white/30"
              }`}
            >
              {h}
            </button>
          ))}
        </div>
      </div>

      {/* BOTONES */}
      <div className="flex gap-4 pt-6 border-t border-white/10">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-3 border border-white/20 hover:bg-white/5 rounded-lg font-bold uppercase tracking-[0.1em] transition-all"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading || !nombre || !telefono || !fecha || !hora}
          className="flex-1 px-6 py-3 bg-yellow-600 hover:bg-yellow-500 disabled:bg-yellow-900/50 text-black font-bold uppercase tracking-[0.1em] rounded-lg transition-all"
        >
          {isLoading ? "Guardando..." : "Crear reserva"}
        </button>
      </div>
    </form>
  );
}
