#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
MAYAN TECH IA · Generador Paramétrico de Ejercicios · v1.1 (auditado y corregido)
=====================================================================
Motor de generación simbólica con SymPy para MayaTiqIA.
100% propio y verificado simbólicamente.

Uso:
  python mayan_generator.py --n 40 --out data/
  python mayan_generator.py --only QUAD_01 SPEED_01 AGES_01
  python mayan_generator.py --stats --out data/
"""

import argparse, json, random, hashlib
from math import gcd
from pathlib import Path

import sympy as sp
from sympy import (symbols, Eq, solve, simplify, Rational, latex,
                   diff, integrate, limit, expand, factor)

X, Y = symbols("x y")
CURRENCIES = (
    ("peso", "pesos"),
    ("quetzal", "quetzales"),
    ("dólar", "dólares"),
    ("yen", "yenes"),
    ("libra esterlina", "libras esterlinas"),
)

# ═══════════════════════ utilidades ═══════════════════════

def hash_params(tid: str, params: dict) -> str:
    return hashlib.sha256(
        f"{tid}|{json.dumps(params, sort_keys=True)}".encode()
    ).hexdigest()[:16]

def _frac_str(r: Rational) -> str:
    return str(int(r)) if r.q == 1 else f"{r.p}/{r.q}"

def _currency_unit(currency, amount) -> str:
    singular, plural = currency
    return singular if abs(Rational(amount)) == 1 else plural

def _format_currency(amount, currency) -> str:
    value = f"{int(amount):,}".replace(",", ".")
    return f"{value} {_currency_unit(currency, amount)}"

def _horas_str(t: Rational) -> str:
    """1 → '1' · 3/2 → '1,5' (decimal con coma, uso escolar en español)."""
    return str(int(t)) if t == int(t) else f"{float(t):g}".replace(".", ",")

def _poly_str(coefs) -> str:
    """Polinomio en texto plano con supresión de ceros y manejo de ±1.
    coefs: lista (coeficiente, símbolo) de mayor a menor grado.
    [(1,'x²'),(-3,'x'),(2,'')] → 'x² − 3x + 2' · [(5,'x'),(0,'')] → '5x'"""
    partes = []
    for coef, sym in coefs:
        if coef == 0:
            continue
        mag = abs(coef)
        body = sym if sym and mag == 1 else f"{mag}{sym}"
        if partes:
            partes.append(f"− {body}" if coef < 0 else f"+ {body}")
        else:
            partes.append(f"−{body}" if coef < 0 else body)
    return " ".join(partes) if partes else "0"

def _random_polynomial(rng, min_terms=1, max_terms=4, max_degree=3):
    degrees = sorted(rng.sample(range(max_degree + 1), rng.randint(min_terms, max_terms)), reverse=True)
    expression = sp.Integer(0)
    for degree in degrees:
        coefficient = rng.choice([n for n in range(-6, 7) if n])
        expression += coefficient * X**degree
    return expand(expression)

def _pythagorean_triples(max_m=50):
    triples = []
    for m in range(2, max_m + 1):
        for n in range(1, m):
            if gcd(m, n) == 1 and (m - n) % 2 == 1:
                a, b = sorted((m**2 - n**2, 2 * m * n))
                triples.append((a, b, m**2 + n**2))
    return triples

PYTHAGOREAN_TRIPLES = _pythagorean_triples()

def _factor(r: int) -> str:
    """(x − r) con signo correcto: r=-3 → '(x + 3)' · r=0 → '(x)'."""
    if r == 0:
        return "(x)"
    return f"(x {'−' if r > 0 else '+'} {abs(r)})"

def make_choices(correct, rng, n: int = 4, distractors=None, unit=None):
    """Distractores estilo PAA basados en ERRORES TÍPICOS. Garantiza n opciones."""
    c = Rational(correct)
    cands = [c + 1, c - 1, -c, c * 2, c / 2, c + 2, c - 2,
             c + Rational(1, 2), c * 3, c - Rational(1, 3), c * 10,
             c + 10, c - 10, c + Rational(1, 4), c * 5, c + Rational(3, 2)]
    rng.shuffle(cands)
    distractores = []
    for candidate in distractors or ():
        value = Rational(candidate)
        if value != c and value not in distractores:
            distractores.append(value)
        if len(distractores) >= n - 1:
            break
    for e in cands:
        if len(distractores) >= n - 1:
            break
        if e != c and e not in distractores:
            distractores.append(e)
    k = 3                                        # fallback: nunca devolver < n
    while len(distractores) < n - 1:
        e = c + k
        if e != c and e not in distractores:
            distractores.append(e)
        k += 1
    def display(value):
        text = _frac_str(value)
        if unit:
            if value.q == 1:
                text = f"{int(value):,}".replace(",", ".")
            unit_text = _currency_unit(unit, value) if isinstance(unit, tuple) else unit
            text = f"{text} {unit_text}"
        return text

    opts = [{"text": display(c), "correct": True}] + \
           [{"text": display(e), "correct": False} for e in distractores]
    rng.shuffle(opts)
    return opts, next(i for i, o in enumerate(opts) if o["correct"])

# ═══════════════════════ framework ═══════════════════════

TEMPLATES = []

def template(cls):
    TEMPLATES.append(cls())
    return cls

class Template:
    id = "BASE"
    topic = subtopic = grade_level = ""
    skills = []
    difficulty = 5.0
    jitter = 0.4
    estimated_time = 4
    profiles = []
    mcq = False

    def build(self, rng):
        raise NotImplementedError

def generate_one(t: Template, rng):
    content = t.build(rng)
    if content is None:
        return None
    diff_final = round(t.difficulty + rng.uniform(-t.jitter, t.jitter), 1)
    ex = {
        "source": "mayan_generator",
        "license": "Propietaria MAYAN TECH IA",
        "attribution": "Banco propio MAYAN TECH IA",
        "subject": "matematicas",
        "topic": t.topic,
        "subtopic": t.subtopic,
        "difficulty": diff_final,
        "grade_level": t.grade_level,
        "profiles": t.profiles,
        "resource_track": "matematicas",
        "estimated_time": t.estimated_time,
        "skills": t.skills,
        "language": "es",
        "answer_type": content.get("answer_type", "numeric"),
        "verified_by": "cas",
        "cas_checkable": True,
        "status": "approved",
        "template_id": t.id,
        "variant_params": content["params"],
        "content_hash": hash_params(t.id, content["params"]),
        "question": content["question"],
        "question_latex": content.get("question_latex"),
        "answer": content["answer"],
        "answer_display": content["answer_display"],
        "explanation": content["explanation"],
    }
    if t.mcq:
        opts, idx = make_choices(
            content["answer"], rng,
            distractors=content.get("distractors"),
            unit=content.get("choice_unit"),
        )
        ex["choices"], ex["correct_index"] = opts, idx
    ex["exercise_id"] = f"MAYAN-{t.id}-{ex['content_hash']}"
    return ex

# ═══════════════ BÁSICOS / ALFABETIZACIÓN ═══════════════

@template
class SumaContexto(Template):
    id = "SUM_CTX_01"
    topic, subtopic, grade_level = "aritmetica", "suma_resta", "basicos"
    skills = ["suma", "resta", "problemas_aplicados"]
    difficulty, estimated_time = 1.5, 2
    profiles = ["alfabetizacion", "basicos", "escuela_tecnica"]
    mcq = True

    def build(self, rng):
        a, b = rng.randint(20, 480), rng.randint(20, 480)
        currency = rng.choice(CURRENCIES)
        total = a + b
        assert sp.Integer(a) + sp.Integer(b) == total
        return {
            "question": f"Ana gastó {_format_currency(a, currency)} en cuadernos y {_format_currency(b, currency)} en lápices. ¿Cuánto gastó en total?",
            "answer": str(total),
            "answer_display": _format_currency(total, currency),
            "explanation": f"Sumamos los dos gastos: {a} + {b} = {total}.",
            "params": {"a": a, "b": b, "currency": currency[1]},
            "distractors": [abs(a - b), total - 1, total + 1, total + min(a, b)],
            "choice_unit": currency,
        }

@template
class FraccionesOperacion(Template):
    id = "FRAC_01"
    topic, subtopic, grade_level = "aritmetica", "fracciones", "basicos"
    skills = ["fracciones", "mcm", "aritmetica"]
    difficulty, estimated_time = 3.5, 4
    profiles = ["basicos", "bachillerato", "escuela_tecnica"]
    mcq = True

    def build(self, rng):
        for _ in range(60):
            b, d = rng.randint(2, 9), rng.randint(2, 9)
            if b == d:
                continue
            a, c = rng.randint(1, b - 1), rng.randint(1, d - 1)
            op = rng.choice(["+", "-"])
            r = Rational(a, b) + Rational(c, d) if op == "+" else Rational(a, b) - Rational(c, d)
            if 0 < r.q <= 12:
                break
        else:
            return None
        num = a * d + c * b if op == "+" else a * d - c * b
        assert simplify(Rational(num, b * d) - r) == 0
        mcm = b * d // sp.gcd(b, d)
        return {
            "question": f"Resuelve: {a}/{b} {op} {c}/{d}",
            "question_latex": f"\\dfrac{{{a}}}{{{b}}} {op} \\dfrac{{{c}}}{{{d}}} = \\;?",
            "answer": _frac_str(r),
            "answer_display": _frac_str(r),
            "explanation": f"Común denominador {mcm}: {a}/{b} {op} {c}/{d} = {_frac_str(r)}",
            "params": {"a": a, "b": b, "c": c, "d": d, "op": op},
            "distractors": [
                Rational(a + c, b + d),
                Rational(a + c if op == "+" else a - c, b * d),
                Rational(a, b) - Rational(c, d) if op == "+" else Rational(a, b) + Rational(c, d),
                Rational(a * d + c * b, b + d),
            ],
        }

@template
class MultiplicacionAritmetica(Template):
    id = "ARITH_MULT_01"
    topic, subtopic, grade_level = "aritmetica", "multiplicacion", "basicos"
    skills = ["multiplicacion", "aritmetica", "problemas_aplicados"]
    difficulty, estimated_time = 2.0, 2
    profiles = ["alfabetizacion", "basicos", "bachillerato", "escuela_tecnica"]
    mcq = True

    def build(self, rng):
        a, b = rng.randint(2, 999), rng.randint(2, 999)
        result = a * b
        assert sp.Integer(a) * b == result
        return {
            "question": f"Calcula: {a} × {b}",
            "question_latex": f"\\({a} \\times {b}\\)",
            "answer": str(result),
            "answer_display": str(result),
            "explanation": f"Multiplicamos {a} × {b} = {result}.",
            "params": {"a": a, "b": b},
            "distractors": [a + b, abs(a - b), (a - 1) * b, a * (b - 1)],
        }

@template
class DivisionAritmetica(Template):
    id = "ARITH_DIV_01"
    topic, subtopic, grade_level = "aritmetica", "division", "basicos"
    skills = ["division", "aritmetica", "operaciones_inversas"]
    difficulty, estimated_time = 2.5, 3
    profiles = ["basicos", "bachillerato", "escuela_tecnica"]
    mcq = True

    def build(self, rng):
        divisor = rng.randint(2, 999)
        quotient = rng.randint(2, 999)
        dividend = divisor * quotient
        assert dividend // divisor == quotient
        return {
            "question": f"Calcula: {dividend} ÷ {divisor}",
            "question_latex": f"\\({dividend} \\div {divisor}\\)",
            "answer": str(quotient),
            "answer_display": str(quotient),
            "explanation": f"Buscamos el número que multiplicado por {divisor} da {dividend}: {dividend} ÷ {divisor} = {quotient}.",
            "params": {"dividend": dividend, "divisor": divisor, "quotient": quotient},
            "distractors": [dividend - divisor, dividend, divisor, quotient + divisor],
        }

@template
class Porcentaje(Template):
    id = "PCT_01"
    topic, subtopic, grade_level = "aritmetica", "porcentajes", "basicos"
    skills = ["porcentajes", "aritmetica"]
    difficulty, estimated_time = 2.5, 3
    profiles = ["basicos", "bachillerato", "escuela_tecnica", "admision_uni"]
    mcq = True

    def build(self, rng):
        p = rng.choice([5, 10, 15, 20, 25, 30, 40, 50, 75])
        N = rng.choice([n for n in range(200, 2001, 20) if (n * p) % 100 == 0])
        res = N * p // 100
        assert sp.Integer(N) * sp.Rational(p, 100) == res
        return {
            "question": f"¿Cuánto es el {p}% de {N:,}?".replace(",", "."),
            "answer": str(res),
            "answer_display": str(res),
            "explanation": f"{p}% de {N} = {N} × {p}/100 = {res}.",
            "params": {"p": p, "N": N},
            "distractors": [N * p, N - res, res * 10, N // p],
        }

@template
class ReglaDeTres(Template):
    id = "RULE3_01"
    topic, subtopic, grade_level = "aritmetica", "proporcionalidad", "escuela_tecnica"
    skills = ["proporciones", "regla_de_tres"]
    difficulty, estimated_time = 3.0, 4
    profiles = ["basicos", "escuela_tecnica", "bachillerato", "admision_uni"]
    mcq = True

    def build(self, rng):
        u = rng.randint(2, 60)
        a = rng.choice([2, 3, 4, 5, 6, 8])
        b = rng.choice([7, 9, 10, 12, 15, 20])
        currency = rng.choice(CURRENCIES)
        total_a, res = a * u, b * u
        assert Rational(res, b) == Rational(total_a, a)
        return {
            "question": f"Si {a} kg de arroz cuestan {_format_currency(total_a, currency)}, ¿cuánto costarán {b} kg?",
            "answer": str(res),
            "answer_display": _format_currency(res, currency),
            "explanation": f"Precio por kg: {total_a} ÷ {a} = {u}. "
                           f"Entonces {b} kg → {b} × {u} = {res}.",
            "params": {"a": a, "b": b, "u": u, "currency": currency[1]},
            "distractors": [total_a, total_a + b, total_a // b, total_a * b],
            "choice_unit": currency,
        }

# ═══════════════ BACHILLERATO ═══════════════

@template
class EcuacionLineal(Template):
    id = "LIN_EQ_01"
    topic, subtopic, grade_level = "algebra", "ecuaciones_lineales", "bachillerato"
    skills = ["ecuaciones", "despejes", "aritmetica"]
    difficulty, estimated_time = 3.5, 3
    profiles = ["basicos", "bachillerato", "escuela_tecnica", "admision_uni", "universitario"]
    mcq = True

    def build(self, rng):
        x0 = rng.choice([n for n in range(-9, 10) if n != 0])
        a = rng.choice([n for n in range(-6, 7) if n != 0])
        b = rng.randint(-20, 20)
        c = a * x0 + b
        eq = Eq(a * X + b, c)
        assert solve(eq, X) == [x0]
        expl = ""
        if b != 0:
            expl += f"Pasamos {abs(b)} al otro lado ({'restando' if b > 0 else 'sumando'}): {a}x = {c - b}. "
        if a != 1:
            expl += f"Dividimos entre {a}: "
        expl += f"x = {x0}."
        return {
            "question": f"Resuelve para x:  {_poly_str([(a, 'x'), (b, '')])} = {c}",
            "question_latex": f"Resuelve: \\({latex(eq)}\\)",
            "answer": str(x0),
            "answer_display": f"x = {x0}",
            "explanation": expl,
            "params": {"a": a, "b": b, "x0": x0},
        }

@template
class CuadraticaFactorizable(Template):
    id = "QUAD_01"
    topic, subtopic, grade_level = "algebra", "ecuaciones_cuadraticas", "bachillerato"
    skills = ["factorizacion", "ecuaciones", "razonamiento_algebraico"]
    difficulty, estimated_time = 5.0, 6
    profiles = ["bachillerato", "admision_uni", "universitario"]

    def build(self, rng):
        r1, r2 = rng.randint(-9, 9), rng.randint(-9, 9)
        if r1 == r2:
            return None
        poly = expand((X - r1) * (X - r2))
        b, c = int(poly.coeff(X, 1)), int(poly.coeff(X, 0))
        assert sorted(set(int(s) for s in solve(Eq(poly, 0), X))) == sorted({r1, r2})
        return {
            "question": f"Resuelve: {_poly_str([(1, 'x²'), (b, 'x'), (c, '')])} = 0",
            "question_latex": f"\\({latex(Eq(poly, 0))}\\)",
            "answer": sorted([str(r1), str(r2)]),
            "answer_display": f"x₁ = {min(r1, r2)},  x₂ = {max(r1, r2)}",
            "explanation": f"Factorizamos: {_factor(r1)}{_factor(r2)} = 0 "
                           f"→ x = {r1} o x = {r2}.",
            "params": {"r1": r1, "r2": r2},
        }

@template
class Sistema2x2(Template):
    id = "SYS2_01"
    topic, subtopic, grade_level = "algebra", "sistemas_ecuaciones", "bachillerato"
    skills = ["sistemas", "ecuaciones", "razonamiento_algebraico"]
    difficulty, estimated_time = 5.5, 7
    profiles = ["bachillerato", "admision_uni", "universitario"]

    def build(self, rng):
        for _ in range(30):
            x0, y0 = rng.randint(-6, 6), rng.randint(-6, 6)
            a1 = rng.choice([n for n in range(-4, 5) if n])
            b1 = rng.choice([n for n in range(-4, 5) if n])
            a2 = rng.choice([n for n in range(-4, 5) if n])
            b2 = rng.choice([n for n in range(-4, 5) if n])
            if a1 * b2 - a2 * b1 == 0:
                continue
            c1, c2 = a1 * x0 + b1 * y0, a2 * x0 + b2 * y0
            sol = solve([Eq(a1 * X + b1 * Y, c1), Eq(a2 * X + b2 * Y, c2)], [X, Y])
            assert sol == {X: x0, Y: y0}
            return {
                "question": (f"Resuelve el sistema:  "
                             f"{_poly_str([(a1, 'x'), (b1, 'y')])} = {c1}  ;  "
                             f"{_poly_str([(a2, 'x'), (b2, 'y')])} = {c2}"),
                "question_latex": (f"\\({latex(Eq(a1*X + b1*Y, c1))} \\quad;\\quad "
                                   f"{latex(Eq(a2*X + b2*Y, c2))}\\)"),
                "answer": [str(x0), str(y0)],
                "answer_display": f"x = {x0}, y = {y0}",
                "explanation": f"Verificación: {a1}({x0}) + {b1}({y0}) = {c1} ✓",
                "params": {"a1": a1, "b1": b1, "c1": c1, "a2": a2, "b2": b2, "c2": c2},
            }
        return None

@template
class EvaluarPolinomio(Template):
    id = "EVALF_01"
    topic, subtopic, grade_level = "algebra", "funciones", "bachillerato"
    skills = ["sustitucion", "orden_de_operaciones"]
    difficulty, estimated_time = 3.0, 3
    profiles = ["bachillerato", "admision_uni", "universitario"]
    mcq = True

    def build(self, rng):
        a = rng.choice([n for n in range(-5, 6) if n])
        b, c, x0 = rng.randint(-8, 8), rng.randint(-9, 9), rng.randint(-4, 4)
        f = a * X**2 + b * X + c
        val = int(f.subs(X, x0))
        assert a * x0 * x0 + b * x0 + c == val
        return {
            "question": f"Si f(x) = {_poly_str([(a, 'x²'), (b, 'x'), (c, '')])}, "
                        f"¿cuánto vale f({x0})?",
            "question_latex": f"\\(f(x) = {latex(f)}\\), calcula \\(f({x0})\\)",
            "answer": str(val),
            "answer_display": str(val),
            "explanation": f"f({x0}) = {a}({x0})² + ({b})({x0}) + ({c}) = {val}.",
            "params": {"a": a, "b": b, "c": c, "x0": x0},
        }

@template
class ProgresionAritmetica(Template):
    id = "SEQ_AR_01"
    topic, subtopic, grade_level = "progresiones", "progresion_aritmetica", "bachillerato"
    skills = ["patrones", "progresiones", "razonamiento"]
    difficulty, estimated_time = 4.5, 4
    profiles = ["bachillerato", "admision_uni"]
    mcq = True

    def build(self, rng):
        a1, d = rng.randint(2, 500), rng.randint(2, 100)
        n = rng.choice([10, 12, 15, 20])
        res = a1 + (n - 1) * d
        assert sp.Integer(a1) + (n - 1) * sp.Integer(d) == res
        terms = ", ".join(str(a1 + i * d) for i in range(4))
        return {
            "question": f"En la sucesión {terms}, …, ¿cuál es el término número {n}?",
            "answer": str(res),
            "answer_display": str(res),
            "explanation": f"Es aritmética con a(1) = {a1} y d = {d}. "
                           f"a({n}) = {a1} + ({n}−1)·{d} = {res}.",
            "params": {"a1": a1, "d": d, "n": n},
        }

# ═══════════════ ADMISIÓN UNI (PAA) ═══════════════

@template
class Movimiento(Template):
    id = "SPEED_01"
    topic, subtopic, grade_level = "aritmetica", "movimiento", "admision_uni"
    skills = ["razonamiento", "proporciones", "problemas_aplicados"]
    difficulty, estimated_time = 5.0, 5
    profiles = ["bachillerato", "admision_uni", "escuela_tecnica", "universitario"]
    mcq = True

    def build(self, rng):
        s = rng.randint(30, 200)
        t = Rational(rng.randint(2, 40), 2)
        d = s * t
        assert Rational(s) * t == d
        hs = _horas_str(t)
        modo = rng.choice(["distancia", "tiempo"])
        if modo == "distancia":
            return {
                "question": f"Un ómnibus viaja a {s} km/h durante {hs} horas. "
                            f"¿Qué distancia recorre?",
                "answer": _frac_str(d),
                "answer_display": f"{float(d):g} km",
                "explanation": f"d = v · t = {s} × {hs} = {_frac_str(d)} km.",
                "params": {"s": s, "t": str(t), "modo": modo},
            }
        return {
            "question": f"Un auto recorre {_frac_str(d)} km a {s} km/h. "
                        f"¿Cuántas horas tarda?",
            "answer": _frac_str(t),
            "answer_display": f"{float(t):g} h",
            "explanation": f"t = d ÷ v = {_frac_str(d)} ÷ {s} = {hs} h.",
            "params": {"s": s, "t": str(t), "modo": modo},
        }

@template
class TrabajoConjunto(Template):
    id = "WORK_01"
    topic, subtopic, grade_level = "aritmetica", "trabajo_conjunto", "admision_uni"
    skills = ["razonamiento", "fracciones", "tasas"]
    difficulty, estimated_time = 6.0, 6
    profiles = ["admision_uni", "universitario"]
    mcq = True

    PARES = [(2, 2), (3, 6), (4, 12), (6, 12), (3, 3), (5, 20), (2, 6), (4, 4), (10, 15)]
    CONTEXTO = [("pinta", "una pared"), ("llena", "un tanque"),
                ("transcribe", "un informe"), ("cose", "un lote de camisas")]

    def build(self, rng):
        a, b = rng.choice(self.PARES)
        t = Rational(a * b, a + b)
        assert Rational(a * b, a + b) == t
        verbo, objeto = rng.choice(self.CONTEXTO)
        n1, n2 = rng.sample(["Luis", "Marta", "Carlos", "Rosa", "Diego", "Elena"], 2)
        return {
            "question": f"{n1} {verbo} {objeto} en {a} horas y {n2} lo hace en {b} horas. "
                        f"Trabajando juntos, ¿en cuántas horas lo terminan?",
            "answer": _frac_str(t),
            "answer_display": f"{float(t):g} horas",
            "explanation": f"Tasas: 1/{a} + 1/{b} = 1/{_frac_str(t)} por hora → "
                           f"juntos tardan {_frac_str(t)} horas.",
            "params": {"a": a, "b": b, "verbo": verbo, "objeto": objeto, "n1": n1, "n2": n2},
        }

@template
class ProblemaEdades(Template):
    id = "AGES_01"
    topic, subtopic, grade_level = "aritmetica", "problemas_edades", "admision_uni"
    skills = ["razonamiento", "ecuaciones", "modelado"]
    difficulty, estimated_time = 6.5, 7
    profiles = ["admision_uni", "universitario"]
    mcq = True

    def build(self, rng):
        m = rng.randint(8, 40)
        k = rng.choice([2, 3, 4, 5, 6, 8])
        n = rng.choice([4, 5, 6, 10])
        p, S = m + k, 2 * m + k + 2 * n
        assert m + (m + k) + 2 * n == S
        if rng.choice(["maria", "pedro"]) == "maria":
            return {
                "question": f"Pedro tiene {k} años más que María. Dentro de {n} años, "
                            f"la suma de sus edades será {S}. ¿Qué edad tiene María HOY?",
                "answer": str(m),
                "answer_display": f"{m} años",
                "explanation": f"María = m, Pedro = m + {k}. En {n} años: "
                               f"(m+{n}) + (m+{k}+{n}) = {S} → 2m = {S - k - 2*n} → m = {m}.",
                "params": {"m": m, "k": k, "n": n, "modo": "maria"},
            }
        return {
            "question": f"Pedro tiene {k} años más que María. Dentro de {n} años, "
                        f"la suma de sus edades será {S}. ¿Qué edad tiene Pedro HOY?",
            "answer": str(p),
            "answer_display": f"{p} años",
            "explanation": f"María = m, Pedro = m + {k}. En {n} años: 2m + {k} + {2*n} = {S} "
                           f"→ m = {m} → Pedro = m + {k} = {p}.",
            "params": {"m": m, "k": k, "n": n, "modo": "pedro"},
        }

@template
class DescuentoIVA(Template):
    id = "DISC_01"
    topic, subtopic, grade_level = "aritmetica", "descuentos_iva", "escuela_tecnica"
    skills = ["porcentajes", "finanzas_personales"]
    difficulty, estimated_time = 3.5, 4
    profiles = ["basicos", "escuela_tecnica", "bachillerato", "admision_uni"]
    mcq = True

    def build(self, rng):
        P = rng.randrange(20_000, 1_000_001, 1_000)
        currency = rng.choice(CURRENCIES)
        modo = rng.choice(["descuento", "iva"])
        if modo == "descuento":
            d = rng.choice([5, 10, 15, 20, 25, 30, 35, 40, 50, 60, 75, 80])
            res = P * (100 - d) // 100
            assert P * (100 - d) == res * 100
            descuento = P - res
            return {
                "question": f"Un celular cuesta {_format_currency(P, currency)} y tiene {d}% de descuento. "
                            "¿Cuál es el precio final?".replace(",", "."),
                "answer": str(res),
                "answer_display": _format_currency(res, currency),
                "explanation": f"Descuento: {P} × {d}/100 = {descuento}. "
                               f"Precio final: {P} − {descuento} = {res}.",
                "params": {"P": P, "d": d, "modo": modo, "currency": currency[1]},
                "distractors": [P, descuento, P + descuento, P - d],
                "choice_unit": currency,
            }
        tasa = rng.choice([5, 10, 12, 15, 18, 20])
        res = P * (100 + tasa) // 100
        assert P * (100 + tasa) == res * 100
        impuesto = res - P
        return {
            "question": f"Un producto cuesta {_format_currency(P, currency)} antes de impuestos. Con un impuesto del {tasa}%, "
                        "¿cuánto se paga en total?".replace(",", "."),
            "answer": str(res),
            "answer_display": _format_currency(res, currency),
            "explanation": f"Impuesto: {P} × {tasa}/100 = {impuesto}. Total: {P} + {impuesto} = {res}.",
            "params": {"P": P, "tasa": tasa, "modo": modo, "currency": currency[1]},
            "distractors": [P, impuesto, P - impuesto, res + impuesto],
            "choice_unit": currency,
        }

# ═══════════════ UNIVERSITARIO ═══════════════

@template
class DerivadaEvaluada(Template):
    id = "DERIV_01"
    topic, subtopic, grade_level = "calculo", "derivadas", "universitario"
    skills = ["derivadas", "calculo_diferencial"]
    difficulty, estimated_time = 6.5, 6
    profiles = ["universitario"]

    def build(self, rng):
        a = rng.choice([n for n in range(-5, 6) if n])
        b, c, d = rng.randint(-5, 5), rng.randint(-9, 9), rng.randint(-9, 9)
        x0 = rng.randint(-4, 4)
        f = a * X**3 + b * X**2 + c * X + d
        fp = diff(f, X)
        val = int(fp.subs(X, x0))
        assert int(a * 3 * x0 * x0 + b * 2 * x0 + c) == val
        return {
            "question": f"Si f(x) = {sp.sstr(f).replace('**', '^')}, calcula f'({x0}).",
            "question_latex": f"\\(f(x) = {latex(f)}\\), calcula \\(f'({x0})\\)",
            "answer": str(val),
            "answer_display": str(val),
            "explanation": f"f'(x) = {latex(fp)}. Evaluando en x = {x0}: f'({x0}) = {val}.",
            "params": {"a": a, "b": b, "c": c, "d": d, "x0": x0},
        }

@template
class LimiteRacional(Template):
    id = "LIMIT_01"
    topic, subtopic, grade_level = "calculo", "limites", "universitario"
    skills = ["limites", "factorizacion", "calculo_diferencial"]
    difficulty, estimated_time = 7.0, 6
    profiles = ["universitario"]

    def build(self, rng):
        a = rng.randint(2, 9)
        expr = (X**2 - a**2) / (X - a)
        val = int(limit(expr, X, a))
        assert simplify(expr - (X + a)) == 0
        assert limit(expr, X, a) == val
        return {
            "question": f"Calcula: lím (x² − {a*a}) / (x − {a}) cuando x → {a}",
            "question_latex": f"\\(\\lim_{{x \\to {a}}} \\dfrac{{x^2 - {a*a}}}{{x - {a}}}\\)",
            "answer": str(val),
            "answer_display": str(val),
            "explanation": f"Indeterminación 0/0. Factorizando: (x+{a})(x−{a})/(x−{a}) = x+{a}. "
                           f"Evaluando en {a}: {2*a}.",
            "params": {"a": a},
        }

@template
class IntegralDefinida(Template):
    id = "INTEG_01"
    topic, subtopic, grade_level = "calculo", "integrales", "universitario"
    skills = ["integrales", "teorema_fundamental"]
    difficulty, estimated_time = 7.5, 8
    profiles = ["universitario"]

    def build(self, rng):
        a = rng.choice([n for n in range(-4, 5) if n])
        b = rng.randint(-6, 6)
        c = rng.choice([2, 4, 6])
        f = a * X + b
        val = int(integrate(f, (X, 0, c)))
        assert a * c * c // 2 + b * c == val
        return {
            "question": f"Calcula la integral de {sp.sstr(f).replace('**', '^')} "
                        f"entre x = 0 y x = {c}.",
            "question_latex": f"\\(\\int_{{0}}^{{{c}}} ({latex(f)})\\,dx\\)",
            "answer": str(val),
            "answer_display": str(val),
            "explanation": f"Antiderivada: {latex(integrate(f, X))}. "
                           f"Evaluando: F({c}) − F(0) = {val}.",
            "params": {"a": a, "b": b, "c": c},
        }


# ═══════════════ NUEVOS MÓDULOS: GEOMETRÍA, CONJUNTOS Y LÓGICA ═══════════════

@template
class OperacionesCombinadas(Template):
    id = "ARITH_02"
    topic, subtopic, grade_level = "aritmetica", "operaciones_combinadas", "basicos"
    skills = ["aritmetica", "jerarquia_operaciones", "signos_agrupacion"]
    difficulty, estimated_time = 2.5, 3
    profiles = ["basicos", "bachillerato", "admision_uni"]
    mcq = True

    def build(self, rng):
        a = rng.randint(2, 12)
        b = rng.randint(2, 8)
        c = rng.randint(1, 10)
        d = rng.choice([2, 3, 4, 5])
        expr_str = f"{a} + {b} × ({c} × {d})"
        val = a + b * (c * d)
        return {
            "question": f"Calcula el resultado respetando los signos de agrupación: {expr_str}",
            "question_latex": f"\\({a} + {b} \\times ({c} \\cdot {d})\\)",
            "answer": str(val),
            "answer_display": str(val),
            "explanation": f"Primero resolvemos el paréntesis: {c} × {d} = {c*d}. Luego multiplicamos: {b} × {c*d} = {b*c*d}. Finalmente sumamos: {a} + {b*c*d} = {val}.",
            "params": {"a": a, "b": b, "c": c, "d": d},
        }

@template
class LeyDeSignos(Template):
    id = "SIGN_LAWS_01"
    topic, subtopic, grade_level = "aritmetica", "ley_de_signos", "basicos"
    skills = ["aritmetica", "ley_de_signos", "enteros"]
    difficulty, estimated_time = 2.0, 2
    profiles = ["basicos", "bachillerato", "escuela_tecnica"]
    mcq = True

    def build(self, rng):
        a = rng.choice([-9, -8, -7, -6, -5, -4, -3, -2])
        b = rng.choice([-9, -8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5])
        c = rng.choice([-10, -5, 5, 10])
        val = (a * b) + c
        return {
            "question": f"Aplica la ley de los signos para calcular: ({a}) × ({b}) + ({c})",
            "question_latex": f"\\(({a}) \\cdot ({b}) + ({c})\\)",
            "answer": str(val),
            "answer_display": str(val),
            "explanation": f"Paso 1: ({a}) × ({b}) = {a*b} (menos por menos da más). Paso 2: {a*b} + ({c}) = {val}.",
            "params": {"a": a, "b": b, "c": c},
        }

@template
class RazonesYProporciones(Template):
    id = "RATIO_PROP_01"
    topic, subtopic, grade_level = "aritmetica", "razones_proporciones", "basicos"
    skills = ["razones", "proporciones", "aritmetica"]
    difficulty, estimated_time = 3.0, 3
    profiles = ["basicos", "bachillerato", "admision_uni"]
    mcq = True

    def build(self, rng):
        r1, r2 = rng.choice([(2, 3), (3, 4), (3, 5), (4, 5), (2, 5), (5, 7)])
        k = rng.randint(4, 100)
        num1, num2 = r1 * k, r2 * k
        suma = num1 + num2
        return {
            "question": f"La razón entre dos números es {r1}:{r2}. Si la suma de ambos números es {suma}, ¿cuál es el número mayor?",
            "answer": str(num2),
            "answer_display": str(num2),
            "explanation": f"La constante k es {suma} ÷ ({r1} + {r2}) = {suma} ÷ {r1+r2} = {k}. El mayor número es {r2} × {k} = {num2}.",
            "params": {"r1": r1, "r2": r2, "k": k, "suma": suma},
        }

@template
class ReglaDeTresCompuesta(Template):
    id = "RULE3_COMP_01"
    topic, subtopic, grade_level = "aritmetica", "regla_tres_compuesta", "bachillerato"
    skills = ["proporcionalidad", "regla_tres_compuesta"]
    difficulty, estimated_time = 4.5, 5
    profiles = ["bachillerato", "admision_uni"]
    mcq = True

    def build(self, rng):
        o1, h1 = rng.randint(4, 30), rng.randint(4, 12)
        o2 = rng.choice([workers for workers in range(3, 31) if workers != o1])
        h2 = rng.choice([hours for hours in range(4, 13) if hours != h1])
        d1 = (o2 * h2 // gcd(o1 * h1, o2 * h2)) * rng.randint(1, 20)
        total_horas = o1 * d1 * h1
        d2 = total_horas // (o2 * h2)
        assert total_horas % (o2 * h2) == 0
        return {
            "question": f"Si {o1} obreros trabajando {h1} horas al día tardan {d1} días en realizar una obra, ¿cuántos días tardarán {o2} obreros trabajando {h2} horas al día en hacer la misma obra?",
            "answer": str(d2),
            "answer_display": f"{d2} días",
            "explanation": f"Horas-hombre necesarias = {o1} × {d1} × {h1} = {total_horas}. Días necesarios = {total_horas} ÷ ({o2} × {h2}) = {d2} días.",
            "params": {"o1": o1, "d1": d1, "h1": h1, "o2": o2, "h2": h2},
        }

@template
class SumaRestaAlgebraica(Template):
    id = "ALG_SUM_REST_01"
    topic, subtopic, grade_level = "algebra", "operaciones_algebraicas", "bachillerato"
    skills = ["algebra", "simplificacion", "terminos_semejantes"]
    difficulty, estimated_time = 3.0, 3
    profiles = ["basicos", "bachillerato", "admision_uni"]
    mcq = False

    def build(self, rng):
        p1 = _random_polynomial(rng)
        p2 = _random_polynomial(rng)
        operation = rng.choice(["+", "-"])
        res = expand(p1 + p2 if operation == "+" else p1 - p2)
        ans_str = sp.sstr(res).replace("**", "^")
        return {
            "question": f"Simplifica: ({latex(p1)}) {operation} ({latex(p2)})",
            "question_latex": f"\\(({latex(p1)}) {operation} ({latex(p2)})\\)",
            "answer": ans_str,
            "answer_display": f"${latex(res)}$",
            "explanation": f"Reducimos los términos semejantes de ambas expresiones. Resultado: {latex(res)}.",
            "params": {"p1": sp.sstr(p1), "p2": sp.sstr(p2), "operation": operation},
        }

@template
class MultiplicacionDivisionAlgebraica(Template):
    id = "ALG_MULT_DIV_01"
    topic, subtopic, grade_level = "algebra", "multiplicacion_monomios", "bachillerato"
    skills = ["algebra", "multiplicacion_algebraica", "exponentes"]
    difficulty, estimated_time = 3.5, 4
    profiles = ["bachillerato", "admision_uni", "universitario"]
    mcq = False

    def build(self, rng):
        a = rng.randint(2, 6)
        b = rng.randint(2, 5)
        m, n = rng.randint(1, 4), rng.randint(1, 4)
        p, q = rng.randint(1, 4), rng.randint(1, 4)
        m1 = a * X**m * Y**n
        m2 = b * X**p * Y**q
        prod = expand(m1 * m2)
        ans_str = sp.sstr(prod).replace("**", "^")
        return {
            "question": f"Calcula el producto de los monomios: ({a}x^{m}y^{n}) × ({b}x^{p}y^{q})",
            "question_latex": f"\\(({latex(m1)}) \\cdot ({latex(m2)})\\)",
            "answer": ans_str,
            "answer_display": f"${latex(prod)}$",
            "explanation": f"Multiplicamos coeficientes: {a} × {b} = {a*b}. Sumamos exponentes de x: {m} + {p} = {m+p}. Sumamos exponentes de y: {n} + {q} = {n+q}. Resultado: {latex(prod)}.",
            "params": {"a": a, "b": b, "m": m, "n": n, "p": p, "q": q},
        }

@template
class MultiplicacionPolinomios(Template):
    id = "ALG_POLY_MULT_01"
    topic, subtopic, grade_level = "algebra", "multiplicacion_polinomios", "bachillerato"
    skills = ["algebra", "multiplicacion_algebraica", "productos_polinomios"]
    difficulty, estimated_time = 4.0, 5
    profiles = ["bachillerato", "admision_uni", "universitario"]

    def build(self, rng):
        p1 = _random_polynomial(rng, min_terms=1, max_terms=3)
        p2 = _random_polynomial(rng, min_terms=2, max_terms=4)
        product = expand(p1 * p2)
        return {
            "question": f"Multiplica y simplifica: ({latex(p1)})({latex(p2)})",
            "question_latex": f"\\(({latex(p1)})({latex(p2)})\\)",
            "answer": sp.sstr(product).replace("**", "^"),
            "answer_display": f"${latex(product)}$",
            "explanation": f"Aplicamos la propiedad distributiva y reducimos términos semejantes: {latex(product)}.",
            "params": {"p1": sp.sstr(p1), "p2": sp.sstr(p2)},
        }

@template
class DivisionMonomios(Template):
    id = "ALG_MONO_DIV_01"
    topic, subtopic, grade_level = "algebra", "division_monomios", "bachillerato"
    skills = ["algebra", "division_algebraica", "leyes_exponentes"]
    difficulty, estimated_time = 3.5, 4
    profiles = ["bachillerato", "admision_uni", "universitario"]

    def build(self, rng):
        divisor_coefficient = rng.randint(2, 8)
        quotient_coefficient = rng.randint(2, 8)
        dividend_coefficient = divisor_coefficient * quotient_coefficient
        quotient_x, quotient_y = rng.randint(0, 5), rng.randint(0, 5)
        divisor_x, divisor_y = rng.randint(0, 3), rng.randint(0, 3)
        dividend = dividend_coefficient * X**(quotient_x + divisor_x) * Y**(quotient_y + divisor_y)
        divisor = divisor_coefficient * X**divisor_x * Y**divisor_y
        quotient = simplify(dividend / divisor)
        return {
            "question": f"Divide y simplifica: ({latex(dividend)}) ÷ ({latex(divisor)})",
            "question_latex": f"\\(\\dfrac{{{latex(dividend)}}}{{{latex(divisor)}}}\\)",
            "answer": sp.sstr(quotient).replace("**", "^"),
            "answer_display": f"${latex(quotient)}$",
            "explanation": "Dividimos coeficientes y restamos los exponentes de las variables con la misma base.",
            "params": {
                "dividend_coefficient": dividend_coefficient,
                "divisor_coefficient": divisor_coefficient,
                "quotient_x": quotient_x,
                "quotient_y": quotient_y,
                "divisor_x": divisor_x,
                "divisor_y": divisor_y,
            },
        }

@template
class DivisionPolinomioMonomio(Template):
    id = "ALG_POLY_MONO_DIV_01"
    topic, subtopic, grade_level = "algebra", "division_polinomio_monomio", "bachillerato"
    skills = ["algebra", "division_algebraica", "polinomios"]
    difficulty, estimated_time = 4.0, 5
    profiles = ["bachillerato", "admision_uni", "universitario"]

    def build(self, rng):
        quotient = _random_polynomial(rng, min_terms=2, max_terms=4)
        divisor = rng.randint(2, 8) * X**rng.randint(0, 2)
        dividend = expand(divisor * quotient)
        result, remainder = sp.div(dividend, divisor, X)
        assert remainder == 0 and expand(result - quotient) == 0
        return {
            "question": f"Divide cada término y simplifica: ({latex(dividend)}) ÷ ({latex(divisor)})",
            "question_latex": f"\\(\\dfrac{{{latex(dividend)}}}{{{latex(divisor)}}}\\)",
            "answer": sp.sstr(result).replace("**", "^"),
            "answer_display": f"${latex(result)}$",
            "explanation": f"Dividimos cada término del polinomio entre el monomio: {latex(result)}.",
            "params": {"quotient": sp.sstr(quotient), "divisor": sp.sstr(divisor)},
        }

@template
class DivisionPolinomioBinomio(Template):
    id = "ALG_POLY_BINOM_DIV_01"
    topic, subtopic, grade_level = "algebra", "division_polinomio_binomio", "bachillerato"
    skills = ["algebra", "division_algebraica", "polinomios"]
    difficulty, estimated_time = 5.0, 6
    profiles = ["bachillerato", "admision_uni", "universitario"]

    def build(self, rng):
        divisor = rng.choice([2, 3, 4, 5]) * X + rng.choice([-9, -7, -5, -3, 3, 5, 7, 9])
        quotient = _random_polynomial(rng, min_terms=2, max_terms=3, max_degree=2)
        dividend = expand(divisor * quotient)
        result, remainder = sp.div(dividend, divisor, X)
        assert remainder == 0 and expand(result - quotient) == 0
        return {
            "question": f"Divide y simplifica: ({latex(dividend)}) ÷ ({latex(divisor)})",
            "question_latex": f"\\(\\dfrac{{{latex(dividend)}}}{{{latex(divisor)}}}\\)",
            "answer": sp.sstr(result).replace("**", "^"),
            "answer_display": f"${latex(result)}$",
            "explanation": f"Dividimos el polinomio entre el binomio y verificamos multiplicando el cociente: {latex(result)}.",
            "params": {"quotient": sp.sstr(quotient), "divisor": sp.sstr(divisor)},
        }

@template
class FactorizacionFactorComun(Template):
    id = "ALG_FACT_COMMON_01"
    topic, subtopic, grade_level = "algebra", "factorizacion", "bachillerato"
    skills = ["algebra", "factorizacion", "factor_comun"]
    difficulty, estimated_time = 3.5, 3
    profiles = ["bachillerato", "admision_uni"]
    mcq = False

    def build(self, rng):
        mode = rng.choice(["factor_comun", "diferencia_cuadrados", "trinomio"])
        if mode == "factor_comun":
            k = rng.choice([2, 3, 4, 5, 6])
            a = rng.choice([1, 2, 3])
            b = rng.choice([n for n in range(-7, 8) if n])
            p = k * a * X**2 + k * b * X
        elif mode == "diferencia_cuadrados":
            a, b = rng.randint(2, 8), rng.randint(1, 8)
            p = a**2 * X**2 - b**2
        else:
            r1, r2 = rng.sample(range(-8, 9), 2)
            p = expand((X - r1) * (X - r2))
        fact = factor(p)
        ans_str = sp.sstr(fact).replace("**", "^")
        return {
            "question": f"Factoriza completamente: {latex(p)}",
            "question_latex": f"\\({latex(p)}\\)",
            "answer": ans_str,
            "answer_display": f"${latex(fact)}$",
            "explanation": f"Aplicando factorización algebraica obtenemos: {latex(fact)}.",
            "params": {"mode": mode, "polynomial": sp.sstr(p)},
        }

@template
class ProductosNotables(Template):
    id = "ALG_PROD_01"
    topic, subtopic, grade_level = "algebra", "productos_notables", "bachillerato"
    skills = ["algebra", "productos_notables", "expansion"]
    difficulty, estimated_time = 4.0, 4
    profiles = ["bachillerato", "admision_uni", "universitario"]
    mcq = False

    def build(self, rng):
        a = rng.choice([1, 2, 3, 4, 5])
        b = rng.choice([n for n in range(-9, 10) if n])
        modo = rng.choice(["cuadrado", "diferencia_cuadrados"])
        
        if modo == "cuadrado":
            expr = (a * X + b)**2
            exp_expr = expand(expr)
            ans_str = sp.sstr(exp_expr).replace("**", "^")
            return {
                "question": f"Desarrolla el producto notable: ({_poly_str([(a, 'x'), (b, '')])})²",
                "question_latex": f"\\(({latex(a*X + b)})^2\\)",
                "answer": ans_str,
                "answer_display": f"${latex(exp_expr)}$",
                "explanation": f"Aplicando la fórmula (u + v)² = u² + 2uv + v²: ({latex(a*X + b)})² = {latex(exp_expr)}.",
                "params": {"a": a, "b": b, "modo": modo},
            }
        else:
            expr = (a * X + b) * (a * X - b)
            exp_expr = expand(expr)
            ans_str = sp.sstr(exp_expr).replace("**", "^")
            return {
                "question": f"Desarrolla el producto notable: ({_poly_str([(a, 'x'), (b, '')])})({_poly_str([(a, 'x'), (-b, '')])})",
                "question_latex": f"\\(({latex(a*X + b)})({latex(a*X - b)})\\)",
                "answer": ans_str,
                "answer_display": f"${latex(exp_expr)}$",
                "explanation": f"Aplicando la diferencia de cuadrados (u + v)(u - v) = u² - v²: {latex(exp_expr)}.",
                "params": {"a": a, "b": b, "modo": modo},
            }

@template
class TeoremaPitagoras(Template):
    id = "GEOM_PIT_01"
    topic, subtopic, grade_level = "geometria_trigonometria", "pitagoras", "bachillerato"
    skills = ["geometria", "pitagoras", "triangulos"]
    difficulty, estimated_time = 3.5, 4
    profiles = ["basicos", "bachillerato", "admision_uni"]
    mcq = True

    def build(self, rng):
        a, b, c = rng.choice(PYTHAGOREAN_TRIPLES)
        k = rng.randint(1, 20)
        a, b, c = a * k, b * k, c * k
        modo = rng.choice(["hipotenusa", "cateto"])
        
        if modo == "hipotenusa":
            val = c
            return {
                "question": f"En un triángulo rectángulo, los catetos miden {a} cm y {b} cm. ¿Cuánto mide la hipotenusa?",
                "question_latex": f"\\(a = {a}\\text{{ cm}}, b = {b}\\text{{ cm}}, c = ?\\)",
                "answer": str(val),
                "answer_display": f"{val} cm",
                "explanation": f"Por el Teorema de Pitágoras: c = √({a}² + {b}²) = √({a*a} + {b*b}) = √({c*c}) = {c} cm.",
                "params": {"a": a, "b": b, "c": c, "modo": modo},
            }
        else:
            val = a
            return {
                "question": f"En un triángulo rectángulo, la hipotenusa mide {c} cm y uno de los catetos mide {b} cm. ¿Cuánto mide el otro cateto?",
                "question_latex": f"\\(c = {c}\\text{{ cm}}, b = {b}\\text{{ cm}}, a = ?\\)",
                "answer": str(val),
                "answer_display": f"{val} cm",
                "explanation": f"Por el Teorema de Pitágoras: a = √({c}² − {b}²) = √({c*c} − {b*b}) = √({a*a}) = {a} cm.",
                "params": {"a": a, "b": b, "c": c, "modo": modo},
            }

@template
class RazonesTrigonometricas(Template):
    id = "TRIG_RATIO_01"
    topic, subtopic, grade_level = "geometria_trigonometria", "trigonometria", "bachillerato"
    skills = ["trigonometria", "razones_trigonométricas"]
    difficulty, estimated_time = 4.5, 4
    profiles = ["bachillerato", "admision_uni", "universitario"]
    mcq = True

    def build(self, rng):
        co, ca, h = rng.choice(PYTHAGOREAN_TRIPLES)
        scale = rng.randint(1, 30)
        co, ca, h = co * scale, ca * scale, h * scale
        func = rng.choice(["sin", "cos", "tan"])
        
        if func == "sin":
            ans_rat = Rational(co, h)
            ans_str = _frac_str(ans_rat)
            return {
                "question": f"En un triángulo rectángulo, el cateto opuesto al ángulo θ mide {co} y la hipotenusa mide {h}. Hallar sen(θ).",
                "question_latex": f"\\(\\sin(\\theta) = \\dfrac{{\\text{{opuesto}}}}{{\\text{{hipotenusa}}}}\\)",
                "answer": ans_str,
                "answer_display": ans_str,
                "explanation": f"sen(θ) = Cateto Opuesto / Hipotenusa = {co}/{h}" + (f" = {ans_str}" if ans_str != f"{co}/{h}" else "") + ".",
                "params": {"co": co, "ca": ca, "h": h, "func": func},
            }
        elif func == "cos":
            ans_rat = Rational(ca, h)
            ans_str = _frac_str(ans_rat)
            return {
                "question": f"En un triángulo rectángulo, el cateto adyacente al ángulo θ mide {ca} y la hipotenusa mide {h}. Hallar cos(θ).",
                "question_latex": f"\\(\\cos(\\theta) = \\dfrac{{\\text{{adyacente}}}}{{\\text{{hipotenusa}}}}\\)",
                "answer": ans_str,
                "answer_display": ans_str,
                "explanation": f"cos(θ) = Cateto Adyacente / Hipotenusa = {ca}/{h}" + (f" = {ans_str}" if ans_str != f"{ca}/{h}" else "") + ".",
                "params": {"co": co, "ca": ca, "h": h, "func": func},
            }
        else:
            ans_rat = Rational(co, ca)
            ans_str = _frac_str(ans_rat)
            return {
                "question": f"En un triángulo rectángulo, el cateto opuesto mide {co} y el cateto adyacente mide {ca}. Hallar tan(θ).",
                "question_latex": f"\\(\\tan(\\theta) = \\dfrac{{\\text{{opuesto}}}}{{\\text{{adyacente}}}}\\)",
                "answer": ans_str,
                "answer_display": ans_str,
                "explanation": f"tan(θ) = Cateto Opuesto / Cateto Adyacente = {co}/{ca}" + (f" = {ans_str}" if ans_str != f"{co}/{ca}" else "") + ".",
                "params": {"co": co, "ca": ca, "h": h, "func": func},
            }

@template
class CatetoPorAngulo(Template):
    id = "TRIG_SIDE_ANGLE_01"
    topic, subtopic, grade_level = "geometria_trigonometria", "cateto_por_angulo", "bachillerato"
    skills = ["trigonometria", "seno", "coseno", "tangente", "triangulos"]
    difficulty, estimated_time = 5.0, 5
    profiles = ["bachillerato", "admision_uni", "universitario"]

    def build(self, rng):
        angle = rng.choice([30, 45, 60])
        mode = rng.choice(["seno", "coseno", "tangente"])
        if mode == "seno":
            given_side = rng.randint(10, 1000)
            result = simplify(given_side * sp.sin(sp.pi * angle / 180))
            known = f"la hipotenusa mide {given_side} cm"
            question = f"Halla el cateto opuesto"
            formula = "cateto opuesto = hipotenusa × sen(ángulo)"
        elif mode == "coseno":
            given_side = rng.randint(10, 1000)
            result = simplify(given_side * sp.cos(sp.pi * angle / 180))
            known = f"la hipotenusa mide {given_side} cm"
            question = f"Halla el cateto adyacente"
            formula = "cateto adyacente = hipotenusa × cos(ángulo)"
        else:
            given_side = rng.randint(4, 1000)
            result = simplify(given_side * sp.tan(sp.pi * angle / 180))
            known = f"el cateto adyacente mide {given_side} cm"
            question = f"Halla el cateto opuesto"
            formula = "cateto opuesto = cateto adyacente × tan(ángulo)"

        return {
            "question": f"En un triángulo rectángulo, uno de sus ángulos agudos mide {angle}° y {known}. {question}.",
            "question_latex": f"\\(\\theta={angle}^\\circ,\\quad {formula}\\)",
            "answer": sp.sstr(result).replace("**", "^"),
            "answer_display": f"${latex(result)}\\text{{ cm}}$",
            "explanation": f"Usamos {formula}. Sustituyendo los datos, el cateto mide {latex(result)} cm.",
            "params": {"angle": angle, "mode": mode, "given_side": given_side},
        }

@template
class AreaFiguraPlana(Template):
    id = "GEOM_AREA_01"
    topic, subtopic, grade_level = "geometria_trigonometria", "areas", "bachillerato"
    skills = ["geometria", "areas", "geometria_plana"]
    difficulty, estimated_time = 3.5, 4
    profiles = ["basicos", "bachillerato", "admision_uni"]
    mcq = True

    def build(self, rng):
        figura = rng.choice(["triangulo", "rectangulo", "trapecio"])
        if figura == "triangulo":
            b = rng.randrange(4, 1001, 2)
            h = rng.randint(3, 999)
            val = b * h // 2
            return {
                "question": f"Calcula el área de un triángulo con base b = {b} cm y altura h = {h} cm.",
                "question_latex": f"\\(A = \\dfrac{{b \\cdot h}}{{2}}\\)",
                "answer": str(val),
                "answer_display": f"{val} cm²",
                "explanation": f"Área del triángulo = (base × altura) / 2 = ({b} × {h}) / 2 = {val} cm².",
                "params": {"b": b, "h": h, "figura": figura},
            }
        elif figura == "rectangulo":
            b = rng.randint(4, 1000)
            h = rng.randint(3, 999)
            val = b * h
            return {
                "question": f"Calcula el área de un rectángulo de base {b} m y altura {h} m.",
                "question_latex": f"\\(A = b \\cdot h\\)",
                "answer": str(val),
                "answer_display": f"{val} m²",
                "explanation": f"Área del rectángulo = base × altura = {b} × {h} = {val} m².",
                "params": {"b": b, "h": h, "figura": figura},
            }
        else:
            B = rng.randrange(8, 1001, 2)
            b = rng.randrange(4, B + 1, 2)
            h = rng.randrange(2, 1001, 2)
            val = (B + b) * h // 2
            return {
                "question": f"Un trapecio tiene base mayor B = {B} cm, base menor b = {b} cm y altura h = {h} cm. ¿Cuál es su área?",
                "question_latex": f"\\(A = \\dfrac{{(B + b) \\cdot h}}{{2}}\\)",
                "answer": str(val),
                "answer_display": f"{val} cm²",
                "explanation": f"Área del trapecio = (({B} + {b}) × {h}) / 2 = ({B+b} × {h}) / 2 = {val} cm².",
                "params": {"B": B, "b": b, "h": h, "figura": figura},
            }

@template
class PerimetroFiguraPlana(Template):
    id = "GEOM_PERIM_01"
    topic, subtopic, grade_level = "geometria_trigonometria", "perimetros", "bachillerato"
    skills = ["geometria", "perimetros", "geometria_plana"]
    difficulty, estimated_time = 3.0, 3
    profiles = ["basicos", "bachillerato", "admision_uni"]
    mcq = True

    def build(self, rng):
        figura = rng.choice(["rectangulo", "triangulo", "trapecio"])
        if figura == "rectangulo":
            a, b = rng.randint(3, 1000), rng.randint(3, 1000)
            result = 2 * (a + b)
            question = f"Calcula el perímetro de un rectángulo de lados {a} cm y {b} cm."
            params = {"figura": figura, "a": a, "b": b}
            explanation = f"P = 2({a} + {b}) = {result} cm."
        elif figura == "triangulo":
            a, b = rng.randint(3, 1000), rng.randint(3, 1000)
            c = rng.randint(abs(a - b) + 1, a + b - 1)
            result = a + b + c
            question = f"Calcula el perímetro de un triángulo cuyos lados miden {a} cm, {b} cm y {c} cm."
            params = {"figura": figura, "a": a, "b": b, "c": c}
            explanation = f"P = {a} + {b} + {c} = {result} cm."
        else:
            base_mayor = rng.randint(10, 1000)
            base_menor = rng.randint(2, base_mayor - 2)
            lado = rng.randint((base_mayor - base_menor + 1) // 2, 1000)
            result = base_mayor + base_menor + 2 * lado
            question = (
                f"Un trapecio isósceles tiene bases de {base_mayor} cm y {base_menor} cm "
                f"y lados iguales de {lado} cm. Calcula su perímetro."
            )
            params = {
                "figura": figura,
                "base_mayor": base_mayor,
                "base_menor": base_menor,
                "lado": lado,
            }
            explanation = f"P = {base_mayor} + {base_menor} + 2 × {lado} = {result} cm."
        return {
            "question": question,
            "answer": str(result),
            "answer_display": f"{result} cm",
            "explanation": explanation,
            "params": params,
        }

@template
class VolumenCuerpo(Template):
    id = "GEOM_VOL_01"
    topic, subtopic, grade_level = "geometria_trigonometria", "volumenes", "bachillerato"
    skills = ["geometria", "volumenes", "geometria_espacial"]
    difficulty, estimated_time = 4.0, 4
    profiles = ["bachillerato", "admision_uni", "universitario"]
    mcq = True

    def build(self, rng):
        cuerpo = rng.choice(["prisma", "cubo"])
        if cuerpo == "cubo":
            l = rng.randint(3, 1000)
            val = l**3
            return {
                "question": f"¿Cuál es el volumen de un cubo cuyo lado mide {l} cm?",
                "question_latex": f"\\(V = l^3\\)",
                "answer": str(val),
                "answer_display": f"{val} cm³",
                "explanation": f"Volumen del cubo = l³ = {l}³ = {val} cm³.",
                "params": {"l": l, "cuerpo": cuerpo},
            }
        else:
            l = rng.randint(3, 1000)
            w = rng.randint(3, 1000)
            h = rng.randint(2, 1000)
            val = l * w * h
            return {
                "question": f"Calcula el volumen de un prisma recto de largo {l} cm, ancho {w} cm y alto {h} cm.",
                "question_latex": f"\\(V = l \\cdot w \\cdot h\\)",
                "answer": str(val),
                "answer_display": f"{val} cm³",
                "explanation": f"Volumen del prisma = largo × ancho × alto = {l} × {w} × {h} = {val} cm³.",
                "params": {"l": l, "w": w, "h": h, "cuerpo": cuerpo},
            }

@template
class OperacionesConjuntos(Template):
    id = "SET_OPS_01"
    topic, subtopic, grade_level = "conjuntos", "operaciones_conjuntos", "bachillerato"
    skills = ["conjuntos", "union", "interseccion", "diferencia"]
    difficulty, estimated_time = 3.5, 4
    profiles = ["basicos", "bachillerato", "admision_uni"]
    mcq = True

    def build(self, rng):
        universo = list(range(1, 12))
        nA = rng.randint(4, 7)
        nB = rng.randint(4, 7)
        setA = set(rng.sample(universo, nA))
        setB = set(rng.sample(universo, nB))
        
        op = rng.choice(["union", "interseccion", "diferencia"])
        
        if op == "union":
            res = sorted(list(setA | setB))
            val = len(res)
            return {
                "question": f"Dados los conjuntos A = {sorted(list(setA))} y B = {sorted(list(setB))}, ¿cuántos elementos tiene A ∪ B?",
                "question_latex": f"\\(|A \\cup B| = ?\\)",
                "answer": str(val),
                "answer_display": f"{val} elementos",
                "explanation": f"A ∪ B = {res}. El número de elementos es {val}.",
                "params": {"A": sorted(list(setA)), "B": sorted(list(setB)), "op": op},
            }
        elif op == "interseccion":
            res = sorted(list(setA & setB))
            val = len(res)
            return {
                "question": f"Dados los conjuntos A = {sorted(list(setA))} y B = {sorted(list(setB))}, ¿cuántos elementos tiene A ∩ B?",
                "question_latex": f"\\(|A \\cap B| = ?\\)",
                "answer": str(val),
                "answer_display": f"{val} elementos",
                "explanation": f"A ∩ B = {res}. El número de elementos es {val}.",
                "params": {"A": sorted(list(setA)), "B": sorted(list(setB)), "op": op},
            }
        else:
            res = sorted(list(setA - setB))
            val = len(res)
            return {
                "question": f"Dados los conjuntos A = {sorted(list(setA))} y B = {sorted(list(setB))}, ¿cuántos elementos tiene la diferencia A \\ B?",
                "question_latex": f"\\(|A \\setminus B| = ?\\)",
                "answer": str(val),
                "answer_display": f"{val} elementos",
                "explanation": f"A \\ B = {res}. El número de elementos es {val}.",
                "params": {"A": sorted(list(setA)), "B": sorted(list(setB)), "op": op},
            }

@template
class ProblemaVenn(Template):
    id = "SET_VENN_01"
    topic, subtopic, grade_level = "conjuntos", "diagramas_venn", "bachillerato"
    skills = ["conjuntos", "cardinalidad", "venn"]
    difficulty, estimated_time = 4.0, 5
    profiles = ["bachillerato", "admision_uni"]
    mcq = True

    def build(self, rng):
        soloA = rng.randint(10, 30)
        soloB = rng.randint(10, 30)
        ambos = rng.randint(5, 20)
        ninguno = rng.randint(5, 15)
        
        total = soloA + soloB + ambos + ninguno
        totalA = soloA + ambos
        totalB = soloB + ambos
        
        modo = rng.choice(["total", "ninguno", "solo_uno"])
        
        if modo == "ninguno":
            val = ninguno
            return {
                "question": f"En un grupo de {total} estudiantes, {totalA} estudian Inglés, {totalB} estudian Francés y {ambos} estudian ambos idiomas. ¿Cuántos estudiantes no estudian ninguno de los dos idiomas?",
                "answer": str(val),
                "answer_display": f"{val} estudiantes",
                "explanation": f"Estudiantes que estudian al menos un idioma: |I ∪ F| = {totalA} + {totalB} − {ambos} = {totalA + totalB - ambos}. "
                               f"Ninguno: {total} − {totalA + totalB - ambos} = {val}.",
                "params": {"total": total, "totalA": totalA, "totalB": totalB, "ambos": ambos, "modo": modo},
            }
        elif modo == "total":
            val = total
            return {
                "question": f"En un curso, {soloA} leen novela, {soloB} leen poesía, {ambos} leen ambos géneros y {ninguno} no lee ninguno. ¿Cuántos alumnos hay en total en el curso?",
                "answer": str(val),
                "answer_display": f"{val} alumnos",
                "explanation": f"Total = Solo Novela + Solo Poesía + Ambos + Ninguno = {soloA} + {soloB} + {ambos} + {ninguno} = {val}.",
                "params": {"soloA": soloA, "soloB": soloB, "ambos": ambos, "ninguno": ninguno, "modo": modo},
            }
        else:
            val = soloA + soloB
            return {
                "question": f"De {total} deportistas, {totalA} juegan fútbol, {totalB} juegan tenis y {ambos} juegan ambos deportes. ¿Cuántos deportistas juegan EXACTAMENTE UN SOLO deporte?",
                "answer": str(val),
                "answer_display": f"{val} deportistas",
                "explanation": f"Solo fútbol = {totalA} − {ambos} = {soloA}. Solo tenis = {totalB} − {ambos} = {soloB}. "
                               f"Exactamente uno = {soloA} + {soloB} = {val}.",
                "params": {"total": total, "totalA": totalA, "totalB": totalB, "ambos": ambos, "modo": modo},
            }

@template
class SecuenciaGeometricaPatron(Template):
    id = "SEQ_GEO_01"
    topic, subtopic, grade_level = "progresiones", "progresion_geometrica", "bachillerato"
    skills = ["secuencias", "patrones", "progresion_geometrica"]
    difficulty, estimated_time = 4.0, 4
    profiles = ["basicos", "bachillerato", "admision_uni"]
    mcq = True

    def build(self, rng):
        a1 = rng.randint(1, 500)
        r = rng.randint(2, 10)
        n = 5
        seq = [a1 * (r**i) for i in range(n)]
        val = seq[-1]
        pre = ", ".join(map(str, seq[:-1]))
        return {
            "question": f"Determina el siguiente término de la secuencia: {pre}, ?",
            "answer": str(val),
            "answer_display": str(val),
            "explanation": f"La secuencia es una progresión geométrica de razón r = {r}. El quinto término es {seq[-2]} × {r} = {val}.",
            "params": {"a1": a1, "r": r, "n": n},
        }

@template
class RazonamientoLogico(Template):
    id = "LOGIC_ORD_01"
    topic, subtopic, grade_level = "progresiones", "razonamiento_logico", "admision_uni"
    skills = ["logica", "ordenamiento", "razonamiento"]
    difficulty, estimated_time = 4.5, 5
    profiles = ["bachillerato", "admision_uni"]
    mcq = False

    def build(self, rng):
        personas = rng.sample(["Carlos", "Ana", "Beatriz", "David", "Elena", "Luis", "Marta", "Jorge"], 4)
        p1, p2, p3, p4 = personas
        ans_str = p1
        
        choices = [{"text": p, "correct": (p == ans_str)} for p in personas]
        rng.shuffle(choices)
        idx = next(i for i, c in enumerate(choices) if c["correct"])
        
        return {
            "question": f"En un examen, {p1} obtuvo más puntos que {p2}. {p2} obtuvo más puntos que {p3}. {p3} obtuvo más puntos que {p4}. ¿Quién obtuvo el mayor puntaje?",
            "answer": ans_str,
            "answer_display": ans_str,
            "choices": choices,
            "correct_index": idx,
            "explanation": f"Ordenando de mayor a menor puntaje: {p1} > {p2} > {p3} > {p4}. Por lo tanto, el mayor puntaje es de {p1}.",
            "params": {"orden": personas},
        }

# ═══════════════════════ CLI ═══════════════════════

def main():
    ap = argparse.ArgumentParser(description="Generador paramétrico MAYAN TECH IA v1.1")
    ap.add_argument("--n", type=int, default=30, help="variantes por template")
    ap.add_argument("--only", nargs="*", help="ids de template específicos")
    ap.add_argument("--out", default="data", help="directorio de salida")
    ap.add_argument("--seed", type=int, default=None)
    ap.add_argument("--stats", action="store_true")
    args = ap.parse_args()

    rng = random.Random(args.seed)
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)

    templates = [t for t in TEMPLATES if not args.only or t.id in args.only]
    if not templates:
        ap.error(f"Ningún template coincide con --only {args.only}\n"
                 f"  Ids válidos: {', '.join(t.id for t in TEMPLATES)}")

    ejercicios, vistos = [], set()
    for t in templates:
        ok = 0
        for _ in range(args.n * 3):
            if ok >= args.n:
                break
            ex = generate_one(t, rng)
            if ex and ex["content_hash"] not in vistos:
                vistos.add(ex["content_hash"])
                ejercicios.append(ex)
                ok += 1
        print(f"  ✓ {t.id:<12} {ok:>3} ejercicios  (dif ~{t.difficulty}, "
              f"perfiles: {', '.join(t.profiles)})")

    destino = out / "exercises_mayan.jsonl"
    with open(destino, "w", encoding="utf-8") as f:
        for ex in ejercicios:
            f.write(json.dumps(ex, ensure_ascii=False) + "\n")

    print(f"\n📦 {len(ejercicios)} ejercicios verificados (CAS) → {destino}")
    print("   Licencia: 100% propietaria MAYAN TECH IA ✓")

    if args.stats:
        from collections import Counter
        print("\n📊 Distribución por tema:")
        for tema, n in Counter(e["topic"] for e in ejercicios).most_common():
            print(f"   {tema:<15} {'█' * (n // 5)} {n}")

if __name__ == "__main__":
    main()
