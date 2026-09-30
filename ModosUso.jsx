import React from 'react';

export default function ModosUso({ modos, ejecutarModo }) {
  return (
    <section className="mb-8" aria-label="Sección de modos de uso">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-gray-800 dark:text-stone-100 flex items-center gap-2">
          <span>🎯</span> Modos & Experiencias de Aprendizaje
        </h2>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300">
          Matific & Khan Gamified
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {modos.map((modo, index) => (
          <button
            key={modo.id}
            onClick={() => ejecutarModo(modo.id)}
            aria-label={`Ejecutar modo ${modo.nombre}: ${modo.descripcion}`}
            style={{ animationDelay: `${index * 40}ms` }}
            className="card-matific flex flex-col items-start p-4 bg-white dark:bg-[#141f1a] rounded-2xl border border-stone-200 dark:border-stone-800/80 text-left transition-all duration-200 animate-stagger-in hover:shadow-xl hover:-translate-y-1 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/10 to-amber-500/20 flex items-center justify-center text-2xl mb-2 group-hover:scale-110 transition-transform">
              {modo.nombre.split(' ')[0]}
            </div>
            <span className="font-extrabold text-gray-800 dark:text-stone-100 text-sm group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {modo.nombre}
            </span>
            <span className="text-xs text-gray-600 dark:text-stone-300 mt-1 leading-relaxed">
              {modo.descripcion}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}