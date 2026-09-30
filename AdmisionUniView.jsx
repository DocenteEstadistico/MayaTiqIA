import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Target, BookOpen, Calculator, Sparkles, Award, 
  Clock, CheckCircle2, Play, AlertCircle, RefreshCw, BarChart2, ShieldCheck, ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';

export default function AdmisionUniView({ onVolver, onSeleccionarMateria }) {
  // Estado del simulador PAA en tiempo real
  const [simulacroActivo, setSimulacroActivo] = useState(false);
  const [preguntaActualIndex, setPreguntaActualIndex] = useState(0);
  const [respuestasUsuario, setRespuestasUsuario] = useState({});
  const [tiempoRestante, setTiempoRestante] = useState(120); // 2 minutos por pregunta
  const [simulacroFinalizado, setSimulacroFinalizado] = useState(false);
  const [puntajeProyectado, setPuntajeProyectado] = useState(1280);

  // Banco de preguntas de Admisión Universitaria (PAA / USAC)
  const preguntasSimulacro = [
    {
      id: 1,
      area: 'Razonamiento Matemático',
      enunciado: 'Si 2(x - 3) + 4 = 14, ¿cuál es el valor del término (x + 2)?',
      opciones: [
        { id: 'A', texto: '8' },
        { id: 'B', texto: '10' },
        { id: 'C', texto: '12' },
        { id: 'D', texto: '14' }
      ],
      correcta: 'B',
      explicacion: '2(x - 3) + 4 = 14 ➔ 2x - 6 + 4 = 14 ➔ 2x = 16 ➔ x = 8. Por lo tanto (x + 2) = 10.'
    },
    {
      id: 2,
      area: 'Razonamiento Verbal',
      enunciado: 'Selecciona el sinónimo contextual de la palabra destacada: "El argumento presentado por el ponente fue CONCLUDENTE".',
      opciones: [
        { id: 'A', texto: 'Ambiguo' },
        { id: 'B', texto: 'Convincente' },
        { id: 'C', texto: 'Extenso' },
        { id: 'D', texto: 'Superficial' }
      ],
      correcta: 'B',
      explicacion: 'Concludente se refiere a algo decisivo, irrebatible y convincente.'
    },
    {
      id: 3,
      area: 'Redacción Indirecta',
      enunciado: '¿Cuál de las siguientes oraciones presenta la redacción gramaticalmente correcta y sin redundancias?',
      opciones: [
        { id: 'A', texto: 'El resultado final definitivo se publicará mañana por la mañana.' },
        { id: 'B', texto: 'Los resultados se publicarán el día de mañana.' },
        { id: 'C', texto: 'Los resultados definitivos se publicarán mañana.' },
        { id: 'D', texto: 'El resultado final se va a publicar mañana en la mañana.' }
      ],
      correcta: 'C',
      explicacion: '"Resultado definitivo" evita la redundancia "resultado final definitivo" o "mañana por la mañana".'
    }
  ];

  // Timer para el simulacro activo
  useEffect(() => {
    let interval = null;
    if (simulacroActivo && !simulacroFinalizado && tiempoRestante > 0) {
      interval = setInterval(() => {
        setTiempoRestante(prev => prev - 1);
      }, 1000);
    } else if (tiempoRestante === 0 && simulacroActivo && !simulacroFinalizado) {
      handleFinalizarSimulacro();
    }
    return () => clearInterval(interval);
  }, [simulacroActivo, simulacroFinalizado, tiempoRestante]);

  const handleIniciarSimulacro = () => {
    setSimulacroActivo(true);
    setSimulacroFinalizado(false);
    setPreguntaActualIndex(0);
    setRespuestasUsuario({});
    setTiempoRestante(180); // 3 minutos totales
    toast.info('🚀 Simulacro PAA Oficial Iniciado', {
      description: 'Responde cada pregunta antes de que finalice el cronómetro.'
    });
  };

  const handleSeleccionarRespuesta = (opcionId) => {
    setRespuestasUsuario(prev => ({
      ...prev,
      [preguntaActualIndex]: opcionId
    }));
  };

  const handleSiguientePregunta = () => {
    if (preguntaActualIndex < preguntasSimulacro.length - 1) {
      setPreguntaActualIndex(prev => prev + 1);
    } else {
      handleFinalizarSimulacro();
    }
  };

  const handleFinalizarSimulacro = () => {
    setSimulacroFinalizado(true);
    let aciertos = 0;
    preguntasSimulacro.forEach((preg, idx) => {
      if (respuestasUsuario[idx] === preg.correcta) {
        aciertos += 1;
      }
    });

    const nuevoPuntaje = Math.round(800 + (aciertos / preguntasSimulacro.length) * 800);
    setPuntajeProyectado(nuevoPuntaje);

    if (aciertos === preguntasSimulacro.length) {
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      toast.success(`🎉 ¡Puntaje Perfecto! ${nuevoPuntaje} / 1600 PAA`, {
        description: 'Has superado con éxito el rango de admisión para Facultades de Alta Demanda.'
      });
    } else {
      toast.info(`Simulacro Completado: ${aciertos} de ${preguntasSimulacro.length} aciertos.`, {
        description: `Puntaje estimado de PAA: ${nuevoPuntaje} puntos.`
      });
    }
  };

  const formatTiempo = (segundos) => {
    const mins = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${mins}:${segs < 10 ? '0' : ''}${segs}`;
  };

  const areasEvaluacion = [
    {
      id: 'matem',
      titulo: 'Razonamiento Matemático',
      desc: 'Aritmética, Álgebra, Geometría Analítica e Interpretación de Datos.',
      icono: Calculator,
      ponderacion: '40% del Examen',
      dominio: 78,
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
    },
    {
      id: 'verbal',
      titulo: 'Razonamiento Verbal y Lectura',
      desc: 'Vocabulario contextual, analogías, deducción sintáctica y análisis crítico.',
      icono: BookOpen,
      ponderacion: '40% del Examen',
      dominio: 85,
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
    },
    {
      id: 'redaccion',
      titulo: 'Redacción Indirecta y Gramática',
      desc: 'Corrección de estilo, concordancia, puntuación y coherencia textual.',
      icono: Target,
      ponderacion: '20% del Examen',
      dominio: 90,
      color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header & Breadcrumb */}
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
            <span className="font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <Target size={16} /> Admisión Universitaria
            </span>
          </div>
        </div>

        {/* Badge Puntaje Proyectado */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-xs font-bold">
          <Award size={14} className="text-amber-500" />
          <span>Puntaje Proyectado PAA: {puntajeProyectado} / 1600 pts</span>
        </div>
      </div>

      {/* Hero Banner Admisión Universitaria */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-900 via-stone-900 to-emerald-950 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute right-0 top-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-medium backdrop-blur-md">
            📝 Entrenamiento Intensivo PAA / USAC / Landívar
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Asegura tu Lugar en la Universidad de tus Sueños
          </h2>
          <p className="text-amber-100/90 text-sm sm:text-base leading-relaxed">
            Módulos interactivos diseñados para maximizar tu puntaje en la Prueba de Aptitud Académica (PAA). Entrena con simulacros con tiempo real y diagnósticos IA.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
              <div className="text-xs text-amber-200">Días para el Examen</div>
              <div className="text-xl font-bold text-amber-300">⏳ 42 Días</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
              <div className="text-xs text-amber-200">Simulacros Realizados</div>
              <div className="text-xl font-bold text-emerald-300">8 / 12 Pruebas</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 col-span-2 sm:col-span-1">
              <div className="text-xs text-amber-200">Nivel de Probabilidad</div>
              <div className="text-xl font-bold text-cyan-300">92% Admisión Alta</div>
            </div>
          </div>
        </div>
      </div>

      {/* Áreas del Examen de Admisión */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 flex items-center gap-2">
            <BarChart2 className="text-amber-600 dark:text-amber-400" size={22} />
            <span>Áreas Evaluadas en la PAA</span>
          </h3>
          <span className="text-xs text-stone-500 dark:text-stone-400">3 áreas principales</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {areasEvaluacion.map((area) => (
            <div
              key={area.id}
              className="bg-white dark:bg-[#1a241f] p-5 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 flex flex-col justify-between hover:shadow-md transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-2xl border ${area.color}`}>
                    <area.icono size={24} />
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                    {area.ponderacion}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-stone-800 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {area.titulo}
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                    {area.desc}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium text-stone-500 dark:text-stone-400">
                    <span>Nivel de Dominio</span>
                    <span>{area.dominio}%</span>
                  </div>
                  <div className="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-amber-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${area.dominio}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                <button
                  onClick={() => {
                    if (area.id === 'matem') {
                      onSeleccionarMateria('mat');
                    } else {
                      toast.info(`Practicando área: ${area.titulo}`);
                    }
                  }}
                  className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
                >
                  <span>{area.id === 'matem' ? 'Ir a Matemáticas' : 'Practicar Preguntas'}</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Simulador Oficial PAA Cronometrado */}
      <section className="bg-white dark:bg-[#1a241f] rounded-3xl p-6 shadow-sm border border-stone-200 dark:border-stone-800 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl border border-emerald-500/20">
              <Clock size={26} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100">
                Simulacro Oficial PAA con Cronómetro
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Simulación con tiempo límite para entrenar velocidad de lectura y agilidad matemática.
              </p>
            </div>
          </div>

          <button
            onClick={handleIniciarSimulacro}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-sm transition-all active:scale-95 shadow-md"
          >
            <Play size={16} />
            <span>{simulacroActivo && !simulacroFinalizado ? 'Reiniciar Prueba' : 'Iniciar Simulacro Rápido'}</span>
          </button>
        </div>

        {/* Interfaz del Simulacro Activo */}
        {simulacroActivo && (
          <div className="bg-stone-50 dark:bg-stone-900/60 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-5 animate-slide-up">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                {preguntasSimulacro[preguntaActualIndex].area} (Pregunta {preguntaActualIndex + 1} de {preguntasSimulacro.length})
              </span>
              <div className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${
                tiempoRestante < 30 
                  ? 'bg-red-500/10 text-red-600 animate-pulse' 
                  : 'bg-amber-500/10 text-amber-700 dark:text-amber-300'
              }`}>
                <Clock size={14} />
                <span>Tiempo: {formatTiempo(tiempoRestante)}</span>
              </div>
            </div>

            {!simulacroFinalizado ? (
              <div className="space-y-4">
                <p className="text-base font-semibold text-stone-800 dark:text-stone-100">
                  {preguntasSimulacro[preguntaActualIndex].enunciado}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {preguntasSimulacro[preguntaActualIndex].opciones.map((opt) => {
                    const seleccionada = respuestasUsuario[preguntaActualIndex] === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSeleccionarRespuesta(opt.id)}
                        className={`p-3.5 rounded-xl text-left text-sm font-medium border transition-all flex items-center justify-between ${
                          seleccionada
                            ? 'bg-amber-500/10 border-amber-500 text-amber-900 dark:text-amber-300 font-bold ring-2 ring-amber-400'
                            : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 hover:border-amber-400 text-stone-800 dark:text-stone-200'
                        }`}
                      >
                        <span><strong>{opt.id})</strong> {opt.texto}</span>
                        {seleccionada && <CheckCircle2 size={18} className="text-amber-500" />}
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleSiguientePregunta}
                    disabled={!respuestasUsuario[preguntaActualIndex]}
                    className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs transition-all active:scale-95 flex items-center gap-1.5"
                  >
                    <span>{preguntaActualIndex === preguntasSimulacro.length - 1 ? 'Finalizar Examen' : 'Siguiente Pregunta'}</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 animate-fade-in">
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-base">¡Simulacro Concluido!</h4>
                    <p className="text-xs text-emerald-800 dark:text-emerald-300">
                      Puntaje PAA Proyectado: <strong>{puntajeProyectado} / 1600</strong>
                    </p>
                  </div>
                  <ShieldCheck size={32} className="text-emerald-500" />
                </div>

                <div className="space-y-3">
                  <h5 className="font-bold text-xs text-stone-600 dark:text-stone-400 uppercase">Retroalimentación detallada por pregunta:</h5>
                  {preguntasSimulacro.map((preg, idx) => {
                    const respondida = respuestasUsuario[idx];
                    const esCorrecta = respondida === preg.correcta;
                    return (
                      <div key={preg.id} className="p-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs space-y-1">
                        <div className="flex justify-between font-bold">
                          <span>{idx + 1}. {preg.area}</span>
                          <span className={esCorrecta ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}>
                            {esCorrecta ? '✓ Correcta' : '✗ Incorrecta'}
                          </span>
                        </div>
                        <p className="text-stone-600 dark:text-stone-300">{preg.explicacion}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Diagnóstico IA de Puntos Débiles */}
      <section className="bg-gradient-to-r from-stone-900 via-stone-900 to-amber-950 rounded-3xl p-6 text-white shadow-xl border border-stone-800 space-y-4">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles size={16} /> Diagnóstico Estratégico IA
        </div>
        <h3 className="text-xl font-extrabold">Recomendación IA para el Día del Examen</h3>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-amber-100 leading-relaxed space-y-2">
          <p>
            🔍 <strong>Análisis de Patrones:</strong> Has demostrado excelente velocidad en <em>Redacción Indirecta</em> (90% precisión). Tu mayor margen de mejora está en <em>Geometría Analítica y Sistemas de Ecuaciones</em>.
          </p>
          <p>
            💡 <strong>Estrategia Recomendada:</strong> Dedica 20 minutos diarios a resolver ejercicios de la materia de <strong>Matemáticas</strong> para asegurar un puntaje superior a 1,350 puntos en la PAA.
          </p>
        </div>
      </section>
    </div>
  );
}
