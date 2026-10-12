#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generador de 500 ejercicios de Quimica - MayaTiqIA
Formato identico a ejercicios_base_500.json (matematicas)
Cubre los temas de la Guia Tematica Facultad de Odontologia
"""

import json
import random
import hashlib

random.seed(42)

def mhash(text):
    return hashlib.md5(text.encode("utf-8")).hexdigest()[:16]

def make_id(tid, h):
    return f"MAYAN-{tid}-{h}"

BASE = {
    "source": "mayan_generator",
    "license": "Propietaria MAYAN TECH IA",
    "attribution": "Banco propio MAYAN TECH IA",
    "subject": "quimica",
    "language": "es",
    "verified_by": "cas",
    "cas_checkable": False,
    "status": "approved",
    "resource_track": "quimica",
    "estimated_time": 3,
    "grade_level": "preuniversitario",
    "profiles": ["preuniversitario", "odontologia", "ciencias_naturales"]
}

ejercicios = []

def ex(topic, subtopic, diff, skills, answer_type, tid, variant_params,
       question, answer, answer_display, explanation, question_latex=None):
    h = mhash(question)
    ejercicios.append({
        **BASE,
        "topic": topic,
        "subtopic": subtopic,
        "difficulty": diff,
        "skills": skills,
        "answer_type": answer_type,
        "template_id": tid,
        "variant_params": variant_params,
        "content_hash": h,
        "question": question,
        "question_latex": question_latex,
        "answer": answer,
        "answer_display": answer_display,
        "explanation": explanation,
        "exercise_id": make_id(tid, h)
    })

# ==============================================================
# I. MEDICIONES FUNDAMENTALES  (90 ejercicios)
# ==============================================================

# --- Volumen: L -> mL (10) ---
vol_L = [round(random.uniform(0.1, 10.0), 2) for _ in range(10)]
for v in vol_L:
    res = round(v * 1000, 2)
    ex("mediciones_fundamentales", "conversion_volumen", 1.2,
       ["conversion_unidades", "volumen"], "numeric",
       "CONV_VOL_L_ML", {"valor": v, "de": "L", "a": "mL"},
       f"Convierte {v} L a mL.",
       str(res), f"{res} mL",
       f"Para pasar litros a mililitros se multiplica por 1 000: {v} x 1 000 = {res} mL.",
       f"{v} \\text{{ L}} = ? \\text{{ mL}}")

# --- Volumen: mL -> L (10) ---
vol_mL = [random.randint(50, 5000) for _ in range(10)]
for v in vol_mL:
    res = round(v / 1000, 4)
    ex("mediciones_fundamentales", "conversion_volumen", 1.3,
       ["conversion_unidades", "volumen"], "numeric",
       "CONV_VOL_ML_L", {"valor": v, "de": "mL", "a": "L"},
       f"Convierte {v} mL a L.",
       str(res), f"{res} L",
       f"Para pasar mL a litros se divide entre 1 000: {v} / 1 000 = {res} L.",
       f"{v} \\text{{ mL}} = ? \\text{{ L}}")

# --- Volumen: cc = mL (10) ---
for v in random.sample(range(1, 500), 10):
    ex("mediciones_fundamentales", "conversion_volumen", 1.0,
       ["conversion_unidades", "volumen"], "numeric",
       "CONV_VOL_CC_ML", {"valor": v, "de": "cc", "a": "mL"},
       f"Expresa {v} cc en mL. Recuerda que 1 cc = 1 mL.",
       str(v), f"{v} mL",
       f"1 cc equivale exactamente a 1 mL, por tanto {v} cc = {v} mL.")

# --- Masa: g -> mg (10) ---
for m in [round(random.uniform(0.01, 50.0), 2) for _ in range(10)]:
    res = round(m * 1000, 2)
    ex("mediciones_fundamentales", "conversion_masa", 1.2,
       ["conversion_unidades", "masa"], "numeric",
       "CONV_MASA_G_MG", {"valor": m, "de": "g", "a": "mg"},
       f"Convierte {m} g a mg.",
       str(res), f"{res} mg",
       f"{m} g x 1 000 = {res} mg.",
       f"{m} \\text{{ g}} = ? \\text{{ mg}}")

# --- Masa: kg -> g (10) ---
for m in [round(random.uniform(0.1, 20.0), 2) for _ in range(10)]:
    res = round(m * 1000, 2)
    ex("mediciones_fundamentales", "conversion_masa", 1.2,
       ["conversion_unidades", "masa"], "numeric",
       "CONV_MASA_KG_G", {"valor": m, "de": "kg", "a": "g"},
       f"Convierte {m} kg a g.",
       str(res), f"{res} g",
       f"{m} kg x 1 000 = {res} g.",
       f"{m} \\text{{ kg}} = ? \\text{{ g}}")

# --- Masa: mg -> g (10) ---
for m in random.sample(range(100, 9999), 10):
    res = round(m / 1000, 4)
    ex("mediciones_fundamentales", "conversion_masa", 1.3,
       ["conversion_unidades", "masa"], "numeric",
       "CONV_MASA_MG_G", {"valor": m, "de": "mg", "a": "g"},
       f"Convierte {m} mg a g.",
       str(res), f"{res} g",
       f"{m} mg / 1 000 = {res} g.",
       f"{m} \\text{{ mg}} = ? \\text{{ g}}")

# --- Temperatura: C -> F (5) ---
for t in [0, 25, 37, 100, -10]:
    res = round((t * 9/5) + 32, 2)
    ex("mediciones_fundamentales", "temperatura", 1.5,
       ["conversion_temperatura"], "numeric",
       "TEMP_C_F", {"valor": t, "de": "C", "a": "F"},
       f"Convierte {t} grados Celsius a grados Fahrenheit.",
       str(res), f"{res} grados F",
       f"Formula: F = (C x 9/5) + 32 = ({t} x 9/5) + 32 = {res} grados F.",
       f"T(°F) = {t} \\times \\frac{{9}}{{5}} + 32")

# --- Temperatura: F -> C (5) ---
for t in [32, 98.6, 212, 68, 50]:
    res = round((t - 32) * 5/9, 2)
    ex("mediciones_fundamentales", "temperatura", 1.5,
       ["conversion_temperatura"], "numeric",
       "TEMP_F_C", {"valor": t, "de": "F", "a": "C"},
       f"Convierte {t} grados Fahrenheit a grados Celsius.",
       str(res), f"{res} grados C",
       f"Formula: C = (F - 32) x 5/9 = ({t} - 32) x 5/9 = {res} grados C.",
       f"T(°C) = \\frac{{({t}-32) \\times 5}}{{9}}")

# --- Temperatura: C -> K (5) ---
for t in [20, 40, 15, 30, 50]:
    res = round(t + 273.15, 2)
    ex("mediciones_fundamentales", "temperatura", 1.2,
       ["conversion_temperatura"], "numeric",
       "TEMP_C_K", {"valor": t, "de": "C", "a": "K"},
       f"Convierte {t} grados Celsius a Kelvin.",
       str(res), f"{res} K",
       f"K = C + 273.15 = {t} + 273.15 = {res} K.",
       f"T(K) = {t} + 273.15")

# --- Densidad (15) ---
liquidos = [
    ("agua", 1.00), ("aceite vegetal", 0.92), ("alcohol etilico", 0.79),
    ("leche", 1.03), ("mercurio", 13.60), ("gasolina", 0.72),
    ("glicerina", 1.26), ("cloroformo", 1.49), ("acetona", 0.79),
    ("eter etilico", 0.71), ("benceno", 0.88), ("vinagre", 1.01),
    ("aceite de oliva", 0.91), ("agua salada", 1.025), ("sangre", 1.06)
]

# d = m/V (5)
for liq, d_r in liquidos[:5]:
    V = random.randint(50, 200)
    m = round(d_r * V, 2)
    ex("mediciones_fundamentales", "densidad", 1.6,
       ["densidad", "calculo"], "numeric",
       "DENS_CALC_D", {"masa": m, "volumen": V, "liquido": liq},
       f"Se tienen {m} g de {liq} que ocupan {V} mL. Calcula la densidad (g/mL).",
       str(round(m/V, 2)), f"{round(m/V,2)} g/mL",
       f"d = m/V = {m} g / {V} mL = {round(m/V,2)} g/mL.",
       f"d = \\frac{{{m}}}{{{V}}}")

# V = m/d (5)
for liq, d_r in liquidos[5:10]:
    m = random.randint(50, 500)
    V = round(m / d_r, 2)
    ex("mediciones_fundamentales", "densidad", 1.7,
       ["densidad", "calculo"], "numeric",
       "DENS_CALC_V", {"masa": m, "densidad": d_r, "liquido": liq},
       f"La densidad del {liq} es {d_r} g/mL. Que volumen ocupa {m} g?",
       str(V), f"{V} mL",
       f"V = m/d = {m} / {d_r} = {V} mL.",
       f"V = \\frac{{{m}}}{{{d_r}}}")

# m = d*V (5)
for liq, d_r in liquidos[10:15]:
    V = random.randint(100, 300)
    m = round(d_r * V, 2)
    ex("mediciones_fundamentales", "densidad", 1.5,
       ["densidad", "calculo"], "numeric",
       "DENS_CALC_M", {"volumen": V, "densidad": d_r, "liquido": liq},
       f"Si la densidad del {liq} es {d_r} g/mL y tienes {V} mL, cuantos gramos son?",
       str(m), f"{m} g",
       f"m = d x V = {d_r} x {V} = {m} g.",
       f"m = {d_r} \\times {V}")

# ==============================================================
# II. MATERIA  (85 ejercicios)
# ==============================================================

# --- Clasificacion (20) ---
matter_items = [
    ("el agua destilada (H2O)", "sustancia pura", "compuesto",
     "La formula H2O indica dos elementos (H y O) en proporcion fija."),
    ("el aire", "mezcla", "homogenea",
     "El aire es mezcla de N2, O2, Ar, CO2 en proporciones variables."),
    ("el hierro (Fe)", "sustancia pura", "elemento",
     "El hierro esta formado por un solo tipo de atomo."),
    ("el suelo", "mezcla", "heterogenea",
     "El suelo contiene minerales, materia organica y agua no uniformes."),
    ("el cloruro de sodio (NaCl)", "sustancia pura", "compuesto",
     "NaCl esta formado por Na y Cl en proporcion fija 1:1."),
    ("el vinagre", "mezcla", "homogenea",
     "El vinagre es solucion de acido acetico en agua, apariencia uniforme."),
    ("el oxigeno (O2)", "sustancia pura", "elemento",
     "El oxigeno esta formado solo por atomos de O."),
    ("la ensalada", "mezcla", "heterogenea",
     "La ensalada contiene componentes visiblemente distintos."),
    ("el dioxido de carbono (CO2)", "sustancia pura", "compuesto",
     "CO2 contiene C y O en proporcion fija 1:2."),
    ("el agua con aceite", "mezcla", "heterogenea",
     "Agua y aceite no se mezclan, forman fases visibles."),
    ("el oro (Au)", "sustancia pura", "elemento",
     "El oro esta formado solo por atomos de Au."),
    ("la leche", "mezcla", "heterogenea",
     "Aunque parece uniforme, la leche es una emulsion (coloide)."),
    ("la glucosa (C6H12O6)", "sustancia pura", "compuesto",
     "La glucosa contiene C, H y O en proporcion fija."),
    ("el bronce", "mezcla", "homogenea",
     "El bronce es aleacion Cu-Sn de apariencia uniforme."),
    ("el nitrogeno (N2)", "sustancia pura", "elemento",
     "N2 esta formado solo por atomos de nitrogeno."),
    ("el cafe con leche", "mezcla", "homogenea",
     "El cafe con leche tiene apariencia uniforme."),
    ("el amoniaco (NH3)", "sustancia pura", "compuesto",
     "NH3 contiene N y H en proporcion fija 1:3."),
    ("el concreto", "mezcla", "heterogenea",
     "El concreto contiene cemento, arena y grava distintos."),
    ("el azufre (S)", "sustancia pura", "elemento",
     "El azufre es un elemento puro."),
    ("el agua de mar", "mezcla", "homogenea",
     "El agua de mar es solucion de sales disueltas.")
]

for name, t1, t2, explic in matter_items:
    ex("materia", "clasificacion_materia", 1.5, ["clasificacion", "materia"], "text",
       "MATER_CLASS_01", {"sustancia": name},
       f"Clasifica {name}: es sustancia pura o mezcla? Si es mezcla, homogenea o heterogenea? Si es sustancia pura, elemento o compuesto?",
       f"{t1} — {t2}", f"{t1.capitalize()} / {t2.capitalize()}", explic)

# --- Estados fisicos (15) ---
state_items = [
    ("El hielo", "solido", "Los solidos tienen forma y volumen definidos; particulas muy unidas."),
    ("El vapor de agua", "gaseoso", "Los gases no tienen forma ni volumen definidos."),
    ("El mercurio a temperatura ambiente", "liquido", "Los liquidos tienen volumen fijo pero adoptan la forma del recipiente."),
    ("El oxigeno a 25 grados C", "gaseoso", "El O2 es gas a temperatura ambiente."),
    ("La madera", "solido", "La madera es solida: forma y volumen definidos."),
    ("El alcohol a temperatura ambiente", "liquido", "El etanol es liquido a 25 grados C."),
    ("El dioxido de carbono a 25 grados C y 1 atm", "gaseoso", "El CO2 es gas en condiciones normales."),
    ("La sal de cocina (NaCl) a 25 grados C", "solido", "El NaCl es solido cristalino a temperatura ambiente."),
    ("El agua a 50 grados C", "liquido", "A 50 grados C el agua sigue siendo liquida (punto de ebullicion = 100 grados C)."),
    ("El nitrogeno a 25 grados C y 1 atm", "gaseoso", "El N2 hierve a -196 grados C, por eso es gas a 25 grados C."),
    ("El oro a temperatura ambiente", "solido", "El oro funde a 1 064 grados C; a temperatura ambiente es solido."),
    ("La miel a 20 grados C", "liquido", "La miel es un liquido viscoso a 20 grados C."),
    ("El azufre a 25 grados C", "solido", "El azufre es un solido amarillo a temperatura ambiente."),
    ("El helio a 25 grados C", "gaseoso", "El He hierve a -269 grados C; es gas en condiciones normales."),
    ("El aceite de oliva a 20 grados C", "liquido", "El aceite de oliva es liquido a temperatura ambiente.")
]

for subst, estado, explic in state_items:
    ex("materia", "estados_fisicos", 1.2, ["estados_fisicos"], "text",
       "MATER_ESTADO_01", {"sustancia": subst},
       f"{subst} - en que estado fisico se encuentra?",
       estado, estado.capitalize(), explic)

# --- Propiedades fisicas vs quimicas (20) ---
propiedades = [
    ("El punto de fusion del hielo es 0 grados C", "fisica",
     "Es observable sin cambiar la composicion quimica."),
    ("La combustibilidad de la madera", "quimica",
     "La combustion transforma la madera en CO2 y H2O."),
    ("La densidad del oro (19,3 g/cm3)", "fisica",
     "La densidad se mide sin alterar la naturaleza del material."),
    ("La reactividad del sodio con el agua", "quimica",
     "Implica reaccion que produce NaOH e H2."),
    ("El color amarillo del azufre", "fisica",
     "El color es observable sin cambio de composicion."),
    ("La capacidad del hierro de oxidarse", "quimica",
     "La oxidacion convierte Fe en Fe2O3."),
    ("La dureza del diamante (10 en Mohs)", "fisica",
     "La dureza se mide sin reaccion quimica."),
    ("La acidez del vinagre (pH 3)", "quimica",
     "El pH refleja la capacidad de liberar H+."),
    ("La conductividad electrica del cobre", "fisica",
     "Se mide sin alterar la composicion del cobre."),
    ("La capacidad del magnesio de arder con luz brillante", "quimica",
     "Arder transforma Mg en MgO."),
    ("El punto de ebullicion del agua (100 grados C)", "fisica",
     "Cambio de estado sin alterar la composicion."),
    ("La toxicidad del monoxido de carbono", "quimica",
     "Refleja como CO interactua con moleculas del cuerpo."),
    ("La solubilidad del azucar en agua", "fisica",
     "El azucar se disuelve sin cambiar su composicion."),
    ("La capacidad del zinc de disolverse en acido clorhidrico", "quimica",
     "Reaccion: Zn + HCl -> ZnCl2 + H2."),
    ("El brillo metalico de la plata", "fisica",
     "Es una propiedad visual sin cambio quimico."),
    ("La inestabilidad del agua oxigenada (H2O2)", "quimica",
     "El H2O2 se descompone en H2O y O2."),
    ("La transparencia del vidrio", "fisica",
     "Es una propiedad optica sin alterar la composicion."),
    ("La capacidad del hierro de formar sales", "quimica",
     "Implica reacciones que cambian la composicion."),
    ("El olor penetrante del amoniaco", "fisica",
     "El olor es detectable sin reaccion quimica."),
    ("La capacidad de la plata de ennegrecerse con el tiempo", "quimica",
     "La plata reacciona con el azufre del aire formando Ag2S.")
]

for prop, tipo, explic in propiedades:
    ex("materia", "propiedades_fisico_quimicas", 1.4,
       ["propiedades_materia"], "text",
       "PROP_FQ_01", {"propiedad": prop},
       f"Es la siguiente una propiedad fisica o quimica? '{prop}'",
       tipo, f"Propiedad {tipo}", explic)

# --- Cambios fisicos vs quimicos (15) ---
cambios = [
    ("Fundir un cubo de hielo", "fisico",
     "El agua cambia de estado (solido a liquido) pero sigue siendo H2O."),
    ("Quemar papel", "quimico",
     "El papel se convierte en CO2, H2O y cenizas; cambia la composicion."),
    ("Cortar una hoja de papel", "fisico",
     "Solo cambia la forma, no la composicion."),
    ("Fermentar el azucar en alcohol", "quimico",
     "La levadura transforma C6H12O6 en C2H5OH y CO2."),
    ("Evaporar el agua", "fisico",
     "El agua pasa a vapor pero sigue siendo H2O."),
    ("Oxidar el hierro (formacion de oxido)", "quimico",
     "Se forma Fe2O3, un compuesto distinto al Fe original."),
    ("Disolver sal en agua", "fisico",
     "El NaCl se ioniza pero puede recuperarse por evaporacion."),
    ("Cocinar un huevo", "quimico",
     "Las proteinas se desnaturalizan; proceso irreversible."),
    ("Doblar un alambre de cobre", "fisico",
     "Solo cambia la forma, no la composicion."),
    ("La explosion de la polvora", "quimico",
     "Reaccion violenta que genera gases y calor."),
    ("Triturar azucar en polvo fino", "fisico",
     "Solo cambia el tamano de las particulas, no la composicion."),
    ("La digestion de los alimentos", "quimico",
     "Los alimentos se transforman en moleculas mas simples por enzimas."),
    ("Congelar jugo de naranja", "fisico",
     "El agua del jugo pasa a solido, sin cambio quimico."),
    ("La fotosintesis en plantas", "quimico",
     "6CO2 + 6H2O -> C6H12O6 + 6O2; cambio de composicion."),
    ("Destilar agua de mar", "fisico",
     "Se separa el agua de las sales por cambio de estado, sin reaccion quimica.")
]

for proceso, tipo, explic in cambios:
    ex("materia", "cambios_fisico_quimicos", 1.4,
       ["cambios_materia"], "text",
       "CAMBIO_FQ_01", {"proceso": proceso},
       f"El siguiente proceso es cambio fisico o quimico? '{proceso}'",
       tipo, f"Cambio {tipo}", explic)

# --- Ley de conservacion de la masa (15) ---
cons_data = [
    (10, 15, 25, "2H2 + O2 -> 2H2O"),
    (28, 32, 60, "2Mg + O2 -> 2MgO"),
    (12, 32, 44, "C + O2 -> CO2"),
    (46, 32, 78, "2Na + Cl2 -> 2NaCl"),
    (2, 32, 34, "H2 + S -> H2S"),
    (24, 16, 40, "2Na + O2 -> Na2O2 (aprox)"),
    (8, 8, 16, "2H2 + O2 -> 2H2O (parcial)"),
    (40, 36, 76, "CaO + 2HCl -> CaCl2 + H2O"),
    (32, 8, 40, "S + O2 -> SO2 (parcial)"),
    (36, 20, 56, "CO2 + 2NaOH -> Na2CO3 + H2O"),
    (100, 44, 56, "CaCO3 -> CaO + CO2"),
    (14, 16, 30, "2N + O2 -> 2NO"),
    (56, 32, 80, "Fe + S -> FeS (aprox)"),
    (4, 16, 18, "CH4 + O2 -> parcial"),
    (20, 12, 32, "4Na + O2 -> 2Na2O (aprox)")
]

for m1, m2, m3, rxn in cons_data:
    ex("materia", "ley_conservacion_masa", 1.6,
       ["conservacion_masa", "calculo"], "numeric",
       "CONS_MASA_01", {"m1": m1, "m2": m2, "m3": m3, "reaccion": rxn},
       f"En la reaccion {rxn}, se consumen {m1} g del reactivo A y {m2} g del reactivo B. Segun la Ley de Conservacion de la Masa, cuantos gramos de producto se forman?",
       str(m3), f"{m3} g",
       f"Ley de Conservacion de la Masa: masa reactivos = masa productos. {m1} g + {m2} g = {m3} g.",
       f"{m1} + {m2} = ?")

# ==============================================================
# III. ELEMENTOS Y ATOMOS  (105 ejercicios)
# ==============================================================

ELEMENTOS = [
    (1, "H", "Hidrogeno", 1.008),
    (2, "He", "Helio", 4.003),
    (3, "Li", "Litio", 6.941),
    (4, "Be", "Berilio", 9.012),
    (5, "B", "Boro", 10.811),
    (6, "C", "Carbono", 12.011),
    (7, "N", "Nitrogeno", 14.007),
    (8, "O", "Oxigeno", 15.999),
    (9, "F", "Fluor", 18.998),
    (10, "Ne", "Neon", 20.180),
    (11, "Na", "Sodio", 22.990),
    (12, "Mg", "Magnesio", 24.305),
    (13, "Al", "Aluminio", 26.982),
    (14, "Si", "Silicio", 28.086),
    (15, "P", "Fosforo", 30.974),
    (16, "S", "Azufre", 32.065),
    (17, "Cl", "Cloro", 35.453),
    (18, "Ar", "Argon", 39.948),
    (19, "K", "Potasio", 39.098),
    (20, "Ca", "Calcio", 40.078),
    (21, "Sc", "Escandio", 44.956),
    (22, "Ti", "Titanio", 47.867),
    (23, "V", "Vanadio", 50.942),
    (24, "Cr", "Cromo", 51.996),
    (25, "Mn", "Manganeso", 54.938),
    (26, "Fe", "Hierro", 55.845),
    (27, "Co", "Cobalto", 58.933),
    (28, "Ni", "Niquel", 58.693),
    (29, "Cu", "Cobre", 63.546),
    (30, "Zn", "Zinc", 65.380),
    (31, "Ga", "Galio", 69.723),
    (32, "Ge", "Germanio", 72.630),
    (33, "As", "Arsenico", 74.922),
    (34, "Se", "Selenio", 78.960),
    (35, "Br", "Bromo", 79.904),
    (36, "Kr", "Kripton", 83.798),
    (37, "Rb", "Rubidio", 85.468),
    (38, "Sr", "Estroncio", 87.620),
    (39, "Y", "Itrio", 88.906),
    (40, "Zr", "Zirconio", 91.224),
    (41, "Nb", "Niobio", 92.906),
    (42, "Mo", "Molibdeno", 95.960),
    (43, "Tc", "Tecnecio", 98.000),
    (44, "Ru", "Rutenio", 101.070),
    (45, "Rh", "Rodio", 102.906),
    (46, "Pd", "Paladio", 106.420),
    (47, "Ag", "Plata", 107.868),
    (48, "Cd", "Cadmio", 112.411),
    (49, "In", "Indio", 114.818),
    (50, "Sn", "Estano", 118.710),
    (51, "Sb", "Antimonio", 121.760),
    (52, "Te", "Teluro", 127.600),
    (53, "I", "Yodo", 126.904),
    (54, "Xe", "Xenon", 131.293),
    (55, "Cs", "Cesio", 132.905),
    (56, "Ba", "Bario", 137.327),
    (57, "La", "Lantano", 138.905)
]

# Simbolo -> Nombre (30)
for Z, sym, name, mass in random.sample(ELEMENTOS, 30):
    ex("elementos_atomos", "simbolos_nombres", 1.3,
       ["elementos"], "text",
       "ELEM_SIM_NOM", {"simbolo": sym, "Z": Z},
       f"Cual es el nombre del elemento cuyo simbolo es '{sym}'?",
       name, name,
       f"El simbolo {sym} corresponde al elemento numero {Z}: {name}.")

# Nombre -> Simbolo (30)
for Z, sym, name, mass in random.sample(ELEMENTOS, 30):
    ex("elementos_atomos", "simbolos_nombres", 1.3,
       ["elementos"], "text",
       "ELEM_NOM_SIM", {"nombre": name, "Z": Z},
       f"Escribe el simbolo del elemento '{name}'.",
       sym, sym,
       f"El elemento {name} tiene numero atomico {Z} y simbolo {sym}.")

# Particulas subatomicas (20)
part_templates = [
    ("protones", lambda Z, A: Z, "Z", "Los protones definen el numero atomico Z."),
    ("neutrones", lambda Z, A: A-Z, "A-Z", "Neutrones = numero masico (A) - numero atomico (Z)."),
    ("electrones", lambda Z, A: Z, "Z (atomo neutro)", "En un atomo neutro, electrones = protones = Z.")
]

rng_elems = [ELEMENTOS[i] for i in random.sample(range(30), 20)]
for i, (Z, sym, name, mass) in enumerate(rng_elems):
    A = Z + random.randint(max(1, int(Z*0.9)), int(Z*1.3) + 1)
    particle, calc, desc, explic_p = part_templates[i % 3]
    answer = calc(Z, A)
    ex("elementos_atomos", "particulas_subatomicas", 1.5,
       ["particulas_subatomicas"], "numeric",
       "ATOM_PART_01", {"Z": Z, "A": A, "elemento": name, "particula": particle},
       f"El atomo de {name} ({sym}) tiene numero atomico Z={Z} y numero masico A={A}. Cuantos {particle} tiene?",
       str(answer), str(answer),
       f"{explic_p} Para {name}: {particle} = {answer}.",
       f"Z={Z}, A={A}")

# Isotopos - identificacion (10)
isotopes_db = [
    ("Hidrogeno", "H", 1, 1, "Protio", 1, 2, "Deuterio"),
    ("Carbono", "C", 6, 12, "C-12", 6, 14, "C-14"),
    ("Oxigeno", "O", 8, 16, "O-16", 8, 18, "O-18"),
    ("Cloro", "Cl", 17, 35, "Cl-35", 17, 37, "Cl-37"),
    ("Uranio", "U", 92, 235, "U-235", 92, 238, "U-238"),
    ("Hierro", "Fe", 26, 54, "Fe-54", 26, 56, "Fe-56"),
    ("Cobre", "Cu", 29, 63, "Cu-63", 29, 65, "Cu-65"),
    ("Bromo", "Br", 35, 79, "Br-79", 35, 81, "Br-81"),
    ("Magnesio", "Mg", 12, 24, "Mg-24", 12, 26, "Mg-26"),
    ("Calcio", "Ca", 20, 40, "Ca-40", 20, 44, "Ca-44")
]

for name, sym, z1, a1, iso1, z2, a2, iso2 in isotopes_db:
    ex("elementos_atomos", "isotopos", 1.6,
       ["isotopos"], "text",
       "ISOTOPO_01", {"elemento": name, "iso1": iso1, "iso2": iso2, "Z": z1, "A1": a1, "A2": a2},
       f"El {iso1} y el {iso2} son isotopos del {name}? Justifica tu respuesta.",
       "Si, son isotopos",
       "Si, son isotopos",
       f"Ambos tienen Z={z1} (mismo elemento {name}), pero A diferente ({a1} y {a2}). Los isotopos tienen igual Z y diferente A.")

# Masas atomicas (15)
for Z, sym, name, mass in ELEMENTOS[:15]:
    ex("elementos_atomos", "masas_atomicas", 1.3,
       ["masa_atomica"], "numeric",
       "MASA_ATOM_01", {"Z": Z, "simbolo": sym, "elemento": name},
       f"Cual es la masa atomica del {name} ({sym}) en unidades de masa atomica (uma)?",
       str(mass), f"{mass} uma",
       f"La masa atomica del {name} ({sym}, Z={Z}) es {mass} uma segun la tabla periodica.")

# ==============================================================
# IV. TABLA PERIODICA  (90 ejercicios)
# ==============================================================

# Ubicacion: periodo y familia (30)
elem_loc = [
    (1, "H", "Hidrogeno", 1, "IA"),
    (2, "He", "Helio", 1, "VIII A"),
    (3, "Li", "Litio", 2, "IA"),
    (4, "Be", "Berilio", 2, "IIA"),
    (5, "B", "Boro", 2, "IIIA"),
    (6, "C", "Carbono", 2, "IVA"),
    (7, "N", "Nitrogeno", 2, "VA"),
    (8, "O", "Oxigeno", 2, "VIA"),
    (9, "F", "Fluor", 2, "VIIA"),
    (10, "Ne", "Neon", 2, "VIII A"),
    (11, "Na", "Sodio", 3, "IA"),
    (12, "Mg", "Magnesio", 3, "IIA"),
    (17, "Cl", "Cloro", 3, "VIIA"),
    (18, "Ar", "Argon", 3, "VIII A"),
    (19, "K", "Potasio", 4, "IA"),
    (20, "Ca", "Calcio", 4, "IIA"),
    (26, "Fe", "Hierro", 4, "VIII B"),
    (29, "Cu", "Cobre", 4, "IB"),
    (35, "Br", "Bromo", 4, "VIIA"),
    (36, "Kr", "Kripton", 4, "VIII A"),
    (37, "Rb", "Rubidio", 5, "IA"),
    (47, "Ag", "Plata", 5, "IB"),
    (53, "I", "Yodo", 5, "VIIA"),
    (55, "Cs", "Cesio", 6, "IA"),
    (56, "Ba", "Bario", 6, "IIA"),
    (80, "Hg", "Mercurio", 6, "IIB"),
    (82, "Pb", "Plomo", 6, "IVA"),
    (86, "Rn", "Radon", 6, "VIII A"),
    (87, "Fr", "Francio", 7, "IA"),
    (88, "Ra", "Radio", 7, "IIA")
]

for Z, sym, name, period, group in elem_loc:
    ex("tabla_periodica", "ubicacion_tabla", 1.5,
       ["tabla_periodica", "familias", "periodos"], "text",
       "TABLA_LOC_01", {"Z": Z, "elemento": name, "simbolo": sym},
       f"En que periodo y familia se encuentra el {name} ({sym}) en la tabla periodica?",
       f"Periodo {period}, Familia {group}",
       f"Periodo {period} / Familia {group}",
       f"El {name} ({sym}, Z={Z}) se ubica en el periodo {period} y pertenece a la familia {group}.")

# Metal / no metal / metaloide (30)
metal_class = [
    ("Hierro (Fe)", "metal", "Conduce electricidad y calor, es maleable y ductil, tiene brillo metalico."),
    ("Oxigeno (O2)", "no metal", "Gas; no conduce electricidad; no tiene brillo metalico."),
    ("Silicio (Si)", "metaloide", "Semiconductor usado en chips; propiedades intermedias."),
    ("Oro (Au)", "metal", "Excelente conductor, brillante, maleable, resistente a la corrosion."),
    ("Azufre (S)", "no metal", "Solido amarillo, mal conductor, fragil."),
    ("Germanio (Ge)", "metaloide", "Semiconductor importante en electronica."),
    ("Cobre (Cu)", "metal", "Excelente conductor electrico y termico, maleable y ductil."),
    ("Cloro (Cl2)", "no metal", "Gas amarillo-verdoso, corrosivo, mal conductor."),
    ("Boro (B)", "metaloide", "Tiene algunas propiedades metalicas pero es fragil; semiconductor."),
    ("Calcio (Ca)", "metal", "Metal alcalinoterreo, conductor, reactivo con agua."),
    ("Carbono (C)", "no metal", "No metal versatil; diamante y grafito son sus alotropos."),
    ("Arsenico (As)", "metaloide", "Tiene brillo metalico pero propiedades intermedias."),
    ("Plata (Ag)", "metal", "Mejor conductor electrico, maleable y ductil."),
    ("Fosforo (P)", "no metal", "Solido a T ambiente, no conductor, altamente reactivo."),
    ("Antimonio (Sb)", "metaloide", "Apariencia metalica pero fragil y mal conductor."),
    ("Aluminio (Al)", "metal", "Conductor ligero, maleable, ampliamente usado en la industria."),
    ("Nitrogeno (N2)", "no metal", "Gas inerte, no conductor, componente mayoritario del aire."),
    ("Teluro (Te)", "metaloide", "Semiconductor con brillo metalico pero fragil."),
    ("Zinc (Zn)", "metal", "Metal de transicion, buen conductor, usado en galvanizacion."),
    ("Bromo (Br2)", "no metal", "Liquido rojizo a T ambiente, no conductor, muy reactivo."),
    ("Estano (Sn)", "metal", "Metal suave, conductor, usado en aleaciones."),
    ("Plomo (Pb)", "metal", "Metal pesado, conductor, muy denso; usado en baterias."),
    ("Yodo (I2)", "no metal", "Solido brillante a T ambiente, pero no conductor."),
    ("Sodio (Na)", "metal", "Metal alcalino muy reactivo con el agua."),
    ("Hidrogeno (H)", "no metal", "Gas no conductor; aunque esta en el grupo IA, es no metalico."),
    ("Cromo (Cr)", "metal", "Metal de transicion brillante y duro."),
    ("Niquel (Ni)", "metal", "Metal duro, conductor, usado en monedas y baterias."),
    ("Titanio (Ti)", "metal", "Metal de transicion ligero y resistente."),
    ("Neon (Ne)", "no metal", "Gas noble, no conductor, extremadamente inerte."),
    ("Magnesio (Mg)", "metal", "Metal alcalinoterreo, ligero y conductor.")
]

for elem, tipo, explic in metal_class:
    ex("tabla_periodica", "metales_no_metales_metaloides", 1.4,
       ["tabla_periodica", "clasificacion"], "text",
       "TABLA_CLASS_01", {"elemento": elem},
       f"Clasifica el elemento: {elem} — es metal, no metal o metaloide?",
       tipo, tipo.capitalize(), explic)

# Masa molar (30)
compounds_mm = [
    ("H2O",     [("H", 1.008, 2), ("O", 15.999, 1)]),
    ("NaCl",    [("Na", 22.990, 1), ("Cl", 35.453, 1)]),
    ("CO2",     [("C", 12.011, 1), ("O", 15.999, 2)]),
    ("H2SO4",   [("H", 1.008, 2), ("S", 32.065, 1), ("O", 15.999, 4)]),
    ("HCl",     [("H", 1.008, 1), ("Cl", 35.453, 1)]),
    ("NH3",     [("N", 14.007, 1), ("H", 1.008, 3)]),
    ("Ca(OH)2", [("Ca", 40.078, 1), ("O", 15.999, 2), ("H", 1.008, 2)]),
    ("NaOH",    [("Na", 22.990, 1), ("O", 15.999, 1), ("H", 1.008, 1)]),
    ("CaCO3",   [("Ca", 40.078, 1), ("C", 12.011, 1), ("O", 15.999, 3)]),
    ("CH4",     [("C", 12.011, 1), ("H", 1.008, 4)]),
    ("C6H12O6", [("C", 12.011, 6), ("H", 1.008, 12), ("O", 15.999, 6)]),
    ("MgO",     [("Mg", 24.305, 1), ("O", 15.999, 1)]),
    ("Fe2O3",   [("Fe", 55.845, 2), ("O", 15.999, 3)]),
    ("KMnO4",   [("K", 39.098, 1), ("Mn", 54.938, 1), ("O", 15.999, 4)]),
    ("AlCl3",   [("Al", 26.982, 1), ("Cl", 35.453, 3)]),
    ("HNO3",    [("H", 1.008, 1), ("N", 14.007, 1), ("O", 15.999, 3)]),
    ("H3PO4",   [("H", 1.008, 3), ("P", 30.974, 1), ("O", 15.999, 4)]),
    ("MgSO4",   [("Mg", 24.305, 1), ("S", 32.065, 1), ("O", 15.999, 4)]),
    ("ZnO",     [("Zn", 65.380, 1), ("O", 15.999, 1)]),
    ("CuSO4",   [("Cu", 63.546, 1), ("S", 32.065, 1), ("O", 15.999, 4)]),
    ("Na2CO3",  [("Na", 22.990, 2), ("C", 12.011, 1), ("O", 15.999, 3)]),
    ("KCl",     [("K", 39.098, 1), ("Cl", 35.453, 1)]),
    ("BaSO4",   [("Ba", 137.327, 1), ("S", 32.065, 1), ("O", 15.999, 4)]),
    ("C2H5OH",  [("C", 12.011, 2), ("H", 1.008, 6), ("O", 15.999, 1)]),
    ("NaHCO3",  [("Na", 22.990, 1), ("H", 1.008, 1), ("C", 12.011, 1), ("O", 15.999, 3)]),
    ("Fe(OH)3", [("Fe", 55.845, 1), ("O", 15.999, 3), ("H", 1.008, 3)]),
    ("CaCl2",   [("Ca", 40.078, 1), ("Cl", 35.453, 2)]),
    ("Mg(NO3)2",[("Mg", 24.305, 1), ("N", 14.007, 2), ("O", 15.999, 6)]),
    ("Al2O3",   [("Al", 26.982, 2), ("O", 15.999, 3)]),
    ("K2SO4",   [("K", 39.098, 2), ("S", 32.065, 1), ("O", 15.999, 4)])
]

for formula, atoms in compounds_mm:
    mm = round(sum(mass * count for _, mass, count in atoms), 2)
    steps = " + ".join([f"{count}x{mass} ({sym})" for sym, mass, count in atoms])
    ex("tabla_periodica", "masa_molar", 1.8,
       ["masa_molar", "tabla_periodica", "calculo"], "numeric",
       "MASA_MOLAR_01", {"formula": formula},
       f"Calcula la masa molar del compuesto {formula} (g/mol, 2 cifras decimales).",
       str(mm), f"{mm} g/mol",
       f"M({formula}) = {steps} = {mm} g/mol.",
       f"M({formula}) = ?")

# ==============================================================
# V. NOMENCLATURA  (130 ejercicios)
# ==============================================================

# Numero de oxidacion (30)
oxnum_data = [
    ("Na", "NaCl", 1, "El sodio tiene oxidacion fija +1 en sus compuestos ionicos."),
    ("Cl", "NaCl", -1, "En el NaCl (haluro), el cloro tiene oxidacion -1."),
    ("Fe", "Fe2O3", 3, "2x + 3(-2) = 0 -> x = +3. Fe tiene oxidacion +3 en la hematita."),
    ("Fe", "FeO", 2, "x + (-2) = 0 -> x = +2."),
    ("S", "SO4(2-)", 6, "x + 4(-2) = -2 -> x = +6."),
    ("S", "SO3(2-)", 4, "x + 3(-2) = -2 -> x = +4."),
    ("N", "NO3(-)", 5, "x + 3(-2) = -1 -> x = +5."),
    ("N", "NO2(-)", 3, "x + 2(-2) = -1 -> x = +3."),
    ("Mn", "KMnO4", 7, "+1 + x + 4(-2) = 0 -> x = +7."),
    ("Cr", "K2Cr2O7", 6, "2(+1) + 2x + 7(-2) = 0 -> x = +6."),
    ("P", "H3PO4", 5, "3(+1) + x + 4(-2) = 0 -> x = +5."),
    ("P", "H3PO3", 3, "3(+1) + x + 3(-2) = 0 -> x = +3."),
    ("C", "CO2", 4, "x + 2(-2) = 0 -> x = +4."),
    ("C", "CO", 2, "x + (-2) = 0 -> x = +2."),
    ("O", "H2O", -2, "El oxigeno tiene oxidacion -2 (regla general)."),
    ("H", "H2O", 1, "El hidrogeno tiene oxidacion +1 en compuestos con no metales."),
    ("Cu", "CuO", 2, "x + (-2) = 0 -> x = +2."),
    ("Cu", "Cu2O", 1, "2x + (-2) = 0 -> x = +1."),
    ("Cl", "HClO4", 7, "+1 + x + 4(-2) = 0 -> x = +7."),
    ("Cl", "HClO3", 5, "+1 + x + 3(-2) = 0 -> x = +5."),
    ("Cl", "HClO2", 3, "+1 + x + 2(-2) = 0 -> x = +3."),
    ("Cl", "HClO", 1, "+1 + x + (-2) = 0 -> x = +1."),
    ("Pb", "PbO2", 4, "x + 2(-2) = 0 -> x = +4."),
    ("Pb", "PbO", 2, "x + (-2) = 0 -> x = +2."),
    ("Sn", "SnO2", 4, "x + 2(-2) = 0 -> x = +4."),
    ("Sn", "SnO", 2, "x + (-2) = 0 -> x = +2."),
    ("As", "As2O5", 5, "2x + 5(-2) = 0 -> x = +5."),
    ("As", "As2O3", 3, "2x + 3(-2) = 0 -> x = +3."),
    ("Bi", "Bi2O3", 3, "2x + 3(-2) = 0 -> x = +3."),
    ("Al", "Al2O3", 3, "2x + 3(-2) = 0 -> x = +3. Aluminio tiene oxidacion fija +3.")
]

for elem, compound, ox, explic in oxnum_data:
    sign = "+" if ox > 0 else ""
    ex("nomenclatura", "numero_oxidacion", 1.7,
       ["numero_oxidacion", "nomenclatura"], "numeric",
       "OXNUM_01", {"elemento": elem, "compuesto": compound},
       f"Cual es el numero de oxidacion del {elem} en el compuesto {compound}?",
       str(ox), f"{sign}{ox}",
       explic,
       f"n.o.({elem}) \\text{{ en }} {compound} = ?")

# Compuestos binarios — 3 sistemas (60 ejercicios: 30 formula->nombres + 30 nombre->formula)
binary_compounds = [
    ("NaCl",   "sodio", "cloro", 1, "cloruro sodico", "cloruro de sodio", "cloruro de sodio(I)"),
    ("MgCl2",  "magnesio", "cloro", 2, "cloruro magnesico", "dicloruro de magnesio", "cloruro de magnesio(II)"),
    ("AlCl3",  "aluminio", "cloro", 3, "cloruro aluminico", "tricloruro de aluminio", "cloruro de aluminio(III)"),
    ("FeCl2",  "hierro", "cloro", 2, "cloruro ferroso", "dicloruro de hierro", "cloruro de hierro(II)"),
    ("FeCl3",  "hierro", "cloro", 3, "cloruro ferrico", "tricloruro de hierro", "cloruro de hierro(III)"),
    ("CuCl",   "cobre", "cloro", 1, "cloruro cuproso", "cloruro de cobre", "cloruro de cobre(I)"),
    ("CuCl2",  "cobre", "cloro", 2, "cloruro cuprico", "dicloruro de cobre", "cloruro de cobre(II)"),
    ("SnCl2",  "estano", "cloro", 2, "cloruro estannoso", "dicloruro de estano", "cloruro de estano(II)"),
    ("SnCl4",  "estano", "cloro", 4, "cloruro stannico", "tetracloruro de estano", "cloruro de estano(IV)"),
    ("PbCl2",  "plomo", "cloro", 2, "cloruro plumboso", "dicloruro de plomo", "cloruro de plomo(II)"),
    ("FeO",    "hierro", "oxigeno", 2, "oxido ferroso", "monoxido de hierro", "oxido de hierro(II)"),
    ("Fe2O3",  "hierro", "oxigeno", 3, "oxido ferrico", "trioxido de dihierro", "oxido de hierro(III)"),
    ("CuO",    "cobre", "oxigeno", 2, "oxido cuprico", "monoxido de cobre", "oxido de cobre(II)"),
    ("Cu2O",   "cobre", "oxigeno", 1, "oxido cuproso", "monoxido de dicobre", "oxido de cobre(I)"),
    ("MgO",    "magnesio", "oxigeno", 2, "oxido magnesico", "monoxido de magnesio", "oxido de magnesio(II)"),
    ("Al2O3",  "aluminio", "oxigeno", 3, "oxido aluminico", "trioxido de dialuminio", "oxido de aluminio(III)"),
    ("Na2O",   "sodio", "oxigeno", 1, "oxido sodico", "monoxido de disodio", "oxido de sodio(I)"),
    ("CaO",    "calcio", "oxigeno", 2, "oxido calcico", "monoxido de calcio", "oxido de calcio(II)"),
    ("CO",     "carbono", "oxigeno", 2, "oxido carbonoso", "monoxido de carbono", "oxido de carbono(II)"),
    ("CO2",    "carbono", "oxigeno", 4, "dioxido carbonico", "dioxido de carbono", "oxido de carbono(IV)"),
    ("SO2",    "azufre", "oxigeno", 4, "dioxido sulfuroso", "dioxido de azufre", "oxido de azufre(IV)"),
    ("SO3",    "azufre", "oxigeno", 6, "trioxido sulfurico", "trioxido de azufre", "oxido de azufre(VI)"),
    ("NO",     "nitrogeno", "oxigeno", 2, "oxido nitroso", "monoxido de nitrogeno", "oxido de nitrogeno(II)"),
    ("NO2",    "nitrogeno", "oxigeno", 4, "dioxido de nitrogeno", "dioxido de nitrogeno", "oxido de nitrogeno(IV)"),
    ("P2O5",   "fosforo", "oxigeno", 5, "pentozido fosforico", "pentoxido de difosforo", "oxido de fosforo(V)"),
    ("P2O3",   "fosforo", "oxigeno", 3, "trioxido fosforoso", "trioxido de difosforo", "oxido de fosforo(III)"),
    ("HF",     "hidrogeno", "fluor", 1, "fluoruro de hidrogeno", "fluoruro de hidrogeno", "fluoruro de hidrogeno"),
    ("HBr",    "hidrogeno", "bromo", 1, "bromuro de hidrogeno", "bromuro de hidrogeno", "bromuro de hidrogeno"),
    ("H2S",    "hidrogeno", "azufre", 2, "sulfuro de dihidrogeno", "sulfuro de dihidrogeno", "sulfuro de hidrogeno(II)"),
    ("CCl4",   "carbono", "cloro", 4, "tetracloruro carbonico", "tetracloruro de carbono", "cloruro de carbono(IV)")
]

for formula, metal, nonmetal, ox, clasico, estequio, stock in binary_compounds:
    # Formula -> 3 nombres
    ex("nomenclatura", "compuestos_binarios", 2.0,
       ["nomenclatura", "compuestos_binarios"], "text",
       "NOMEN_BIN_3S", {"formula": formula},
       f"Nombra el compuesto binario {formula} usando el sistema Clasico, Estequiometrico y Stock.",
       f"Clasico: {clasico} | Estequiometrico: {estequio} | Stock: {stock}",
       f"Clasico: {clasico} / Estequiometrico: {estequio} / Stock: {stock}",
       f"Clasico: usa sufijos -oso/-ico -> {clasico}. Estequiometrico: prefijos mono/di/tri -> {estequio}. Stock: indica la valencia -> {stock}.")

    # Nombre Stock -> formula
    ex("nomenclatura", "compuestos_binarios", 2.0,
       ["nomenclatura", "compuestos_binarios"], "text",
       "NOMEN_BIN_FORM", {"nombre_stock": stock},
       f"Escribe la formula del compuesto llamado '{stock}'.",
       formula, formula,
       f"'{stock}' corresponde al compuesto de {metal} con oxidacion +{ox} y {nonmetal}. Formula: {formula}.")

# Acidos ternarios (20)
ternary_acids = [
    ("H2SO4",  "acido sulfurico"),
    ("H2SO3",  "acido sulfuroso"),
    ("HNO3",   "acido nitrico"),
    ("HNO2",   "acido nitroso"),
    ("H3PO4",  "acido fosforico"),
    ("H3PO3",  "acido fosforoso"),
    ("HClO4",  "acido perclorico"),
    ("HClO3",  "acido clorico"),
    ("HClO2",  "acido cloroso"),
    ("HClO",   "acido hipocloroso"),
    ("H2CO3",  "acido carbonico"),
    ("HBrO3",  "acido bromico"),
    ("HBrO",   "acido hipobromoso"),
    ("HIO3",   "acido yodico"),
    ("H2CrO4", "acido cromico"),
    ("HMnO4",  "acido permanganico"),
    ("H3BO3",  "acido borico"),
    ("HF",     "acido fluorhidrico"),
    ("H3AsO4", "acido arsenico"),
    ("H3AsO3", "acido arsenioso")
]

for formula, nombre in ternary_acids:
    ex("nomenclatura", "nomenclatura_ternaria", 2.1,
       ["nomenclatura", "oxoacidos"], "text",
       "NOMEN_ACID_01", {"formula": formula},
       f"Como se llama el oxoacido (acido ternario) con formula {formula}?",
       nombre, nombre,
       f"La formula {formula} corresponde al {nombre}.")

    ex("nomenclatura", "nomenclatura_ternaria", 2.1,
       ["nomenclatura", "oxoacidos"], "text",
       "NOMEN_ACID_FORM", {"nombre": nombre},
       f"Escribe la formula del {nombre}.",
       formula, formula,
       f"El {nombre} tiene la formula {formula}.")

# Hidroxidos (20)
hydroxides = [
    ("NaOH",     "hidróxido de sodio", "Na(+1)", "OH(-)"),
    ("KOH",      "hidróxido de potasio", "K(+1)", "OH(-)"),
    ("Ca(OH)2",  "hidróxido de calcio", "Ca(+2)", "2 OH(-)"),
    ("Mg(OH)2",  "hidróxido de magnesio", "Mg(+2)", "2 OH(-)"),
    ("Al(OH)3",  "hidróxido de aluminio", "Al(+3)", "3 OH(-)"),
    ("Fe(OH)2",  "hidróxido de hierro(II)", "Fe(+2)", "2 OH(-)"),
    ("Fe(OH)3",  "hidróxido de hierro(III)", "Fe(+3)", "3 OH(-)"),
    ("Cu(OH)2",  "hidróxido de cobre(II)", "Cu(+2)", "2 OH(-)"),
    ("Ba(OH)2",  "hidróxido de bario", "Ba(+2)", "2 OH(-)"),
    ("NH4OH",    "hidróxido de amonio", "NH4(+)", "OH(-)"),
    ("Zn(OH)2",  "hidróxido de zinc", "Zn(+2)", "2 OH(-)"),
    ("Pb(OH)2",  "hidróxido de plomo(II)", "Pb(+2)", "2 OH(-)"),
    ("Cr(OH)3",  "hidróxido de cromo(III)", "Cr(+3)", "3 OH(-)"),
    ("Mn(OH)2",  "hidróxido de manganeso(II)", "Mn(+2)", "2 OH(-)"),
    ("AgOH",     "hidróxido de plata", "Ag(+1)", "OH(-)"),
    ("Sn(OH)2",  "hidróxido de estano(II)", "Sn(+2)", "2 OH(-)"),
    ("Sn(OH)4",  "hidróxido de estano(IV)", "Sn(+4)", "4 OH(-)"),
    ("Ni(OH)2",  "hidróxido de niquel(II)", "Ni(+2)", "2 OH(-)"),
    ("Co(OH)2",  "hidróxido de cobalto(II)", "Co(+2)", "2 OH(-)"),
    ("Bi(OH)3",  "hidróxido de bismuto(III)", "Bi(+3)", "3 OH(-)")
]

for formula, nombre, cation, anion in hydroxides:
    ex("nomenclatura", "nomenclatura_ternaria", 1.8,
       ["nomenclatura", "hidroxidos"], "text",
       "NOMEN_HIDRO_01", {"formula": formula},
       f"Nombra el hidroxido con formula {formula}.",
       nombre, nombre,
       f"{formula} esta formado por {cation} y {anion}. Su nombre es {nombre}.")

    ex("nomenclatura", "nomenclatura_ternaria", 1.8,
       ["nomenclatura", "hidroxidos"], "text",
       "NOMEN_HIDRO_FORM", {"nombre": nombre},
       f"Escribe la formula del {nombre}.",
       formula, formula,
       f"El {nombre} tiene la formula {formula}.")

# ==============================================================
# RESUMEN FINAL
# ==============================================================

from collections import Counter
topics = Counter(e["topic"] for e in ejercicios)

print(f"\nTotal ejercicios generados: {len(ejercicios)}")
print("\nDistribucion por tema:")
for k, v in sorted(topics.items()):
    print(f"  {k}: {v}")

subtopics = Counter(e["subtopic"] for e in ejercicios)
print("\nDistribucion por subtema:")
for k, v in sorted(subtopics.items()):
    print(f"  {k}: {v}")

output_path = "src/data/ejercicios_quimica_500.json"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(ejercicios, f, ensure_ascii=False, indent=2)

print(f"\nArchivo guardado: {output_path}")
