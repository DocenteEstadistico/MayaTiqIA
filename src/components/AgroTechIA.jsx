import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Building2,
  Leaf,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const fallbackCursos = [
  {
    id: 'precision-agriculture',
    title: 'Agricultura de Precisión con IA',
    description:
      'Aprende a interpretar sensores, imágenes satelitales y datos de campo para optimizar riego, fertilización y manejo agronómico.',
    instructor_name: 'Ana Morales',
    association_badge: 'Asociación de Egresados Zamorano',
    target_audience: ['Estudiantes técnicos', 'Jóvenes agrónomos', 'Productores rurales'],
    enrolled_count: 420,
    rating: 4.9,
    modules_count: 6,
    category: 'agrotech',
    is_featured: true,
    badge: 'Alianza Gremiada',
    accent: 'emerald',
  },
  {
    id: 'soil-health',
    title: 'Salud del Suelo y Biofertilidad',
    description:
      'Explora prácticas de diagnóstico de suelo, manejo orgánico y recuperación de nutrientes para un modelo productivo sostenible.',
    instructor_name: 'Luis Cárdenas',
    association_badge: 'Red CATIE',
    target_audience: ['Técnicos agrícolas', 'Agrónomos', 'Estudiantes de ciencias aplicadas'],
    enrolled_count: 285,
    rating: 4.8,
    modules_count: 5,
    category: 'agronomy',
    is_featured: false,
    badge: 'Técnico Práctico',
    accent: 'amber',
  },
  {
    id: 'green-logistics',
    title: 'Logística Verde y Mercados Agrícolas',
    description:
      'Analiza cadenas de valor, calidad, trazabilidad y estrategia comercial para fortalecer emprendimientos agrícolas modernos.',
    instructor_name: 'Rosa Mejía',
    association_badge: 'Comité de Agrocursos',
    target_audience: ['Emprendedores', 'Técnicos de campo', 'Estudiantes de agroindustria'],
    enrolled_count: 312,
    rating: 4.7,
    modules_count: 4,
    category: 'agri-business',
    is_featured: false,
    badge: 'Emprendimiento',
    accent: 'teal',
  },
];

const fallbackEspecialistas = [
  {
    name: 'María Fernanda Rivera',
    role: 'Especialista en agroecología',
    association: 'Asociación de Egresados Zamorano',
    specialties: ['Suelo', 'Fertilidad', 'Sustentabilidad'],
  },
  {
    name: 'Javier Solís',
    role: 'Ingeniero agrónomo digital',
    association: 'Red CATIE',
    specialties: ['Agrotech', 'Sensores', 'Monitoreo'],
  },
  {
    name: 'Elena Torres',
    role: 'Mentora de emprendimiento agrícola',
    association: 'Alianza Gremiada',
    specialties: ['Mercados', 'Pymes', 'Innovación'],
  },
];

const accentClasses = {
  emerald: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/70',
  amber: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/70',
  teal: 'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800/70',
};

const categoryLabels = {
  agronomy: 'Agronomía',
  agrotech: 'Agrotech',
  'agri-business': 'Agronegocios',
};

const getBadgeByCategory = (category) => {
  if (category === 'agrotech') return 'Alianza Gremiada';
  if (category === 'agronomy') return 'Técnico Práctico';
  return 'Emprendimiento';
};

export default function AgroTechIA({ onVolver }) {
  const [courses, setCourses] = useState(fallbackCursos);
  const [specialists, setSpecialists] = useState(fallbackEspecialistas);
  const [loading, setLoading] = useState(true);
  const [usandoSupabase, setUsandoSupabase] = useState(false);
  const [categoriaActiva, setCategoriaActiva] = useState('todas');

  const featuredCourse = useMemo(
    () => courses.find((course) => course.is_featured) ?? courses[0] ?? fallbackCursos[0],
    [courses],
  );

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (!isSupabaseConfigured) {
        if (isMounted) {
          setCourses(fallbackCursos);
          setSpecialists(fallbackEspecialistas);
          setLoading(false);
        }
        return;
      }

      try {
        const [coursesResult, instructorsResult] = await Promise.all([
          supabase
            .from('courses')
            .select('*')
            .order('is_featured', { ascending: false })
            .order('created_at', { ascending: false }),
          supabase
            .from('instructors')
            .select('*')
            .order('is_verified', { ascending: false })
            .order('created_at', { ascending: false }),
        ]);

        if (coursesResult.error) {
          console.warn('No se pudo cargar la lista de cursos de AgroTechIA:', coursesResult.error.message);
        }

        if (instructorsResult.error) {
          console.warn('No se pudo cargar la red de especialistas de AgroTechIA:', instructorsResult.error.message);
        }

        if (isMounted) {
          const normalizedCourses = (coursesResult.data?.length ? coursesResult.data : fallbackCursos).map((course) => ({
            ...course,
            badge: course.badge || getBadgeByCategory(course.category),
            accent: course.accent || (course.category === 'agrotech' ? 'emerald' : course.category === 'agronomy' ? 'amber' : 'teal'),
            target_audience: Array.isArray(course.target_audience) ? course.target_audience : [course.target_audience || 'Estudiantes'],
            rating: Number(course.rating ?? 4.5),
            enrolled_count: Number(course.enrolled_count ?? 0),
            modules_count: Number(course.modules_count ?? 0),
            is_featured: Boolean(course.is_featured),
          }));

          const normalizedSpecialists = (instructorsResult.data?.length ? instructorsResult.data : fallbackEspecialistas).map((instructor) => ({
            name: instructor.full_name || instructor.name || 'Especialista',
            role: instructor.role || 'Especialista',
            association: instructor.association_badge || instructor.association || 'Asociación de Egresados',
            specialties: Array.isArray(instructor.specialties) ? instructor.specialties : ['Agro', 'Tecnología', 'Innovación'],
          }));

          setCourses(normalizedCourses);
          setSpecialists(normalizedSpecialists);
          setUsandoSupabase(Boolean(coursesResult.data?.length));
        }
      } catch (error) {
        console.warn('AgroTechIA fallback activado:', error.message);
        if (isMounted) {
          setCourses(fallbackCursos);
          setSpecialists(fallbackEspecialistas);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const summary = useMemo(() => ({
    totalCourses: courses.length,
    totalStudents: courses.reduce((acc, course) => acc + Number(course.enrolled_count || 0), 0),
    totalSpecialists: specialists.length,
  }), [courses, specialists]);

  const categorias = useMemo(
    () => ['todas', ...new Set(courses.map((course) => course.category).filter(Boolean))],
    [courses],
  );

  const cursosFiltrados = useMemo(
    () => (categoriaActiva === 'todas' ? courses : courses.filter((course) => course.category === categoriaActiva)),
    [courses, categoriaActiva],
  );

  const formatoCompacto = (valor) =>
    new Intl.NumberFormat('es', { notation: 'compact', maximumFractionDigits: 1 }).format(valor);

  const avisarProximamente = (accion) => {
    toast.info(`${accion}: disponible muy pronto`, {
      description: 'Estamos preparando este flujo dentro de AgroTechIA.',
    });
  };

  const iniciales = (nombre) =>
    nombre
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((parte) => parte[0])
      .join('')
      .toUpperCase();

  return (
    <section className="space-y-8 animate-stagger-in">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-700 p-6 text-white shadow-xl shadow-emerald-950/10 sm:p-8">
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-amber-400/25 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <button
              onClick={onVolver}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-emerald-50 ring-1 ring-white/20 transition hover:bg-white/20"
            >
              <ArrowRight size={14} className="rotate-180" />
              Volver al Dashboard
            </button>

            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-200">
              <Sparkles size={14} />
              <span>AgroTechIA</span>
            </div>

            <h1 className="text-2xl font-black leading-tight tracking-tight sm:text-4xl">
              Cursos y red de especialistas del agro con IA y talento técnico
            </h1>

            <p className="text-sm text-emerald-50/90 sm:text-base">
              AgroTechIA conecta egresados, asociaciones profesionales, ingenieros, técnicos y estudiantes para formar talento agrícola con visión digital, productiva y sostenible.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <button
              onClick={() => avisarProximamente('Postulación de instructores')}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-400 px-5 py-3 text-sm font-black text-stone-900 shadow-lg shadow-amber-900/20 transition hover:-translate-y-0.5 hover:bg-amber-300"
            >
              <BadgeCheck size={16} />
              Postular como instructor
            </button>
            <button
              onClick={() => avisarProximamente('Registro en la red')}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/15"
            >
              <Users size={16} />
              Unirme a la red
            </button>
          </div>
        </div>

        <div className="relative mt-6 grid grid-cols-3 gap-2 sm:gap-3">
          {[
            { label: 'Cursos activos', value: summary.totalCourses, icon: BookOpen },
            { label: 'Estudiantes', value: formatoCompacto(summary.totalStudents), icon: Users },
            { label: 'Especialistas', value: summary.totalSpecialists, icon: Building2 },
          ].map((stat) => (
            <div key={stat.label} className="min-w-0 rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-sm sm:p-4">
              <div className="mb-1 flex items-center gap-1.5 text-amber-200">
                <stat.icon size={14} aria-hidden="true" />
                <span className="truncate text-[10px] font-bold uppercase tracking-[0.12em] sm:text-[11px]">{stat.label}</span>
              </div>
              <div className="text-xl font-black sm:text-2xl">{loading ? '—' : stat.value}</div>
            </div>
          ))}
        </div>
      </div>

      {!loading && !usandoSupabase && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200"
        >
          <Sparkles size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          <p>
            <strong>Catálogo de muestra.</strong> Estás viendo cursos y especialistas de ejemplo mientras se publica el catálogo oficial.
          </p>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        {/* Curso destacado */}
        <div className="maya-card p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="maya-eyebrow">Curso destacado</p>
              <h2 className="mt-1 maya-section-title">Programa del mes</h2>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Recomendado
            </span>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-emerald-50 p-5 dark:border-amber-900/60 dark:from-[#1c2824] dark:to-[#14251d]">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.15em] ${accentClasses[featuredCourse.accent] || accentClasses.emerald}`}>
                {featuredCourse.badge}
              </span>
              <span className="rounded-full border border-amber-300 bg-amber-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-amber-800 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                IA aplicada
              </span>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h3 className="text-xl font-black text-stone-900 sm:text-2xl dark:text-white">{featuredCourse.title}</h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-stone-600 dark:text-stone-300">
                  {featuredCourse.description}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1 self-start rounded-full border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-bold text-amber-800 md:self-auto dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                <Star size={14} className="fill-current" />
                {Number(featuredCourse.rating ?? 0).toFixed(1)} / 5
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2 text-xs text-stone-700 dark:text-stone-200">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-1.5 font-semibold dark:bg-[#0f1714]">
                <Leaf size={12} />
                {categoryLabels[featuredCourse.category] || 'Agro'}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-1.5 font-semibold dark:bg-[#0f1714]">
                <BookOpen size={12} />
                {featuredCourse.modules_count} módulos
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-1.5 font-semibold dark:bg-[#0f1714]">
                <Users size={12} />
                {featuredCourse.enrolled_count} estudiantes
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-1.5 font-semibold dark:bg-[#0f1714]">
                <MapPin size={12} />
                {featuredCourse.association_badge}
              </span>
            </div>
          </div>
        </div>

        {/* Red de especialistas */}
        <div className="maya-card p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="maya-section-icon">
              <ShieldCheck size={18} aria-hidden="true" />
            </span>
            <div>
              <p className="maya-eyebrow">Comunidad</p>
              <h2 className="maya-section-title">Red de especialistas</h2>
            </div>
          </div>

          <ul className="space-y-3">
            {specialists.map((especialista) => (
              <li key={especialista.name} className="rounded-2xl border border-stone-200 bg-stone-50 p-3 transition-colors hover:border-emerald-300 dark:border-stone-800 dark:bg-[#0f1714] dark:hover:border-emerald-800">
                <div className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 text-sm font-black text-white"
                  >
                    {iniciales(especialista.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-stone-900 dark:text-white">{especialista.name}</p>
                    <p className="text-xs text-stone-500 dark:text-stone-300">{especialista.role}</p>
                    <p className="mt-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">{especialista.association}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {especialista.specialties.map((tag) => (
                    <span key={tag} className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-bold capitalize text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Catálogo */}
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="maya-eyebrow">Catálogo</p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-stone-900 dark:text-white">Cursos disponibles</h2>
          </div>
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="group" aria-label="Filtrar cursos por categoría">
            {categorias.map((categoria) => {
              const activa = categoriaActiva === categoria;
              return (
                <button
                  key={categoria}
                  onClick={() => setCategoriaActiva(categoria)}
                  aria-pressed={activa}
                  className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-black transition-colors ${
                    activa
                      ? 'border-emerald-700 bg-emerald-700 text-white'
                      : 'border-emerald-200 bg-white text-emerald-800 hover:bg-emerald-50 dark:border-emerald-800 dark:bg-[#141f1a] dark:text-emerald-300 dark:hover:bg-emerald-950/40'
                  }`}
                >
                  {categoria === 'todas' ? 'Todos' : categoryLabels[categoria] || categoria}
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="maya-card h-72 animate-pulse bg-stone-100 dark:bg-[#141f1a]" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cursosFiltrados.map((curso) => (
              <article
                key={curso.id}
                className="maya-card flex flex-col p-5 transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg dark:hover:border-emerald-700"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.15em] ${accentClasses[curso.accent] || accentClasses.emerald}`}>
                    {curso.badge}
                  </span>
                  {curso.is_featured && (
                    <span className="rounded-full bg-amber-100 px-2 py-1 text-[9px] font-black uppercase tracking-[0.15em] text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                      Destacado
                    </span>
                  )}
                </div>

                <h3 className="mt-4 text-lg font-black leading-snug text-stone-900 dark:text-white">{curso.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-stone-600 dark:text-stone-300">{curso.description}</p>

                <dl className="mt-4 space-y-2 text-sm text-stone-600 dark:text-stone-300">
                  <div className="flex items-center justify-between gap-2">
                    <dt className="font-semibold">Instructor</dt>
                    <dd className="text-right font-bold text-stone-900 dark:text-white">{curso.instructor_name}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <dt className="font-semibold">Asociación</dt>
                    <dd className="text-right text-xs text-emerald-700 dark:text-emerald-300">{curso.association_badge}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <dt className="font-semibold">Público</dt>
                    <dd className="text-right text-xs">{curso.target_audience[0]}</dd>
                  </div>
                </dl>

                <div className="mt-auto pt-4">
                  <div className="flex items-center justify-between border-t border-stone-200 pt-3 text-xs text-stone-500 dark:border-stone-800 dark:text-stone-400">
                    <span className="inline-flex items-center gap-1 text-sm font-bold text-stone-900 dark:text-white">
                      <Star size={14} className="fill-amber-400 text-amber-400" />
                      {Number(curso.rating).toFixed(1)}
                    </span>
                    <span>{curso.modules_count} módulos</span>
                    <span>
                      <strong className="text-stone-900 dark:text-white">{curso.enrolled_count}</strong> inscritos
                    </span>
                  </div>

                  <button
                    onClick={() => avisarProximamente(`Curso "${curso.title}"`)}
                    className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-black text-white transition hover:bg-emerald-600 active:scale-[0.98]"
                  >
                    Ver curso
                    <ArrowRight size={14} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
