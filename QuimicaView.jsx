import React, { useState, useMemo } from 'react';
import {
  ArrowLeft, FlaskConical, Sparkles, Trophy, Brain, Zap,
  BookOpen, Atom, Table2, TestTube, Beaker, ChevronRight, Play, Lock
} from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import ModuloDedicadoView from './src/components/ModuloDedicadoView';
import ejerciciosData from './src/data/ejercicios_quimica_1000.json';

const MODULOS = [
  {
    id: 'mediciones',
    titulo: 'I. Mediciones Fundamentales',
    desc: 'Conversiones de volumen (L, mL, cc), masa (kg, g, mg), temperatura (F, C, K) y densidad de líquidos.',
    topicKey: 'mediciones_fundamentales',
    icono: Beaker,
    color: 'from-sky-500 to-cyan-600',
    completado: 0,
    nivelRequerido: 'basico',
  },
  {
    id: 'materia',
    titulo: 'II. Materia',
    desc: 'Clasificación de sustancias, estados físicos, propiedades físicas y químicas, cambios y Ley de Conservación de la Masa.',
    topicKey: 'materia',
    icono: TestTube,
    color: 'from-purple-500 to-violet-600',
    completado: 0,
    nivelRequerido: 'basico',
  },
  {
    id: 'elementos',
    titulo: 'III. Elementos y Átomos',
    desc: 'Nombres y símbolos de los primeros 57 elementos, partículas subatómicas, isótopos y masas atómicas.',
    topicKey: 'elementos_atomos',
    icono: Atom,
    color: 'from-emerald-500 to-teal-600',
    completado: 0,
    nivelRequerido: 'basico',
  },
  {
    id: 'tabla',
    titulo: 'IV. Tabla Periódica',
    desc: 'Familias, períodos, metales / no metales / metaloides, iones, cationes, aniones y masa molar.',
    topicKey: 'tabla_periodica',
    icono: Table2,
    color: 'from-amber-500 to-orange-600',
    completado: 0,
    nivelRequerido: 'basico',
  },
  {
    id: 'nomenclatura',
    titulo: 'V. Nomenclatura Inorgánica',
    desc: 'Número de oxidación, compuestos binarios (Clásico, Estequiométrico y Stock), oxoácidos, hidróxidos y sales.',
    topicKey: 'nomenclatura',
    icono: FlaskConical,
    color: 'from-rose-500 to-red-600',
    completado: 0,
    nivelRequerido: 'basico',
  },
];

const SUBTEMA_LABELS = {
  conversion_volumen: 'Conversiones de Volumen',
  conversion_masa: 'Conversiones de Masa',
  temperatura: 'Temperatura',
  densidad: 'Densidad',
  clasificacion_materia: 'Clasificación de la Materia',
  estados_fisicos: 'Estados Físicos',
  propiedades_fisico_quimicas: 'Propiedades Físicas y Químicas',
  cambios_fisico_quimicos: 'Cambios Físicos y Químicos',
  ley_conservacion_masa: 'Ley de Conservación de la Masa',
  simbolos_nombres: 'Símbolos y Nombres',
  particulas_subatomicas: 'Partículas Subatómicas',
  isotopos: 'Isótopos',
  masas_atomicas: 'Masas Atómicas',
  ubicacion_tabla: 'Ubicación en la Tabla',
  metales_no_metales_metaloides: 'Metales, No Metales y Metaloides',
  iones_cationes_aniones: 'Iones, Cationes y Aniones',
  masa_molar: 'Masa Molar',
  numero_oxidacion: 'Número de Oxidación',
  compuestos_binarios: 'Compuestos Binarios (3 Sistemas)',
  nomenclatura_ternaria: 'Nomenclatura Ternaria',
};

export default function QuimicaView({ perfilActual = 'bachillerato', onVolver }) {
  const [moduloActivo, setModuloActivo] = useState(null);
  const [ejerciciosModulo, setEjerciciosModulo] = useState([]);
  const [xpTotal, setXpTotal] = useState(0);
  const [subtemaFiltro, setSubtemaFiltro] = useState(null);

  // Construir índice de ejercicios por topic (cargado desde JSON local)
  const ejerciciosPorTopic = useMemo(() => {
    const idx = {};
    for (const e of ejerciciosData) {
      if (!idx[e.topic]) idx[e.topic] = [];
      idx[e.topic].push(e);
    }
    return idx;
  }, []);

  const conteosPorTopic = useMemo(() => {
    const c = {};
    for (const [k, v] of Object.entries(ejerciciosPorTopic)) c[k] = v.length;
    return c;
  }, [ejerciciosPorTopic]);

  const subtemasPorTopic = useMemo(() => {
    const s = {};
    for (const [topic, lista] of Object.entries(ejerciciosPorTopic)) {
      const subs = {};
      for (const e of lista) {
        subs[e.subtopic] = (subs[e.subtopic] || 0) + 1;
      }
      s[topic] = subs;
    }
    return s;
  }, [ejerciciosPorTopic]);

  const handleAbrirModulo = (modulo, subtema = null) => {
    let lista = ejerciciosPorTopic[modulo.topicKey] || [];
    if (subtema) lista = lista.filter(e => e.subtopic === subtema);
    if (lista.length === 0) {
      toast.error('No hay ejercicios para este subtema.');
      return;
    }
    // Mezclar para variedad
    const mezclados = [...lista].sort(() => Math.random() - 0.5);
    setModuloActivo(modulo);
    setEjerciciosModulo(mezclados);
    setSubtemaFiltro(subtema);
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
    toast.info(`Módulo: ${modulo.titulo}`, {
      description: `${mezclados.length} ejercicios${subtema ? ` de "${SUBTEMA_LABELS[subtema]}"` : ''} cargados.`
    });
  };

  if (moduloActivo) {
    return (
      <ModuloDedicadoView
        modulo={moduloActivo}
        ejercicios={ejerciciosModulo}
        onVolver={() => { setModuloActivo(null); setSubtemaFiltro(null); }}
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
          <div className="h-6 w-px bg-stone-300 dark:bg-stone-700 hidden sm:block" />
          <div className="flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400">
            <span>Inicio</span><span>/</span>
            <span className="font-semibold text-purple-700 dark:text-purple-400 flex items-center gap-1">
              <FlaskConical size={16} /> Química
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-xs font-bold">
            <Trophy size={14} className="text-amber-500" />
            <span>{xpTotal} XP</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-300 text-xs font-bold">
            <span>981 ejercicios disponibles</span>
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900 via-violet-900 to-indigo-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-medium">
            ✨ Química Inorgánica · Guía Temática Odontología
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Domina la Química Inorgánica
          </h2>
          <p className="text-purple-100/90 text-sm sm:text-base leading-relaxed">
            981 ejercicios organizados en los 5 temas de la prueba específica: Mediciones, Materia,
            Elementos y Átomos, Tabla Periódica y Nomenclatura con los 3 sistemas (Clásico, Estequiométrico y Stock).
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
            {MODULOS.map(m => {
              const count = conteosPorTopic[m.topicKey] || 0;
              return (
                <div key={m.id} className="rounded-xl bg-white/10 p-2 text-center">
                  <div className="text-lg font-black">{count}</div>
                  <div className="text-[10px] text-purple-200 leading-tight mt-0.5">{m.titulo.split('.')[1]?.trim()}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Módulos */}
      <div className="space-y-6">
        <h3 className="text-xl font-extrabold text-stone-800 dark:text-stone-100 flex items-center gap-2">
          <Brain size={22} className="text-purple-600" />
          Módulos Temáticos
        </h3>
        <div className="grid gap-6">
          {MODULOS.map((modulo) => {
            const count = conteosPorTopic[modulo.topicKey] || 0;
            const subs = subtemasPorTopic[modulo.topicKey] || {};
            const Icono = modulo.icono;
            return (
              <div
                key={modulo.id}
                className="bg-white dark:bg-[#1a241f] rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden"
              >
                {/* Cabecera del módulo */}
                <div className={`bg-gradient-to-r ${modulo.color} p-5 text-white`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-white/20">
                        <Icono size={22} />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-base sm:text-lg">{modulo.titulo}</h4>
                        <p className="text-white/80 text-xs sm:text-sm mt-0.5 max-w-lg">{modulo.desc}</p>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="text-2xl font-black">{count}</div>
                      <div className="text-white/70 text-xs">ejercicios</div>
                    </div>
                  </div>
                  {/* Botón practicar todo el módulo */}
                  <button
                    onClick={() => handleAbrirModulo(modulo)}
                    className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-sm transition-all active:scale-95"
                  >
                    <Play size={16} />
                    Practicar módulo completo ({count} ejercicios)
                    <ChevronRight size={16} />
                  </button>
                </div>

                {/* Subtemas */}
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {Object.entries(subs).map(([sub, cnt]) => (
                    <button
                      key={sub}
                      onClick={() => handleAbrirModulo(modulo, sub)}
                      className="flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 hover:bg-purple-50 dark:hover:bg-purple-900/30 border border-stone-200 dark:border-stone-700 text-left transition-all group active:scale-95"
                    >
                      <div>
                        <div className="text-sm font-semibold text-stone-800 dark:text-stone-100 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
                          {SUBTEMA_LABELS[sub] || sub}
                        </div>
                        <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">{cnt} ejercicios</div>
                      </div>
                      <ChevronRight size={16} className="text-stone-400 group-hover:text-purple-500 shrink-0 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Estadísticas del banco */}
      <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 rounded-2xl border border-purple-200 dark:border-purple-800 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={18} className="text-purple-600" />
          <h4 className="font-extrabold text-purple-900 dark:text-purple-300">Banco de Ejercicios — Guía Odontología</h4>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total ejercicios', value: '981' },
            { label: 'Temas cubiertos', value: '5' },
            { label: 'Subtemas', value: '20' },
            { label: 'Dificultades', value: '1.0 – 2.1' },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white dark:bg-purple-950/40 rounded-xl p-3 text-center border border-purple-200 dark:border-purple-800">
              <div className="text-2xl font-black text-purple-800 dark:text-purple-300">{value}</div>
              <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-4">
          Ejercicios generados con el sistema de plantillas inteligentes MayaTiqIA.
          Cubre todos los temas de la Guía Temática Facultad de Odontología — Ciencias Naturales y Exactas.
        </p>
      </div>
    </div>
  );
}
