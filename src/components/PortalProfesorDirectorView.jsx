import React, { useState } from 'react';
import { 
  UserCog, GraduationCap, Users, BookOpen, AlertTriangle, CheckCircle2, 
  TrendingUp, Download, Plus, FileText, Send, Sparkles, Search, ChevronRight,
  PieChart, BarChart3, Filter, Award, ShieldAlert, Mail
} from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

export default function PortalProfesorDirectorView({ onVolver }) {
  const [tabActiva, setTabActiva] = useState('profesor'); // 'profesor' | 'director'
  const [seccionSeleccionada, setSeccionSeleccionada] = useState('3_bach_a');
  
  // Estado de Asignador de Tareas
  const [materiaTarea, setMateriaTarea] = useState('algebra');
  const [numEjerciciosTarea, setNumEjerciciosTarea] = useState(15);
  const [fechaEntrega, setFechaEntrega] = useState('2026-10-05');

  const dispararConfeti = () => {
    confetti({
      particleCount: 60,
      spread: 50,
      origin: { y: 0.6 }
    });
  };

  const handleCrearTarea = (e) => {
    e.preventDefault();
    dispararConfeti();
    toast.success('¡Tarea / Desafío Asignado Exitosamente!', {
      description: `Se enviaron ${numEjerciciosTarea} ejercicios de ${materiaTarea.toUpperCase()} a la Sección 3º Bachillerato A.`
    });
  };

  const handleEnviarAlertaPadres = (estudianteNombre) => {
    toast.info(`Alerta enviada al Padre de Familia`, {
      description: `Se notificó a la familia de ${estudianteNombre} con recomendaciones de apoyo en casa.`
    });
  };

  // Datos simulados de mapa de calor de aula
  const temasHeatmap = [
    { tema: 'Aritmética y Razones', dominio: 88, estado: 'excelente' },
    { tema: 'Álgebra & Ecuaciones 2x2', dominio: 54, estado: 'critico' },
    { tema: 'Geometría y Pitágoras', dominio: 76, estado: 'bueno' },
    { tema: 'Teoría de Conjuntos & Venn', dominio: 82, estado: 'excelente' },
    { tema: 'Progresiones y Patrones', dominio: 61, estado: 'atencion' },
  ];

  // Datos simulados de alertas tempranas para el Director
  const alertasTempranas = [
    { id: 1, estudiante: 'Carlos Mendoza', grado: '3º Bachillerato A', racha: 1, promedio: 58, riesgo: 'Alto' },
    { id: 2, estudiante: 'Sofía Gutiérrez', grado: '2º Admisión PAA', racha: 0, promedio: 62, riesgo: 'Medio' },
    { id: 3, estudiante: 'Mateo Morales', grado: '3º Bachillerato B', racha: 2, promedio: 64, riesgo: 'Medio' },
  ];

  return (
    <div className="space-y-8 animate-stagger-in pb-12">
      {/* Encabezado Principal del Portal Institucional */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-amber-950 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <UserCog className="w-4 h-4 text-amber-400" />
              Módulo Institucional B2B · Maya TiqIA Campus Edition
            </div>
            
            <h1 className="text-3xl md:text-4xl font-black text-amber-300 tracking-tight">
              Portal del Profesor & Director
            </h1>
            
            <p className="text-emerald-100 text-sm md:text-base leading-relaxed">
              Monitorea el progreso de tus alumnos, detecta temas críticos en tiempo real, asigna tareas automatizadas con el banco de 1,000 ejercicios y conecta a la comunidad educativa.
            </p>
          </div>

          {/* Switch de Rol: Profesor vs Director */}
          <div className="bg-emerald-900/80 p-1.5 rounded-2xl border border-emerald-500/40 flex md:flex-col gap-2 shrink-0">
            <button
              onClick={() => setTabActiva('profesor')}
              className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all ${
                tabActiva === 'profesor'
                  ? 'bg-amber-400 text-stone-900 shadow-md scale-105'
                  : 'text-emerald-200 hover:bg-emerald-800'
              }`}
            >
              <UserCog size={16} />
              <span>👩‍🏫 Panel del Profesor</span>
            </button>

            <button
              onClick={() => setTabActiva('director')}
              className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all ${
                tabActiva === 'director'
                  ? 'bg-amber-400 text-stone-900 shadow-md scale-105'
                  : 'text-emerald-200 hover:bg-emerald-800'
              }`}
            >
              <GraduationCap size={16} />
              <span>🏛️ Dashboard Director</span>
            </button>
          </div>
        </div>
      </div>

      {/* 👩‍🏫 VISTA 1: PANEL DEL PROFESOR */}
      {tabActiva === 'profesor' && (
        <div className="space-y-8">
          {/* Tarjetas de Métricas de Aula */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-emerald-950/40 p-5 rounded-2xl border border-emerald-500/20 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-gray-500 dark:text-emerald-300 uppercase tracking-wider">Alumnos Activos</span>
                <h3 className="text-2xl font-extrabold text-emerald-800 dark:text-emerald-200 mt-1">32 / 32</h3>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Sección 3º A</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white dark:bg-emerald-950/40 p-5 rounded-2xl border border-emerald-500/20 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-gray-500 dark:text-emerald-300 uppercase tracking-wider">Promedio de Maestría</span>
                <h3 className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">74%</h3>
                <span className="text-[11px] text-amber-700 dark:text-amber-300 font-semibold">+6% vs mes anterior</span>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white dark:bg-emerald-950/40 p-5 rounded-2xl border border-emerald-500/20 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-gray-500 dark:text-emerald-300 uppercase tracking-wider">Tareas Entregadas</span>
                <h3 className="text-2xl font-extrabold text-teal-600 dark:text-teal-300 mt-1">94%</h3>
                <span className="text-[11px] text-teal-700 dark:text-teal-400 font-semibold">30 de 32 entregados</span>
              </div>
              <div className="p-3 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white dark:bg-emerald-950/40 p-5 rounded-2xl border border-emerald-500/20 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-gray-500 dark:text-emerald-300 uppercase tracking-wider">Tema Crítico</span>
                <h3 className="text-lg font-extrabold text-red-600 dark:text-red-400 mt-1 truncate max-w-[140px]">Álgebra 2x2</h3>
                <span className="text-[11px] text-red-500 font-semibold">54% de precisión</span>
              </div>
              <div className="p-3 rounded-xl bg-red-500/10 text-red-500">
                <AlertTriangle className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* MAPA DE CALOR DE COMPETENCIAS DEL AULA */}
            <div className="lg:col-span-2 bg-white dark:bg-emerald-950/30 rounded-3xl p-6 border border-emerald-500/20 shadow-lg space-y-6">
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                    <BarChart3 className="text-emerald-600" size={22} />
                    <span>Mapa de Calor de Competencias (Sección 3º A)</span>
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-emerald-200/70 mt-1">
                    Detecta automáticamente qué áreas requieren reforzamiento en la siguiente clase.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {temasHeatmap.map((item, idx) => {
                  let colorBarra = 'bg-emerald-500';
                  let textoBadge = 'Excelente';
                  if (item.estado === 'critico') {
                    colorBarra = 'bg-red-500';
                    textoBadge = '¡Reforzamiento Requerido!';
                  } else if (item.estado === 'atencion') {
                    colorBarra = 'bg-amber-500';
                    textoBadge = 'Atención';
                  }

                  return (
                    <div key={idx} className="space-y-1.5 p-3 rounded-2xl bg-gray-50 dark:bg-emerald-900/30 border border-emerald-500/10">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-gray-800 dark:text-emerald-100">{item.tema}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-stone-900 dark:text-white">{item.dominio}% Dominio</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full text-white font-bold ${colorBarra}`}>
                            {textoBadge}
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-emerald-950 h-3 rounded-full overflow-hidden p-0.5">
                        <div className={`${colorBarra} h-full rounded-full transition-all duration-500`} style={{ width: `${item.dominio}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button 
                  onClick={() => toast.info('Generando Examen PDF impreso con clave de respuesta...')}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 dark:bg-emerald-900 hover:bg-stone-200 dark:hover:bg-emerald-800 font-bold text-xs flex items-center gap-2 text-stone-800 dark:text-emerald-200 border border-stone-200 dark:border-emerald-700"
                >
                  <Download size={14} />
                  <span>Exportar Examen Impreso (PDF)</span>
                </button>
              </div>
            </div>

            {/* CREADOR Y ASIGNADOR DE TAREAS / DESAFÍOS */}
            <div className="bg-white dark:bg-emerald-950/30 rounded-3xl p-6 border border-emerald-500/20 shadow-lg space-y-6">
              <div className="border-b border-emerald-500/20 pb-3">
                <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                  <Send className="text-amber-500" size={18} />
                  <span>Asignar Tarea / Desafío</span>
                </h3>
                <p className="text-xs text-gray-500 dark:text-emerald-200/70 mt-1">
                  Usa los 1,000 ejercicios simbólicos para enviar una tarea automatizada.
                </p>
              </div>

              <form onSubmit={handleCrearTarea} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-emerald-200 uppercase tracking-wider block mb-1.5">
                    Materia / Unidad
                  </label>
                  <select 
                    value={materiaTarea} 
                    onChange={(e) => setMateriaTarea(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-emerald-900/60 border border-emerald-500/30 text-xs font-bold text-gray-800 dark:text-emerald-100"
                  >
                    <option value="aritmetica">Aritmética & Razones (200 ejercicios)</option>
                    <option value="algebra">Álgebra & Polinomios (200 ejercicios)</option>
                    <option value="geometria">Geometría & Trigonometría (200 ejercicios)</option>
                    <option value="conjuntos">Teoría de Conjuntos & Venn (200 ejercicios)</option>
                    <option value="progresiones">Progresiones & Patrones (200 ejercicios)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-emerald-200 uppercase tracking-wider block mb-1.5">
                    Cantidad de Ejercicios: <span className="text-amber-500 font-extrabold">{numEjerciciosTarea}</span>
                  </label>
                  <input 
                    type="range" 
                    min="5" 
                    max="30" 
                    value={numEjerciciosTarea} 
                    onChange={(e) => setNumEjerciciosTarea(parseInt(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-emerald-200 uppercase tracking-wider block mb-1.5">
                    Fecha Límite de Entrega
                  </label>
                  <input 
                    type="date" 
                    value={fechaEntrega} 
                    onChange={(e) => setFechaEntrega(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-emerald-900/60 border border-emerald-500/30 text-xs font-bold text-gray-800 dark:text-emerald-100"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md active:scale-95 transition-all btn-3d-emerald flex items-center justify-center gap-2"
                >
                  <Sparkles size={16} />
                  <span>Publicar Tarea a la Sección</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 🏛️ VISTA 2: DASHBOARD DEL DIRECTOR */}
      {tabActiva === 'director' && (
        <div className="space-y-8">
          {/* Métricas Institucionales Macro */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white p-6 rounded-3xl border border-emerald-500/30 shadow-xl space-y-2">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Matrícula Activa Institucional</span>
              <h3 className="text-3xl font-black text-amber-300">240 Estudiantes</h3>
              <p className="text-xs text-emerald-200">En 8 secciones (Bachillerato & Admisión PAA)</p>
            </div>

            <div className="bg-gradient-to-br from-teal-900 to-emerald-950 text-white p-6 rounded-3xl border border-teal-500/30 shadow-xl space-y-2">
              <span className="text-xs font-bold text-teal-300 uppercase tracking-wider">Rendimiento Promedio Institucional</span>
              <h3 className="text-3xl font-black text-amber-300">1,280 / 1,600 pts</h3>
              <p className="text-xs text-teal-200">Simulacro PAA Ponderado Global</p>
            </div>

            <div className="bg-gradient-to-br from-amber-950 to-emerald-950 text-white p-6 rounded-3xl border border-amber-500/30 shadow-xl space-y-2">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">Índice de Retención & Racha</span>
              <h3 className="text-3xl font-black text-amber-300">92.4%</h3>
              <p className="text-xs text-amber-200">Promedio de 4.8 días/semana conectados</p>
            </div>
          </div>

          {/* MÓDULO DE ALERTAS TEMPRANAS DE IA (CONEXIÓN A PADRES DE FAMILIA) */}
          <div className="bg-white dark:bg-emerald-950/30 rounded-3xl p-6 border border-emerald-500/20 shadow-lg space-y-6">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
              <div>
                <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                  <ShieldAlert className="text-amber-500" size={22} />
                  <span>Alertas Tempranas con IA (Prevención de Deserción y Reprobación)</span>
                </h3>
                <p className="text-xs text-gray-500 dark:text-emerald-200/70 mt-1">
                  Estudiantes detectados por la IA con bajo rendimiento o racha inactiva en los últimos 7 días.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-emerald-500/20 text-xs font-bold text-gray-500 dark:text-emerald-300 uppercase tracking-wider">
                    <th className="pb-3 px-3">Estudiante</th>
                    <th className="pb-3 px-3">Grado / Sección</th>
                    <th className="pb-3 px-3">Racha</th>
                    <th className="pb-3 px-3">Promedio PAA</th>
                    <th className="pb-3 px-3">Nivel Riesgo</th>
                    <th className="pb-3 px-3 text-right">Acción Familiar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-500/10 text-xs font-semibold text-gray-800 dark:text-emerald-100">
                  {alertasTempranas.map((est) => (
                    <tr key={est.id} className="hover:bg-emerald-500/5 transition-colors">
                      <td className="py-3 px-3 font-bold">{est.estudiante}</td>
                      <td className="py-3 px-3">{est.grado}</td>
                      <td className="py-3 px-3">{est.racha} días 🔥</td>
                      <td className="py-3 px-3 font-extrabold text-amber-600 dark:text-amber-400">{est.promedio}%</td>
                      <td className="py-3 px-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white ${est.riesgo === 'Alto' ? 'bg-red-500' : 'bg-amber-500'}`}>
                          Riesgo {est.riesgo}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => handleEnviarAlertaPadres(est.estudiante)}
                          className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-900 font-extrabold text-[11px] flex items-center gap-1.5 ml-auto transition-all active:scale-95"
                        >
                          <Mail size={12} />
                          <span>Notificar Padres</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
