#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
MAYAN TECH IA · Script de Publicación Masiva de Ejercicios a Supabase
=====================================================================
Sube los 1,000 ejercicios de src/data/ejercicios_base_1000.json
directamente a la tabla 'exercises' de Supabase.

Uso:
  python publish_to_supabase.py
"""

import os
import json
from pathlib import Path
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_ANON_KEY")

PROJECT_ROOT = Path(__file__).resolve().parents[1]
EXERCISES_JSON = PROJECT_ROOT / "src" / "data" / "ejercicios_base_1000.json"

def upload_exercises():
    if not EXERCISES_JSON.exists():
        print(f"[ERROR] No se encontro el archivo {EXERCISES_JSON}")
        return

    if not SUPABASE_URL or not SUPABASE_KEY:
        print("[AVISO] Variables SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY no configuradas en .env")
        print("   Por favor completa tus credenciales de Supabase.")
        return

    try:
        from supabase import create_client, Client
    except ImportError:
        print("[ERROR] Falta la libreria 'supabase'. Ejecuta: pip install supabase")
        return

    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    with open(EXERCISES_JSON, "r", encoding="utf-8") as f:
        ejercicios = json.load(f)

    print(f"[INICIO] Cargando {len(ejercicios)} ejercicios a Supabase...")

    preparados = []
    for ex in ejercicios:
        row = {
            "exercise_id": ex.get("exercise_id") or ex.get("id") or f"ex_{ex['content_hash']}",
            "source": "mayan_generator",
            "license": "Proprietary / MayanTech",
            "subject": "matematicas",
            "topic": ex.get("topic", "aritmetica"),
            "subtopic": ex.get("subtopic", "general"),
            "difficulty": float(ex.get("difficulty", 5.0)),
            "grade_level": ex.get("grade_level", "bachillerato"),
            "profiles": ex.get("profiles", ["bachillerato", "universitario"]),
            "estimated_time": ex.get("estimated_time", 4),
            "question": ex.get("question", ""),
            "question_latex": ex.get("question_latex", ""),
            "choices": ex.get("choices", []),
            "correct_index": ex.get("correct_index", 0),
            "explanation": ex.get("explanation", ""),
            "skills": ex.get("skills", []),
            "language": ex.get("language", "es"),
            "status": "approved",
            "template_id": ex.get("template_id"),
            "content_hash": ex.get("content_hash")
        }
        preparados.append(row)

    # Insertar en lotes de 100
    batch_size = 100
    subidos = 0
    for i in range(0, len(preparados), batch_size):
        batch = preparados[i:i + batch_size]
        response = supabase.table("exercises").upsert(batch, on_conflict="content_hash").execute()
        subidos += len(batch)
        print(f"  [OK] Lote {i // batch_size + 1}: {subidos}/{len(preparados)} ejercicios procesados.")

    print("\n[EXITO] Publicacion completada exitosamente en Supabase!")

if __name__ == "__main__":
    upload_exercises()
