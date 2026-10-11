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
  TrendingUp,
  Users,
} from 'lucide-react';
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

  return (
    <section className="space-y-6 animate-stagger-in">
      <div className="rounded-[2rem] border border-emerald-200/80 bg-gradient-to-br from-emerald-900 via-emerald-800 to-amber-500 p-6 shadow-xl shadow-emerald-950/10 text-white">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <button
              onClick={onVolver}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-emerald-50 ring-1 ring-white/20 transition hover:bg-white/15"
            >
              <ArrowRight size={14} className="rotate-180" />
              Volver al Dashboard
            </button>

            <div className="flex items-center gap-2 text-amber-200 text-xs font-bold uppercase tracking-[0.18em]">
              <Sparkles size={14} />
              <span>AgroTechIA</span>
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Cursos y red de especialistas del agro con IA y talento técnico
            </h1>

            <p className="max-w-2xl text-sm text-emerald-50/90 sm:text-base">
              AgroTechIA conecta egresados, asociaciones profesionales, ingenieros, técnicos y estudiantes para formar talento agrícola con visión digital, productiva y sostenible.
            </p>
          </div>

          <div className="flex min-w-[240px] flex-col gap-3">
            <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-400 px-5 py-3 text-sm font-black text-stone-900 shadow-lg shadow-amber-500/20 transition hover:-translate-y-0.5 hover:bg-amber-300">
              <BadgeCheck size={16} />
              Postular como instructor
            </button>
            <button className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10">
              <Users size={16} />
              Unirme a la red
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            { label: 'Cursos activos', value: `${summary.totalCourses}+`, icon: BookOpen },
            { label: 'Estudiantes conectados', value: `${(summary.totalStudents / 1000).toFixed(summary.totalStudents >= 1000 ? 1 : 0)}K`, icon: Users },
            { label: 'Especialistas aliados', value: `${summary.totalSpecialists}`, icon: Building2 },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <div className="mb-2 flex items-center gap-2 text-amber-200">
                <stat.icon size={16} />
                <span className="text-[11px] font-bold uppercase tracking-[0.12em]">{stat.label}</span>
              </div>
              <div className="text-2xl font-black">{stat.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.7fr_0.9fr]">
        <div className="rounded-[1.75rem] border border-emerald-200 bg-white p-5 shadow-sm dark:border-emerald-900 dark:bg-[#141f1a]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
                Curso destacado
              </p>
              <h2 className="mt-2 text-2xl font-black text-stone-900 dark:text-white">Programa del mes</h2>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Recomendado
            </span>
          </div>

          <div className="rounded-[1.5rem] border border-amber-200 bg-gradient-to-br from-amber-50 to-emerald-50 p-5 dark:border-amber-900/60 dark:from-[#1c2824] dark:to-[#14251d]">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-emerald-300 bg-emerald-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                Alianza Gremiada
              </span>
              <span className="rounded-full border border-amber-300 bg-amber-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-amber-800 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                IA aplicada
              </span>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h3 className="text-2xl font-black text-stone-900 dark:text-white">{featuredCourse.title}</h3>
                <p className="mt-2 max-w-xl text-sm text-stone-600 dark:text-stone-300">
                  {featuredCourse.description}
                </p>
              </div>
              <div className="flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-bold text-amber-800 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                <Star size={14} className="fill-current" />
                {Number(featuredCourse.rating ?? 0).toFixed(1)} / 5
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3 text-xs text-stone-700 dark:text-stone-200">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-1.5 font-semibold dark:bg-[#0f1714]">
                <Leaf size={12} />
                {categoryLabels[featuredCourse.category] || 'Agro'}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-1.5 font-semibold dark:bg-[#0f1714]">
                <MapPin size={12} />
                {featuredCourse.modules_count} módulos
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-1.5 font-semibold dark:bg-[#0f1714]">
                <Users size={12} />
                {featuredCourse.enrolled_count} estudiantes
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-emerald-200 bg-white p-5 shadow-sm dark:border-emerald-900 dark:bg-[#141f1a]">
          <div className="mb-4 flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
            <ShieldCheck size={18} />
            <h3 className="text-lg font-black">Red de especialistas</h3>
          </div>

          <div className="space-y-3">
            {specialists.map((especialista) => (
              <div key={especialista.name} className="rounded-2xl border border-stone-200 bg-stone-50 p-3 dark:border-stone-800 dark:bg-[#0f1714]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-stone-900 dark:text-white">{especialista.name}</p>
                    <p className="text-xs text-stone-500 dark:text-stone-300">{especialista.role}</p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2 py-1 text-[9px] font-black uppercase tracking-[0.15em] text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {especialista.association}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {especialista.specialties.map((tag) => (
                    <span key={tag} className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-bold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">Catálogo</p>
            <h2 className="mt-1 text-2xl font-black text-stone-900 dark:text-white">Cursos disponibles</h2>
          </div>
          <button className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-800 transition hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
            Ver todos
            <TrendingUp size={14} />
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {courses.map((curso) => (
            <article
              key={curso.id}
              className="rounded-[1.5rem] border border-stone-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-stone-800 dark:bg-[#141f1a]"
            >
              <div className="flex items-start justify-between gap-3">
                <span className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.15em] ${accentClasses[curso.accent]}`}>
                  {curso.badge}
                </span>
                {curso.is_featured && (
                  <span className="rounded-full bg-amber-100 px-2 py-1 text-[9px] font-black uppercase tracking-[0.15em] text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                    Destacado
                  </span>
                )}
              </div>

              <h3 className="mt-4 text-xl font-black text-stone-900 dark:text-white">{curso.title}</h3>
              <p className="mt-2 text-sm text-stone-600 dark:text-stone-300">{curso.description}</p>

              <div className="mt-4 space-y-3 text-sm text-stone-600 dark:text-stone-300">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold">Instructor</span>
                  <span className="text-right font-bold text-stone-900 dark:text-white">{curso.instructor_name}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold">Asociación</span>
                  <span className="text-right text-xs text-emerald-700 dark:text-emerald-300">{curso.association_badge}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold">Público</span>
                  <span className="text-right text-xs">{curso.target_audience[0]}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-stone-200 pt-3 dark:border-stone-800">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star size={14} className="fill-current" />
                  <span className="text-sm font-bold text-stone-900 dark:text-white">{curso.rating}</span>
                </div>
                <div className="text-right text-xs text-stone-500 dark:text-stone-400">
                  <div className="font-bold text-stone-900 dark:text-white">{curso.enrolled_count}</div>
                  <div>inscritos</div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-stone-600 dark:text-stone-300">
                <span>{curso.modules_count} módulos</span>
                <button className="inline-flex items-center gap-1.5 font-black text-emerald-700 transition hover:text-emerald-600 dark:text-emerald-300 dark:hover:text-emerald-200">
                  Ver curso
                  <ArrowRight size={14} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
