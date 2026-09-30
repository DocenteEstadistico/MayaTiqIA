import React, { useState } from 'react';
import { 
  ArrowLeft, GraduationCap, BookOpen, Calculator, FlaskConical, Dna,
  Sparkles, Award, Target, CheckCircle2, Play, Lock, HelpCircle, ChevronRight, Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';

export default function BachilleratoView({ onVolver, onSeleccionarMateria }) {
  const [testIniciado, setTestIniciado] = useState(false);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState(null);
  const [progresoPAA, setProgresoPAA] = useState(65);

  const materiasBachillerato = [
    { 
      id: 'mat', 
      nombre: 'Matemáticas Bachillerato', 
      desc: 'Álgebra, Geometría, Funciones y Trigonometría', 
      icono: Calculator, 
      avance: 80, 
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
    },
    { 
      id: 'fis', 
      nombre: 'Física General', 
      desc: 'Cinemática, Dinámica y Energía', 
      icono: Zap, 
      avance: 45, 
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' 
    },
    { 
      id: 'quim', 
      nombre: 'Química Orgánica e Inorgánica', 
      desc: 'Estructura atómica, enlaces y reacciones', 
      icono: FlaskConical, 
      avance: 30, 
      color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' 
    },
    { 
      id: 'com', 
      nombre: 'Lenguaje y Literatura', 
      desc: 'Comprensión lectora, redacción y sintaxis', 
      icono: BookOpen, 
      avance: 90, 
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' 
    },
    { 
      id: 'bio', 
      nombre: 'Biología Celular', 
      desc: 'Genética, ecosistemas y anatomía', 
      icono: Dna, 
      avance: 50, 
      color: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20' 
    }
  ];

  const handleSimulacroPAA = () => {
    setTestIniciado(true);
    toast.info('Simulacro PAA Iniciado: 1 de 10 preguntas.');
  };

  const handleResponderPAA = (opcion) => {
    setRespuestaSeleccionada(opcion);
    if (opcion === 'B') {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      toast.success('¡Respuesta Correcta! +15 XP', {
        description: 'La simplificación del sistema algebraico es correcta.'
      });
      setProgresoPAA(prev => Math.min(prev + 10, 100));
    } else {
      toast.error('Respuesta incorrecta. Revisa el procedimiento de factorización.');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Navigation Header & Breadcrumb */}
      <div className="flex items-center justify-between flex-wrap gap-4 bg-white dark:bg-[#1a241f] p-4 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onVolver}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 font-medium text-sm transition-all active:scale-95"
          >
            <ArrowLeft size={18} />
            <span>Volver al Dashboard</span>
          </button>
          <div className="h-6 w-px bg-stone-300 dark:bg-stone-700 hidden sm:block"></div>
          <div className="flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400">
            <span>Inicio</span>
            <span>/</span>
            <span className="font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
              <GraduationCap size={16} /> Bachillerato
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 px-3 py-1.5 rounded-full text-xs font-semibold text-amber-900 dark:text-amber-300">
          <Sparkles size={14} className="text-amber-500 animate-pulse" />
          <span>Meta: Ingreso Universitario 2027</span>
        </div>
      </div>

      {/* Hero Banner Bachillerato */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-900 to-stone-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-medium backdrop-blur-md">
            🎓 Nivel Bachillerato en Ciencias y Letras
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Prepara tu Futuro Universitario con Maya TiqIA
          </h2>
          <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
            Explora las materias clave de educación media, practica con simulacros de admisión reales y consulta a nuestra IA de orientación vocacional.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
              <div className="text-xs text-emerald-200">Racha Actual</div>
              <div className="text-xl font-bold text-amber-300">🔥 5 Días</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
              <div className="text-xs text-emerald-200">Examen Admisión PAA</div>
              <div className="text-xl font-bold text-emerald-300">{progresoPAA}% Preparado</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 col-span-2 sm:col-span-1">
              <div className="text-xs text-emerald-200">Insignias Desbloqueadas</div>
              <div className="text-xl font-bold text-cyan-300">🏆 4 Insignias</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Materias de Bachillerato */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 flex items-center gap-2">
            <BookOpen className="text-emerald-600 dark:text-emerald-400" size={22} />
            <span>Materias Núcleo de Bachillerato</span>
          </h3>
          <span className="text-xs text-stone-500 dark:text-stone-400">5 materias activas</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {materiasBachillerato.map(materia => (
            <div 
              key={materia.id}
              className="bg-white dark:bg-[#1a241f] p-5 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 flex flex-col justify-between hover:shadow-md transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-2xl border ${materia.color}`}>
                    <materia.icono size={24} />
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                    Avance: {materia.avance}%
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-stone-800 dark:text-stone-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {materia.nombre}
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                    {materia.desc}
                  </p>
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-600 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${materia.avance}%` }}
                  ></div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                <button
                  onClick={() => onSeleccionarMateria(materia.id)}
                  className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
                >
                  <span>Ver Portal Dedicado</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Módulo de Examen de Admisión Universitaria (Simulacro) */}
      <section className="bg-white dark:bg-[#1a241f] rounded-3xl p-6 shadow-sm border border-stone-200 dark:border-stone-800 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-2xl border border-amber-500/20">
              <Target size={26} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100">
                Simulador PAA / Admisión Universitaria
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Practica preguntas reales tipo PAA / USAC con retroalimentación instantánea.
              </p>
            </div>
          </div>
          <button
            onClick={handleSimulacroPAA}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-sm transition-all active:scale-95 shadow-md"
          >
            <Play size={16} />
            <span>{testIniciado ? 'Reiniciar Simulacro' : 'Iniciar Simulacro Rápido'}</span>
          </button>
        </div>

        {testIniciado && (
          <div className="bg-stone-50 dark:bg-stone-900/60 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-4">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-600 dark:text-stone-400">
              <span>Pregunta 1 de 10 — Razonamiento Matemático</span>
              <span className="text-amber-600 dark:text-amber-400 font-bold">Tiempo estimado: 2 min</span>
            </div>
            <p className="text-stone-800 dark:text-stone-200 font-medium text-sm sm:text-base">
              Si 3x + 5 = 20, ¿cuál es el valor del término (x² - 1)?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key: 'A', text: '14' },
                { key: 'B', text: '24' },
                { key: 'C', text: '16' },
                { key: 'D', text: '25' }
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => handleResponderPAA(opt.key)}
                  className={`p-3.5 rounded-xl text-left font-medium text-sm border transition-all flex items-center justify-between ${
                    respuestaSeleccionada === opt.key 
                      ? opt.key === 'B' 
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-400 font-bold' 
                        : 'bg-red-500/10 border-red-500 text-red-600 dark:text-red-400 font-bold'
                      : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 hover:border-amber-400 text-stone-700 dark:text-stone-200'
                  }`}
                >
                  <span><strong>{opt.key})</strong> {opt.text}</span>
                  {respuestaSeleccionada === opt.key && opt.key === 'B' && <CheckCircle2 size={18} className="text-emerald-500" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Orientador Vocacional IA */}
      <section className="bg-gradient-to-r from-stone-900 to-emerald-950 rounded-3xl p-6 text-white shadow-md border border-stone-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles size={16} /> Orientación Vocacional IA
          </div>
          <h3 className="text-xl font-extrabold">¿No sabes qué carrera elegir en la universidad?</h3>
          <p className="text-stone-300 text-sm">
            Nuestro algoritmo de IA analiza tus fortalezas en Matemáticas, Ciencias y Lenguaje para recomendarte las mejores carreras técnicas y universitarias.
          </p>
        </div>
        <button
          onClick={() => toast.info('Iniciando Test Vocacional IA...', { description: 'Te haremos 5 preguntas para evaluar tus áreas afines.' })}
          className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-extrabold text-sm transition-all active:scale-95 shadow-lg whitespace-nowrap"
        >
          Iniciar Test Vocacional
        </button>
      </section>
    </div>
  );
}
