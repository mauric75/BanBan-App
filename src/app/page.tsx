import BookingCalendar from "@/components/BookingCalendar";

export default function Home() {
  return (
    <main className="bg-black text-white overflow-hidden">

      {/* NAVBAR */}
      <header className="fixed top-0 w-full z-50 bg-black/30 backdrop-blur-xl border-b border-white/10">

        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">

          <h1 className="text-2xl font-black tracking-[6px]">
            BANBAN
          </h1>

          <nav className="hidden md:flex gap-8 text-sm uppercase tracking-widest text-zinc-300">

            <a href="#" className="hover:text-yellow-500 transition">
              Inicio
            </a>

            <a href="#" className="hover:text-yellow-500 transition">
              Servicios
            </a>

            <a href="#" className="hover:text-yellow-500 transition">
              Reservas
            </a>

            <a href="#" className="hover:text-yellow-500 transition">
              Contacto
            </a>

          </nav>

        </div>

      </header>

      {/* HERO */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">

        {/* VIDEO */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute w-full h-full object-cover opacity-70 scale-105"
          style={{
            filter: "contrast(1.1) brightness(0.8)"
          }}
        >
          <source src="/barber.mp4" type="video/mp4" />
        </video>

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* HERO CONTENT */}
        <div className="relative z-10 text-center px-6 max-w-4xl">

          <span className="uppercase tracking-[8px] text-yellow-500 text-sm">
            Barbería Premium
          </span>

          <h1 className="text-7xl md:text-9xl font-black mt-6 leading-none">
            BANBAN
          </h1>

          <p className="mt-8 text-zinc-300 text-lg md:text-xl leading-relaxed">
            Reservas online, experiencia premium y estilo urbano moderno.
          </p>

          <div className="mt-12 flex flex-col md:flex-row gap-4 justify-center">

            <button className="px-10 py-5 rounded-full bg-yellow-600 hover:bg-yellow-500 transition-all text-black font-bold text-lg shadow-2xl shadow-yellow-600/20">

              Reservar Turno

            </button>

            <button className="px-10 py-5 rounded-full border border-white/20 hover:bg-white/10 transition-all text-lg">

              Ver Servicios

            </button>

          </div>

        </div>

      </section>

      {/* SERVICIOS */}
      <section className="py-28 px-6 bg-[#0f0f14]">

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-20">

            <span className="uppercase tracking-[6px] text-yellow-500 text-sm">
              Experiencia Premium
            </span>

            <h2 className="text-5xl md:text-6xl font-black mt-6">
              Servicios
            </h2>

          </div>

          <div className="grid md:grid-cols-3 gap-8">

            {/* CARD */}
            <div className="bg-zinc-900/80 border border-white/5 rounded-[30px] p-10 hover:-translate-y-2 hover:border-yellow-500/30 transition-all duration-300 backdrop-blur-lg">

              <div className="text-5xl mb-6">
                ✂️
              </div>

              <h3 className="text-3xl font-bold mb-4">
                Corte Premium
              </h3>

              <p className="text-zinc-400 leading-relaxed">
                Fade, taper, freestyle y asesoramiento personalizado para un estilo moderno.
              </p>

            </div>

            {/* CARD */}
            <div className="bg-zinc-900/80 border border-white/5 rounded-[30px] p-10 hover:-translate-y-2 hover:border-yellow-500/30 transition-all duration-300 backdrop-blur-lg">

              <div className="text-5xl mb-6">
                🧔
              </div>

              <h3 className="text-3xl font-bold mb-4">
                Barba Elite
              </h3>

              <p className="text-zinc-400 leading-relaxed">
                Perfilado premium, toallas calientes y tratamiento profesional.
              </p>

            </div>

            {/* CARD */}
            <div className="bg-zinc-900/80 border border-white/5 rounded-[30px] p-10 hover:-translate-y-2 hover:border-yellow-500/30 transition-all duration-300 backdrop-blur-lg">

              <div className="text-5xl mb-6">
                🔥
              </div>

              <h3 className="text-3xl font-bold mb-4">
                Experiencia VIP
              </h3>

              <p className="text-zinc-400 leading-relaxed">
                Atención exclusiva, ambiente urbano y experiencia barber premium.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* RESERVAS */}
      <section className="py-28 px-6">

        <div className="max-w-5xl mx-auto bg-zinc-900/70 border border-white/10 rounded-[40px] p-10 md:p-14 backdrop-blur-xl">

          <div className="text-center mb-12">

            <span className="uppercase tracking-[6px] text-yellow-500 text-sm">
              Reserva Online
            </span>

            <h2 className="text-5xl font-black mt-6">
              Agenda tu turno
            </h2>

          </div>

          {/* CALENDARIO */}
          <div className="max-w-4xl mx-auto">

            <BookingCalendar />

          </div>

        </div>

      </section>

    </main>
  );
}