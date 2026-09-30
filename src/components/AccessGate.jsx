import React, { useCallback, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

function formatExpiry(value) {
  return new Intl.DateTimeFormat('es', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(value));
}

function csvCell(value) {
  const safeValue = /^[=+\-@]/.test(value) ? `'${value}` : value;
  return `"${safeValue.replaceAll('"', '""')}"`;
}

function downloadCodes(codes) {
  const rows = [
    ['Código', 'Duración (días)', 'Grupo'],
    ...codes.map(({ code, duration_days, label }) => [
      code,
      String(duration_days),
      label,
    ]),
  ];
  const csv = `\uFEFF${rows.map(row => row.map(csvCell).join(',')).join('\r\n')}`;
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'pases-mayantech-una-sola-vez.csv';
  link.click();
  URL.revokeObjectURL(url);
}

export default function AccessGate({ children }) {
  const [session, setSession] = useState(null);
  const [access, setAccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [authMode, setAuthMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [notice, setNotice] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [passCount, setPassCount] = useState('20');
  const [durationDays, setDurationDays] = useState('7');
  const [passLabel, setPassLabel] = useState('Prueba inicial');
  const [issuedCodes, setIssuedCodes] = useState([]);

  const refreshAccess = useCallback(async () => {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    const currentSession = sessionData.session;
    setSession(currentSession);

    if (!currentSession) {
      setAccess(null);
      return;
    }

    const { data, error } = await supabase.rpc('get_my_access_status');
    if (error) throw error;
    setAccess(data);
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return undefined;
    }

    let mounted = true;
    const loadInitialSession = async () => {
      try {
        await refreshAccess();
      } catch (error) {
        if (mounted) setErrorMessage(error.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    void loadInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      window.setTimeout(() => {
        if (mounted) void loadInitialSession();
      }, 0);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [refreshAccess]);

  useEffect(() => {
    if (!session) return undefined;
    const refreshIfVisible = () => {
      if (document.visibilityState === 'visible') {
        void refreshAccess().catch(error => setErrorMessage(error.message));
      }
    };
    const interval = window.setInterval(refreshIfVisible, 30000);
    document.addEventListener('visibilitychange', refreshIfVisible);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', refreshIfVisible);
    };
  }, [session, refreshAccess]);

  const handleAuth = async (event) => {
    event.preventDefault();
    setBusy(true);
    setErrorMessage('');
    setNotice('');
    try {
      if (authMode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        if (!data.session) {
          setNotice('Cuenta creada. Revisa tu correo para confirmar el registro y luego inicia sesión.');
        } else {
          await refreshAccess();
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        await refreshAccess();
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setBusy(false);
    }
  };

  const handleRedeem = async (event) => {
    event.preventDefault();
    setBusy(true);
    setErrorMessage('');
    setNotice('');
    try {
      const { data, error } = await supabase.rpc('redeem_access_code', {
        p_code: code.trim(),
      });
      if (error) throw error;
      setNotice(`Pase activado hasta ${formatExpiry(data.access_until)}.`);
      setCode('');
      await refreshAccess();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setBusy(false);
    }
  };

  const handleCreateCodes = async (event) => {
    event.preventDefault();
    setBusy(true);
    setErrorMessage('');
    setNotice('');
    setIssuedCodes([]);
    try {
      const { data, error } = await supabase.rpc('create_access_codes', {
        p_count: Number(passCount),
        p_duration_days: Number(durationDays),
        p_label: passLabel.trim(),
      });
      if (error) throw error;
      setIssuedCodes(data || []);
      setNotice(`Se emitieron ${data?.length || 0} códigos. Esta es la única vez que se mostrarán.`);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setBusy(false);
    }
  };

  const handleSignOut = async () => {
    setBusy(true);
    setErrorMessage('');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setSession(null);
      setAccess(null);
      setIssuedCodes([]);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setBusy(false);
    }
  };

  if (!isSupabaseConfigured) {
    return (
      <AccessShell>
        <h1 className="text-2xl font-black text-emerald-800 dark:text-emerald-300">Configura el acceso a Maya TiqIA</h1>
        <p className="mt-3 text-stone-600 dark:text-stone-300">
          No se configuraron las variables <code>VITE_SUPABASE_URL</code> y <code>VITE_SUPABASE_ANON_KEY</code>.
          Añádelas en el entorno local y en las variables de compilación de Netlify.
        </p>
      </AccessShell>
    );
  }

  if (loading) {
    return <AccessShell><p className="text-stone-600 dark:text-stone-300">Comprobando sesión y acceso…</p></AccessShell>;
  }

  if (!session) {
    return (
      <AccessShell>
        <div className="mb-6">
          <p className="text-xs font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">Maya TiqIA</p>
          <h1 className="mt-2 text-3xl font-black text-stone-900 dark:text-white">Acceso para estudiantes, profesores y directores</h1>
          <p className="mt-2 text-sm text-stone-600 dark:text-stone-300">
            Regístrate con tu correo y crea tu propia contraseña, o inicia sesión si ya tienes una cuenta. Para entrar también necesitarás un código de acceso vigente.
          </p>
        </div>
        <div className="mb-5 grid grid-cols-2 gap-2 rounded-xl bg-stone-100 p-1 dark:bg-stone-800">
          {[
            ['signin', 'Iniciar sesión'],
            ['signup', 'Crear cuenta'],
          ].map(([mode, label]) => (
            <button
              key={mode}
              type="button"
              onClick={() => { setAuthMode(mode); setNotice(''); setErrorMessage(''); }}
              className={`rounded-lg px-3 py-2 text-sm font-bold ${authMode === mode ? 'bg-white text-emerald-800 shadow dark:bg-stone-700 dark:text-emerald-300' : 'text-stone-600 dark:text-stone-300'}`}
            >
              {label}
            </button>
          ))}
        </div>
        <form onSubmit={handleAuth} className="space-y-4">
          <label className="block text-sm font-bold text-stone-700 dark:text-stone-200">
            Correo electrónico
            <input
              required
              type="email"
              autoComplete="email"
              value={email}
              onChange={event => setEmail(event.target.value)}
              className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 font-normal dark:border-stone-700 dark:bg-stone-900"
            />
          </label>
          <label className="block text-sm font-bold text-stone-700 dark:text-stone-200">
            Contraseña
            <input
              required
              minLength={8}
              type="password"
              autoComplete={authMode === 'signup' ? 'new-password' : 'current-password'}
              value={password}
              onChange={event => setPassword(event.target.value)}
              className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 font-normal dark:border-stone-700 dark:bg-stone-900"
            />
          </label>
          <button disabled={busy} className="w-full rounded-xl bg-emerald-700 px-4 py-3 font-extrabold text-white hover:bg-emerald-600 disabled:opacity-60">
            {busy ? 'Procesando…' : authMode === 'signup' ? 'Crear cuenta' : 'Iniciar sesión'}
          </button>
        </form>
        <Feedback notice={notice} error={errorMessage} />
      </AccessShell>
    );
  }

  if (!access?.active) {
    return (
      <AccessShell>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">Cuenta</p>
            <h1 className="mt-2 text-2xl font-black text-stone-900 dark:text-white">Activa tu pase de acceso</h1>
            <p className="mt-2 text-sm text-stone-600 dark:text-stone-300">{session.user.email}</p>
          </div>
          <button onClick={handleSignOut} disabled={busy} className="rounded-lg px-3 py-2 text-sm font-bold text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800">
            Cerrar sesión
          </button>
        </div>

        <form onSubmit={handleRedeem} className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            required
            minLength={10}
            maxLength={100}
            autoComplete="off"
            value={code}
            onChange={event => setCode(event.target.value.toUpperCase())}
            placeholder="Ejemplo: MAYAN-..."
            className="min-w-0 flex-1 rounded-xl border border-stone-300 bg-white px-3 py-3 font-mono uppercase dark:border-stone-700 dark:bg-stone-900"
          />
          <button disabled={busy} className="rounded-xl bg-emerald-700 px-5 py-3 font-extrabold text-white hover:bg-emerald-600 disabled:opacity-60">
            Canjear código
          </button>
        </form>
        <p className="mt-3 text-xs text-stone-500 dark:text-stone-400">Cada código se canjea una vez y activa acceso por el plazo que definió quien lo emitió.</p>
        <Feedback notice={notice} error={errorMessage} />
        {access?.is_admin && <AdminPassPanel {...{ busy, passCount, setPassCount, durationDays, setDurationDays, passLabel, setPassLabel, issuedCodes, handleCreateCodes }} />}
      </AccessShell>
    );
  }

  return (
    <>
      <div className="fixed right-3 top-3 z-50 flex items-center gap-3 rounded-full border border-emerald-300 bg-white/95 px-4 py-2 text-xs font-bold text-emerald-800 shadow-lg backdrop-blur dark:border-emerald-800 dark:bg-stone-900/95 dark:text-emerald-300">
        <span>{access.is_admin ? 'Administrador' : `${access.days_remaining} días de acceso`}</span>
        <button onClick={handleSignOut} disabled={busy} className="underline underline-offset-2">Salir</button>
      </div>
      {access.is_admin && (
        <div className="fixed right-3 top-14 z-50">
          <details className="max-h-[80vh] w-[min(24rem,calc(100vw-1.5rem))] overflow-auto rounded-2xl border border-amber-300 bg-white shadow-xl dark:border-amber-800 dark:bg-stone-900">
            <summary className="cursor-pointer px-4 py-3 text-sm font-extrabold text-amber-800 dark:text-amber-300">Emitir pases de acceso</summary>
            <div className="p-4 pt-0">
              <AdminPassPanel {...{ busy, passCount, setPassCount, durationDays, setDurationDays, passLabel, setPassLabel, issuedCodes, handleCreateCodes }} />
            </div>
          </details>
        </div>
      )}
      {children}
    </>
  );
}

function AdminPassPanel({ busy, passCount, setPassCount, durationDays, setDurationDays, passLabel, setPassLabel, issuedCodes, handleCreateCodes }) {
  return (
    <section className="mt-7 border-t border-stone-200 pt-5 dark:border-stone-700">
      <h2 className="text-lg font-extrabold text-stone-900 dark:text-white">Emitir pases</h2>
      <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">Útiles para lotes pequeños hoy y nuevas cohortes o plazos más largos después.</p>
      <form onSubmit={handleCreateCodes} className="mt-4 grid gap-3 sm:grid-cols-3">
        <label className="text-xs font-bold text-stone-600 dark:text-stone-300">
          Cantidad
          <input required type="number" min="1" max="500" value={passCount} onChange={event => setPassCount(event.target.value)} className="mt-1 block w-full rounded-lg border border-stone-300 bg-white px-2.5 py-2 text-sm dark:border-stone-700 dark:bg-stone-900" />
        </label>
        <label className="text-xs font-bold text-stone-600 dark:text-stone-300">
          Días
          <input required type="number" min="1" max="36500" value={durationDays} onChange={event => setDurationDays(event.target.value)} className="mt-1 block w-full rounded-lg border border-stone-300 bg-white px-2.5 py-2 text-sm dark:border-stone-700 dark:bg-stone-900" />
        </label>
        <label className="text-xs font-bold text-stone-600 dark:text-stone-300">
          Grupo / motivo
          <input maxLength="120" value={passLabel} onChange={event => setPassLabel(event.target.value)} className="mt-1 block w-full rounded-lg border border-stone-300 bg-white px-2.5 py-2 text-sm dark:border-stone-700 dark:bg-stone-900" />
        </label>
        <button disabled={busy} className="rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-extrabold text-stone-950 hover:bg-amber-400 disabled:opacity-60 sm:col-span-3">
          {busy ? 'Procesando…' : 'Generar códigos de un solo uso'}
        </button>
      </form>
      {issuedCodes.length > 0 && (
        <div className="mt-4 space-y-3">
          <div className="rounded-lg bg-amber-50 p-3 text-xs font-semibold text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
            Guarda o descarga estos códigos ahora: no se almacenan en texto legible y no volverán a mostrarse.
          </div>
          <button onClick={() => downloadCodes(issuedCodes)} className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm font-bold dark:border-stone-700">
            Descargar CSV
          </button>
          <ul className="max-h-44 space-y-1 overflow-auto rounded-lg bg-stone-100 p-3 font-mono text-xs dark:bg-stone-800">
            {issuedCodes.map(({ code }) => <li key={code}>{code}</li>)}
          </ul>
        </div>
      )}
    </section>
  );
}

function Feedback({ notice, error }) {
  return (
    <>
      {notice && <p role="status" className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">{notice}</p>}
      {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800 dark:bg-red-950/40 dark:text-red-200">{error}</p>}
    </>
  );
}

function AccessShell({ children }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-100 px-4 py-8 dark:bg-[#0b1310]">
      <section className="w-full max-w-xl rounded-3xl border border-stone-200 bg-white p-6 shadow-xl dark:border-stone-800 dark:bg-[#141f1a] sm:p-8">
        {children}
      </section>
    </main>
  );
}
