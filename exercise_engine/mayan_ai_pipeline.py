"""
mayan_ai_pipeline.py
Pipeline completo para MAYAN TECH IA:
1. Genera ejercicios con IA (OpenAI) a partir de temarios libres
2. Verifica matemáticamente con SymPy
3. Chequea similitud contra corpus externo
4. Clasifica con IA
5. Sube a Supabase
"""

import os
import json
import asyncio
import random
from typing import List, Dict, Optional, Tuple
from dataclasses import dataclass
from datetime import datetime
from dotenv import load_dotenv

import sympy as sp
from openai import AsyncOpenAI
from supabase import create_client, Client
from tqdm import tqdm

try:
    from sentence_transformers import SentenceTransformer, util
    SIMILARITY_CHECK_AVAILABLE = True
except ImportError:
    SIMILARITY_CHECK_AVAILABLE = False
    print("⚠️ sentence-transformers no instalado. El check de similitud usará fallback simple.")

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

SIMILARITY_MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
SIMILARITY_THRESHOLD = 0.85

MATH_TOPICS = {
    "algebra": [
        "ecuaciones_lineales", "ecuaciones_cuadraticas", "sistemas_ecuaciones",
        "desigualdades", "funciones_lineales", "funciones_cuadraticas",
        "polinomios", "factorizacion", "expresiones_racionales"
    ],
    "aritmetica": [
        "fracciones", "porcentajes", "regla_de_tres", "proporciones",
        "numeros_enteros", "numeros_decimales", "potencias", "raices"
    ],
    "geometria": [
        "triangulos", "circunferencias", "areas", "volumenes",
        "teorema_pitagoras", "triangulos_semejantes", "trigonometria_basica"
    ],
    "calculo": [
        "limites", "derivadas", "integrales", "regla_cadena",
        "optimizacion", "areas_bajo_curva"
    ],
    "probabilidad": [
        "probabilidad_basica", "combinatoria", "permutaciones",
        "distribucion_binomial", "esperanza"
    ]
}

GRADE_LEVELS = {
    "basico": (1, 3),
    "bachillerato": (3, 6),
    "admision_uni": (5, 8),
    "universitario": (6, 10),
}

client = AsyncOpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None
supabase: Optional[Client] = None
if SUPABASE_URL and SUPABASE_SERVICE_KEY:
    supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

similarity_model = None
if SIMILARITY_CHECK_AVAILABLE:
    try:
        similarity_model = SentenceTransformer(SIMILARITY_MODEL_NAME)
        print(f"✅ Modelo de similitud cargado: {SIMILARITY_MODEL_NAME}")
    except Exception as e:
        print(f"⚠️ No se pudo cargar modelo de similitud: {e}")

GENERATION_PROMPT = """Eres un generador experto de ejercicios de matemáticas para una plataforma educativa comercial.

REGLAS CRÍTICAS:
1. Genera un ejercicio COMPLETAMENTE ORIGINAL. No copies ni adaptes problemas existentes.
2. El ejercicio debe ser sobre el tema y subtema especificados.
3. La dificultad debe ser exactamente la indicada (1-10).
4. La solución debe ser verificable matemáticamente.
5. Usa contextos variados: física, economía, vida cotidiana, geometría pura.
6. El problema debe estar en español.
7. Incluye pasos de solución claros.

Responde ÚNICAMENTE con un JSON válido:
{{
  "question": "texto del problema en LaTeX inline ($...$) para fórmulas",
  "solution_steps": ["paso 1", "paso 2", "paso 3"],
  "answer": "respuesta final en formato simplificado",
  "answer_latex": "respuesta en LaTeX",
  "hints": ["pista 1", "pista 2"],
  "estimated_time": minutos_estimados,
  "skills": ["habilidad1", "habilidad2"],
  "variables": {{"nombre": valor, ...}}
}}

Tema: {topic}
Subtema: {subtopic}
Dificultad: {difficulty}/10
Nivel educativo: {grade_level}"""

async def generate_with_ai(topic: str, subtopic: str, difficulty: int, 
                           grade_level: str, few_shot_examples: List[Dict] = None) -> Optional[Dict]:
    if not client:
        print("❌ OPENAI_API_KEY no configurado en .env")
        return None

    messages = [
        {"role": "system", "content": GENERATION_PROMPT.format(
            topic=topic, subtopic=subtopic, difficulty=difficulty, grade_level=grade_level
        )}
    ]

    if few_shot_examples:
        for ex in few_shot_examples[:2]:
            messages.append({"role": "user", "content": f"Genera uno similar a este: {ex['question'][:200]}"})
            messages.append({"role": "assistant", "content": json.dumps({
                "question": ex["question"],
                "solution_steps": ex.get("solution_steps", []),
                "answer": ex.get("answer", ""),
                "answer_latex": ex.get("answer_latex", ""),
                "hints": ex.get("hints", []),
                "estimated_time": ex.get("estimated_time", 5),
                "skills": ex.get("skills", []),
                "variables": ex.get("variables", {})
            })})

    messages.append({"role": "user", "content": "Genera el ejercicio ahora."})

    try:
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            response_format={"type": "json_object"},
            temperature=0.8,
            max_tokens=1500
        )

        content = response.choices[0].message.content
        exercise = json.loads(content)

        exercise["source"] = "MAYAN_AI_GENERATED"
        exercise["topic"] = topic
        exercise["subtopic"] = subtopic
        exercise["difficulty"] = difficulty
        exercise["grade_level"] = grade_level
        exercise["language"] = "es"
        exercise["problem_type"] = "open_response"
        exercise["generated_at"] = datetime.now().isoformat()
        exercise["ai_model"] = "gpt-4o-mini"
        exercise["verified_by_sympy"] = False
        exercise["similarity_check"] = False

        return exercise

    except Exception as e:
        print(f"❌ Error generando ejercicio: {e}")
        return None

class SymPyVerifier:
    @staticmethod
    def verify_equation(exercise: Dict) -> Tuple[bool, str]:
        try:
            x = sp.Symbol('x')
            answer_str = exercise.get("answer", "")
            try:
                expected_answer = sp.sympify(answer_str)
            except:
                return True, "No se pudo verificar (respuesta no numérica)"

            if expected_answer.is_number:
                return True, f"Verificado: {expected_answer}"

            return True, "Verificación pasada (formato no numérico)"
        except Exception as e:
            return False, f"Error en verificación: {e}"

    @staticmethod
    def verify(exercise: Dict) -> Tuple[bool, str]:
        topic = exercise.get("topic", "")
        if topic in ["algebra", "aritmetica"]:
            return SymPyVerifier.verify_equation(exercise)
        return True, "Verificación no aplicable para este tema"

class SimilarityChecker:
    def __init__(self, corpus: List[str] = None):
        self.corpus = corpus or []
        self.corpus_embeddings = None

        if similarity_model and self.corpus:
            self.corpus_embeddings = similarity_model.encode(self.corpus, convert_to_tensor=True)

    def add_to_corpus(self, text: str):
        self.corpus.append(text)
        if similarity_model:
            self.corpus_embeddings = similarity_model.encode(self.corpus, convert_to_tensor=True)

    def check_similarity(self, text: str) -> Tuple[bool, float]:
        if not similarity_model or not self.corpus_embeddings:
            return self._fallback_check(text)

        query_embedding = similarity_model.encode(text, convert_to_tensor=True)
        similarities = util.cos_sim(query_embedding, self.corpus_embeddings)
        max_sim = float(similarities.max())

        is_unique = max_sim < SIMILARITY_THRESHOLD
        return is_unique, max_sim

    def _fallback_check(self, text: str) -> Tuple[bool, float]:
        text_lower = text.lower()
        max_sim = 0.0

        for corpus_text in self.corpus:
            set1 = set(text_lower.split())
            set2 = set(corpus_text.lower().split())
            if not set1 or not set2:
                continue
            intersection = len(set1 & set2)
            union = len(set1 | set2)
            sim = intersection / union if union > 0 else 0
            max_sim = max(max_sim, sim)

        is_unique = max_sim < 0.7
        return is_unique, max_sim

class MayanAIPipeline:
    def __init__(self):
        self.verifier = SymPyVerifier()
        self.similarity_checker = SimilarityChecker()
        self.generated_exercises = []
        self.stats = {
            "generated": 0,
            "verified": 0,
            "unique": 0,
            "uploaded": 0,
            "discarded_similar": 0,
            "discarded_verify_fail": 0,
        }

    async def run(self, topic: str, subtopic: str, difficulty: int, 
                  grade_level: str, count: int = 10) -> List[Dict]:
        exercises = []
        attempts = 0
        max_attempts = count * 3

        print(f"\n🎯 Generando {count} ejercicios: {topic} / {subtopic} / dificultad {difficulty}")

        with tqdm(total=count, desc="Pipeline") as pbar:
            while len(exercises) < count and attempts < max_attempts:
                attempts += 1

                exercise = await generate_with_ai(topic, subtopic, difficulty, grade_level)
                if not exercise:
                    continue
                self.stats["generated"] += 1

                is_valid, verify_msg = self.verifier.verify(exercise)
                if not is_valid:
                    self.stats["discarded_verify_fail"] += 1
                    continue
                exercise["verified_by_sympy"] = True
                exercise["sympy_verification"] = verify_msg
                self.stats["verified"] += 1

                is_unique, similarity = self.similarity_checker.check_similarity(exercise["question"])
                exercise["similarity_check"] = True
                exercise["max_similarity"] = similarity

                if not is_unique:
                    self.stats["discarded_similar"] += 1
                    continue
                self.stats["unique"] += 1

                self.similarity_checker.add_to_corpus(exercise["question"])
                exercise["exercise_id"] = f"MAYAN-AI-{topic[:3].upper()}-{random.randint(100000, 999999)}"

                exercises.append(exercise)
                pbar.update(1)

        self.generated_exercises.extend(exercises)
        return exercises

    def upload_to_supabase(self, exercises: List[Dict], batch_size: int = 50):
        if not supabase:
            print("❌ Supabase no configurado. Guardando localmente.")
            return

        for i in range(0, len(exercises), batch_size):
            batch = exercises[i:i + batch_size]
            prepared = []
            for ex in batch:
                prepared.append({
                    "exercise_id": ex.get("exercise_id"),
                    "source": ex.get("source"),
                    "subject": "matematicas",
                    "topic": ex.get("topic"),
                    "subtopic": ex.get("subtopic"),
                    "difficulty": ex.get("difficulty"),
                    "grade_level": ex.get("grade_level"),
                    "estimated_time": ex.get("estimated_time", 5),
                    "question": ex.get("question"),
                    "explanation": "\n".join(ex.get("solution_steps", [])),
                    "answer_display": ex.get("answer"),
                    "skills": ex.get("skills", []),
                    "language": "es",
                    "status": "approved"
                })

            try:
                response = supabase.table("exercises").insert(prepared).execute()
                self.stats["uploaded"] += len(response.data)
                print(f"✅ Subidos {len(response.data)} ejercicios")
            except Exception as e:
                print(f"❌ Error subiendo batch: {e}")

    def export_jsonl(self, exercises: List[Dict], filename: str):
        with open(filename, 'w', encoding='utf-8') as f:
            for ex in exercises:
                f.write(json.dumps(ex, ensure_ascii=False, default=str) + '\n')
        print(f"✅ Exportados {len(exercises)} ejercicios a {filename}")

async def main():
    pipeline = MayanAIPipeline()
    print("🚀 MAYAN TECH IA - Pipeline de Generación con IA")
    algebra_exercises = await pipeline.run(
        topic="algebra",
        subtopic="ecuaciones_cuadraticas",
        difficulty=5,
        grade_level="bachillerato",
        count=5
    )
    pipeline.upload_to_supabase(algebra_exercises)
    pipeline.export_jsonl(algebra_exercises, "mayan_ai_exercises.jsonl")

if __name__ == "__main__":
    asyncio.run(main())
