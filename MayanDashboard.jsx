import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Toaster, toast } from 'sonner';
import { useThesisSocket } from './hooks/useThesisSocket';
import { 
  BookOpen, Calculator, Languages, FlaskConical, Dna, Globe,
  UserCog, Wifi, WifiOff, Sun, Moon, Home, GraduationCap, ChevronRight,
  Flame, Star, Sparkles, Trophy, Sliders, Play, Award, Leaf
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
import AgroTechIA from './src/components/AgroTechIA';
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

const navItems = [
  { id: 'dashboard', label: 'Inicio', corto: 'Inicio', icono: Home },
  { id: 'matematicas', label: 'Rutas Matemáticas (1000)', corto: 'Matemáticas', icono: Calculator },
  { id: 'phet', label: 'Laboratorio PhET', corto: 'PhET', icono: FlaskConical },
  { id: 'admision', label: 'Simulacros PAA', corto: 'PAA', icono: GraduationCap },
  { id: 'agrotechia', label: 'AgroTechIA', corto: 'Agro', icono: Leaf },
  { id: 'universitario', label: 'Universitario & Tesis', corto: 'Universidad', icono: Award },
  { id: 'profesor_director', label: 'Profesor & Director', corto: 'Docentes', icono: UserCog },
];

export default function MayanDashboard() {
  const [perfilActual, setPerfilActual] = useState('universitario');
  const [materiaSeleccionada, setMateriaSeleccionada] = useState('mat');
  const [vistaActiva, setVistaActiva] = useState('dashboard'); // 'dashboard' | 'bachillerato' | 'universitario' | 'matematicas' | 'admision' | 'phet' | 'agrotechia'
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

      {/* Header general: marca, gamificación y navegación por módulos */}
      <header className="sticky top-0 z-20 border-b border-mayan bg-white/90 shadow-sm backdrop-blur-md dark:bg-[#141f1a]/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
          {/* Logo y Marca */}
          <button
            onClick={() => setVistaActiva('dashboard')}
            className="group flex min-w-0 items-center gap-3 rounded-2xl text-left"
            title="Volver al Inicio"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-amber-300/40 bg-mayan-gradient shadow-lg shadow-emerald-900/20 transition-transform group-hover:scale-105 group-active:scale-95">
              <span className="text-2xl font-extrabold tracking-tighter text-white">M</span>
            </span>
            <span className="min-w-0">
              <span className="flex items-center gap-2">
                <span className="truncate text-xl font-black tracking-tight text-emerald-800 sm:text-2xl dark:text-emerald-400">
                  Maya TIQIA
                </span>
                <span className="hidden rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-stone-900 sm:inline-block">
                  Progresivo
                </span>
              </span>
              <span className="hidden text-xs font-medium text-stone-500 sm:block dark:text-stone-400">
                Aprendizaje adaptativo con identidad maya
              </span>
            </span>
          </button>

          {/* Gamificación: racha, gemas, perfil y tema */}
          <div className="flex shrink-0 items-center gap-2">
            <div
              className="hidden items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-extrabold text-amber-700 sm:flex dark:text-amber-400"
              title="Racha de días seguidos"
            >
              <Flame className="h-4 w-4 fill-amber-500 text-amber-500" />
              <span>{rachaDias} días</span>
            </div>

            <div
              className="hidden items-center gap-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1.5 text-xs font-extrabold text-teal-700 sm:flex dark:text-teal-400"
              title="Estrellas acumuladas"
            >
              <Star className="h-4 w-4 fill-teal-500 text-teal-500" />
              <span>{gemasTotal}</span>
            </div>

            <div className="hidden items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-900 lg:flex dark:border-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-200">
              <UserCog size={15} className="text-emerald-700 dark:text-emerald-400" />
              <span>{perfilNombreActual}</span>
            </div>

            <button
              onClick={() => setIsDark(!isDark)}
              aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-stone-50 text-stone-700 transition-colors hover:bg-stone-100 active:scale-95 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700"
            >
              {isDark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-emerald-800" />}
            </button>
          </div>
        </div>

        {/* Barra de navegación por módulos (desplazable en móvil) */}
        <nav aria-label="Módulos de Maya TIQIA" className="border-t border-emerald-800/60 bg-emerald-900">
          <div className="no-scrollbar mx-auto flex max-w-7xl items-center gap-1.5 overflow-x-auto px-4 py-2">
            {navItems.map(({ id, label, corto, icono: Icono }) => (
              <button
                key={id}
                onClick={() => setVistaActiva(id)}
                aria-current={vistaActiva === id ? 'page' : undefined}
                className="maya-nav-tab"
              >
                <Icono size={15} aria-hidden="true" />
                <span className="sm:hidden">{corto}</span>
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </nav>
      </header>

      {/* Main Content: Renderiza la vista correspondiente */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
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

        {/* 3) Nueva vista de Agrocursos integrada dentro del dashboard principal sin romper el resto del flujo. */}
        {vistaActiva === 'agrotechia' && (
          <AgroTechIA
            onVolver={() => setVistaActiva('dashboard')}
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
          <div className="space-y-8 animate-stagger-in">
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-700 p-6 text-white shadow-xl shadow-emerald-950/10 sm:p-8">
              <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-amber-400/20 blur-3xl" />
              <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div className="max-w-2xl space-y-2">
                  <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-200">
                    <Sparkles size={14} aria-hidden="true" /> Tu espacio de aprendizaje
                  </p>
                  <h1 className="text-2xl font-black tracking-tight sm:text-3xl">¡Hola de nuevo! Sigamos aprendiendo hoy</h1>
                  <p className="text-sm text-emerald-50/90 sm:text-base" aria-live="polite">{mensajeMotivador}</p>
                </div>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {[
                    { label: 'Racha', value: `${rachaDias} días`, icon: Flame },
                    { label: 'Estrellas', value: gemasTotal, icon: Star },
                    { label: 'Perfil', value: perfilNombreActual?.replace(/^\S+\s/, ''), icon: Trophy },
                  ].map(({ label, value, icon: Icono }) => (
                    <div key={label} className="min-w-0 rounded-2xl border border-white/10 bg-white/10 px-3 py-2.5 backdrop-blur-sm">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-200">
                        <Icono size={12} aria-hidden="true" /> {label}
                      </div>
                      <div className="mt-0.5 truncate text-sm font-black sm:text-base">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

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
          </div>
        )}
      </main>
    </div>
  );
}