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

  const barberos = [
    {
      nombre: "BARBERO_1",
      bio: "Tu minibio aquí.\nCuéntanos tus especialidades.\nDos o tres líneas.",
      foto:
        "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=800&auto=format&fit=crop",
      franja: "mañana",
    },
    {
      nombre: "BARBERO_2",
      bio: "Tu minibio aquí.\nCuéntanos tus especialidades.\nDos o tres líneas.",
      foto:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop",
      franja: "tarde",
    },
  ];

  const horariosCompletos = [
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
  ];

  const obtenerHorariosPorBarbero = (nombreBarbero: string) => {
    const barberoObj = barberos.find((b) => b.nombre === nombreBarbero);

    if (!barberoObj) return [];

    if (barberoObj.franja === "mañana") {
      return horariosCompletos.filter((h) => {
        const [horas, minutos] = h.split(":").map(Number);
        const totalMinutos = horas * 60 + minutos;

        return totalMinutos <= 13 * 60;
      });
    }

    if (barberoObj.franja === "tarde") {
      return horariosCompletos.filter((h) => {
        const [horas, minutos] = h.split(":").map(Number);
        const totalMinutos = horas * 60 + minutos;

        return totalMinutos >= 14 * 60;
      });
    }

    return [];
  };

  async function cargarHorasOcupadas(fecha: Date) {
    const fechaStr = fecha.toISOString().split("T")[0];

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

  useEffect(() => {
    if (selected) {
      cargarHorasOcupadas(selected);
      setHora("");
    }
  }, [selected]);

  useEffect(() => {
    setHora("");
  }, [barbero]);

  const estaOcupado = (horario: string) =>
    horasOcupadas.includes(horario);

  const esFechaValida = (fecha: Date): boolean => {
    const hoy = new Date().toISOString().split("T")[0];
    const fechaStr = fecha.toISOString().split("T")[0];

    return fechaStr >= hoy;
  };

  async function guardarReserva() {
    if (
      !selected ||
      !hora ||
      !barbero ||
      !nombre.trim() ||
      !telefono.trim()
    ) {
      alert("Completa todos los datos");
      return;
    }

    if (!esFechaValida(selected)) {
      alert("No puedes reservar en una fecha pasada");
      return;
    }

    if (estaOcupado(hora)) {
      alert("Este horario ya fue reservado");
      setHora("");
      return;
    }

    try {
      setLoading(true);

      const fechaISO = selected.toISOString().split("T")[0];

      const { error } = await supabase.from("reservas").insert([
        {
          fecha: fechaISO,
          hora,
          barbero,
          nombre: nombre.trim(),
          telefono: telefono.trim(),
        },
      ]);

      if (error) {
        if (error.code === "23505") {
          alert("Este horario acaba de ocuparse");

          setHora("");

          await cargarHorasOcupadas(selected);
        } else {
          alert(error.message);
        }

        setLoading(false);
        return;
      }

      const mensaje = encodeURIComponent(
        `Hola, soy ${nombre.trim()}. Solicito una reserva para el ${selected.toLocaleDateString()} a las ${hora} con ${barbero}. Mi teléfono es ${telefono.trim()}. Quedo a la espera de su confirmación.`
      );

      window.location.href = `https://wa.me/59898914088?text=${mensaje}`;

      alert("Reserva guardada. Se abrirá WhatsApp.");

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

  const horariosDisponibles = barbero
    ? obtenerHorariosPorBarbero(barbero)
    : [];

  return (
    <div className="space-y-8">

      {/* FECHA */}
      <div className="bg-[#151515] border border-[#262626] rounded-3xl p-8">

        <h2 className="
          font-[family-name:var(--font-bebas)]
          text-4xl
          md:text-5xl
          tracking-[0.08em]
          text-center
          mb-8
        ">
          FECHA
        </h2>

        <div className="flex justify-center">

          <DayPicker
            mode="single"
            selected={selected}
            onSelect={setSelected}
            disabled={(date) => {
              const today = new Date().toISOString().split("T")[0];
              const dateStr = date.toISOString().split("T")[0];

              return dateStr < today;
            }}
          />

        </div>

        <p className="text-center text-zinc-500 text-sm mt-6">
          Solo fechas futuras
        </p>

      </div>

      {/* BARBEROS */}
      {selected && (
        <div className="bg-[#151515] border border-[#262626] rounded-3xl p-8">

          <h2 className="
            font-[family-name:var(--font-bebas)]
            text-4xl
            md:text-5xl
            tracking-[0.08em]
            text-center
            mb-10
          ">
            BARBEROS
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            {barberos.map((b) => (

              <button
                key={b.nombre}
                onClick={() => setBarbero(b.nombre)}
                className={`
                  overflow-hidden
                  rounded-3xl
                  border
                  transition-all
                  duration-300
                  text-left
                  bg-[#111111]
                  hover:border-[#C6A76A]/40
                  hover:-translate-y-1
                  ${
                    barbero === b.nombre
                      ? "border-[#C6A76A] scale-[1.02]"
                      : "border-[#262626]"
                  }
                `}
              >

                <img
                  src={b.foto}
                  alt={b.nombre}
                  className="w-full h-72 object-cover"
                />

                <div className="p-6">

                  <h3 className="text-3xl font-semibold">
                    {b.nombre}
                  </h3>

                  <p className="text-zinc-400 mt-4 leading-relaxed whitespace-pre-line">
                    {b.bio}
                  </p>

                  <p className="text-[#C6A76A] text-sm mt-5 tracking-wide">
                    {b.franja === "mañana"
                      ? "🌅 Turnos mañana"
                      : "🌆 Turnos tarde"}
                  </p>

                </div>

              </button>

            ))}

          </div>

        </div>
      )}

      {/* DATOS */}
      {selected && barbero && (
        <div className="bg-[#151515] border border-[#262626] rounded-3xl p-8">

          <h2 className="
            font-[family-name:var(--font-bebas)]
            text-4xl
            md:text-5xl
            tracking-[0.08em]
            text-center
            mb-10
          ">
            TUS DATOS
          </h2>

          <div className="space-y-5">

            <input
              type="text"
              placeholder="Nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="
                w-full
                px-6
                py-5
                rounded-2xl
                bg-[#101010]
                border
                border-[#262626]
                text-white
                placeholder:text-zinc-600
                focus:outline-none
                focus:border-[#C6A76A]
                transition-all
                text-lg
              "
            />

            <input
              type="tel"
              placeholder="Teléfono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="
                w-full
                px-6
                py-5
                rounded-2xl
                bg-[#101010]
                border
                border-[#262626]
                text-white
                placeholder:text-zinc-600
                focus:outline-none
                focus:border-[#C6A76A]
                transition-all
                text-lg
              "
            />

          </div>

        </div>
      )}

      {/* HORARIOS */}
      {selected && barbero && nombre && telefono && (
        <div className="bg-[#151515] border border-[#262626] rounded-3xl p-8">

          <h2 className="
            font-[family-name:var(--font-bebas)]
            text-4xl
            md:text-5xl
            tracking-[0.08em]
            text-center
            mb-10
          ">

            HORARIOS

            {cargandoHorarios && (
              <span className="text-sm ml-4 text-[#C6A76A] font-sans">
                actualizando...
              </span>
            )}

          </h2>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">

            {horariosDisponibles.map((h) => {

              const ocupado = estaOcupado(h);
              const seleccionado = hora === h;

              return (
                <button
                  key={h}
                  onClick={() => !ocupado && setHora(h)}
                  disabled={ocupado}
                  className={`
                    py-3
                    rounded-xl
                    text-sm
                    tracking-wide
                    transition-all
                    duration-300
                    font-medium
                    ${
                      ocupado
                        ? "bg-red-950/30 border border-red-900 text-zinc-500 cursor-not-allowed"
                        : seleccionado
                        ? "bg-[#C6A76A] text-black"
                        : "bg-[#101010] border border-[#262626] hover:border-[#C6A76A]/40"
                    }
                  `}
                >

                  {h}

                  {ocupado && (
                    <span className="block text-[10px] mt-1">
                      ocupado
                    </span>
                  )}

                </button>
              );
            })}

          </div>

        </div>
      )}

      {/* CONFIRMAR */}
      {selected && hora && barbero && nombre && telefono && (
        <div className="bg-[#C6A76A] rounded-3xl p-10 text-black text-center">

          <h2 className="
            font-[family-name:var(--font-bebas)]
            text-4xl
            md:text-5xl
            tracking-[0.08em]
            mb-8
          ">
            CONFIRMAR
          </h2>

          <div className="space-y-3 text-lg">

            <p>🧑 {nombre}</p>

            <p>📞 {telefono}</p>

            <p>📅 {selected.toLocaleDateString()}</p>

            <p>⏰ {hora}</p>

            <p>✂️ {barbero}</p>

          </div>

          <button
            onClick={guardarReserva}
            disabled={loading}
            className="
              mt-8
              bg-black
              text-white
              px-10
              py-4
              rounded-2xl
              font-semibold
              hover:bg-[#1A1A1A]
              transition-all
              disabled:opacity-50
            "
          >
            {loading
              ? "Guardando..."
              : "Confirmar por WhatsApp"}
          </button>

        </div>
      )}

      {/* CANCELAR */}
      <div className="text-center pt-2">

        <Link
          href="/cancelar"
          className="text-[#C6A76A] hover:text-white transition-colors text-sm"
        >
          ¿Quieres cancelar una reserva?
        </Link>

      </div>

    </div>
  );
}