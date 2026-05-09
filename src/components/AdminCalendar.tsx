"use client";

interface Reserva {
  id: string;
  fecha: string;
  hora: string;
  barbero: string;
  nombre: string;
  telefono: string;
  estado?: string;
}

interface AdminCalendarProps {
  reservas: Reserva[];
  selectedMonth: Date;
}

export default function AdminCalendar({
  reservas,
  selectedMonth,
}: AdminCalendarProps) {
  const year = selectedMonth.getFullYear();
  const month = selectedMonth.getMonth();

  // Primer día del mes y días totales
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  // Obtener reservas por día
  const reservasPorDia = new Map<number, Reserva[]>();
  reservas.forEach((reserva) => {
    const [year, monthStr, dayStr] = reserva.fecha.split("-");
    const day = parseInt(dayStr);
    if (
      parseInt(year) === year &&
      parseInt(monthStr) === month + 1
    ) {
      if (!reservasPorDia.has(day)) {
        reservasPorDia.set(day, []);
      }
      reservasPorDia.get(day)!.push(reserva);
    }
  });

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  return (
    <div className="bg-zinc-900/50 border border-white/10 rounded-[20px] p-6">
      <h2 className="text-xl font-black mb-6">Calendario</h2>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-xs uppercase tracking-[0.1em] text-zinc-500 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Días del mes */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          const dayReservas = day ? reservasPorDia.get(day) || [] : [];
          const isToday =
            day &&
            new Date().toDateString() ===
              new Date(year, month, day).toDateString();

          return (
            <div
              key={index}
              className={`p-2 rounded-lg text-center min-h-[80px] flex flex-col ${
                day
                  ? `border ${
                      isToday
                        ? "border-yellow-500/50 bg-yellow-500/10"
                        : "border-white/10 bg-black/40"
                    }`
                  : "bg-transparent"
              }`}
            >
              {day && (
                <>
                  <p className="font-bold text-sm mb-1">{day}</p>
                  <div className="flex-1 flex flex-col gap-1 text-[10px]">
                    {dayReservas.slice(0, 2).map((reserva) => (
                      <div
                        key={reserva.id}
                        className="bg-yellow-600/30 px-1 py-0.5 rounded text-yellow-300 truncate"
                      >
                        {reserva.hora}
                      </div>
                    ))}
                    {dayReservas.length > 2 && (
                      <p className="text-zinc-500 text-[9px]">
                        +{dayReservas.length - 2} más
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Leyenda */}
      <div className="mt-6 pt-6 border-t border-white/10 space-y-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-yellow-600/30 border border-yellow-500/50"></div>
          <span className="text-zinc-400">Reservas en este día</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-yellow-500 border border-yellow-500"></div>
          <span className="text-zinc-400">Hoy</span>
        </div>
      </div>
    </div>
  );
}
