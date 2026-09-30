import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(
  supabaseUrl || 'https://supabase-not-configured.invalid',
  supabaseAnonKey || 'supabase-not-configured'
);

/**
 * Registra un intento de ejercicio en la tabla 'attempts' de Supabase
 */
export async function registrarIntentoSupabase({ studentId, exerciseId, response, correct, timeSeconds, stepsPartial }) {
  try {
    const { data, error } = await supabase
      .from('attempts')
      .insert([
        {
          student_id: studentId,
          exercise_id: exerciseId,
          response: response,
          correct: correct,
          time_seconds: timeSeconds,
          steps_partial: stepsPartial
        }
      ]);

    if (error) {
      console.warn('⚠️ Nota: Guardado local activo (Supabase no conectado aún):', error.message);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.warn('⚠️ Error de conexión Supabase:', err.message);
    return { success: false, error: err };
  }
}
