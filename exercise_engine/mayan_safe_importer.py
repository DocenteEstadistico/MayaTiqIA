"""
mayan_safe_importer.py
Importador SEGURO para MAYAN TECH IA.
Solo descarga fuentes verificadas como libres para uso comercial:
- GSM8K (MIT License)
- OpenStax (CC BY 4.0)
- MIT MathNet (Open Source)
- Dominio público

NO descarga: Khan Academy (NC), MIT OCW (NC), MATH dataset (DMCA issues)
"""

import os
import json
from typing import List, Dict, Optional
from datetime import datetime
from dotenv import load_dotenv

from datasets import load_dataset
from supabase import create_client, Client
from tqdm import tqdm

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

supabase: Optional[Client] = None
if SUPABASE_URL and SUPABASE_SERVICE_KEY:
    supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

SAFE_SOURCES = {
    "gsm8k": {
        "name": "GSM8K",
        "license": "MIT",
        "hf_id": "openai/gsm8k",
        "config": "main",
        "split": "train",
        "commercial_use": True,
        "attribution_required": True,
        "attribution_text": "Ejercicios adaptados de GSM8K (OpenAI), licencia MIT",
        "subject": "matematicas",
        "topic": "aritmetica",
        "difficulty_range": (1, 3),
        "language": "en",
        "needs_translation": True,
    },
    "mathnet": {
        "name": "MIT MathNet",
        "license": "Open Source",
        "hf_id": "ShadenA/MathNet",
        "config": None,
        "split": "train",
        "commercial_use": True,
        "attribution_required": True,
        "attribution_text": "Problemas de MIT MathNet",
        "subject": "matematicas",
        "topic": "olimpiadas",
        "difficulty_range": (5, 10),
        "language": "en",
        "needs_translation": True,
    }
}

PROHIBITED_SOURCES = {
    "khan_academy": {"reason": "CC BY-NC-SA - No comercial"},
    "mit_ocw": {"reason": "CC BY-NC-SA - No comercial"},
    "brilliant": {"reason": "Copyright propietario"},
    "math_hendrycks": {"reason": "DMCA de AoPS/MAA"},
    "college_board": {"reason": "Copyright propietario"},
}

class SafeImporter:
    def __init__(self):
        self.imported_count = 0

    def validate_source(self, source_key: str) -> bool:
        if source_key in PROHIBITED_SOURCES:
            print(f"🚫 FUENTE PROHIBIDA: {source_key} ({PROHIBITED_SOURCES[source_key]['reason']})")
            return False
        return source_key in SAFE_SOURCES

    def import_gsm8k(self, max_items: Optional[int] = 100) -> List[Dict]:
        print("\n📥 Importando GSM8K...")
        dataset = load_dataset("openai/gsm8k", "main", split="train")
        if max_items:
            dataset = dataset.select(range(min(max_items, len(dataset))))

        exercises = []
        for item in tqdm(dataset, desc="GSM8K"):
            answer_text = item["answer"]
            answer_only = answer_text.split("####")[-1].strip() if "####" in answer_text else None

            exercises.append({
                "exercise_id": f"MAYAN-GSM8K-{len(exercises)}",
                "source": "GSM8K",
                "license": "MIT",
                "attribution": "Ejercicios adaptados de GSM8K (OpenAI), licencia MIT",
                "subject": "matematicas",
                "topic": "aritmetica",
                "subtopic": "problemas_palabra",
                "difficulty": 2,
                "grade_level": "basico",
                "estimated_time": 5,
                "question": item["question"],
                "explanation": answer_text,
                "answer_display": answer_only,
                "skills": ["comprension_lectora", "operaciones_basicas"],
                "language": "en",
                "status": "approved"
            })
        return exercises

    def upload_to_supabase(self, exercises: List[Dict], batch_size: int = 100):
        if not supabase:
            print("❌ Supabase no configurado")
            return

        for i in range(0, len(exercises), batch_size):
            batch = exercises[i:i + batch_size]
            try:
                response = supabase.table("exercises").insert(batch).execute()
                self.imported_count += len(response.data)
                print(f"✅ Subidos {len(response.data)} ejercicios a Supabase")
            except Exception as e:
                print(f"❌ Error: {e}")

    def export_jsonl(self, exercises: List[Dict], filename: str):
        with open(filename, 'w', encoding='utf-8') as f:
            for ex in exercises:
                f.write(json.dumps(ex, ensure_ascii=False, default=str) + '\n')
        print(f"✅ Exportados {len(exercises)} ejercicios a {filename}")

def main():
    importer = SafeImporter()
    print("🛡️ MAYAN TECH IA - Importador Seguro")
    gsm8k_exercises = importer.import_gsm8k(max_items=50)
    importer.upload_to_supabase(gsm8k_exercises)
    importer.export_jsonl(gsm8k_exercises, "mayan_gsm8k_imported.jsonl")

if __name__ == "__main__":
    main()
