import React, { useState } from 'react';
import { 
  ArrowLeft, CheckCircle2, XCircle, Sparkles, Brain, ArrowRight, RefreshCw, 
  BookOpen, Trophy, Lightbulb, List, Play, Check, HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';

export default function ModuloDedicadoView({ modulo, ejercicios, onVolver, onSumarXp }) {
  const [vistaInterna, setVistaInterna] = useState('practica'); // 'practica' | 'lista'
  const [ejercicioIndex, setEjercicioIndex] = useState(0);
  const [opcionElegidaIdx, setOpcionElegidaIdx] = useState(null);
  const [esCorrecto, setEsCorrecto] = useState(null);
  const [respuestaRevelada, setRespuestaRevelada] = useState(false);

  const ejercicioActual = ejercicios[ejercicioIndex] || ejercicios[0];
  const opciones = ejercicioActual?.choices || [];

  const handleSeleccionarOpcion = (idx, opt) => {
    setOpcionElegidaIdx(idx);
    setEsCorrecto(opt.correct);
    setRespuestaRevelada(false);

    if (opt.correct) {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      toast.success('¡Excelente! Respuesta Correcta +20 XP', {
        description: 'Has dominado este problema.'
      });
      if (onSumarXp) onSumarXp(20);
    } else {
      toast.error('Respuesta incorrecta', {
        description: 'No te preocupes. Revisa la explicación del Tutor IA abajo.'
      });
    }
  };

  const handleSiguiente = () => {
    setOpcionElegidaIdx(null);
    setEsCorrecto(null);
    setRespuestaRevelada(false);
    setEjercicioIndex(prev => (prev + 1) % ejercicios.length);
  };

  const handleReintentar = () => {
    setOpcionElegidaIdx(null);
    setEsCorrecto(null);
    setRespuestaRevelada(false);
  };

  const handleSeleccionarDeLista = (idx) => {
    setEjercicioIndex(idx);
    setOpcionElegidaIdx(null);
    setEsCorrecto(null);
    setRespuestaRevelada(false);
    setVistaInterna('practica');
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-[#121815] text-stone-900 dark:text-stone-100 p-4 sm:p-6 lg:p-8 space-y-6 animate-fade-in">
      {/* Header Navegación de Página Dedicada */}
      <div className="flex items-center justify-between flex-wrap gap-4 bg-white dark:bg-[#1a241f] p-4 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onVolver}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 font-bold text-sm transition-all active:scale-95 shadow-sm"
          >
            <ArrowLeft size={18} />
            <span>Volver a Módulos</span>
          </button>
          <div className="h-6 w-px bg-stone-300 dark:bg-stone-700 hidden sm:block"></div>
          <div>
            <h1 className="font-extrabold text-base sm:text-xl text-emerald-800 dark:text-emerald-400 flex items-center gap-2">
              <span>{modulo.titulo}</span>
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Página Dedicada de Aprendizaje — {ejercicios.length} ejercicios disponibles
            </p>
          </div>
        </div>

        {/* Alternador de Modo de Vista (Práctica vs Lista Completa de Ejercicios) */}
        <div className="flex items-center gap-2 bg-stone-100 dark:bg-stone-900 p-1.5 rounded-xl border border-stone-200 dark:border-stone-800">
          <button
            onClick={() => setVistaInterna('practica')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              vistaInterna === 'practica'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            <Play size={14} />
            <span>Modo Práctica</span>
          </button>
          <button
            onClick={() => setVistaInterna('lista')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              vistaInterna === 'lista'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            <List size={14} />
            <span>Ver los {ejercicios.length} Ejercicios</span>
          </button>
        </div>
      </div>

      {/* VISTA 1: Catálogo / Lista Completa de 125 Ejercicios */}
      {vistaInterna === 'lista' ? (
        <section className="bg-white dark:bg-[#1a241f] rounded-3xl p-6 shadow-sm border border-stone-200 dark:border-stone-800 space-y-6 animate-fade-in">
          <div className="flex justify-between items-center flex-wrap gap-2 border-b border-stone-100 dark:border-stone-800 pb-4">
            <div>
              <h2 className="text-lg font-extrabold text-stone-800 dark:text-stone-100 flex items-center gap-2">
                <List className="text-emerald-600" size={20} />
                <span>Lista Completa de Ejercicios del Módulo ({ejercicios.length})</span>
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                Haz clic en cualquier ejercicio para resolverlo individualmente en la página de práctica.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ejercicios.map((ex, idx) => (
              <button
                key={idx}
                onClick={() => handleSeleccionarDeLista(idx)}
                className={`p-4 rounded-2xl text-left border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between space-y-3 ${
                  idx === ejercicioIndex
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 ring-2 ring-emerald-500/30'
                    : 'border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/40 hover:border-emerald-300'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-stone-400">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 uppercase">
                      Ejercicio #{idx + 1}
                    </span>
                    <span>Dif. {ex.difficulty} / 10</span>
                  </div>
                  <h3 className="font-bold text-stone-800 dark:text-stone-200 text-sm line-clamp-2">
                    {ex.question}
                  </h3>
                </div>

                <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-200/60 dark:border-stone-800">
                  <span className="capitalize">{ex.subtopic?.replace('_', ' ')}</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <span>Resolver</span> <ArrowRight size={12} />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>
      ) : (
        /* VISTA 2: Modo Práctica Interactiva en Página Dedicada */
        <section className="max-w-4xl mx-auto space-y-6 animate-slide-up">
          {/* Bar de Progreso del Módulo */}
          <div className="bg-white dark:bg-[#1a241f] p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm flex items-center justify-between gap-4">
            <div className="flex-1 space-y-1">
              <div className="flex justify-between text-xs font-bold text-stone-600 dark:text-stone-400">
                <span>Progreso: Ejercicio {ejercicioIndex + 1} de {ejercicios.length}</span>
                <span>{Math.round(((ejercicioIndex + 1) / ejercicios.length) * 100)}% Completado</span>
              </div>
              <div className="w-full bg-stone-100 dark:bg-stone-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${((ejercicioIndex + 1) / ejercicios.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Tarjeta Principal del Ejercicio */}
          <div className="bg-white dark:bg-[#1a241f] rounded-3xl p-6 sm:p-8 shadow-lg border border-stone-200 dark:border-stone-800 space-y-6">
            <div>
              <div className="flex items-center justify-between flex-wrap gap-2 text-xs text-stone-500 dark:text-stone-400 mb-2">
                <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold uppercase tracking-wider">
                  Subtema: {ejercicioActual.subtopic?.replace('_', ' ')}
                </span>
                <span className="font-mono text-stone-400">ID: {ejercicioActual.exercise_id || 'MAYAN-PRO'}</span>
              </div>

              <h2 className="text-lg sm:text-2xl font-extrabold text-stone-800 dark:text-stone-100 leading-relaxed mt-2">
                {ejercicioActual.question}
              </h2>

              {ejercicioActual.question_latex && (
                <div className="mt-4 p-4 rounded-2xl bg-stone-900 text-emerald-300 font-mono text-sm sm:text-base border border-emerald-900/50 shadow-inner">
                  <span className="text-stone-400 text-xs block mb-1">Expresión Matemática (LaTeX):</span>
                  {ejercicioActual.question_latex}
                </div>
              )}
            </div>

            {/* Opciones de respuesta A, B, C, D */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
                Selecciona la opción correcta:
              </span>

              {opciones.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {opciones.map((opt, idx) => {
                  const esElegida = opcionElegidaIdx === idx;
                  let estiloClase = 'bg-stone-50 dark:bg-stone-900/80 border-stone-200 dark:border-stone-800 hover:border-emerald-500 text-stone-800 dark:text-stone-200';

                  if (opcionElegidaIdx !== null) {
                    if (opt.correct) {
                      estiloClase = 'bg-emerald-500/15 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold ring-2 ring-emerald-500/30';
                    } else if (esElegida) {
                      estiloClase = 'bg-red-500/15 border-red-500 text-red-700 dark:text-red-300 font-bold ring-2 ring-red-500/30';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={opcionElegidaIdx !== null}
                      onClick={() => handleSeleccionarOpcion(idx, opt)}
                      className={`p-4 sm:p-5 rounded-2xl text-left font-medium text-sm sm:text-base border-2 transition-all flex items-center justify-between shadow-sm active:scale-[0.99] ${estiloClase}`}
                    >
                      <span className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                          opcionElegidaIdx !== null && opt.correct
                            ? 'bg-emerald-500 text-white'
                            : esElegida && !opt.correct
                            ? 'bg-red-500 text-white'
                            : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt.text}</span>
                      </span>

                      {opcionElegidaIdx !== null && opt.correct && (
                        <CheckCircle2 size={24} className="text-emerald-500 shrink-0" />
                      )}
                      {esElegida && !opt.correct && (
                        <XCircle size={24} className="text-red-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-stone-600 dark:text-stone-300">
                    Este es un ejercicio de respuesta abierta. Resuélvelo antes de revelar la solución.
                  </p>
                  {!respuestaRevelada && (
                    <button
                      onClick={() => setRespuestaRevelada(true)}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all"
                    >
                      Mostrar respuesta y explicación
                    </button>
                  )}
                  {respuestaRevelada && (
                    <p className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 font-bold">
                      Respuesta: {ejercicioActual.answer_display || ejercicioActual.answer}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* SECCIÓN PEDAGÓGICA CUANDO EL ESTUDIANTE FALLA O ACERTA */}
            {(opcionElegidaIdx !== null || respuestaRevelada) && (
              <div className="pt-6 border-t border-stone-200 dark:border-stone-800 space-y-4 animate-fade-in">
                {/* Banner de Retroalimentación Pedagógica */}
                {opcionElegidaIdx === null ? (
                  <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-900 dark:text-sky-200">
                    <div className="font-extrabold text-base">Comprueba tu procedimiento con la solución.</div>
                  </div>
                ) : esCorrecto ? (
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 dark:text-emerald-200 space-y-1">
                    <div className="font-extrabold text-base flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                      <Sparkles size={20} /> ¡Excelente Trabajo! Respuesta Correcta (+20 XP)
                    </div>
                    <p className="text-xs sm:text-sm">Has aplicado correctamente los conceptos para este problema.</p>
                  </div>
                ) : (
                  <div className="p-5 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 text-amber-900 dark:text-amber-200 space-y-3">
                    <div className="font-extrabold text-base flex items-center gap-2 text-amber-700 dark:text-amber-300">
                      <Lightbulb size={22} className="text-amber-500 animate-bounce" />
                      <span>¡No te preocupes! El error es una gran oportunidad para aprender.</span>
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed">
                      Repasemos juntos cómo se resuelve este ejercicio paso a paso utilizando el razonamiento matemático:
                    </p>

                    {/* Alternativa / Tip de aprendizaje para jóvenes */}
                    <div className="p-3.5 rounded-xl bg-amber-100/70 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-xs sm:text-sm font-medium space-y-1">
                      <strong className="text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                        <Brain size={16} /> Tip Pedagógico para Jóvenes:
                      </strong>
                      <p className="text-amber-800 dark:text-amber-300">
                        {ejercicioActual.topic === 'aritmetica'
                          ? 'Recuerda respetar siempre el orden de las operaciones: primero paréntesis, luego multiplicaciones/divisiones, y al final sumas y restas.'
                          : ejercicioActual.topic === 'algebra'
                          ? 'En álgebra, antes de despejar la variable, agrupa todos los términos semejantes con la misma potencia de x.'
                          : 'Revisa siempre las fórmulas y asegúrate de reemplazar los datos conocidos antes de realizar las operaciones.'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Explicación Detallada SymPy */}
                <div className="p-5 rounded-2xl bg-stone-900 text-stone-200 space-y-2 border border-stone-800 shadow-inner">
                  <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen size={16} /> Explicación Paso a Paso (Motor SymPy CAS):
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed font-mono text-stone-300">
                    {ejercicioActual.explanation}
                  </p>
                </div>

                {/* Botones de Acción Posterior */}
                <div className="flex justify-between items-center flex-wrap gap-3 pt-2">
                  {!esCorrecto && (
                    <button
                      onClick={handleReintentar}
                      className="px-4 py-2.5 rounded-xl bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs sm:text-sm transition-all flex items-center gap-2"
                    >
                      <RefreshCw size={16} />
                      <span>Reintentar este Ejercicio</span>
                    </button>
                  )}

                  <button
                    onClick={handleSiguiente}
                    className="ml-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm transition-all shadow-lg active:scale-95 flex items-center gap-2"
                  >
                    <span>Siguiente Ejercicio</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
