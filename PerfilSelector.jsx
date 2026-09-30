import React from 'react';
import { GraduationCap, ExternalLink } from 'lucide-react';

export default function PerfilSelector({ perfiles, perfilActual, cambiarPerfil, onAbrirVistaPerfil }) {
  const tieneVistaDedicada = ['bachillerato', 'universitario', 'tesista', 'admision'].includes(perfilActual);

  const getNombrePortal = (id) => {
    if (id === 'bachillerato') return 'Bachillerato';
    if (id === 'admision') return 'Admisión Uni';
    return 'Universitario';
  };

  return (
    <section className="mb-8" aria-label="Sección de selección de perfil">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-stone-200 flex items-center gap-2">
          <GraduationCap size={20} className="text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
          <span>Selecciona tu perfil</span>
        </h2>

        {tieneVistaDedicada && onAbrirVistaPerfil && (
          <button
            onClick={() => onAbrirVistaPerfil(perfilActual)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-500 hover:bg-amber-600 text-stone-950 transition-all shadow-sm active:scale-95 animate-pulse"
          >
            <span>Ver Portal Dedicado ({getNombrePortal(perfilActual)})</span>
            <ExternalLink size={14} />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2.5">
        {perfiles.map(perfil => {
          const isSelected = perfilActual === perfil.id;
          return (
            <button
              key={perfil.id}
              onClick={() => cambiarPerfil(perfil.id)}
              aria-label={`Seleccionar perfil ${perfil.nombre}`}
              aria-pressed={isSelected}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ease-in-out active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                isSelected 
                  ? 'bg-emerald-700 text-white shadow-md font-semibold ring-2 ring-emerald-500/50' 
                  : 'bg-white dark:bg-[#1a241f] border border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
              }`}
            >
              {perfil.nombre}
            </button>
          );
        })}
      </div>
    </section>
  );
}