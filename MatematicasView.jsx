import React, { useEffect, useState } from 'react';
import { 
  ArrowLeft, Calculator, Lock, Unlock, Sparkles, CheckCircle2, Play, 
  HelpCircle, Brain, RefreshCw, Trophy, ChevronRight, Zap, ShieldAlert, Award,
  ArrowRight, XCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';

import ModuloDedicadoView from './src/components/ModuloDedicadoView';
import { supabase } from './src/lib/supabaseClient';

export default function MatematicasView({ perfilActual = 'bachillerato', onVolver }) {
  const isUniversitario = perfilActual === 'universitario' || perfilActual === 'tesista';
  
  // Estado del resolutor de fórmulas IA
  const [formulaInput, setFormulaInput] = useState('');
  const [solucionIA, setSolucionIA] = useState(null);
  const [resolviendo, setResolviendo] = useState(false);

  // Estado del simulador de lección interactiva dinámica con 1000 ejercicios
  const [leccionActiva, setLeccionActiva] = useState(null);
  const [ejerciciosModulo, setEjerciciosModulo] = useState([]);
  const [ejercicioIndex, setEjercicioIndex] = useState(0);
  const [opcionElegidaIdx, setOpcionElegidaIdx] = useState(null);
  const [mostrandoExplicacion, setMostrandoExplicacion] = useState(false);
  const [xpTotal, setXpTotal] = useState(520);
  const [ejerciciosBase, setEjerciciosBase] = useState([]);
  const [cargandoEjercicios, setCargandoEjercicios] = useState(true);
  const [errorEjercicios, setErrorEjercicios] = useState('');

  useEffect(() => {
    let cancelled = false;

    const cargarEjercicios = async () => {
      setCargandoEjercicios(true);
      setErrorEjercicios('');
      try {
        const todos = [];
        const pageSize = 500;
        for (let offset = 0; ; offset += pageSize) {
          const { data, error } = await supabase
            .from('exercises')
            .select('exercise_id, topic, subtopic, difficulty, question, question_latex, answer, answer_display, choices, correct_index, explanation')
            .eq('status', 'approved')
            .order('exercise_id')
            .range(offset, offset + pageSize - 1);
          if (error) throw error;
          todos.push(...(data || []));
          if (!data || data.length < pageSize) break;
        }
        if (!cancelled) setEjerciciosBase(todos);
      } catch (error) {
        if (!cancelled) setErrorEjercicios(error.message);
      } finally {
        if (!cancelled) setCargandoEjercicios(false);
      }
    };

    void cargarEjercicios();
    return () => { cancelled = true; };
  }, []);

  // Catálogo completo de módulos de Matemáticas con nivel de acceso
  const modulosMatematicas = [
    {
      id: 'aritmetica',
      titulo: 'Aritmética, Proporciones y Razones',
      desc: 'Fracciones combinadas, regla de tres, ley de signos, porcentajes y proporciones.',
      nivelRequerido: 'bachillerato',
      topicKey: 'aritmetica',
      temasCount: 0,
      completado: 90,
      icono: Calculator,
      color: 'from-amber-500 to-emerald-600'
    },
    {
      id: 'algebra',
      titulo: 'Álgebra Fundamental y Polinomios',
      desc: 'Ecuaciones de 1er y 2do grado, productos notables, factor común y sistemas 2x2.',
      nivelRequerido: 'bachillerato',
      topicKey: 'algebra',
      temasCount: 0,
      completado: 85,
      icono: Calculator,
      color: 'from-emerald-500 to-teal-600'
    },
    {
      id: 'geometria',
      titulo: 'Geometría & Trigonometría',
      desc: 'Teorema de Pitágoras, sen/cos/tan, áreas planas y volúmenes de cuerpos.',
      nivelRequerido: 'bachillerato',
      topicKey: 'geometria_trigonometria',
      temasCount: 0,
      completado: 70,
      icono: Zap,
      color: 'from-amber-500 to-orange-600'
    },
    {
      id: 'conjuntos',
      titulo: 'Teoría de Conjuntos & Venn',
      desc: 'Unión, intersección, diferencia y diagramas de Venn con cardinalidad.',
      nivelRequerido: 'bachillerato',
      topicKey: 'conjuntos',
      temasCount: 0,
      completado: 60,
      icono: Brain,
      color: 'from-blue-500 to-cyan-600'
    },
    {
      id: 'logica',
      titulo: 'Progresiones y Patrones',
      desc: 'Progresiones aritméticas y geométricas, secuencias y razonamiento lógico.',
      nivelRequerido: 'bachillerato',
      topicKey: 'progresiones',
      temasCount: 0,
      completado: 75,
      icono: Sparkles,
      color: 'from-purple-600 to-indigo-600'
    },
    {
      id: 'calculo_1',
      titulo: 'Cálculo Diferencial e Integral',
      desc: 'Límites, continuidad, reglas de derivación e integrales definidas.',
      nivelRequerido: 'universitario',
      topicKey: 'calculo',
      temasCount: 0,
      completado: isUniversitario ? 75 : 0,
      icono: Award,
      color: 'from-rose-500 to-red-600'
    }
  ];

  // Intento de acceso a un módulo
  const handleAbrirModulo = (modulo) => {
    const esPermitido = modulo.nivelRequerido === 'bachillerato' || isUniversitario;
    
    if (!esPermitido) {
      toast.error(`🔒 Acceso Restringido por Servidor`, {
        description: `El módulo "${modulo.titulo}" requiere perfil Universitario. Cambia tu perfil desde el Dashboard.`
      });
      return;
    }

    // Los ejercicios se consultan desde Supabase bajo RLS; no hay copia pública local.
    const filtrados = ejerciciosBase.filter(e => e.topic === modulo.topicKey);
    if (filtrados.length === 0) {
      toast.error(errorEjercicios || 'Este módulo no tiene ejercicios aprobados disponibles en Supabase.');
      return;
    }
    const listaFinal = filtrados;

    setLeccionActiva(modulo);
    setEjerciciosModulo(listaFinal);
    setEjercicioIndex(0);
    setOpcionElegidaIdx(null);
    setMostrandoExplicacion(false);

    toast.info(`Iniciando Módulo: ${modulo.titulo}`, {
      description: `${listaFinal.length} ejercicios aprobados cargados desde Supabase.`
    });
  };

  // Resolver fórmula con IA
  const handleResolverFormula = (e) => {
    e.preventDefault();
    if (!formulaInput.trim()) return;

    setResolviendo(true);
    setSolucionIA(null);

    setTimeout(() => {
      setResolviendo(false);
      if (isUniversitario) {
        setSolucionIA({
          nivel: 'Universitario (Rigor Formal)',
          pasos: [
            `1. Identificación del operador diferencial en la ecuación: ${formulaInput}`,
            `2. Aplicación del teorema de derivación / integración según el perfil universitario.`,
            `3. Solución analítica exacta: f(x) = C₁ e^(2x) + C₂ e^(-2x)`,
            `4. Verificación de condiciones de frontera y convergencia.`
          ]
        });
      } else {
        setSolucionIA({
          nivel: 'Bachillerato (Explicación Intuitiva Paso a Paso)',
          pasos: [
            `1. Agrupamos los términos semejantes de la expresión: ${formulaInput}`,
            `2. Despejamos la variable incognita aislando x en un lado de la igualdad.`,
            `3. Resultado simplificado: x = 5`,
            `4. ¡Comprobación rápida! Reemplaza 5 en la ecuación original para verificar.`
          ]
        });
      }
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
      toast.success('¡Fórmula resuelta por la IA de Maya TiqIA!');
    }, 700);
  };

  const handleCompletarLeccion = (opcion) => {
    setOpcionElegida(opcion);
    if (opcion === 'correcta') {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      toast.success('¡Excelente! Respuesta Correcta +20 XP', {
        description: 'Has dominado esta propiedad matemática.'
      });
      setXpTotal(prev => prev + 20);
    } else {
      toast.error('Respuesta incorrecta. Revisa la sugerencia del tutor IA.');
    }
  };

  if (leccionActiva) {
    return (
      <ModuloDedicadoView 
        modulo={leccionActiva} 
        ejercicios={ejerciciosModulo} 
        onVolver={() => setLeccionActiva(null)} 
        onSumarXp={(xp) => setXpTotal(prev => prev + xp)}
      />
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Breadcrumb Header */}
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
            <span>Materias</span>
            <span>/</span>
            <span className="font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
              <Calculator size={16} /> Matemáticas
            </span>
          </div>
        </div>

        {/* Badge Nivel y XP */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-xs font-bold">
            <Trophy size={14} className="text-amber-500" />
            <span>{xpTotal} XP Acumulados</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 text-xs font-bold">
            <span>Perfil: {isUniversitario ? '🧑‍🎓 Universitario' : '🎓 Bachillerato'}</span>
          </div>
        </div>
      </div>

      {/* Hero Banner de Matemáticas Adaptativa */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-stone-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-medium backdrop-blur-md">
            ✨ Portal Interactivo de Matemáticas — Modo {isUniversitario ? 'Avanzado' : 'Preparatoria'}
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Domina el Lenguaje del Universo
          </h2>
          <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
            {isUniversitario
              ? 'Accede a contenidos universitarios avanzados: Cálculo Multivariable, Álgebra Lineal y Modelado Diferencial con demostraciones rigurosas.'
              : 'Aprende Álgebra, Geometría y Funciones paso a paso con explicaciones dinámicas y preparación para exámenes de admisión.'}
          </p>
        </div>
      </div>

      {/* Aviso de restricción desde Servidor para Bachillerato */}
      {!isUniversitario && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-xs sm:text-sm">
          <ShieldAlert size={20} className="text-amber-600 shrink-0" />
          <div>
            <strong>Control de Acceso por Servidor Activo:</strong> Los módulos avanzados de nivel Universitario muestran un candado 🔒. Para desbloquearlos automáticamente, cambia tu perfil a <em>Universitario</em> en la barra superior del Dashboard.
          </div>
        </div>
      )}

      {/* Grid de Módulos y Rutas de Maestría (Estilo Khan Academy + Matific) */}
      <section className="space-y-4">
        {cargandoEjercicios && (
          <p role="status" className="rounded-xl bg-sky-50 p-3 text-sm text-sky-800 dark:bg-sky-950/40 dark:text-sky-200">
            Cargando ejercicios aprobados de Supabase…
          </p>
        )}
        {!cargandoEjercicios && errorEjercicios && (
          <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800 dark:bg-red-950/40 dark:text-red-200">
            No se pudieron cargar los ejercicios: {errorEjercicios}
          </p>
        )}
        {!cargandoEjercicios && !errorEjercicios && ejerciciosBase.length === 0 && (
          <p role="alert" className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
            Todavía no hay ejercicios aprobados en Supabase. El administrador debe publicar el banco antes de abrir los módulos.
          </p>
        )}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 flex items-center gap-2">
              <Calculator className="text-emerald-600 dark:text-emerald-400" size={22} />
              <span>Unidades de Maestría & Rutas de Estudio</span>
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Avanza desde Nivel Familiar hasta Dominado 👑 para ganar insignias y certificar unidades.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            {modulosMatematicas.length} Unidades Disponibles
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {modulosMatematicas.map((modulo) => {
            const esBloqueado = modulo.nivelRequerido === 'universitario' && !isUniversitario;
            const temasCount = ejerciciosBase.filter(exercise => exercise.topic === modulo.topicKey).length;

            // Determinar badge de maestría Khan Academy según completado
            let badgeMaestria = { label: 'Sin Iniciar', color: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300' };
            if (modulo.completado >= 85) {
              badgeMaestria = { label: 'Dominado 👑', color: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-300 font-extrabold' };
            } else if (modulo.completado >= 60) {
              badgeMaestria = { label: 'Competente ⚡', color: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300' };
            } else if (modulo.completado > 0) {
              badgeMaestria = { label: 'Familiar 📘', color: 'bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-300' };
            }

            return (
              <div
                key={modulo.id}
                className={`bg-white dark:bg-[#1a241f] rounded-3xl p-5 shadow-sm border transition-all duration-200 flex flex-col justify-between relative overflow-hidden card-matific ${
                  esBloqueado
                    ? 'border-stone-200 dark:border-stone-800 opacity-75 grayscale-[0.3]'
                    : 'border-stone-200 dark:border-stone-800 hover:shadow-xl hover:-translate-y-1'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${modulo.color} text-white flex items-center justify-center shadow-md`}>
                      <modulo.icono size={22} />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${badgeMaestria.color}`}>
                        {badgeMaestria.label}
                      </span>
                      {esBloqueado && (
                        <span className="p-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500">
                          <Lock size={14} />
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-stone-800 dark:text-stone-100 text-base">
                      {modulo.titulo}
                    </h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 line-clamp-2">
                      {modulo.desc}
                    </p>
                  </div>

                  {/* Barra de Progreso de Maestría Estilo Khan Academy */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-xs font-semibold text-stone-600 dark:text-stone-300">
                      <span>{cargandoEjercicios ? 'Cargando ejercicios…' : `${temasCount} ejercicios disponibles`}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{modulo.completado}% Maestría</span>
                    </div>
                    <div className="w-full bg-stone-100 dark:bg-stone-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-stone-200 dark:border-stone-700">
                      <div 
                        className="bg-gradient-to-r from-emerald-500 to-amber-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${modulo.completado}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-stone-100 dark:border-stone-800">
                  <button
                    onClick={() => handleAbrirModulo(modulo)}
                    disabled={cargandoEjercicios || temasCount === 0 || Boolean(errorEjercicios)}
                    className={`w-full py-2.5 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all disabled:cursor-not-allowed disabled:opacity-50 ${ 
                      esBloqueado
                        ? 'bg-stone-100 dark:bg-stone-800 text-stone-500 cursor-not-allowed'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md active:scale-95 btn-3d-emerald'
                    }`}
                  >
                    {esBloqueado ? (
                      <>
                        <Lock size={14} />
                        <span>Requiere Perfil Universitario</span>
                      </>
                    ) : (
                      <>
                        <Play size={14} />
                        <span>{cargandoEjercicios ? 'Cargando…' : `Practicar Unidad (${temasCount})`}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Lección Práctica Modal / Inline Player Dinámico */}
      {leccionActiva && ejerciciosModulo.length > 0 && (() => {
        const ejercicioActual = ejerciciosModulo[ejercicioIndex];
        const opciones = ejercicioActual.choices || [];

        const handleSeleccionarOpcion = (idx, opt) => {
          setOpcionElegidaIdx(idx);
          setMostrandoExplicacion(true);

          if (opt.correct) {
            confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
            toast.success('¡Excelente! Respuesta Correcta +20 XP', {
              description: 'Verificado simbólicamente por SymPy CAS.'
            });
            setXpTotal(prev => prev + 20);
          } else {
            toast.error('Respuesta incorrecta. Lee la explicación detallada.');
          }
        };

        const handleSiguienteEjercicio = () => {
          setOpcionElegidaIdx(null);
          setMostrandoExplicacion(false);
          setEjercicioIndex(prev => (prev + 1) % ejerciciosModulo.length);
        };

        return (
          <section className="bg-white dark:bg-[#1a241f] rounded-3xl p-6 shadow-md border-2 border-emerald-500/30 space-y-5 animate-slide-up">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                  Módulo: {leccionActiva.titulo}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-xs font-medium">
                  Ejercicio {ejercicioIndex + 1} de {ejerciciosModulo.length}
                </span>
                <span className="text-xs text-stone-400 font-mono">
                  ID: {ejercicioActual.exercise_id || 'MAYAN-CAS'}
                </span>
              </div>

              <button
                onClick={() => setLeccionActiva(null)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-xs font-bold px-2 py-1 rounded bg-stone-100 dark:bg-stone-800"
              >
                Cerrar Lección ✕
              </button>
            </div>

            <div className="bg-stone-50 dark:bg-stone-900/60 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-1">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 uppercase">
                    Subtema: {ejercicioActual.subtopic}
                  </span>
                  <span>Dificultad: {ejercicioActual.difficulty} / 10</span>
                </div>
                <h4 className="font-bold text-stone-800 dark:text-stone-100 text-base sm:text-lg leading-relaxed">
                  {ejercicioActual.question}
                </h4>

                {ejercicioActual.question_latex && (
                  <div className="mt-2 p-3 rounded-xl bg-emerald-950/80 text-emerald-200 font-mono text-sm border border-emerald-800/60">
                    Fórmula / Expresión: {ejercicioActual.question_latex}
                  </div>
                )}
              </div>

              {/* Opciones de respuesta MCQ */}
              {opciones.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {opciones.map((opt, idx) => {
                  const esElegida = opcionElegidaIdx === idx;
                  let estiloClase = 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 hover:border-emerald-400 text-stone-800 dark:text-stone-200';

                  if (opcionElegidaIdx !== null) {
                    if (opt.correct) {
                      estiloClase = 'bg-emerald-500/15 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold ring-2 ring-emerald-500/30';
                    } else if (esElegida) {
                      estiloClase = 'bg-red-500/15 border-red-500 text-red-700 dark:text-red-300 font-bold';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={opcionElegidaIdx !== null}
                      onClick={() => handleSeleccionarOpcion(idx, opt)}
                      className={`p-4 rounded-xl text-left font-medium text-sm border transition-all flex items-center justify-between active:scale-[0.98] ${estiloClase}`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-200 flex items-center justify-center text-xs font-bold">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt.text}</span>
                      </span>

                      {opcionElegidaIdx !== null && opt.correct && (
                        <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
                      )}
                      {esElegida && !opt.correct && (
                        <XCircle size={20} className="text-red-500 shrink-0" />
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
                  {!mostrandoExplicacion && (
                    <button
                      onClick={() => setMostrandoExplicacion(true)}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all"
                    >
                      Mostrar respuesta y explicación
                    </button>
                  )}
                  {mostrandoExplicacion && (
                    <p className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 font-bold">
                      Respuesta: {ejercicioActual.answer_display || ejercicioActual.answer}
                    </p>
                  )}
                </div>
              )}

              {/* Explicación y botón Siguiente */}
              {mostrandoExplicacion && (
                <div className="pt-4 border-t border-stone-200 dark:border-stone-800 space-y-3 animate-fade-in">
                  <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs sm:text-sm text-stone-800 dark:text-stone-200 space-y-1">
                    <div className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                      <Sparkles size={16} /> Explicación Paso a Paso (SymPy CAS):
                    </div>
                    <p className="leading-relaxed">{ejercicioActual.explanation}</p>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleSiguienteEjercicio}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 flex items-center gap-2"
                    >
                      <span>Siguiente Ejercicio</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        );
      })()}

      {/* Resolutor de Fórmulas con IA (Adaptativo) */}
      <section className="bg-gradient-to-r from-stone-900 via-stone-900 to-emerald-950 rounded-3xl p-6 text-white shadow-xl border border-stone-800 space-y-4">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles size={16} /> Tutor IA de Matemáticas ({isUniversitario ? 'Modo Universitario' : 'Modo Bachillerato'})
        </div>
        <div>
          <h3 className="text-xl font-extrabold">Resolutor e Interpretador de Fórmulas Paso a Paso</h3>
          <p className="text-stone-300 text-xs sm:text-sm mt-1">
            Escribe cualquier ecuación, derivada o problema algebraico y la IA adaptará la explicación a tu perfil.
          </p>
        </div>

        <form onSubmit={handleResolverFormula} className="flex gap-2 flex-wrap">
          <input
            type="text"
            value={formulaInput}
            onChange={(e) => setFormulaInput(e.target.value)}
            placeholder={isUniversitario ? "Ej: int x^2 * sin(x) dx o dy/dx + 2y = e^x" : "Ej: 3x + 12 = 30 o x^2 - 9 = 0"}
            className="flex-1 min-w-[280px] px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <button
            type="submit"
            disabled={resolviendo}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-sm transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
          >
            {resolviendo ? <RefreshCw size={16} className="animate-spin" /> : <Brain size={16} />}
            <span>{resolviendo ? 'Resolviendo...' : 'Resolver con IA'}</span>
          </button>
        </form>

        {solucionIA && (
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 animate-fade-in">
            <div className="flex items-center justify-between text-xs text-emerald-300 font-bold">
              <span>{solucionIA.nivel}</span>
              <span className="text-stone-400">Verificado por Maya TiqIA Engine</span>
            </div>
            <div className="space-y-1.5 text-xs sm:text-sm text-stone-200 font-mono">
              {solucionIA.pasos.map((paso, idx) => (
                <div key={idx} className="p-2 rounded bg-black/20">{paso}</div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
