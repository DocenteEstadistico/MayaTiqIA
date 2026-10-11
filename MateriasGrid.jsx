import React, { useState, useEffect } from 'react';
import Skeleton from './Skeleton';

export default function MateriasGrid({ materias, materiaSeleccionada, seleccionarMateria, progreso }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section aria-label="Sección de materias disponibles">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="maya-section-icon text-lg" aria-hidden="true">📚</span>
          <div>
            <p className="maya-eyebrow">Paso 2</p>
            <h2 className="maya-section-title">Materias disponibles</h2>
          </div>
        </div>
        <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
          Elige una materia para abrir su portal interactivo
        </span>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="flex flex-col items-center p-4 rounded-2xl bg-white dark:bg-[#141f1a] shadow-sm border border-stone-200/80 dark:border-emerald-900/50 space-y-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <Skeleton className="w-20 h-4 rounded" />
              <Skeleton className="w-14 h-3 rounded-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {materias.map((materia, index) => {
            const isSelected = materiaSeleccionada === materia.id;
            return (
              <button
                key={materia.id}
                onClick={() => seleccionarMateria(materia.id)}
                aria-label={`Seleccionar materia ${materia.nombre}${progreso[materia.id]?.nivel ? `, nivel ${progreso[materia.id].nivel}` : ''}`}
                style={{ animationDelay: `${index * 40}ms` }}
                aria-pressed={isSelected}
                className={`relative flex flex-col items-center rounded-2xl border bg-white p-4 opacity-0 transition-all duration-200 animate-stagger-in hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 dark:bg-[#141f1a] ${
                  isSelected
                    ? 'border-amber-400 shadow-lg shadow-amber-500/10 ring-2 ring-amber-400'
                    : 'border-stone-200/80 hover:border-emerald-300 dark:border-emerald-900/50 dark:hover:border-emerald-700'
                }`}
              >
                <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${materia.color || 'bg-emerald-100'} dark:bg-emerald-950/70`}>
                  <materia.icono size={28} className="text-emerald-700 dark:text-emerald-400" />
                </span>
                <span className="mt-3 text-center text-sm font-bold text-stone-800 dark:text-stone-100">
                  {materia.nombre}
                </span>

                {materia.id === 'mat' && (
                  <span className="text-[10px] font-bold bg-amber-400 text-stone-950 px-2 py-0.5 rounded-full mt-1.5 shadow-sm">
                    ✨ Portal Activo
                  </span>
                )}

                {progreso[materia.id]?.nivel && materia.id !== 'mat' && (
                  <span className="text-xs bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-semibold px-2.5 py-0.5 rounded-full mt-1.5 border border-emerald-200 dark:border-emerald-800">
                    Nivel {progreso[materia.id].nivel}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}