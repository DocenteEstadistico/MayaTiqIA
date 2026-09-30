import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Toaster, toast } from 'sonner';
import { useThesisSocket } from './hooks/useThesisSocket';
import { 
  BookOpen, Calculator, Languages, FlaskConical, Dna, Globe,
  UserCog, Wifi, WifiOff, Sun, Moon, Home, GraduationCap, ChevronRight,
  Flame, Star, Sparkles, Trophy, Sliders, Play, Award
} from 'lucide-react';

import PerfilSelector from './PerfilSelector';
import MateriasGrid from './MateriasGrid';
import ModosUso from './ModosUso';
import ProgresoReciente from './ProgresoReciente';
import IntegracionTesis from './IntegracionTesis';
import BachilleratoView from './BachilleratoView';
import UniversitarioView from './UniversitarioView';
import MatematicasView from './MatematicasView';
import AdmisionUniView from './AdmisionUniView';
import SimuladoresPhETView from './src/components/SimuladoresPhETView';
import PortalProfesorDirectorView from './src/components/PortalProfesorDirectorView';
import './mayan-theme.css';

const materias = [
  { id: 'mat', nombre: 'Matemáticas', icono: Calculator, color: 'bg-emerald-100' },
  { id: 'com', nombre: 'Comunicación', icono: BookOpen, color: 'bg-amber-100' },
  { id: 'ing', nombre: 'Inglés', icono: Languages, color: 'bg-sky-100' },
  { id: 'quim', nombre: 'Química', icono: FlaskConical, color: 'bg-purple-100' },
  { id: 'bio', nombre: 'Biología', icono: Dna, color: 'bg-green-100' },
  { id: 'chi', nombre: 'Chino', icono: Globe, color: 'bg-red-100' },
];

const perfiles = [
  { id: 'profesor', nombre: '👩‍🏫 Profesor', nivelBase: 5 },
  { id: 'alfabetizacion', nombre: '📖 Alfabetización', nivelBase: 0 },
  { id: 'basicos', nombre: '📚 Básicos / Primaria', nivelBase: 1 },
  { id: 'bachillerato', nombre: '🎓 Bachillerato', nivelBase: 2 },
  { id: 'tecnica', nombre: '🔧 Escuela Técnica', nivelBase: 2 },
  { id: 'admision', nombre: '📝 Admisión Uni', nivelBase: 3 },
  { id: 'universitario', nombre: '🧑‍🎓 Universitario', nivelBase: 4 },
  { id: 'tesista', nombre: '📄 Tesista', nivelBase: 4 },
];

const modos = [
  { id: 'diagnostico', nombre: '🚀 Diagnóstico rápido', descripcion: '10 preguntas, determina tu nivel' },
  { id: 'continuar', nombre: '📚 Continuar estudio', descripcion: 'Retoma tu última lección' },
  { id: 'tesis', nombre: '🤝 Tesis y Tutorías', descripcion: 'Abre la plataforma hermana' },
  { id: 'logros', nombre: '🏅 Mis logros', descripcion: 'Insignias y rachas' },
  { id: 'progreso', nombre: '📊 Progreso general', descripcion: 'Gráficas por materia' },
];

export default function MayanDashboard() {
  const [perfilActual, setPerfilActual] = useState('universitario');
  const [materiaSeleccionada, setMateriaSeleccionada] = useState('mat');
  const [vistaActiva, setVistaActiva] = useState('dashboard'); // 'dashboard' | 'bachillerato' | 'universitario' | 'matematicas' | 'admision' | 'phet'
  const [modoOnline, setModoOnline] = useState(true);
  
  // Gamificación estilo Matific / Khan Academy
  const [rachaDias] = useState(5);
  const [gemasTotal] = useState(140);
  
  // Manejo del estado del Dark Mode con persistencia en localStorage ("mayan_tema")
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('mayan_tema');
    if (saved !== null) {
      return saved === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [progreso] = useState({
    mat: { nivel: 4, avance: 80 },
    bio: { nivel: null, avance: 20, mensaje: 'Diagnóstico pendiente' },
    chi: { nivel: 2, avance: 50 },
  });
  const [mensajeMotivador, setMensajeMotivador] = useState('¡Juan! Llevas 5 días seguidos. ¡Sigue así!');
  
  const { isConnected, sendEvent } = useThesisSocket();

  // Sincronizar clase .dark en <html> y persistir en localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('mayan_tema', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('mayan_tema', 'light');
    }
  }, [isDark]);

  const dispararConfeti = () => {
    confetti({
      particleCount: 85,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#065f46', '#fbbf24', '#ffffff']
    });
  };

  const cambiarPerfil = (perfilId) => {
    setPerfilActual(perfilId);
    const nombre = perfiles.find(p => p.id === perfilId)?.nombre;
    toast.success(`Perfil cambiado a: ${nombre}`);

    // Si el usuario selecciona un perfil con portal dedicado, navegamos automáticamente
    if (perfilId === 'bachillerato') {
      toast.info('Ingresando al Portal de Bachillerato...', { description: 'Página especializada para educación media.' });
      setVistaActiva('bachillerato');
    } else if (perfilId === 'admision') {
      toast.info('Ingresando al Portal de Admisión Universitaria...', { description: 'Simulacros PAA y diagnóstico de examen.' });
      setVistaActiva('admision');
    } else if (perfilId === 'universitario' || perfilId === 'tesista') {
      toast.info('Ingresando al Portal Universitario...', { description: 'Página de educación superior e investigación.' });
      setVistaActiva('universitario');
    }
  };

  const seleccionarMateria = (materiaId) => {
    setMateriaSeleccionada(materiaId);
    const materia = materias.find(m => m.id === materiaId);
    
    if (materiaId === 'mat') {
      toast.info('Abriendo Portal Dedicado de Matemáticas...', {
        description: `Adaptado al perfil ${perfilActual === 'bachillerato' ? 'Bachillerato' : 'Universitario'}.`
      });
      setVistaActiva('matematicas');
    } else if (materia) {
      toast.info(`Materia seleccionada: ${materia.nombre}`);
    }
  };

  const abrirVistaPerfil = (perfilId) => {
    if (perfilId === 'bachillerato') {
      setVistaActiva('bachillerato');
    } else if (perfilId === 'admision') {
      setVistaActiva('admision');
    } else if (perfilId === 'universitario' || perfilId === 'tesista') {
      setVistaActiva('universitario');
    }
  };

  const ejecutarModo = (modoId) => {
    if (modoId === 'tesis') {
      setVistaActiva('universitario');
      toast.info('Navegando al Portal Universitario & Tesis');
    } else if (modoId === 'diagnostico') {
      if (perfilActual === 'admision') {
        setVistaActiva('admision');
      } else {
        const materiaNombre = materias.find(m => m.id === materiaSeleccionada)?.nombre || 'Matemáticas';
        dispararConfeti();
        toast.success(`¡Diagnóstico completado para ${materiaNombre}!`, {
          description: 'Has subido de nivel y obtenido una nueva insignia.'
        });
      }
    } else if (modoId === 'continuar') {
      if (materiaSeleccionada === 'mat') {
        setVistaActiva('matematicas');
      } else {
        toast.info(`Reanudando estudio de ${materiaSeleccionada}`);
      }
    } else if (modoId === 'logros') {
      dispararConfeti();
      toast.success('🏅 ¡Racha activa de 5 días! Insignia "Estudiante Constante" desbloqueada.');
    } else if (modoId === 'progreso') {
      toast.info('Visualizando reporte detallado de progreso por materias.');
    }
  };

  const notificarCompletado = () => {
    if (isConnected) {
      sendEvent('curso_completado', { 
        usuario: 'juan@email.com', 
        materia: materiaSeleccionada,
        nivel: progreso[materiaSeleccionada]?.nivel 
      });
      dispararConfeti();
      const msg = '✅ ¡Notificaste a Tesis y Tutorías! Tu tutor recibirá el aviso.';
      setMensajeMotivador(msg);
      toast.success(msg);
    } else {
      const msg = '⚠️ Sin conexión con Tesis. Los datos se sincronizarán más tarde.';
      setMensajeMotivador(msg);
      toast.warning(msg);
    }
  };

  const perfilNombreActual = perfiles.find(p => p.id === perfilActual)?.nombre;

  return (
    <div className="min-h-screen font-sans bg-[#FDF8F0] dark:bg-[#0b1310] text-[#374151] dark:text-[#e7f0eb] transition-colors duration-200">
      <Toaster position="top-center" richColors theme={isDark ? 'dark' : 'light'} />

      {/* Header General Reimaginado (Estilo Matific + Khan Academy) */}
      <header className="bg-white dark:bg-[#141f1a] shadow-md border-b border-mayan sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center flex-wrap gap-3">
          {/* Logo y Marca */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setVistaActiva('dashboard')}
              className="w-11 h-11 bg-mayan-gradient rounded-2xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform active:scale-95 border border-amber-300/40"
              title="Volver al Inicio"
            >
              <span className="text-white font-extrabold text-2xl tracking-tighter">M</span>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 
                  onClick={() => setVistaActiva('dashboard')}
                  className="text-xl sm:text-2xl font-black text-emerald-800 dark:text-emerald-400 tracking-tight cursor-pointer hover:opacity-80 transition-opacity"
                >
                  Maya TIQIA
                </h1>
                <span className="text-[10px] bg-amber-500 text-stone-900 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider hidden sm:inline-block shadow-xs">
                  Progresivo
                </span>
              </div>
            </div>
          </div>

          {/* Gamificación Top Bar: Racha, Gemas y Perfil */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Racha de Días 🔥 */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-extrabold shadow-xs">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-bounce" />
              <span>{rachaDias} Días</span>
            </div>

            {/* Gemas/Estrellas ⭐ */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-600 dark:text-teal-400 text-xs font-extrabold shadow-xs">
              <Star className="w-4 h-4 text-teal-500 fill-teal-500" />
              <span>{gemasTotal} ⭐</span>
            </div>

            {/* Toggle Dark Mode */}
            <button
              onClick={() => setIsDark(!isDark)}
              aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              className="flex items-center justify-center p-2 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 transition-all active:scale-95"
            >
              {isDark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-emerald-800" />}
            </button>

            {/* Badge Perfil Actual */}
            <div className="flex items-center gap-1.5 bg-emerald-100/80 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 px-3 py-1.5 rounded-full text-xs font-bold text-emerald-900 dark:text-emerald-200">
              <UserCog size={15} className="text-emerald-700 dark:text-emerald-400" />
              <span>{perfilNombreActual}</span>
            </div>
          </div>
        </div>

        {/* Tab Bar Superior de Navegación por Módulos */}
        <div className="bg-emerald-900 text-white px-4 py-2 border-t border-emerald-800/60 overflow-x-auto">
          <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs font-bold min-w-max">
            <button
              onClick={() => setVistaActiva('dashboard')}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
                vistaActiva === 'dashboard' ? 'bg-amber-400 text-stone-900 shadow-md' : 'hover:bg-emerald-800 text-emerald-100'
              }`}
            >
              <Home size={14} />
              <span>Inicio</span>
            </button>

            <button
              onClick={() => setVistaActiva('matematicas')}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
                vistaActiva === 'matematicas' ? 'bg-amber-400 text-stone-900 shadow-md' : 'hover:bg-emerald-800 text-emerald-100'
              }`}
            >
              <Calculator size={14} />
              <span>Rutas Matemáticas (1000)</span>
            </button>

            <button
              onClick={() => setVistaActiva('phet')}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
                vistaActiva === 'phet' ? 'bg-amber-400 text-stone-900 shadow-md' : 'hover:bg-emerald-800 text-emerald-100'
              }`}
            >
              <FlaskConical size={14} />
              <span>Laboratorio PhET Interactivo</span>
            </button>

            <button
              onClick={() => setVistaActiva('admision')}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
                vistaActiva === 'admision' ? 'bg-amber-400 text-stone-900 shadow-md' : 'hover:bg-emerald-800 text-emerald-100'
              }`}
            >
              <GraduationCap size={14} />
              <span>Simulacros PAA</span>
            </button>

            <button
              onClick={() => setVistaActiva('universitario')}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
                vistaActiva === 'universitario' ? 'bg-amber-400 text-stone-900 shadow-md' : 'hover:bg-emerald-800 text-emerald-100'
              }`}
            >
              <Award size={14} />
              <span>Portal Universitario & Tesis</span>
            </button>

            <button
              onClick={() => setVistaActiva('profesor_director')}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
                vistaActiva === 'profesor_director' ? 'bg-amber-400 text-stone-900 shadow-md' : 'hover:bg-emerald-800 text-emerald-100'
              }`}
            >
              <UserCog size={14} />
              <span>👩‍🏫 Portal Profesor & Director</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content: Renderiza la vista correspondiente */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {vistaActiva === 'profesor_director' && (
          <PortalProfesorDirectorView
            onVolver={() => setVistaActiva('dashboard')}
          />
        )}
        {vistaActiva === 'bachillerato' && (
          <BachilleratoView
            onVolver={() => setVistaActiva('dashboard')}
            onSeleccionarMateria={(materiaId) => {
              if (materiaId === 'mat') {
                setVistaActiva('matematicas');
              } else {
                toast.info(`Materia ${materiaId} seleccionada en Bachillerato`);
              }
            }}
          />
        )}

        {vistaActiva === 'admision' && (
          <AdmisionUniView
            onVolver={() => setVistaActiva('dashboard')}
            onSeleccionarMateria={(materiaId) => {
              if (materiaId === 'mat') {
                setVistaActiva('matematicas');
              } else {
                toast.info(`Materia ${materiaId} seleccionada en Admisión Uni`);
              }
            }}
          />
        )}

        {vistaActiva === 'universitario' && (
          <UniversitarioView
            onVolver={() => setVistaActiva('dashboard')}
            onSeleccionarMateria={(materiaId) => {
              if (materiaId === 'mat') {
                setVistaActiva('matematicas');
              } else {
                toast.info(`Materia ${materiaId} seleccionada en Universitario`);
              }
            }}
            isConnected={isConnected}
            sendEvent={sendEvent}
          />
        )}

        {vistaActiva === 'matematicas' && (
          <MatematicasView
            perfilActual={perfilActual}
            onVolver={() => setVistaActiva('dashboard')}
          />
        )}

        {vistaActiva === 'phet' && (
          <SimuladoresPhETView
            perfilActual={perfilActual}
            onVolver={() => setVistaActiva('dashboard')}
          />
        )}

        {vistaActiva === 'dashboard' && (
          <div className="space-y-6">
            <PerfilSelector 
              perfiles={perfiles} 
              perfilActual={perfilActual} 
              cambiarPerfil={cambiarPerfil}
              onAbrirVistaPerfil={abrirVistaPerfil} 
            />

            <MateriasGrid 
              materias={materias} 
              materiaSeleccionada={materiaSeleccionada} 
              seleccionarMateria={seleccionarMateria} 
              progreso={progreso} 
            />

            <ModosUso 
              modos={modos} 
              ejecutarModo={ejecutarModo} 
            />

            <ProgresoReciente 
              progreso={progreso} 
              materias={materias} 
              perfilNombre={perfilNombreActual} 
            />

            <IntegracionTesis 
              perfilActual={perfilActual} 
              isConnected={isConnected} 
              notificarCompletado={notificarCompletado} 
            />

            <div className="mt-8 text-center text-stone-600 dark:text-stone-300 text-sm italic bg-white dark:bg-[#1a241f] py-3.5 px-4 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800/60 transition-colors duration-200">
              💬 {mensajeMotivador}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}