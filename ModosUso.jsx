import React from 'react';

export default function ModosUso({ modos, ejecutarModo }) {
  return (
    <section aria-label="Sección de modos de uso">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="maya-section-icon text-lg" aria-hidden="true">🎯</span>
          <div>
            <p className="maya-eyebrow">Paso 3</p>
            <h2 className="maya-section-title">Modos y experiencias de aprendizaje</h2>
          </div>
        </div>
        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-900 dark:bg-amber-950 dark:text-amber-300">
          Aprendizaje gamificado
        </span>
      </div>
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-5">
        {modos.map((modo, index) => (
          <button
            key={modo.id}
            onClick={() => ejecutarModo(modo.id)}
            aria-label={`Ejecutar modo ${modo.nombre}: ${modo.descripcion}`}
            style={{ animationDelay: `${index * 40}ms` }}
            className="card-matific group flex flex-col items-start rounded-2xl border border-stone-200/80 bg-white p-4 text-left opacity-0 transition-all duration-200 animate-stagger-in hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 dark:border-emerald-900/50 dark:bg-[#141f1a] dark:hover:border-emerald-700"
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