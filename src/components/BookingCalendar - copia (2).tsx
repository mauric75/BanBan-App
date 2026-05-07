"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { supabase } from "@/lib/supabase";
import "react-day-picker/dist/style.css";

export default function BookingCalendar() {
  const [selected, setSelected] = useState<Date | undefined>();
  const [hora, setHora] = useState("");
  const [barbero, setBarbero] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState(""); // ✅ Campo teléfono
  const [loading, setLoading] = useState(false);

  const horarios = [
    "10:00", "10:30", "11:00", "11:30", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00"
  ];

  const barberos = [
    { nombre: "Kevin", estilo: "Fade Expert", foto: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=800&auto=format&fit=crop" },
    { nombre: "Lucas", estilo: "Beard Specialist", foto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop" },
    { nombre: "Franco", estilo: "Urban Style", foto: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop" },
  ];

  async function guardarReserva() {
    // Validar todos los campos, incluido teléfono
    if (!selected || !hora || !barbero || !nombre.trim() || !telefono.trim()) {
      alert("Completa todos los datos (nombre y teléfono son obligatorios)");
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("reservas")
        .insert([
          {
            fecha: selected.toLocaleDateString(),
            hora,
            barbero,
            nombre: nombre.trim(),
            telefono: telefono.trim(), // ✅ Guardar teléfono
          },
        ])
        .select();

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }

      // Mensaje de WhatsApp con teléfono incluido
      const mensaje = encodeURIComponent(
        `Hola ${nombre.trim()}, gracias por reservar.\n\n` +
        `📅 Fecha: ${selected.toLocaleDateString()}\n` +
        `⏰ Hora: ${hora}\n` +
        `✂️ Barbero: ${barbero}\n` +
        `📞 Tu teléfono: ${telefono.trim()}\n\n` +
        `Nos pondremos en contacto contigo si es necesario.`
      );
      window.open(`https://wa.me/59898914088?text=${mensaje}`, "_blank");
      alert("Reserva guardada correctamente");
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      alert("Error inesperado");
    }
  }

  return (
    <div className="space-y-10">
      {/* CALENDARIO */}
      <div className="bg-zinc-900/80 border border-white/10 rounded-[30px] p-8 backdrop-blur-xl">
        <h2 className="text-3xl font-black text-center mb-8">Selecciona una fecha</h2>
        <DayPicker mode="single" selected={selected} onSelect={setSelected} />
      </div>

      {/* BARBEROS */}
      {selected && (
        <div className="bg-zinc-900/80 border border-white/10 rounded-[30px] p-8 backdrop-blur-xl">
          <h2 className="text-3xl font-black text-center mb-8">Elige tu barbero</h2>
          <div className="grid md:grid-cols-3 gap-6">
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
                  <p className="text-zinc-400 mt-2">{b.estilo}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* CAMPOS: NOMBRE Y TELÉFONO (se muestran juntos después de elegir barbero) */}
      {selected && barbero && (
        <div className="bg-zinc-900/80 border border-white/10 rounded-[30px] p-8 backdrop-blur-xl">
          <h2 className="text-3xl font-black text-center mb-8">Tus datos</h2>
          <div className="space-y-6">
            <input
              type="text"
              placeholder="Tu nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full p-4 rounded-2xl bg-black/40 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:border-yellow-500 text-center text-xl"
            />
            <input
              type="tel"
              placeholder="Tu número de teléfono (ej: 099123456)"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="w-full p-4 rounded-2xl bg-black/40 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:border-yellow-500 text-center text-xl"
            />
          </div>
        </div>
      )}

      {/* HORARIOS (solo si ya tiene nombre y teléfono) */}
      {selected && barbero && nombre && telefono && (
        <div className="bg-zinc-900/80 border border-white/10 rounded-[30px] p-8 backdrop-blur-xl">
          <h2 className="text-3xl font-black text-center mb-8">Horarios disponibles</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {horarios.map((h) => (
              <button
                key={h}
                onClick={() => setHora(h)}
                className={`py-4 rounded-2xl font-bold transition-all duration-300 ${
                  hora === h ? "bg-yellow-500 text-black scale-105" : "bg-black/40 border border-white/10 hover:bg-yellow-500/20"
                }`}
              >
                {h}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* RESUMEN Y CONFIRMACIÓN (incluye teléfono) */}
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
    </div>
  );
}