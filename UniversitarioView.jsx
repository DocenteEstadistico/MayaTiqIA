import React, { useState } from 'react';
import { 
  ArrowLeft, GraduationCap, Calculator, FileText, Database, Code, 
  Award, Wifi, WifiOff, Sparkles, ChevronRight, CheckCircle2, Send, Bookmark
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';

export default function UniversitarioView({ onVolver, onSeleccionarMateria, isConnected, sendEvent }) {
  const [tesisNotificada, setTesisNotificada] = useState(false);
  const [consultaAPA, setConsultaAPA] = useState('');
  const [respuestaAPA, setRespuestaAPA] = useState(null);

  const materiasUniversitarias = [
    {
      id: 'mat',
      nombre: 'Cálculo Multivariable & Ecuaciones',
      desc: 'Derivadas parciales, integrales dobles y modelado diferencial',
      icono: Calculator,
      avance: 85,
      nivel: 'Avanzado',
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
    },
    {
      id: 'est',
      nombre: 'Estadística Inferencial & Probabilidad',
      desc: 'Pruebas de hipótesis, regresiòn lineal y análisis de varianza',
      icono: Database,
      avance: 70,
      nivel: 'Intermedio',
      color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20'
    },
    {
      id: 'inv',
      nombre: 'Metodología de la Investigación',
      desc: 'Marco teórico, diseño metodológico y protocolo de tesis',
      icono: FileText,
      avance: 92,
      nivel: 'Seminario',
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
    },
    {
      id: 'prog',
      nombre: 'Algoritmos y Estructura de Datos',
      desc: 'Programación avanzada, grafos, árboles y complejidad O(n)',
      icono: Code,
      avance: 60,
      nivel: 'Intermedio',
      color: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20'
    }
  ];

  const handleNotificarTutor = () => {
    if (isConnected && sendEvent) {
      sendEvent('avance_tesis', {
        usuario: 'estudiante.universitario@univ.edu',
        capitulo: 'Capítulo 3 - Metodología',
        progreso: 85
      });
    }
    setTesisNotificada(true);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    toast.success('¡Avance notificado al Tutor de Tesis!', {
      description: 'Se ha enviado un reporte a la plataforma Tesis & Tutorías.'
    });
  };

  const handleConsultarAPA = (e) => {
    e.preventDefault();
    if (!consultaAPA.trim()) return;
    toast.info('Consultando IA de Formato APA 7...', { description: 'Generando cita académica...' });
    setTimeout(() => {
      setRespuestaAPA(`Cita sugerida en APA 7mo edición:\nAutor, A. A. (2025). ${consultaAPA}. Editorial Académica Mayan. https://doi.org/10.1016/j.mayan.2025`);
    }, 500);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header & Breadcrumbs */}
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
            <span className="font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
              <GraduationCap size={16} /> Universitario & Tesista
            </span>
          </div>
        </div>

        {/* Estado Socket con Tesis */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
          {isConnected ? (
            <>
              <Wifi size={14} className="text-emerald-500" />
              <span>Servidor Tesis: Conectado</span>
            </>
          ) : (
            <>
              <WifiOff size={14} className="text-stone-400" />
              <span>Servidor Tesis: Sincronización Local</span>
            </>
          )}
        </div>
      </div>

      {/* Hero Banner Universitario */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-stone-900 via-indigo-950 to-emerald-950 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-medium backdrop-blur-md">
            🧑‍🎓 Nivel Universitario — Facultad de Ciencias e Ingeniería
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Portal Académico Superior y Seminario de Tesis
          </h2>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            Accede a cursos avanzados de Cálculo, Estadística e Investigación Científica. Conecta tu avance con la plataforma de Tesis & Tutorías.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
              <div className="text-xs text-indigo-200">Créditos Acumulados</div>
              <div className="text-xl font-bold text-amber-300">145 / 210 UMA</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
              <div className="text-xs text-indigo-200">Promedio Ponderado</div>
              <div className="text-xl font-bold text-emerald-300">88.5 / 100</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 col-span-2 sm:col-span-1">
              <div className="text-xs text-indigo-200">Estado de Tesis</div>
              <div className="text-xl font-bold text-cyan-300">Cap. 3 en Revisión</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Materias Universitarias */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 flex items-center gap-2">
            <GraduationCap className="text-indigo-600 dark:text-indigo-400" size={22} />
            <span>Asignaturas de Educación Superior</span>
          </h3>
          <span className="text-xs text-stone-500 dark:text-stone-400">4 cursos de nivel avanzado</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {materiasUniversitarias.map((materia) => (
            <div 
              key={materia.id}
              className="bg-white dark:bg-[#1a241f] p-5 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 space-y-4 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl border ${materia.color}`}>
                    <materia.icono size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-800 dark:text-stone-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {materia.nombre}
                    </h4>
                    <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
                      Nivel: {materia.nivel}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {materia.avance}% completado
                </span>
              </div>

              <p className="text-xs text-stone-500 dark:text-stone-400">
                {materia.desc}
              </p>

              <div className="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${materia.avance}%` }}
                ></div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs">
                <button
                  onClick={() => onSeleccionarMateria(materia.id)}
                  className="flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <span>Abrir Portal de {materia.id === 'mat' ? 'Matemáticas' : 'Estudio'}</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Integración con Tesis y Tutorías */}
      <section className="bg-white dark:bg-[#1a241f] rounded-3xl p-6 shadow-sm border border-stone-200 dark:border-stone-800 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl border border-emerald-500/20">
              <FileText size={26} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100">
                Módulo de Integración con Tesis & Tutorías
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Sincronización en tiempo real de avances metodológicos con tu asesor asignado.
              </p>
            </div>
          </div>
          <button
            onClick={handleNotificarTutor}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-md ${
              tesisNotificada
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-700 hover:bg-emerald-800 text-white'
            }`}
          >
            {tesisNotificada ? <CheckCircle2 size={16} /> : <Send size={16} />}
            <span>{tesisNotificada ? 'Notificación Enviada' : 'Notificar Avance a Tutor'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 bg-stone-50 dark:bg-stone-900/60 rounded-xl border border-stone-200 dark:border-stone-800">
            <span className="text-xs text-stone-500 dark:text-stone-400">Capítulo Actual</span>
            <div className="font-semibold text-stone-800 dark:text-stone-100 text-sm">Capítulo 3: Metodología</div>
          </div>
          <div className="p-3 bg-stone-50 dark:bg-stone-900/60 rounded-xl border border-stone-200 dark:border-stone-800">
            <span className="text-xs text-stone-500 dark:text-stone-400">Última Revisión</span>
            <div className="font-semibold text-emerald-600 dark:text-emerald-400 text-sm">Hace 2 días (Aprobado)</div>
          </div>
          <div className="p-3 bg-stone-50 dark:bg-stone-900/60 rounded-xl border border-stone-200 dark:border-stone-800">
            <span className="text-xs text-stone-500 dark:text-stone-400">Próxima Tutoría</span>
            <div className="font-semibold text-amber-600 dark:text-amber-400 text-sm">Jueves 10:00 AM</div>
          </div>
        </div>
      </section>

      {/* Asistente IA de Redacción Científica y Formato APA 7 */}
      <section className="bg-gradient-to-r from-stone-900 via-stone-900 to-indigo-950 rounded-3xl p-6 text-white shadow-md border border-stone-800 space-y-4">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles size={16} /> Asistente de Redacción Científica IA
        </div>
        <h3 className="text-xl font-extrabold">Generador de Citas Bibliográficas APA 7</h3>

        <form onSubmit={handleConsultarAPA} className="flex gap-2 flex-wrap">
          <input
            type="text"
            value={consultaAPA}
            onChange={(e) => setConsultaAPA(e.target.value)}
            placeholder="Introduce el título de un libro, paper o tema (ej. Métodos Numéricos en Ingeniería)"
            className="flex-1 min-w-[280px] px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-stone-950 font-bold text-sm transition-all active:scale-95 flex items-center gap-2"
          >
            <Bookmark size={16} />
            <span>Generar Cita</span>
          </button>
        </form>

        {respuestaAPA && (
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-indigo-200 leading-relaxed whitespace-pre-wrap">
            {respuestaAPA}
          </div>
        )}
      </section>
    </div>
  );
}
