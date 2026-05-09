"use client";

import BookingCalendar from "@/components/BookingCalendar";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="bg-black text-white overflow-hidden">

      {/* NAVBAR */}
      <header className="fixed top-0 w-full z-50 bg-black/40 backdrop-blur-md border-b border-white/5">

        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">

          <h1 className="font-[family-name:var(--font-bebas)] text-3xl tracking-[0.3em]">
            BANBAN
          </h1>

          <nav className="hidden md:flex gap-8 text-xs uppercase tracking-[0.2em] text-zinc-400">

            <a href="#" className="hover:text-[#C6A76A] transition-colors">
              Inicio
            </a>

            <a
              href="#servicios"
              className="hover:text-[#C6A76A] transition-colors"
            >
              Servicios
            </a>

            <a
              href="#reservas"
              className="hover:text-[#C6A76A] transition-colors"
            >
              Reservas
            </a>

            <a href="#" className="hover:text-[#C6A76A] transition-colors">
              Contacto
            </a>

          </nav>

        </div>

      </header>

      {/* HERO */}
      <section className="relative h-screen flex items-center overflow-hidden">

        {/* VIDEO */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute w-full h-full object-cover scale-105 opacity-50"
          style={{
            filter: "contrast(1.1) brightness(0.55)",
          }}
        >
          <source src="/barber.mp4" type="video/mp4" />
        </video>

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-black/40" />

        {/* HERO CONTENT */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6">

          <div className="max-w-3xl">

            <span className="uppercase tracking-[0.5em] text-[#C6A76A] text-xs">
              BARBERÍA PREMIUM
            </span>

            <h1
              className="
                font-[family-name:var(--font-bebas)]
                text-7xl
                md:text-[11rem]
                leading-[0.9]
                tracking-[0.08em]
                mt-6
              "
            >
              BANBAN
            </h1>

            <p
              className="
                mt-8
                text-zinc-400
                text-lg
                md:text-xl
                leading-relaxed
                max-w-xl
              "
            >
              Cortes modernos, precisión y experiencia premium.
              Reservá online en segundos.
            </p>

            <div className="mt-12 flex flex-col sm:flex-row gap-4">

              <button
                onClick={() => {
                  const element = document.getElementById("reservas");

                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="
                  px-10
                  py-4
                  rounded-full
                  bg-[#C6A76A]
                  hover:scale-[1.03]
                  transition-all
                  duration-300
                  text-black
                  font-semibold
                "
              >
                Reservar turno
              </button>

              <button
                onClick={() => {
                  const element = document.getElementById("servicios");

                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="
                  px-10
                  py-4
                  rounded-full
                  border
                  border-[#262626]
                  bg-[#181818]
                  hover:bg-[#202020]
                  transition-all
                  duration-300
                "
              >
                Ver servicios
              </button>

            </div>

          </div>

        </div>

      </section>

      {/* SERVICIOS */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        id="servicios"
        className="py-28 px-6 bg-[#0D0D0D]"
      >

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-20">

            <span className="uppercase tracking-[0.4em] text-[#C6A76A] text-xs">
              EXPERIENCIA PREMIUM
            </span>

            <h2 className="font-[family-name:var(--font-bebas)] text-6xl tracking-[0.08em] mt-6">
              SERVICIOS
            </h2>

          </div>

          <div className="grid md:grid-cols-3 gap-8">

            {/* CARD */}
            <div className="
              bg-[#151515]
              border
              border-[#262626]
              rounded-3xl
              p-10
              transition-all
              duration-300
              hover:border-[#C6A76A]/40
              hover:-translate-y-1
            ">

              <div className="text-5xl mb-6">
                ✂️
              </div>

              <h3 className="text-3xl font-semibold mb-4">
                Corte Premium
              </h3>

              <p className="text-zinc-400 leading-relaxed">
                Fade, taper, freestyle y asesoramiento personalizado
                para un estilo moderno.
              </p>

            </div>

            {/* CARD */}
            <div className="
              bg-[#151515]
              border
              border-[#262626]
              rounded-3xl
              p-10
              transition-all
              duration-300
              hover:border-[#C6A76A]/40
              hover:-translate-y-1
            ">

              <div className="text-5xl mb-6">
                🧔
              </div>

              <h3 className="text-3xl font-semibold mb-4">
                Barba Elite
              </h3>

              <p className="text-zinc-400 leading-relaxed">
                Perfilado premium, toallas calientes
                y tratamiento profesional.
              </p>

            </div>

            {/* CARD */}
            <div className="
              bg-[#151515]
              border
              border-[#262626]
              rounded-3xl
              p-10
              transition-all
              duration-300
              hover:border-[#C6A76A]/40
              hover:-translate-y-1
            ">

              <div className="text-5xl mb-6">
                📅
              </div>

              <h3 className="text-3xl font-semibold mb-4">
                Experiencia VIP
              </h3>

              <p className="text-zinc-400 leading-relaxed">
                Atención exclusiva, ambiente urbano
                y experiencia barber premium.
              </p>

            </div>

          </div>

        </div>

      </motion.section>

      {/* RESERVAS */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        id="reservas"
        className="py-28 px-6"
      >

        <div className="
          max-w-4xl
          mx-auto
          bg-[#101010]
          border
          border-[#1F1F1F]
          rounded-[40px]
          p-6
          md:p-14
        ">

          <div className="text-center mb-12">

            <span className="uppercase tracking-[0.4em] text-[#C6A76A] text-xs">
              RESERVA ONLINE
            </span>

            <h2 className="font-[family-name:var(--font-bebas)] text-6xl tracking-[0.08em] mt-6">
              AGENDA TU TURNO
            </h2>

          </div>

          {/* CALENDARIO */}
          <div className="max-w-4xl mx-auto">

            <BookingCalendar />

          </div>

        </div>

      </motion.section>
	    {/* FOOTER DISCRETO CON LINK ADMIN */}
      <footer className="py-8 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto text-right text-[10px] text-zinc-600">
          <a href="/admin" className="hover:text-yellow-500 transition-colors">
            [admin]
          </a>
        </div>
      </footer>
    </main>
  );
}