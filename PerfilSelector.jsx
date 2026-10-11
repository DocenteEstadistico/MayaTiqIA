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
    <section className="maya-card p-5 sm:p-6" aria-label="Sección de selección de perfil">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="maya-section-icon">
            <GraduationCap size={18} aria-hidden="true" />
          </span>
          <div>
            <p className="maya-eyebrow">Paso 1</p>
            <h2 className="maya-section-title">Selecciona tu perfil</h2>
          </div>
        </div>

        {tieneVistaDedicada && onAbrirVistaPerfil && (
          <button
            onClick={() => onAbrirVistaPerfil(perfilActual)}
            className="flex items-center gap-1.5 rounded-full bg-amber-400 px-4 py-2 text-xs font-extrabold text-stone-950 shadow-sm shadow-amber-900/10 transition-colors hover:bg-amber-300 active:scale-95"
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
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-200 ease-in-out active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                isSelected
                  ? 'border-emerald-700 bg-emerald-700 text-white shadow-md shadow-emerald-900/20'
                  : 'border-emerald-200 bg-white text-emerald-800 hover:border-emerald-400 hover:bg-emerald-50 dark:border-emerald-800/80 dark:bg-[#1a241f] dark:text-emerald-300 dark:hover:bg-emerald-950/40'
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