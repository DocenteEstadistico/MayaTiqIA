#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createClient } from '@supabase/supabase-js';

const inputPath = resolve(process.argv[2] || 'src/data/ejercicios_base_1000.json');
const envPath = resolve('.env');
let localSupabaseUrl = '';
try {
  const envText = await readFile(envPath, 'utf8');
  const match = envText.match(/^\s*VITE_SUPABASE_URL\s*=\s*["']?([^"'\r\n]+)["']?\s*$/m);
  localSupabaseUrl = match?.[1]?.trim() || '';
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || localSupabaseUrl;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    'Configura VITE_SUPABASE_URL en .env (o SUPABASE_URL en el entorno) y SUPABASE_SERVICE_ROLE_KEY solo en el entorno de esta operación. No pongas la service role key en variables VITE ni en el frontend.'
  );
}

const exercises = JSON.parse(await readFile(inputPath, 'utf8'));
if (!Array.isArray(exercises) || exercises.length === 0) {
  throw new Error(`El archivo ${inputPath} no contiene una lista de ejercicios.`);
}

const requiredFields = ['exercise_id', 'topic', 'subtopic', 'question', 'answer', 'status'];
const ids = new Set();
const contentHashes = new Set();
for (const [index, exercise] of exercises.entries()) {
  const missing = requiredFields.filter(field => exercise[field] === undefined || exercise[field] === null);
  if (missing.length) {
    throw new Error(`Ejercicio ${index + 1} incompleto; faltan: ${missing.join(', ')}.`);
  }
  if (ids.has(exercise.exercise_id)) {
    throw new Error(`ID de ejercicio duplicado: ${exercise.exercise_id}.`);
  }
  ids.add(exercise.exercise_id);
  if (exercise.content_hash) {
    if (contentHashes.has(exercise.content_hash)) {
      throw new Error(`Huella content_hash duplicada: ${exercise.content_hash}.`);
    }
    contentHashes.add(exercise.content_hash);
  }
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const batchSize = 250;

for (let offset = 0; offset < exercises.length; offset += batchSize) {
  const batch = exercises.slice(offset, offset + batchSize);
  const { error } = await supabase
    .from('exercises')
    .upsert(batch, { onConflict: 'exercise_id' });
  if (error) {
    throw new Error(
      `No se pudo publicar el lote ${Math.floor(offset / batchSize) + 1}: ${error.message}`
    );
  }
  console.log(`Publicados ${Math.min(offset + batch.length, exercises.length)}/${exercises.length} ejercicios.`);
}

console.log(`Carga terminada: ${exercises.length} ejercicios en Supabase.`);
