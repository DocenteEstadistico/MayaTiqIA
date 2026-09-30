import React, { useState, useEffect } from 'react';
import Skeleton from './Skeleton';

export default function MateriasGrid({ materias, materiaSeleccionada, seleccionarMateria, progreso }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="mb-8" aria-label="Sección de materias disponibles">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-stone-200 flex items-center gap-2">
          <span>📚</span> Materias disponibles
        </h2>
        <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
          💡 Haz clic en una materia para abrir su portal interactivo
        </span>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="flex flex-col items-center p-4 rounded-2xl bg-white dark:bg-[#1a241f] shadow-sm border border-stone-100 dark:border-stone-800/60 space-y-3">
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
                className={`flex flex-col items-center p-4 rounded-2xl transition-all duration-200 animate-stagger-in hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 relative ${
                  isSelected 
                    ? 'ring-4 ring-amber-400 bg-white dark:bg-[#1a241f] shadow-lg border-transparent' 
                    : 'bg-white dark:bg-[#1a241f] hover:shadow-md border border-stone-100 dark:border-stone-800/60'
                } ${materia.color ? `${materia.color} dark:bg-opacity-15` : ''}`}
              >
                <materia.icono size={32} className="text-emerald-700 dark:text-emerald-400" />
                <span className="mt-2 font-medium text-gray-800 dark:text-stone-100 text-sm text-center">
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