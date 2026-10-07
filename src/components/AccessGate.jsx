import React, { useCallback, useEffect, useRef, useState } from 'react';
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
  const [recoveryMode, setRecoveryMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [code, setCode] = useState('');
  const [notice, setNotice] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [passCount, setPassCount] = useState('20');
  const [durationDays, setDurationDays] = useState('7');
  const [passLabel, setPassLabel] = useState('Prueba inicial');
  const [issuedCodes, setIssuedCodes] = useState([]);
  const accountPanelRef = useRef(null);

  const refreshAccess = useCallback(async () => {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    const currentSession = sessionData.session;
    setSession(currentSession);

    if (!currentSession) {
      setAccess(null);
      window.dispatchEvent(new Event('maya-access-updated'));
      return;
    }

    const { data, error } = await supabase.rpc('get_my_access_status');
    if (error) throw error;
    setAccess(data);
    window.dispatchEvent(new Event('maya-access-updated'));
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setRecoveryMode(true);
        if (accountPanelRef.current) accountPanelRef.current.open = true;
      }
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

  useEffect(() => {
    const openAccountPanel = () => {
      if (accountPanelRef.current) accountPanelRef.current.open = true;
    };
    window.addEventListener('maya-open-account', openAccountPanel);
    return () => window.removeEventListener('maya-open-account', openAccountPanel);
  }, []);

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

  const handlePasswordRecovery = async () => {
    setBusy(true);
    setErrorMessage('');
    setNotice('');
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: window.location.origin,
      });
      if (error) throw error;
      setNotice('Si existe una cuenta con ese correo, recibirás un enlace para restablecer la contraseña. Revisa también la carpeta de spam.');
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setBusy(false);
    }
  };

  const handleUpdatePassword = async (event) => {
    event.preventDefault();
    setBusy(true);
    setErrorMessage('');
    setNotice('');
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setRecoveryMode(false);
      setNewPassword('');
      setNotice('Contraseña actualizada. Ya puedes iniciar sesión con tu nueva contraseña.');
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

  return (
    <>
      {children}
      <div className="fixed right-3 top-3 z-50">
        <details
          ref={accountPanelRef}
          className="max-h-[85vh] w-[min(24rem,calc(100vw-1.5rem))] overflow-auto rounded-2xl border border-emerald-300 bg-white/95 shadow-xl backdrop-blur dark:border-emerald-800 dark:bg-stone-900/95"
        >
          <summary className="cursor-pointer list-none px-4 py-3 text-right text-xs font-extrabold text-emerald-800 dark:text-emerald-300">
            {loading ? 'Comprobando cuenta…' : session ? 'Mi cuenta' : 'Crear cuenta / Iniciar sesión'}
          </summary>
          <div className="p-4 pt-0">
            {!isSupabaseConfigured ? (
              <p className="text-sm text-stone-600 dark:text-stone-300">
                El acceso todavía no está configurado. Añade <code>VITE_SUPABASE_URL</code> y <code>VITE_SUPABASE_ANON_KEY</code> en el entorno local y en Netlify.
              </p>
            ) : loading ? (
              <p role="status" className="text-sm text-stone-600 dark:text-stone-300">Comprobando sesión…</p>
            ) : recoveryMode ? (
              <>
                <p className="mb-4 text-sm text-stone-600 dark:text-stone-300">
                  Elige una nueva contraseña para tu cuenta.
                </p>
                <form onSubmit={handleUpdatePassword} className="space-y-3">
                  <label className="block text-sm font-bold text-stone-700 dark:text-stone-200">
                    Nueva contraseña
                    <input
                      required
                      minLength={8}
                      type="password"
                      autoComplete="new-password"
                      value={newPassword}
                      onChange={event => setNewPassword(event.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 font-normal dark:border-stone-700 dark:bg-stone-900"
                    />
                  </label>
                  <button disabled={busy} className="w-full rounded-xl bg-emerald-700 px-4 py-3 font-extrabold text-white hover:bg-emerald-600 disabled:opacity-60">
                    {busy ? 'Guardando…' : 'Guardar nueva contraseña'}
                  </button>
                </form>
              </>
            ) : !session ? (
              <>
                <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl bg-stone-100 p-1 dark:bg-stone-800">
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
                <form onSubmit={handleAuth} className="space-y-3">
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
                    {busy ? 'Procesando…' : authMode === 'signup' ? 'Crear cuenta gratuita' : 'Iniciar sesión'}
                  </button>
                  {authMode === 'signin' && (
                    <button
                      type="button"
                      disabled={busy || !email.trim()}
                      onClick={handlePasswordRecovery}
                      className="w-full rounded-lg px-3 py-2 text-sm font-bold text-emerald-800 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50 dark:text-emerald-300 dark:hover:bg-stone-800"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  )}
                </form>
              </>
            ) : (
              <>
                <p className="text-sm text-stone-600 dark:text-stone-300">{session.user.email}</p>
                <p className="mt-1 text-sm font-bold text-emerald-800 dark:text-emerald-300">
                  {access?.is_admin ? 'Administrador' : access?.active ? `${access.days_remaining} días de acceso completo` : 'Cuenta gratuita · 10 ejercicios de muestra por tema'}
                </p>
                {!access?.active && (
                  <form onSubmit={handleRedeem} className="mt-4 space-y-3">
                    <label className="block text-sm font-bold text-stone-700 dark:text-stone-200">
                      ¿Ya tienes una clave de acceso?
                      <input
                        required
                        minLength={10}
                        maxLength={100}
                        autoComplete="off"
                        value={code}
                        onChange={event => setCode(event.target.value.toUpperCase())}
                        placeholder="MAYAN-…"
                        className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 font-mono uppercase dark:border-stone-700 dark:bg-stone-900"
                      />
                    </label>
                    <button disabled={busy} className="w-full rounded-xl bg-emerald-700 px-4 py-2.5 font-extrabold text-white hover:bg-emerald-600 disabled:opacity-60">
                      {busy ? 'Procesando…' : 'Activar acceso completo'}
                    </button>
                  </form>
                )}
                <button onClick={handleSignOut} disabled={busy} className="mt-4 w-full rounded-lg px-3 py-2 text-sm font-bold text-stone-600 hover:bg-stone-100 disabled:opacity-60 dark:text-stone-300 dark:hover:bg-stone-800">
                  Cerrar sesión
                </button>
              </>
            )}
            <Feedback notice={notice} error={errorMessage} />
            {session && access?.is_admin && (
              <AdminPassPanel {...{ busy, passCount, setPassCount, durationDays, setDurationDays, passLabel, setPassLabel, issuedCodes, handleCreateCodes }} />
            )}
          </div>
        </details>
      </div>
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
