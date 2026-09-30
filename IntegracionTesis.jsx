import React from 'react';
import { Link2, Wifi, WifiOff, GraduationCap } from 'lucide-react';

export default function IntegracionTesis({ perfilActual, isConnected, notificarCompletado }) {
  return (
    <section 
      className="bg-amber-50 dark:bg-amber-950/20 rounded-xl p-5 border border-amber-200 dark:border-amber-900/50 transition-colors duration-200"
      aria-label="Sección de integración con Tesis y Tutorías"
    >
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h3 className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-2 text-base">
            <Link2 size={18} aria-hidden="true" /> Conexión con Tesis y Tutorías
          </h3>
          <p className="text-sm text-amber-800 dark:text-amber-200/90 mt-1 leading-relaxed">
            {perfilActual === 'tesista' 
              ? 'Tienes acceso completo a asesoría de tesis y software estadístico.' 
              : '¿Estás haciendo tu tesis? Cambia tu perfil a "Tesista" para acceder.'}
          </p>
          {isConnected ? (
            <span className="inline-flex items-center gap-1.5 text-xs text-green-700 dark:text-green-400 font-semibold mt-2 bg-green-100 dark:bg-green-950/60 px-2.5 py-0.5 rounded-full border border-green-200 dark:border-green-800">
              <Wifi size={12} aria-hidden="true"/> Conectado a Tesis vía socket
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 font-semibold mt-2 bg-red-100 dark:bg-red-950/60 px-2.5 py-0.5 rounded-full border border-red-200 dark:border-red-800">
              <WifiOff size={12} aria-hidden="true"/> Sin conexión activa
            </span>
          )}
        </div>
        <div className="flex gap-2.5 flex-wrap">
          <button
            onClick={() => window.open('/tesis-dashboard', '_blank')}
            aria-label="Abrir plataforma Tesis y Tutorías en una nueva pestaña"
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium text-sm flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 shadow-sm"
          >
            <GraduationCap size={16} aria-hidden="true" /> Ir a Tesis y Tutorías
          </button>
          {perfilActual === 'tesista' && (
            <button
              onClick={notificarCompletado}
              aria-label="Notificar avance a tu tutor de tesis"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium text-sm transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 shadow-sm"
            >
              Notificar avance a tutor
            </button>
          )}
        </div>
      </div>
    </section>
  );
}