"use client";

import { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import "react-day-picker/dist/style.css";

export default function BookingCalendar() {
  const [selected, setSelected] = useState<Date | undefined>();
  const [hora, setHora] = useState("");
  const [barbero, setBarbero] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [loading, setLoading] = useState(false);
  const [horasOcupadas, setHorasOcupadas] = useState<string[]>([]);
  const [cargandoHorarios, setCargandoHorarios] = useState(false);

  // TAREA 4: BARBEROS CON PLACEHOLDERS, BIO Y FRANJA HORARIA
  const barberos = [
    { 
      nombre: "BARBERO_1", // TODO: Cambiar por nombre real (ej: "BanBan")
      bio: "Tu minibio aquí.\nCuéntanos tus especialidades.\nDos o tres líneas.", // TODO: Reemplazar con biografía real
      foto: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=800&auto=format&fit=crop", // TODO: Cambiar por foto real
      franja: "mañana" // 10:00 a 13:00
    },
    { 
      nombre: "BARBERO_2", // TODO: Cambiar por nombre real
      bio: "Tu minibio aquí.\nCuéntanos tus especialidades.\nDos o tres líneas.", // TODO: Reemplazar con biografía real
      foto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop", // TODO: Cambiar por foto real
      franja: "tarde" // 14:00 a 17:00
    },
  ];

  // Todos los horarios disponibles
  const horariosCompletos = [
    "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
  ];

  // TAREA 4: Función para filtrar horarios según la franja del barbero
  const obtenerHorariosPorBarbero = (nombreBarbero: string) => {
    const barberoObj = barberos.find(b => b.nombre === nombreBarbero);
    if (!barberoObj) return [];

    if (barberoObj.franja === "mañana") {
      return horariosCompletos.filter(h => {
        const [horas, minutos] = h.split(":").map(Number);
        const totalMinutos = horas * 60 + minutos;
        return totalMinutos <= 13 * 60; // Hasta las 13:00
      });
    } else if (barberoObj.franja === "tarde") {
      return horariosCompletos.filter(h => {
        const [horas, minutos] = h.split(":").map(Number);
        const totalMinutos = horas * 60 + minutos;
        return totalMinutos >= 14 * 60; // Desde las 14:00
      });
    }
    return [];
  };

  // Cargar horas ocupadas para la fecha seleccionada
  async function cargarHorasOcupadas(fecha: Date) {
    const fechaStr = fecha.toISOString().split('T')[0];
    setCargandoHorarios(true);
    try {
      const { data, error } = await supabase
        .from("reservas")
        .select("hora")
        .eq("fecha", fechaStr);
      if (error) throw error;
      setHorasOcupadas(data.map((reserva: any) => reserva.hora));
    } catch (error) {
      console.error("Error al cargar horarios ocupados:", error);
    } finally {
      setCargandoHorarios(false);
    }
  }

  // Al cambiar la fecha, recargar disponibilidad y resetear hora
  useEffect(() => {
    if (selected) {
      cargarHorasOcupadas(selected);
      setHora("");
    }
  }, [selected]);

  // Al cambiar el barbero, resetear hora (porque los horarios pueden ser diferentes)
  useEffect(() => {
    setHora("");
  }, [barbero]);

  const estaOcupado = (horario: string) => horasOcupadas.includes(horario);

  // Función para validar si la fecha es futura (o hoy)
  const esFechaValida = (fecha: Date): boolean => {
    const hoy = new Date().toISOString().split('T')[0];
    const fechaStr = fecha.toISOString().split('T')[0];
    return fechaStr >= hoy;
  };

  async function guardarReserva() {
    // Validar campos obligatorios
    if (!selected || !hora || !barbero || !nombre.trim() || !telefono.trim()) {
      alert("Completa todos los datos (nombre y teléfono son obligatorios)");
      return;
    }

    // Validar que la fecha no sea pasada
    if (!esFechaValida(selected)) {
      alert("No se puede reservar en una fecha pasada. Elige una fecha desde hoy en adelante.");
      return;
    }

    // Validar disponibilidad actualizada
    if (estaOcupado(hora)) {
      alert("Este horario ya fue reservado. Por favor elige otro.");
      setHora("");
      return;
    }

    try {
      setLoading(true);
      const fechaISO = selected.toISOString().split('T')[0];
      const { error } = await supabase
        .from("reservas")
        .insert([
          {
            fecha: fechaISO,
            hora,
            barbero,
            nombre: nombre.trim(),
            telefono: telefono.trim(),
          },
        ]);

      if (error) {
        if (error.code === '23505') {
          alert("Este horario acaba de ser ocupado. Por favor elige otro.");
          setHora("");
          await cargarHorasOcupadas(selected);
        } else {
          alert(error.message);
        }
        setLoading(false);
        return;
      }

      // Simulación de email (en local)
      console.log("=== 📧 SIMULACIÓN DE EMAIL ===");
      console.log(`Destinatario: ${nombre.trim()}`);
      console.log(`Reserva: ${selected.toLocaleDateString()} a las ${hora} con ${barbero}`);
      console.log("Teléfono: " + telefono.trim());
      console.log("===============================");

      // TAREA 2: Mensaje WhatsApp claro - es una SOLICITUD, no una confirmación
      const mensaje = encodeURIComponent(
        `Hola, soy ${nombre.trim()}. Solicito una reserva para el ${selected.toLocaleDateString()} a las ${hora} con ${barbero}. Mi teléfono es ${telefono.trim()}. Quedo a la espera de su confirmación.`
      );

      // TAREA 3: Cambiar window.open por window.location.href para compatibilidad con iOS
      window.location.href = `https://wa.me/59898914088?text=${mensaje}`;
      alert("Reserva guardada. Se abrirá WhatsApp para confirmar.");

      // Limpiar formulario
      setSelected(undefined);
      setHora("");
      setBarbero("");
      setNombre("");
      setTelefono("");
      setHorasOcupadas([]);
    } catch (err) {
      console.error(err);
      alert("Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  // Obtener horarios según barbero seleccionado
  const horariosDisponibles = barbero ? obtenerHorariosPorBarbero(barbero) : [];

  return (
    <div className="space-y-10">
      {/* CALENDARIO */}
      <div className="bg-zinc-900/80 border border-white/10 rounded-[30px] p-8 backdrop-blur-xl">
        <h2 className="text-3xl font-black text-center mb-8">Selecciona una fecha</h2>
        <DayPicker
          mode="single"
          selected={selected}
          onSelect={setSelected}
          disabled={(date) => {
            const today = new Date().toISOString().split('T')[0];
            const dateStr = date.toISOString().split('T')[0];
            return dateStr < today;
          }}
        />
        <p className="text-center text-zinc-400 text-sm mt-4">
          Solo fechas futuras (hoy en adelante)
        </p>
      </div>

      {/* BARBEROS - TAREA 4: MOSTRAR 2 BARBEROS CON BIO */}
      {selected && (
        <div className="bg-zinc-900/80 border border-white/10 rounded-[30px] p-8 backdrop-blur-xl">
          <h2 className="text-3xl font-black text-center mb-8">Elige tu barbero</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {barberos.map((b) => (
              <button
                key={b.nombre}
                onClick={() => setBarbero(b.nombre)}
                className={`overflow-hidden rounded-[24px] border transition-all duration-300 hover:-translate-y-2 ${
                  barbero === b.nombre ? "border-yellow-500 scale-105" : "border-white/10"
                }`}
              >
                <img src={b.foto} alt={b.nombre} className="w-full h-72 object-cover" />
                <div className="p-6 bg-black/60">
                  <h3 className="text-2xl font-bold">{b.nombre}</h3>
                  <p className="text-zinc-400 mt-3 text-sm leading-relaxed whitespace-pre-line">
                    {b.bio}
                  </p>
                  <p className="text-yellow-500 text-xs mt-3 font-semibold">
                    {b.franja === "mañana" ? "🌅 Turnos mañana" : "🌆 Turnos tarde"}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* DATOS DEL CLIENTE */}
      {selected && barbero && (
        <div className="bg-zinc-900/80 border border-white/10 rounded-[30px] p-8 backdrop-blur-xl">
          <h2 className="text-3xl font-black text-center mb-8">Tus datos</h2>
          <div className="space-y-6">
            <input
              type="text"
              placeholder="Nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full p-4 rounded-2xl bg-black/40 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:border-yellow-500 text-center text-xl"
            />
            <input
              type="tel"
              placeholder="Teléfono (ej: 099123456)"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="w-full p-4 rounded-2xl bg-black/40 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:border-yellow-500 text-center text-xl"
            />
          </div>
        </div>
      )}

      {/* HORARIOS CON DISPONIBILIDAD - TAREA 4: FILTRADOS POR BARBERO */}
      {selected && barbero && nombre && telefono && (
        <div className="bg-zinc-900/80 border border-white/10 rounded-[30px] p-8 backdrop-blur-xl">
          <h2 className="text-3xl font-black text-center mb-8">
            Horarios disponibles
            {cargandoHorarios && <span className="text-sm ml-2 text-yellow-500">(actualizando...)</span>}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {horariosDisponibles.map((h) => {
              const ocupado = estaOcupado(h);
              const seleccionado = hora === h;
              return (
                <button
                  key={h}
                  onClick={() => !ocupado && setHora(h)}
                  disabled={ocupado}
                  className={`py-4 rounded-2xl font-bold transition-all duration-300 ${
                    ocupado
                      ? "bg-red-900/40 border border-red-500/30 text-zinc-400 cursor-not-allowed"
                      : seleccionado
                      ? "bg-yellow-500 text-black scale-105"
                      : "bg-black/40 border border-white/10 hover:bg-yellow-500/20"
                  }`}
                >
                  {h}
                  {ocupado && <span className="block text-xs">(ocupado)</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* RESUMEN Y CONFIRMACIÓN */}
      {selected && hora && barbero && nombre && telefono && (
        <div className="bg-yellow-500 rounded-[30px] p-10 text-black text-center shadow-2xl shadow-yellow-500/20">
          <h2 className="text-4xl font-black mb-6">Confirmar Reserva</h2>
          <div className="space-y-3 text-xl">
            <p>🧑 {nombre}</p>
            <p>📞 {telefono}</p>
            <p>📅 {selected.toLocaleDateString()}</p>
            <p>⏰ {hora}</p>
            <p>✂️ {barbero}</p>
          </div>
          <button
            onClick={guardarReserva}
            disabled={loading}
            className="inline-block mt-8 bg-black text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-zinc-800 transition-all disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Confirmar por WhatsApp"}
          </button>
        </div>
      )}

      {/* ENLACE CANCELAR */}
      <div className="text-center mt-6">
        <Link href="/cancelar" className="text-yellow-500 underline hover:text-yellow-400">
          ¿Quieres cancelar una reserva?
        </Link>
      </div>
    </div>
  );
}
