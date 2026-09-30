import React, { useState, useEffect } from 'react';
import Skeleton from './Skeleton';

function ProgressRing({ avance = 0, isDark }) {
  const [currentAvance, setCurrentAvance] = useState(0);

  useEffect(() => {
    // Animar suavemente el anillo desde 0% hasta el valor real en ~800ms
    const timer = setTimeout(() => {
      setCurrentAvance(avance);
    }, 60);
    return () => clearTimeout(timer);
  }, [avance]);

  const restColor = isDark ? '#374151' : '#e7e5e4'; // stone-700 o stone-200

  return (
    <div
      className="relative w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-800"
      style={{
        background: `conic-gradient(#065f46 ${currentAvance}%, ${restColor} ${currentAvance}% 100%)`,
        transition: 'background 800ms cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      role="progressbar"
      aria-valuenow={avance}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Progreso: ${avance}%`}
    >
      {/* Centro blanco / oscuro */}
      <div className="w-10 h-10 rounded-full bg-white dark:bg-[#1a241f] flex items-center justify-center shadow-inner">
        <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400">
          {Math.round(currentAvance)}%
        </span>
      </div>
    </div>
  );
}

export default function ProgresoReciente({ progreso, materias, perfilNombre }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="mb-8 bg-white dark:bg-[#1a241f] rounded-xl p-5 shadow-sm border border-emerald-100 dark:border-emerald-900/40 transition-colors duration-200" aria-label="Progreso reciente">
      <h2 className="text-lg font-semibold text-gray-700 dark:text-stone-200 mb-4 flex justify-between items-center flex-wrap gap-2">
        <span className="flex items-center gap-2">📈 Tu progreso reciente</span>
        <span className="text-sm font-normal text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
          Perfil: <strong>{perfilNombre}</strong>
        </span>
      </h2>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="flex items-center gap-4 p-3 rounded-lg border border-stone-100 dark:border-stone-800/40">
              <Skeleton className="w-14 h-14 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="w-32 h-4 rounded" />
                <Skeleton className="w-24 h-3 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(progreso).map(([id, data], index) => {
            const materia = materias.find(m => m.id === id);
            if (!materia) return null;
            return (
              <div
                key={id}
                style={{ animationDelay: `${index * 50}ms` }}
                className="flex items-center gap-4 p-3.5 rounded-xl border border-stone-100 dark:border-stone-800/60 bg-stone-50/50 dark:bg-stone-900/30 animate-stagger-in hover:shadow-sm transition-all"
              >
                <ProgressRing avance={data.avance || 0} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <materia.icono size={18} className="text-emerald-700 dark:text-emerald-400 flex-shrink-0" />
                    <span className="font-semibold text-gray-800 dark:text-stone-100 text-sm truncate">
                      {materia.nombre}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-stone-300 font-medium">
                    {data.nivel ? (
                      <span className="inline-block bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-md font-semibold">
                        Nivel {data.nivel}
                      </span>
                    ) : (
                      <span className="text-amber-700 dark:text-amber-400 italic">
                        {data.mensaje || 'Sin inicio'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}