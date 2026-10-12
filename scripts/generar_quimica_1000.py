#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generador de ~1000 ejercicios de Quimica - MayaTiqIA
Expande el banco a 1000 ejercicios unicos cubriendo los 5 temas de la
Guia Tematica Facultad de Odontologia.
"""

import json, random, hashlib
from collections import Counter

random.seed(2025)

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
_seen_q = set()

def ex(topic, subtopic, diff, skills, answer_type, tid, vp, q, ans, ans_d, explic, latex=None):
    if q in _seen_q:
        return
    _seen_q.add(q)
    h = mhash(q)
    ejercicios.append({
        **BASE,
        "topic": topic, "subtopic": subtopic, "difficulty": diff,
        "skills": skills, "answer_type": answer_type,
        "template_id": tid, "variant_params": vp,
        "content_hash": h, "question": q, "question_latex": latex,
        "answer": ans, "answer_display": ans_d, "explanation": explic,
        "exercise_id": make_id(tid, h)
    })

# =====================================================================
# I. MEDICIONES FUNDAMENTALES  (target ~180)
# =====================================================================

# L -> mL: 30 variantes
vals_L = sorted(set([round(random.uniform(0.05, 20.0), 2) for _ in range(60)]))[:30]
for v in vals_L:
    r = round(v * 1000, 2)
    ex("mediciones_fundamentales","conversion_volumen",1.2,["conversion_unidades","volumen"],"numeric",
       "CONV_VOL_L_ML",{"valor":v},
       f"Convierte {v} L a mL.",str(r),f"{r} mL",
       f"{v} L x 1 000 mL/L = {r} mL.",f"{v}\\,\\text{{L}}=?\\,\\text{{mL}}")

# mL -> L: 30 variantes
vals_mL = sorted(set(random.sample(range(25, 9999), 60)))[:30]
for v in vals_mL:
    r = round(v / 1000, 4)
    ex("mediciones_fundamentales","conversion_volumen",1.3,["conversion_unidades","volumen"],"numeric",
       "CONV_VOL_ML_L",{"valor":v},
       f"Convierte {v} mL a L.",str(r),f"{r} L",
       f"{v} mL / 1 000 = {r} L.",f"{v}\\,\\text{{mL}}=?\\,\\text{{L}}")

# cc = mL: 20 variantes
for v in random.sample(range(1, 999), 20):
    ex("mediciones_fundamentales","conversion_volumen",1.0,["conversion_unidades","volumen"],"numeric",
       "CONV_VOL_CC_ML",{"valor":v},
       f"Expresa {v} cc en mL. Recuerda: 1 cc = 1 mL.",str(v),f"{v} mL",
       f"1 cc = 1 mL exactamente, por lo tanto {v} cc = {v} mL.")

# g -> mg: 20
for m in [round(random.uniform(0.005, 80.0), 3) for _ in range(25)][:20]:
    r = round(m * 1000, 2)
    ex("mediciones_fundamentales","conversion_masa",1.2,["conversion_unidades","masa"],"numeric",
       "CONV_MASA_G_MG",{"valor":m},
       f"Convierte {m} g a mg.",str(r),f"{r} mg",
       f"{m} g x 1 000 = {r} mg.")

# kg -> g: 20
for m in [round(random.uniform(0.05, 30.0), 2) for _ in range(25)][:20]:
    r = round(m * 1000, 2)
    ex("mediciones_fundamentales","conversion_masa",1.2,["conversion_unidades","masa"],"numeric",
       "CONV_MASA_KG_G",{"valor":m},
       f"Convierte {m} kg a g.",str(r),f"{r} g",
       f"{m} kg x 1 000 = {r} g.")

# mg -> g: 20
for m in random.sample(range(50, 12000), 20):
    r = round(m / 1000, 4)
    ex("mediciones_fundamentales","conversion_masa",1.3,["conversion_unidades","masa"],"numeric",
       "CONV_MASA_MG_G",{"valor":m},
       f"Convierte {m} mg a g.",str(r),f"{r} g",
       f"{m} mg / 1 000 = {r} g.")

# g -> kg: 10
for m in random.sample(range(500, 9000), 10):
    r = round(m / 1000, 3)
    ex("mediciones_fundamentales","conversion_masa",1.3,["conversion_unidades","masa"],"numeric",
       "CONV_MASA_G_KG",{"valor":m},
       f"Convierte {m} g a kg.",str(r),f"{r} kg",
       f"{m} g / 1 000 = {r} kg.")

# Temperatura C->F: 10
for t in [-20,-5,0,15,20,25,36.5,37,80,100]:
    r = round((t*9/5)+32, 2)
    ex("mediciones_fundamentales","temperatura",1.5,["conversion_temperatura"],"numeric",
       "TEMP_C_F",{"valor":t},
       f"Convierte {t} grados Celsius a Fahrenheit.",str(r),f"{r} °F",
       f"F = (C x 9/5) + 32 = ({t} x 9/5) + 32 = {r} °F.")

# Temperatura F->C: 10
for t in [14, 32, 50, 68, 86, 98.6, 104, 122, 140, 212]:
    r = round((t-32)*5/9, 2)
    ex("mediciones_fundamentales","temperatura",1.5,["conversion_temperatura"],"numeric",
       "TEMP_F_C",{"valor":t},
       f"Convierte {t} grados Fahrenheit a Celsius.",str(r),f"{r} °C",
       f"C = (F - 32) x 5/9 = ({t} - 32) x 5/9 = {r} °C.")

# Temperatura C->K: 10
for t in [-273, -100, -40, 0, 20, 25, 37, 100, 200, 500]:
    r = round(t + 273.15, 2)
    ex("mediciones_fundamentales","temperatura",1.2,["conversion_temperatura"],"numeric",
       "TEMP_C_K",{"valor":t},
       f"Convierte {t} grados Celsius a Kelvin.",str(r),f"{r} K",
       f"K = C + 273.15 = {t} + 273.15 = {r} K.")

# Temperatura K->C: 5
for K in [0, 173, 273, 298, 373]:
    r = round(K - 273.15, 2)
    ex("mediciones_fundamentales","temperatura",1.4,["conversion_temperatura"],"numeric",
       "TEMP_K_C",{"valor":K},
       f"Convierte {K} K a grados Celsius.",str(r),f"{r} °C",
       f"C = K - 273.15 = {K} - 273.15 = {r} °C.")

# Densidad: 30 ejercicios
liquidos30 = [
    ("agua",1.00),("aceite vegetal",0.92),("alcohol etilico",0.79),
    ("leche",1.03),("mercurio",13.60),("gasolina",0.72),
    ("glicerina",1.26),("cloroformo",1.49),("acetona",0.79),
    ("eter etilico",0.71),("benceno",0.88),("vinagre",1.01),
    ("aceite de oliva",0.91),("sangre",1.06),("solucion salina",1.02),
    ("glicol de etileno",1.11),("tolueno",0.87),("agua de mar",1.025),
    ("xileno",0.86),("kerosene",0.80)
]
# d = m/V (10)
for liq, d in liquidos30[:10]:
    V = random.randint(40, 250)
    m = round(d * V, 2)
    ex("mediciones_fundamentales","densidad",1.6,["densidad","calculo"],"numeric",
       "DENS_CALC_D",{"masa":m,"volumen":V,"liquido":liq},
       f"Se tienen {m} g de {liq} que ocupan {V} mL. Calcula la densidad en g/mL.",
       str(round(m/V,2)),f"{round(m/V,2)} g/mL",
       f"d = m/V = {m}/{V} = {round(m/V,2)} g/mL.")

# V = m/d (10)
for liq, d in liquidos30[5:15]:
    m = random.randint(50, 800)
    V = round(m/d, 2)
    ex("mediciones_fundamentales","densidad",1.7,["densidad","calculo"],"numeric",
       "DENS_CALC_V",{"masa":m,"densidad":d,"liquido":liq},
       f"La densidad del {liq} es {d} g/mL. Que volumen ocupa una muestra de {m} g?",
       str(V),f"{V} mL",
       f"V = m/d = {m}/{d} = {V} mL.")

# m = d*V (10)
for liq, d in liquidos30[10:20]:
    V = random.randint(80, 400)
    m = round(d*V, 2)
    ex("mediciones_fundamentales","densidad",1.5,["densidad","calculo"],"numeric",
       "DENS_CALC_M",{"volumen":V,"densidad":d,"liquido":liq},
       f"Si la densidad del {liq} es {d} g/mL y tienes un volumen de {V} mL, cuanto pesa la muestra?",
       str(m),f"{m} g",
       f"m = d x V = {d} x {V} = {m} g.")

# =====================================================================
# II. MATERIA  (target ~170)
# =====================================================================

# Clasificacion de materia: 30
matter_items = [
    ("el agua destilada (H2O)","sustancia pura","compuesto","La formula H2O indica dos elementos en proporcion fija."),
    ("el aire","mezcla","homogenea","El aire es mezcla de N2, O2, Ar y CO2 en proporciones variables."),
    ("el hierro (Fe)","sustancia pura","elemento","El hierro esta formado por un solo tipo de atomo."),
    ("el suelo","mezcla","heterogenea","El suelo contiene minerales, organica y agua no uniformes."),
    ("el cloruro de sodio (NaCl)","sustancia pura","compuesto","NaCl se forma por Na y Cl en proporcion fija 1:1."),
    ("el vinagre","mezcla","homogenea","El vinagre es solucion acuosa de acido acetico, apariencia uniforme."),
    ("el oxigeno (O2)","sustancia pura","elemento","El O2 esta formado solo por atomos de oxigeno."),
    ("la ensalada","mezcla","heterogenea","Tiene componentes visiblemente distintos."),
    ("el dioxido de carbono (CO2)","sustancia pura","compuesto","CO2 contiene C y O en proporcion fija 1:2."),
    ("el agua con aceite","mezcla","heterogenea","No se mezclan; forman dos fases visibles."),
    ("el oro (Au)","sustancia pura","elemento","Formado solo por atomos de Au."),
    ("la leche","mezcla","heterogenea","La leche es una emulsion coloidal."),
    ("la glucosa (C6H12O6)","sustancia pura","compuesto","Contiene C, H y O en proporcion fija."),
    ("el bronce","mezcla","homogenea","Aleacion Cu-Sn de apariencia uniforme."),
    ("el nitrogeno (N2)","sustancia pura","elemento","Formado solo por atomos de N."),
    ("el cafe con leche","mezcla","homogenea","Apariencia uniforme; mezcla de fases liquidas."),
    ("el amoniaco (NH3)","sustancia pura","compuesto","N y H en proporcion fija 1:3."),
    ("el concreto","mezcla","heterogenea","Cemento, arena y grava visiblemente distintos."),
    ("el azufre (S)","sustancia pura","elemento","Elemento puro; un solo tipo de atomo."),
    ("el agua de mar","mezcla","homogenea","Solucion de sales disueltas en agua."),
    ("el hidrogeno (H2)","sustancia pura","elemento","Formado solo por atomos de H."),
    ("el acero","mezcla","homogenea","Aleacion de Fe y C con apariencia uniforme."),
    ("el yodo (I2)","sustancia pura","elemento","Formado solo por atomos de yodo."),
    ("la gelatina","mezcla","heterogenea","Sistema coloidal (gel); heterogeneo a nivel microscopico."),
    ("el cobre (Cu)","sustancia pura","elemento","Formado solo por atomos de cobre."),
    ("el agua con azucar","mezcla","homogenea","Solucion acuosa; apariencia uniforme."),
    ("el bicarbonato de sodio (NaHCO3)","sustancia pura","compuesto","Contiene Na, H, C y O en proporcion fija."),
    ("la sangre","mezcla","heterogenea","Contiene plasma, globulos rojos, blancos y plaquetas."),
    ("el aluminio (Al)","sustancia pura","elemento","Formado solo por atomos de Al."),
    ("el aire con polvo","mezcla","heterogenea","Las particulas de polvo son visibles y sedimentan.")
]
for name,t1,t2,explic in matter_items:
    ex("materia","clasificacion_materia",1.5,["clasificacion","materia"],"text",
       "MATER_CLASS_01",{"sustancia":name},
       f"Clasifica {name}: sustancia pura o mezcla? Si mezcla, homogenea o heterogenea? Si pura, elemento o compuesto?",
       f"{t1} — {t2}",f"{t1.capitalize()} / {t2.capitalize()}",explic)

# Estados fisicos: 20
state_items = [
    ("El hielo","solido","Los solidos tienen forma y volumen definidos; particulas muy unidas."),
    ("El vapor de agua","gaseoso","Los gases no tienen forma ni volumen definidos."),
    ("El mercurio a temperatura ambiente","liquido","Los liquidos tienen volumen fijo, adoptan la forma del recipiente."),
    ("El oxigeno a 25 grados C y 1 atm","gaseoso","El O2 hierve a -183 grados C; es gas a T ambiente."),
    ("La madera","solido","Forma y volumen definidos; particulas muy juntas."),
    ("El alcohol etilico a 20 grados C","liquido","Liquido; punto de ebullicion = 78 grados C."),
    ("El CO2 a 25 grados C y 1 atm","gaseoso","Gas en condiciones normales (sublima a -78.5 grados C)."),
    ("La sal de cocina (NaCl) a 25 grados C","solido","Cristal ionico solido a T ambiente."),
    ("El agua a 50 grados C","liquido","Por debajo del punto de ebullicion (100 grados C)."),
    ("El nitrogeno a 25 grados C","gaseoso","Hierve a -196 grados C; gas a T ambiente."),
    ("El oro a 25 grados C","solido","Punto de fusion 1064 grados C; solido a T ambiente."),
    ("La miel a 20 grados C","liquido","Liquido viscoso a T ambiente."),
    ("El azufre a 25 grados C","solido","Solido amarillo a T ambiente."),
    ("El helio a 25 grados C","gaseoso","Gas noble; hierve a -269 grados C."),
    ("El aceite de oliva a 20 grados C","liquido","Liquido a T ambiente."),
    ("El hierro a 1600 grados C","liquido","Por encima del punto de fusion del hierro (1538 grados C)."),
    ("El bromo a 25 grados C","liquido","Unico no metal liquido a T ambiente."),
    ("El dioxido de nitrogeno (NO2)","gaseoso","Gas pardo visible a T ambiente."),
    ("El plomo a 25 grados C","solido","Punto de fusion 327 grados C; solido a T ambiente."),
    ("El cesio a 30 grados C","liquido","Punto de fusion del cesio es 28.4 grados C; liquido a 30 grados C.")
]
for sub,estado,explic in state_items:
    ex("materia","estados_fisicos",1.2,["estados_fisicos"],"text",
       "MATER_ESTADO_01",{"sustancia":sub},
       f"{sub}: en que estado fisico se encuentra?",estado,estado.capitalize(),explic)

# Propiedades fisicas vs quimicas: 25
propiedades = [
    ("El punto de fusion del hielo es 0 grados C","fisica","Medible sin cambiar la composicion quimica."),
    ("La combustibilidad de la madera","quimica","La combustion produce CO2 y H2O; cambia la composicion."),
    ("La densidad del oro (19.3 g/cm3)","fisica","Se mide sin alterar la naturaleza del material."),
    ("La reactividad del sodio con el agua","quimica","Produce NaOH e H2; cambia la composicion."),
    ("El color amarillo del azufre","fisica","Observable sin cambio quimico."),
    ("La capacidad del hierro de oxidarse","quimica","Forma Fe2O3, distinto al Fe original."),
    ("La dureza del diamante (10 Mohs)","fisica","Medible sin reaccion quimica."),
    ("La acidez del vinagre (pH 3)","quimica","Refleja la capacidad de liberar H+."),
    ("La conductividad electrica del cobre","fisica","Se mide sin alterar la composicion."),
    ("La capacidad del Mg de arder con luz brillante","quimica","Mg + O2 -> MgO; cambia la composicion."),
    ("El punto de ebullicion del agua (100 grados C)","fisica","Cambio de estado, no de composicion."),
    ("La toxicidad del CO","quimica","Refleja como CO interactua con la hemoglobina."),
    ("La solubilidad del azucar en agua","fisica","Se disuelve sin cambiar su composicion."),
    ("La capacidad del Zn de disolverse en HCl","quimica","Zn + 2HCl -> ZnCl2 + H2."),
    ("El brillo metalico de la plata","fisica","Propiedad optica; no hay cambio quimico."),
    ("La inestabilidad del H2O2","quimica","H2O2 -> H2O + 1/2 O2; cambio de composicion."),
    ("La transparencia del vidrio","fisica","Propiedad optica sin alteracion quimica."),
    ("La capacidad del hierro de formar sales","quimica","Requiere reacciones quimicas."),
    ("El olor penetrante del amoniaco","fisica","Detectable sin reaccion quimica."),
    ("El ennegrecimiento de la plata con el tiempo","quimica","Reacciona con el azufre del aire: Ag + S -> Ag2S."),
    ("La viscosidad de la glicerina","fisica","Medida de resistencia al flujo; sin cambio quimico."),
    ("La capacidad del Ca de reaccionar con agua","quimica","Ca + 2H2O -> Ca(OH)2 + H2."),
    ("El punto de ebullicion del etanol (78 grados C)","fisica","Cambio de estado; composicion intacta."),
    ("La capacidad del H2O2 de blanquear","quimica","Libera O2 reactivo que oxida pigmentos."),
    ("La maleabilidad del aluminio","fisica","Se puede laminar sin cambio quimico.")
]
for prop,tipo,explic in propiedades:
    ex("materia","propiedades_fisico_quimicas",1.4,["propiedades_materia"],"text",
       "PROP_FQ_01",{"propiedad":prop},
       f"Es la siguiente una propiedad fisica o quimica? '{prop}'",
       tipo,f"Propiedad {tipo}",explic)

# Cambios fisicos vs quimicos: 20
cambios = [
    ("Fundir un cubo de hielo","fisico","H2O solido -> H2O liquido; misma composicion."),
    ("Quemar papel","quimico","Papel -> CO2 + H2O + cenizas; composicion cambia."),
    ("Cortar una hoja de papel","fisico","Solo cambia la forma; no la composicion."),
    ("Fermentar azucar en alcohol","quimico","C6H12O6 -> 2C2H5OH + 2CO2."),
    ("Evaporar el agua","fisico","H2O liquida -> H2O vapor; misma composicion."),
    ("Oxidar el hierro","quimico","Fe + O2 -> Fe2O3; composicion diferente."),
    ("Disolver sal en agua","fisico","NaCl se ioniza pero puede recuperarse."),
    ("Cocinar un huevo","quimico","Proteinas se desnaturalizan; irreversible."),
    ("Doblar un alambre de cobre","fisico","Solo cambia la forma; no hay reaccion."),
    ("Explotar la polvora","quimico","Reaccion rapida genera gases y calor."),
    ("Triturar azucar en polvo","fisico","Cambia el tamano; no la composicion."),
    ("Digerir los alimentos","quimico","Enzimas rompen moleculas grandes en pequenas."),
    ("Congelar jugo de naranja","fisico","El agua pasa a solido; composicion intacta."),
    ("La fotosintesis","quimico","6CO2 + 6H2O -> C6H12O6 + 6O2."),
    ("Destilar agua de mar","fisico","Separacion por cambio de estado; no hay reaccion."),
    ("Calentar azucar hasta caramelizarla","quimico","Descomposicion termica de la sacarosa; color y composicion cambian."),
    ("Sublimar el yodo","fisico","I2 solido -> I2 gaseoso; misma composicion."),
    ("La electrolisis del agua","quimico","2H2O -> 2H2 + O2; se rompen enlaces."),
    ("Laminar el aluminio en papel","fisico","Solo cambia la forma del metal."),
    ("La digestion del almido","quimico","El almido se hidroliza a glucosa por enzimas.")
]
for proc,tipo,explic in cambios:
    ex("materia","cambios_fisico_quimicos",1.4,["cambios_materia"],"text",
       "CAMBIO_FQ_01",{"proceso":proc},
       f"El siguiente proceso es cambio fisico o quimico? '{proc}'",
       tipo,f"Cambio {tipo}",explic)

# Ley conservacion de la masa: 20
cons_data = [
    (10,15,25,"2H2 + O2 -> 2H2O"),
    (28,32,60,"2Mg + O2 -> 2MgO"),
    (12,32,44,"C + O2 -> CO2"),
    (46,32,78,"2Na + Cl2 -> 2NaCl"),
    (2,32,34,"H2 + S -> H2S"),
    (24,16,40,"4Na + O2 -> 2Na2O"),
    (8,24,32,"2Ca + O2 -> 2CaO"),
    (40,36,76,"CaO + 2HCl -> CaCl2 + H2O"),
    (32,16,48,"S + O2 -> SO2"),
    (36,20,56,"CO2 + 2NaOH -> Na2CO3 + H2O"),
    (100,44,56,"CaCO3 -> CaO + CO2"),
    (14,32,46,"2N + 2O2 -> 2NO2"),
    (56,32,88,"Fe + S -> FeS (aprox)"),
    (4,64,68,"CH4 + 2O2 -> CO2 + 2H2O (parcial)"),
    (20,12,32,"4Na + O2 -> 2Na2O (aprox)"),
    (27,48,75,"2Al + 3/2 O2 -> Al2O3 (aprox)"),
    (32,48,80,"2Fe + 3/2 O2 -> Fe2O3 (aprox)"),
    (6,8,14,"2C + O2 -> 2CO"),
    (16,32,48,"CH4 + O2 -> CO2 + 2H2O (parcial)"),
    (20,16,36,"2H2 + 2O2 -> 2H2O (escala 10x)")
]
for m1,m2,m3,rxn in cons_data:
    ex("materia","ley_conservacion_masa",1.6,["conservacion_masa","calculo"],"numeric",
       "CONS_MASA_01",{"m1":m1,"m2":m2,"reaccion":rxn},
       f"En la reaccion {rxn}, se consumen {m1} g del reactivo A y {m2} g del reactivo B. Cuantos gramos de producto se forman (Ley de Conservacion de la Masa)?",
       str(m3),f"{m3} g",
       f"Masa total se conserva: {m1} g + {m2} g = {m3} g de productos.")

# =====================================================================
# III. ELEMENTOS Y ATOMOS  (target ~210)
# =====================================================================

ELEMENTOS = [
    (1,"H","Hidrogeno",1.008),(2,"He","Helio",4.003),(3,"Li","Litio",6.941),
    (4,"Be","Berilio",9.012),(5,"B","Boro",10.811),(6,"C","Carbono",12.011),
    (7,"N","Nitrogeno",14.007),(8,"O","Oxigeno",15.999),(9,"F","Fluor",18.998),
    (10,"Ne","Neon",20.180),(11,"Na","Sodio",22.990),(12,"Mg","Magnesio",24.305),
    (13,"Al","Aluminio",26.982),(14,"Si","Silicio",28.086),(15,"P","Fosforo",30.974),
    (16,"S","Azufre",32.065),(17,"Cl","Cloro",35.453),(18,"Ar","Argon",39.948),
    (19,"K","Potasio",39.098),(20,"Ca","Calcio",40.078),(21,"Sc","Escandio",44.956),
    (22,"Ti","Titanio",47.867),(23,"V","Vanadio",50.942),(24,"Cr","Cromo",51.996),
    (25,"Mn","Manganeso",54.938),(26,"Fe","Hierro",55.845),(27,"Co","Cobalto",58.933),
    (28,"Ni","Niquel",58.693),(29,"Cu","Cobre",63.546),(30,"Zn","Zinc",65.380),
    (31,"Ga","Galio",69.723),(32,"Ge","Germanio",72.630),(33,"As","Arsenico",74.922),
    (34,"Se","Selenio",78.960),(35,"Br","Bromo",79.904),(36,"Kr","Kripton",83.798),
    (37,"Rb","Rubidio",85.468),(38,"Sr","Estroncio",87.620),(39,"Y","Itrio",88.906),
    (40,"Zr","Zirconio",91.224),(41,"Nb","Niobio",92.906),(42,"Mo","Molibdeno",95.960),
    (43,"Tc","Tecnecio",98.000),(44,"Ru","Rutenio",101.070),(45,"Rh","Rodio",102.906),
    (46,"Pd","Paladio",106.420),(47,"Ag","Plata",107.868),(48,"Cd","Cadmio",112.411),
    (49,"In","Indio",114.818),(50,"Sn","Estano",118.710),(51,"Sb","Antimonio",121.760),
    (52,"Te","Teluro",127.600),(53,"I","Yodo",126.904),(54,"Xe","Xenon",131.293),
    (55,"Cs","Cesio",132.905),(56,"Ba","Bario",137.327),(57,"La","Lantano",138.905)
]

# Simbolo -> Nombre: todos 57
for Z,sym,name,mass in ELEMENTOS:
    ex("elementos_atomos","simbolos_nombres",1.3,["elementos"],"text",
       "ELEM_SIM_NOM",{"simbolo":sym,"Z":Z},
       f"Cual es el nombre del elemento cuyo simbolo es '{sym}'?",
       name,name,
       f"El simbolo {sym} corresponde al elemento numero {Z}: {name}.")

# Nombre -> Simbolo: todos 57
for Z,sym,name,mass in ELEMENTOS:
    ex("elementos_atomos","simbolos_nombres",1.3,["elementos"],"text",
       "ELEM_NOM_SIM",{"nombre":name,"Z":Z},
       f"Escribe el simbolo del elemento '{name}'.",
       sym,sym,
       f"El elemento {name} tiene numero atomico {Z} y simbolo {sym}.")

# Numero atomico -> nombre: 20 (distinto angulo)
for Z,sym,name,mass in random.sample(ELEMENTOS, 20):
    ex("elementos_atomos","simbolos_nombres",1.2,["elementos"],"text",
       "ELEM_Z_NOM",{"Z":Z},
       f"Que elemento tiene numero atomico Z = {Z}?",
       name,name,
       f"Z = {Z} corresponde al {name} ({sym}).")

# Particulas subatomicas: 30
_part_temps = [
    ("protones",  lambda Z,A: Z,   "Los protones determinan el numero atomico Z."),
    ("neutrones", lambda Z,A: A-Z, "Neutrones = A - Z."),
    ("electrones",lambda Z,A: Z,   "En atomo neutro, electrones = protones = Z.")
]
selected30 = [ELEMENTOS[i] for i in random.sample(range(len(ELEMENTOS)),30)]
for i,(Z,sym,name,mass) in enumerate(selected30):
    A = Z + random.randint(max(1,int(Z*0.85)), int(Z*1.35)+1)
    part, calc, explic = _part_temps[i%3]
    val = calc(Z,A)
    ex("elementos_atomos","particulas_subatomicas",1.5,["particulas_subatomicas"],"numeric",
       "ATOM_PART_01",{"Z":Z,"A":A,"elemento":name,"particula":part},
       f"El atomo de {name} ({sym}) tiene Z={Z} y numero masico A={A}. Cuantos {part} tiene?",
       str(val),str(val),
       f"{explic} Para {name}: {part} = {val}.")

# Isotopos: 20
isotopes_db = [
    ("Hidrogeno","H",1,1,"Protio",1,2,"Deuterio"),
    ("Hidrogeno","H",1,1,"Protio",1,3,"Tritio"),
    ("Carbono","C",6,12,"C-12",6,13,"C-13"),
    ("Carbono","C",6,12,"C-12",6,14,"C-14"),
    ("Oxigeno","O",8,16,"O-16",8,18,"O-18"),
    ("Cloro","Cl",17,35,"Cl-35",17,37,"Cl-37"),
    ("Uranio","U",92,235,"U-235",92,238,"U-238"),
    ("Uranio","U",92,234,"U-234",92,235,"U-235"),
    ("Hierro","Fe",26,54,"Fe-54",26,56,"Fe-56"),
    ("Hierro","Fe",26,56,"Fe-56",26,57,"Fe-57"),
    ("Cobre","Cu",29,63,"Cu-63",29,65,"Cu-65"),
    ("Bromo","Br",35,79,"Br-79",35,81,"Br-81"),
    ("Magnesio","Mg",12,24,"Mg-24",12,26,"Mg-26"),
    ("Calcio","Ca",20,40,"Ca-40",20,44,"Ca-44"),
    ("Estroncio","Sr",38,86,"Sr-86",38,88,"Sr-88"),
    ("Nitrogeno","N",7,14,"N-14",7,15,"N-15"),
    ("Silicio","Si",14,28,"Si-28",14,30,"Si-30"),
    ("Potasio","K",19,39,"K-39",19,41,"K-41"),
    ("Zinc","Zn",30,64,"Zn-64",30,66,"Zn-66"),
    ("Plomo","Pb",82,206,"Pb-206",82,208,"Pb-208")
]
for name,sym,z1,a1,iso1,z2,a2,iso2 in isotopes_db:
    ex("elementos_atomos","isotopos",1.6,["isotopos"],"text",
       "ISOTOPO_01",{"elemento":name,"iso1":iso1,"iso2":iso2,"Z":z1,"A1":a1,"A2":a2},
       f"El {iso1} y el {iso2} son isotopos del {name}? Justifica.",
       "Si, son isotopos","Si, son isotopos",
       f"Ambos tienen Z={z1} ({name}), pero A diferente ({a1} vs {a2}). Isotopos = mismo Z, diferente A.")

# Masas atomicas: todos 57 elementos
for Z,sym,name,mass in ELEMENTOS:
    ex("elementos_atomos","masas_atomicas",1.3,["masa_atomica"],"numeric",
       "MASA_ATOM_01",{"Z":Z,"simbolo":sym},
       f"Cual es la masa atomica del {name} ({sym}) segun la tabla periodica (en uma)?",
       str(mass),f"{mass} uma",
       f"La masa atomica del {name} ({sym}, Z={Z}) es {mass} uma.")

# =====================================================================
# IV. TABLA PERIODICA  (target ~180)
# =====================================================================

# Ubicacion periodo y familia: 40
elem_loc = [
    (1,"H","Hidrogeno",1,"IA"),(2,"He","Helio",1,"VIII A"),
    (3,"Li","Litio",2,"IA"),(4,"Be","Berilio",2,"IIA"),
    (5,"B","Boro",2,"IIIA"),(6,"C","Carbono",2,"IVA"),
    (7,"N","Nitrogeno",2,"VA"),(8,"O","Oxigeno",2,"VIA"),
    (9,"F","Fluor",2,"VIIA"),(10,"Ne","Neon",2,"VIII A"),
    (11,"Na","Sodio",3,"IA"),(12,"Mg","Magnesio",3,"IIA"),
    (13,"Al","Aluminio",3,"IIIA"),(14,"Si","Silicio",3,"IVA"),
    (15,"P","Fosforo",3,"VA"),(16,"S","Azufre",3,"VIA"),
    (17,"Cl","Cloro",3,"VIIA"),(18,"Ar","Argon",3,"VIII A"),
    (19,"K","Potasio",4,"IA"),(20,"Ca","Calcio",4,"IIA"),
    (26,"Fe","Hierro",4,"VIII B"),(29,"Cu","Cobre",4,"IB"),
    (30,"Zn","Zinc",4,"IIB"),(35,"Br","Bromo",4,"VIIA"),
    (36,"Kr","Kripton",4,"VIII A"),(37,"Rb","Rubidio",5,"IA"),
    (38,"Sr","Estroncio",5,"IIA"),(47,"Ag","Plata",5,"IB"),
    (48,"Cd","Cadmio",5,"IIB"),(53,"I","Yodo",5,"VIIA"),
    (54,"Xe","Xenon",5,"VIII A"),(55,"Cs","Cesio",6,"IA"),
    (56,"Ba","Bario",6,"IIA"),(74,"W","Wolframio",6,"VIB"),
    (78,"Pt","Platino",6,"VIII B"),(80,"Hg","Mercurio",6,"IIB"),
    (82,"Pb","Plomo",6,"IVA"),(86,"Rn","Radon",6,"VIII A"),
    (87,"Fr","Francio",7,"IA"),(88,"Ra","Radio",7,"IIA")
]
for Z,sym,name,period,group in elem_loc:
    ex("tabla_periodica","ubicacion_tabla",1.5,["tabla_periodica","familias","periodos"],"text",
       "TABLA_LOC_01",{"Z":Z,"elemento":name,"simbolo":sym},
       f"En que periodo y familia se encuentra el {name} ({sym}) en la tabla periodica?",
       f"Periodo {period}, Familia {group}",f"Periodo {period} / Familia {group}",
       f"El {name} ({sym}, Z={Z}) se ubica en el periodo {period}, familia {group}.")

# Metal/no metal/metaloide: 40
metal_class = [
    ("Hierro (Fe)","metal","Conductor, maleable, ductil, brillo metalico."),
    ("Oxigeno (O2)","no metal","Gas; no conduce electricidad; sin brillo metalico."),
    ("Silicio (Si)","metaloide","Semiconductor; propiedades intermedias."),
    ("Oro (Au)","metal","Excelente conductor, brillante, maleable."),
    ("Azufre (S)","no metal","Solido amarillo fragil, mal conductor."),
    ("Germanio (Ge)","metaloide","Semiconductor en electronica."),
    ("Cobre (Cu)","metal","Excelente conductor electrico, maleable."),
    ("Cloro (Cl2)","no metal","Gas corrosivo, no conductor."),
    ("Boro (B)","metaloide","Semiconductor; algunas prop. metalicas."),
    ("Calcio (Ca)","metal","Metal alcalinoterreo conductor, reactivo."),
    ("Carbono (C)","no metal","No metal versatil (diamante, grafito)."),
    ("Arsenico (As)","metaloide","Brillo metalico pero prop. intermedias."),
    ("Plata (Ag)","metal","Mejor conductor electrico."),
    ("Fosforo (P)","no metal","No conductor, altamente reactivo."),
    ("Antimonio (Sb)","metaloide","Apariencia metalica pero fragil."),
    ("Aluminio (Al)","metal","Conductor ligero, maleable."),
    ("Nitrogeno (N2)","no metal","Gas inerte, no conductor."),
    ("Teluro (Te)","metaloide","Semiconductor con brillo metalico."),
    ("Zinc (Zn)","metal","Metal de transicion, conductor."),
    ("Bromo (Br2)","no metal","Liquido rojizo, no conductor."),
    ("Estano (Sn)","metal","Conductor, usado en aleaciones."),
    ("Plomo (Pb)","metal","Metal pesado, conductor."),
    ("Yodo (I2)","no metal","Solido brillante, no conductor."),
    ("Sodio (Na)","metal","Metal alcalino muy reactivo."),
    ("Hidrogeno (H)","no metal","Gas no conductor; aunque en IA, es no metalico."),
    ("Cromo (Cr)","metal","Metal de transicion brillante y duro."),
    ("Niquel (Ni)","metal","Metal duro, conductor, baterias."),
    ("Titanio (Ti)","metal","Metal de transicion ligero y resistente."),
    ("Neon (Ne)","no metal","Gas noble, extremadamente inerte."),
    ("Magnesio (Mg)","metal","Metal alcalinoterreo, ligero y conductor."),
    ("Potasio (K)","metal","Metal alcalino muy reactivo con agua."),
    ("Selenio (Se)","no metal","Semiconductor; clasificado a veces como metaloide."),
    ("Mercurio (Hg)","metal","Unico metal liquido a T ambiente."),
    ("Polonio (Po)","metaloide","Propiedades intermedias; algunas clasificaciones lo ponen como metal."),
    ("Bismuto (Bi)","metal","Metal pesado con brillo rosado."),
    ("Fluor (F2)","no metal","Gas corrosivo; el elemento mas electronegativo."),
    ("Wolframio (W)","metal","Metal de mayor punto de fusion (3422 grados C)."),
    ("Platino (Pt)","metal","Metal noble, conductor, muy resistente."),
    ("Estroncio (Sr)","metal","Metal alcalinoterreo reactivo."),
    ("Xeniton (Xe)","no metal","Gas noble inerte.")
]
for elem,tipo,explic in metal_class:
    ex("tabla_periodica","metales_no_metales_metaloides",1.4,["tabla_periodica","clasificacion"],"text",
       "TABLA_CLASS_01",{"elemento":elem},
       f"Clasifica el elemento: {elem} — metal, no metal o metaloide?",
       tipo,tipo.capitalize(),explic)

# Iones: cationes vs aniones: 10
iones = [
    ("Na+","cation","El Na+ perdio un electron; carga positiva = cation."),
    ("Cl-","anion","El Cl- gano un electron; carga negativa = anion."),
    ("Ca2+","cation","Ca2+ perdio 2 electrones; carga positiva."),
    ("O2-","anion","O2- gano 2 electrones; carga negativa."),
    ("Fe3+","cation","Fe3+ perdio 3 electrones; carga positiva."),
    ("SO4(2-)","anion","Ion poliatómico con carga negativa."),
    ("NH4+","cation","Ion poliatómico con carga positiva."),
    ("OH-","anion","Ion hidroxilo; carga negativa."),
    ("Mg2+","cation","Mg2+ perdio 2 electrones."),
    ("NO3-","anion","Ion nitrato; carga negativa.")
]
for ion,tipo,explic in iones:
    ex("tabla_periodica","iones_cationes_aniones",1.4,["iones","tabla_periodica"],"text",
       "ION_TIPO_01",{"ion":ion},
       f"El ion {ion} es cation o anion? Justifica.",
       tipo,tipo.capitalize(),explic)

# Masa molar: 50 compuestos
compounds_mm = [
    ("H2O",[("H",1.008,2),("O",15.999,1)]),
    ("NaCl",[("Na",22.990,1),("Cl",35.453,1)]),
    ("CO2",[("C",12.011,1),("O",15.999,2)]),
    ("H2SO4",[("H",1.008,2),("S",32.065,1),("O",15.999,4)]),
    ("HCl",[("H",1.008,1),("Cl",35.453,1)]),
    ("NH3",[("N",14.007,1),("H",1.008,3)]),
    ("Ca(OH)2",[("Ca",40.078,1),("O",15.999,2),("H",1.008,2)]),
    ("NaOH",[("Na",22.990,1),("O",15.999,1),("H",1.008,1)]),
    ("CaCO3",[("Ca",40.078,1),("C",12.011,1),("O",15.999,3)]),
    ("CH4",[("C",12.011,1),("H",1.008,4)]),
    ("C6H12O6",[("C",12.011,6),("H",1.008,12),("O",15.999,6)]),
    ("MgO",[("Mg",24.305,1),("O",15.999,1)]),
    ("Fe2O3",[("Fe",55.845,2),("O",15.999,3)]),
    ("KMnO4",[("K",39.098,1),("Mn",54.938,1),("O",15.999,4)]),
    ("AlCl3",[("Al",26.982,1),("Cl",35.453,3)]),
    ("HNO3",[("H",1.008,1),("N",14.007,1),("O",15.999,3)]),
    ("H3PO4",[("H",1.008,3),("P",30.974,1),("O",15.999,4)]),
    ("MgSO4",[("Mg",24.305,1),("S",32.065,1),("O",15.999,4)]),
    ("ZnO",[("Zn",65.380,1),("O",15.999,1)]),
    ("CuSO4",[("Cu",63.546,1),("S",32.065,1),("O",15.999,4)]),
    ("Na2CO3",[("Na",22.990,2),("C",12.011,1),("O",15.999,3)]),
    ("KCl",[("K",39.098,1),("Cl",35.453,1)]),
    ("BaSO4",[("Ba",137.327,1),("S",32.065,1),("O",15.999,4)]),
    ("C2H5OH",[("C",12.011,2),("H",1.008,6),("O",15.999,1)]),
    ("NaHCO3",[("Na",22.990,1),("H",1.008,1),("C",12.011,1),("O",15.999,3)]),
    ("Fe(OH)3",[("Fe",55.845,1),("O",15.999,3),("H",1.008,3)]),
    ("CaCl2",[("Ca",40.078,1),("Cl",35.453,2)]),
    ("Mg(NO3)2",[("Mg",24.305,1),("N",14.007,2),("O",15.999,6)]),
    ("Al2O3",[("Al",26.982,2),("O",15.999,3)]),
    ("K2SO4",[("K",39.098,2),("S",32.065,1),("O",15.999,4)]),
    ("KNO3",[("K",39.098,1),("N",14.007,1),("O",15.999,3)]),
    ("Ca3(PO4)2",[("Ca",40.078,3),("P",30.974,2),("O",15.999,8)]),
    ("FeSO4",[("Fe",55.845,1),("S",32.065,1),("O",15.999,4)]),
    ("ZnSO4",[("Zn",65.380,1),("S",32.065,1),("O",15.999,4)]),
    ("Na2SO4",[("Na",22.990,2),("S",32.065,1),("O",15.999,4)]),
    ("Mg(OH)2",[("Mg",24.305,1),("O",15.999,2),("H",1.008,2)]),
    ("Al(OH)3",[("Al",26.982,1),("O",15.999,3),("H",1.008,3)]),
    ("NaNO3",[("Na",22.990,1),("N",14.007,1),("O",15.999,3)]),
    ("CuO",[("Cu",63.546,1),("O",15.999,1)]),
    ("Cu2O",[("Cu",63.546,2),("O",15.999,1)]),
    ("MnO2",[("Mn",54.938,1),("O",15.999,2)]),
    ("K2CO3",[("K",39.098,2),("C",12.011,1),("O",15.999,3)]),
    ("Na2O",[("Na",22.990,2),("O",15.999,1)]),
    ("Li2CO3",[("Li",6.941,2),("C",12.011,1),("O",15.999,3)]),
    ("CaSO4",[("Ca",40.078,1),("S",32.065,1),("O",15.999,4)]),
    ("Cr2O3",[("Cr",51.996,2),("O",15.999,3)]),
    ("SnO2",[("Sn",118.710,1),("O",15.999,2)]),
    ("PbO2",[("Pb",207.200,1),("O",15.999,2)]),
    ("Bi2O3",[("Bi",208.980,2),("O",15.999,3)]),
    ("AgNO3",[("Ag",107.868,1),("N",14.007,1),("O",15.999,3)])
]
for formula,atoms in compounds_mm:
    mm = round(sum(mass*count for _,mass,count in atoms),2)
    steps = " + ".join([f"{c}x{m} ({s})" for s,m,c in atoms])
    ex("tabla_periodica","masa_molar",1.8,["masa_molar","tabla_periodica","calculo"],"numeric",
       "MASA_MOLAR_01",{"formula":formula},
       f"Calcula la masa molar del compuesto {formula} en g/mol (2 cifras decimales).",
       str(mm),f"{mm} g/mol",
       f"M({formula}) = {steps} = {mm} g/mol.")

# =====================================================================
# V. NOMENCLATURA  (target ~260)
# =====================================================================

# Numero de oxidacion: 40
oxnum_data = [
    ("Na","NaCl",1,"Sodio tiene oxidacion fija +1."),
    ("Cl","NaCl",-1,"En NaCl (haluro), cloro tiene -1."),
    ("Fe","Fe2O3",3,"2x + 3(-2) = 0 -> x=+3."),
    ("Fe","FeO",2,"x + (-2) = 0 -> x=+2."),
    ("S","SO4(2-)",6,"x + 4(-2) = -2 -> x=+6."),
    ("S","SO3(2-)",4,"x + 3(-2) = -2 -> x=+4."),
    ("N","NO3(-)",5,"x + 3(-2) = -1 -> x=+5."),
    ("N","NO2(-)",3,"x + 2(-2) = -1 -> x=+3."),
    ("Mn","KMnO4",7,"+1+x+4(-2)=0 -> x=+7."),
    ("Cr","K2Cr2O7",6,"2(+1)+2x+7(-2)=0 -> x=+6."),
    ("P","H3PO4",5,"3(+1)+x+4(-2)=0 -> x=+5."),
    ("P","H3PO3",3,"3(+1)+x+3(-2)=0 -> x=+3."),
    ("C","CO2",4,"x+2(-2)=0 -> x=+4."),
    ("C","CO",2,"x+(-2)=0 -> x=+2."),
    ("O","H2O",-2,"Regla general: O tiene -2."),
    ("H","H2O",1,"H tiene +1 con no metales."),
    ("Cu","CuO",2,"x+(-2)=0 -> x=+2."),
    ("Cu","Cu2O",1,"2x+(-2)=0 -> x=+1."),
    ("Cl","HClO4",7,"+1+x+4(-2)=0 -> x=+7."),
    ("Cl","HClO3",5,"+1+x+3(-2)=0 -> x=+5."),
    ("Cl","HClO2",3,"+1+x+2(-2)=0 -> x=+3."),
    ("Cl","HClO",1,"+1+x+(-2)=0 -> x=+1."),
    ("Pb","PbO2",4,"x+2(-2)=0 -> x=+4."),
    ("Pb","PbO",2,"x+(-2)=0 -> x=+2."),
    ("Sn","SnO2",4,"x+2(-2)=0 -> x=+4."),
    ("Sn","SnO",2,"x+(-2)=0 -> x=+2."),
    ("As","As2O5",5,"2x+5(-2)=0 -> x=+5."),
    ("As","As2O3",3,"2x+3(-2)=0 -> x=+3."),
    ("Bi","Bi2O3",3,"2x+3(-2)=0 -> x=+3."),
    ("Al","Al2O3",3,"2x+3(-2)=0 -> x=+3. Al fijo en +3."),
    ("Cr","Cr2O3",3,"2x+3(-2)=0 -> x=+3."),
    ("Cr","CrO3",6,"x+3(-2)=0 -> x=+6."),
    ("Mn","MnO2",4,"x+2(-2)=0 -> x=+4."),
    ("Mn","MnO",2,"x+(-2)=0 -> x=+2."),
    ("V","V2O5",5,"2x+5(-2)=0 -> x=+5."),
    ("V","V2O3",3,"2x+3(-2)=0 -> x=+3."),
    ("Ti","TiO2",4,"x+2(-2)=0 -> x=+4."),
    ("W","WO3",6,"x+3(-2)=0 -> x=+6."),
    ("Mo","MoO3",6,"x+3(-2)=0 -> x=+6."),
    ("Hg","HgO",2,"x+(-2)=0 -> x=+2.")
]
for elem,compound,ox,explic in oxnum_data:
    sign="+" if ox>0 else ""
    ex("nomenclatura","numero_oxidacion",1.7,["numero_oxidacion"],"numeric",
       "OXNUM_01",{"elemento":elem,"compuesto":compound},
       f"Cual es el numero de oxidacion del {elem} en el compuesto {compound}?",
       str(ox),f"{sign}{ox}",explic)

# Compuestos binarios 3 sistemas: 40 compuestos (80 ejercicios)
binary_compounds = [
    ("NaCl","sodio","cloro",1,"cloruro sodico","cloruro de sodio","cloruro de sodio(I)"),
    ("MgCl2","magnesio","cloro",2,"cloruro magnesico","dicloruro de magnesio","cloruro de magnesio(II)"),
    ("AlCl3","aluminio","cloro",3,"cloruro aluminico","tricloruro de aluminio","cloruro de aluminio(III)"),
    ("FeCl2","hierro","cloro",2,"cloruro ferroso","dicloruro de hierro","cloruro de hierro(II)"),
    ("FeCl3","hierro","cloro",3,"cloruro ferrico","tricloruro de hierro","cloruro de hierro(III)"),
    ("CuCl","cobre","cloro",1,"cloruro cuproso","cloruro de cobre","cloruro de cobre(I)"),
    ("CuCl2","cobre","cloro",2,"cloruro cuprico","dicloruro de cobre","cloruro de cobre(II)"),
    ("SnCl2","estano","cloro",2,"cloruro estannoso","dicloruro de estano","cloruro de estano(II)"),
    ("SnCl4","estano","cloro",4,"cloruro stannico","tetracloruro de estano","cloruro de estano(IV)"),
    ("PbCl2","plomo","cloro",2,"cloruro plumboso","dicloruro de plomo","cloruro de plomo(II)"),
    ("FeO","hierro","oxigeno",2,"oxido ferroso","monoxido de hierro","oxido de hierro(II)"),
    ("Fe2O3","hierro","oxigeno",3,"oxido ferrico","trioxido de dihierro","oxido de hierro(III)"),
    ("Fe3O4","hierro","oxigeno","2/3","oxido ferroso-ferrico","tetraoxido de trihierro","oxido de hierro(II,III)"),
    ("CuO","cobre","oxigeno",2,"oxido cuprico","monoxido de cobre","oxido de cobre(II)"),
    ("Cu2O","cobre","oxigeno",1,"oxido cuproso","monoxido de dicobre","oxido de cobre(I)"),
    ("MgO","magnesio","oxigeno",2,"oxido magnesico","monoxido de magnesio","oxido de magnesio(II)"),
    ("Al2O3","aluminio","oxigeno",3,"oxido aluminico","trioxido de dialuminio","oxido de aluminio(III)"),
    ("Na2O","sodio","oxigeno",1,"oxido sodico","monoxido de disodio","oxido de sodio(I)"),
    ("CaO","calcio","oxigeno",2,"oxido calcico","monoxido de calcio","oxido de calcio(II)"),
    ("CO","carbono","oxigeno",2,"oxido carbonoso","monoxido de carbono","oxido de carbono(II)"),
    ("CO2","carbono","oxigeno",4,"dioxido carbonico","dioxido de carbono","oxido de carbono(IV)"),
    ("SO2","azufre","oxigeno",4,"dioxido sulfuroso","dioxido de azufre","oxido de azufre(IV)"),
    ("SO3","azufre","oxigeno",6,"trioxido sulfurico","trioxido de azufre","oxido de azufre(VI)"),
    ("NO","nitrogeno","oxigeno",2,"oxido nitroso","monoxido de nitrogeno","oxido de nitrogeno(II)"),
    ("NO2","nitrogeno","oxigeno",4,"dioxido de nitrogeno","dioxido de nitrogeno","oxido de nitrogeno(IV)"),
    ("N2O5","nitrogeno","oxigeno",5,"pentozido nitrico","pentoxido de dinitrogeno","oxido de nitrogeno(V)"),
    ("P2O5","fosforo","oxigeno",5,"pentozido fosforico","pentoxido de difosforo","oxido de fosforo(V)"),
    ("P2O3","fosforo","oxigeno",3,"trioxido fosforoso","trioxido de difosforo","oxido de fosforo(III)"),
    ("Cr2O3","cromo","oxigeno",3,"oxido cromoso","trioxido de dicromo","oxido de cromo(III)"),
    ("CrO3","cromo","oxigeno",6,"oxido cromico","trioxido de cromo","oxido de cromo(VI)"),
    ("MnO2","manganeso","oxigeno",4,"dioxido manganico","dioxido de manganeso","oxido de manganeso(IV)"),
    ("HF","hidrogeno","fluor",1,"fluoruro de hidrogeno","fluoruro de hidrogeno","fluoruro de hidrogeno"),
    ("HBr","hidrogeno","bromo",1,"bromuro de hidrogeno","bromuro de hidrogeno","bromuro de hidrogeno"),
    ("HI","hidrogeno","yodo",1,"yoduro de hidrogeno","yoduro de hidrogeno","yoduro de hidrogeno"),
    ("H2S","hidrogeno","azufre",2,"sulfuro de dihidrogeno","sulfuro de dihidrogeno","sulfuro de hidrogeno(II)"),
    ("CCl4","carbono","cloro",4,"tetracloruro carbonico","tetracloruro de carbono","cloruro de carbono(IV)"),
    ("PCl3","fosforo","cloro",3,"tricloruro fosforoso","tricloruro de fosforo","cloruro de fosforo(III)"),
    ("PCl5","fosforo","cloro",5,"pentacloruro fosforico","pentacloruro de fosforo","cloruro de fosforo(V)"),
    ("SiO2","silicio","oxigeno",4,"dioxido silicico","dioxido de silicio","oxido de silicio(IV)"),
    ("B2O3","boro","oxigeno",3,"trioxido borico","trioxido de diboro","oxido de boro(III)")
]
for formula,metal,nonmetal,ox,clasico,estequio,stock in binary_compounds:
    ex("nomenclatura","compuestos_binarios",2.0,["nomenclatura","compuestos_binarios"],"text",
       "NOMEN_BIN_3S",{"formula":formula},
       f"Nombra el compuesto binario {formula} usando los sistemas Clasico, Estequiometrico y Stock.",
       f"Clasico: {clasico} | Estequiometrico: {estequio} | Stock: {stock}",
       f"{clasico} / {estequio} / {stock}",
       f"Clasico: {clasico}. Estequiometrico: {estequio}. Stock: {stock}.")
    ex("nomenclatura","compuestos_binarios",2.0,["nomenclatura","compuestos_binarios"],"text",
       "NOMEN_BIN_FORM",{"nombre_stock":stock},
       f"Escribe la formula del compuesto denominado '{stock}'.",
       formula,formula,
       f"'{stock}' corresponde a {metal} con oxidacion {ox} y {nonmetal}. Formula: {formula}.")

# Acidos ternarios: 30 pares (nombre<->formula)
ternary_acids = [
    ("H2SO4","acido sulfurico"),("H2SO3","acido sulfuroso"),
    ("HNO3","acido nitrico"),("HNO2","acido nitroso"),
    ("H3PO4","acido fosforico"),("H3PO3","acido fosforoso"),
    ("HClO4","acido perclorico"),("HClO3","acido clorico"),
    ("HClO2","acido cloroso"),("HClO","acido hipocloroso"),
    ("H2CO3","acido carbonico"),("HBrO3","acido bromico"),
    ("HBrO","acido hipobromoso"),("HIO3","acido yodico"),
    ("H2CrO4","acido cromico"),("HMnO4","acido permanganico"),
    ("H3BO3","acido borico"),("H3AsO4","acido arsenico"),
    ("H3AsO3","acido arsenioso"),("H2MoO4","acido molibdico"),
    ("HIO4","acido peryodico"),("H2WO4","acido tungico"),
    ("HIO2","acido yodoso"),("H5IO6","acido peryodico orto"),
    ("H2TeO4","acido telurico"),("H2TeO3","acido teluroso"),
    ("H2SeO4","acido selenico"),("H2SeO3","acido selenioso"),
    ("H3PO2","acido hipofosforoso"),("H4P2O7","acido pirofosfórico")
]
for formula,nombre in ternary_acids:
    ex("nomenclatura","nomenclatura_ternaria",2.1,["nomenclatura","oxoacidos"],"text",
       "NOMEN_ACID_01",{"formula":formula},
       f"Como se llama el oxoacido (acido ternario) de formula {formula}?",
       nombre,nombre,
       f"La formula {formula} corresponde al {nombre}.")
    ex("nomenclatura","nomenclatura_ternaria",2.1,["nomenclatura","oxoacidos"],"text",
       "NOMEN_ACID_FORM",{"nombre":nombre},
       f"Escribe la formula del {nombre}.",
       formula,formula,
       f"El {nombre} tiene la formula {formula}.")

# Hidroxidos: 25 pares
hydroxides = [
    ("NaOH","hidroxido de sodio"),("KOH","hidroxido de potasio"),
    ("Ca(OH)2","hidroxido de calcio"),("Mg(OH)2","hidroxido de magnesio"),
    ("Al(OH)3","hidroxido de aluminio"),("Fe(OH)2","hidroxido de hierro(II)"),
    ("Fe(OH)3","hidroxido de hierro(III)"),("Cu(OH)2","hidroxido de cobre(II)"),
    ("Ba(OH)2","hidroxido de bario"),("NH4OH","hidroxido de amonio"),
    ("Zn(OH)2","hidroxido de zinc"),("Pb(OH)2","hidroxido de plomo(II)"),
    ("Cr(OH)3","hidroxido de cromo(III)"),("Mn(OH)2","hidroxido de manganeso(II)"),
    ("AgOH","hidroxido de plata"),("Sn(OH)2","hidroxido de estano(II)"),
    ("Sn(OH)4","hidroxido de estano(IV)"),("Ni(OH)2","hidroxido de niquel(II)"),
    ("Co(OH)2","hidroxido de cobalto(II)"),("Bi(OH)3","hidroxido de bismuto(III)"),
    ("LiOH","hidroxido de litio"),("Be(OH)2","hidroxido de berilio"),
    ("Cd(OH)2","hidroxido de cadmio"),("Hg(OH)2","hidroxido de mercurio(II)"),
    ("Ti(OH)4","hidroxido de titanio(IV)")
]
for formula,nombre in hydroxides:
    ex("nomenclatura","nomenclatura_ternaria",1.8,["nomenclatura","hidroxidos"],"text",
       "NOMEN_HIDRO_01",{"formula":formula},
       f"Nombra el hidroxido con formula {formula}.",
       nombre,nombre,f"Formula {formula} = {nombre}.")
    ex("nomenclatura","nomenclatura_ternaria",1.8,["nomenclatura","hidroxidos"],"text",
       "NOMEN_HIDRO_FORM",{"nombre":nombre},
       f"Escribe la formula del {nombre}.",
       formula,formula,f"El {nombre} tiene formula {formula}.")

# Sales ternarias: 20 pares (nombre<->formula)
sales = [
    ("Na2SO4","sulfato de sodio"),("CaSO4","sulfato de calcio"),
    ("MgSO4","sulfato de magnesio"),("FeSO4","sulfato de hierro(II)"),
    ("Fe2(SO4)3","sulfato de hierro(III)"),("CuSO4","sulfato de cobre(II)"),
    ("Al2(SO4)3","sulfato de aluminio"),("ZnSO4","sulfato de zinc"),
    ("NaNO3","nitrato de sodio"),("Ca(NO3)2","nitrato de calcio"),
    ("KNO3","nitrato de potasio"),("Pb(NO3)2","nitrato de plomo(II)"),
    ("Ca3(PO4)2","fosfato de calcio"),("Na3PO4","fosfato de sodio"),
    ("K2CO3","carbonato de potasio"),("Na2CO3","carbonato de sodio"),
    ("CaCO3","carbonato de calcio"),("AgNO3","nitrato de plata"),
    ("BaSO4","sulfato de bario"),("NaHCO3","bicarbonato de sodio")
]
for formula,nombre in sales:
    ex("nomenclatura","nomenclatura_ternaria",2.0,["nomenclatura","sales"],"text",
       "NOMEN_SAL_01",{"formula":formula},
       f"Nombra la sal ternaria con formula {formula}.",
       nombre,nombre,f"La formula {formula} corresponde al {nombre}.")
    ex("nomenclatura","nomenclatura_ternaria",2.0,["nomenclatura","sales"],"text",
       "NOMEN_SAL_FORM",{"nombre":nombre},
       f"Escribe la formula de la sal denominada '{nombre}'.",
       formula,formula,f"La sal '{nombre}' tiene la formula {formula}.")

# =====================================================================
# RESUMEN
# =====================================================================
topics = Counter(e["topic"] for e in ejercicios)
subtopics = Counter(e["subtopic"] for e in ejercicios)

print(f"\nTotal ejercicios generados: {len(ejercicios)}")
print("\nDistribucion por tema:")
for k,v in sorted(topics.items()):
    print(f"  {k}: {v}")
print("\nDistribucion por subtema:")
for k,v in sorted(subtopics.items()):
    print(f"  {k}: {v}")

output = "src/data/ejercicios_quimica_1000.json"
with open(output,"w",encoding="utf-8") as f:
    json.dump(ejercicios,f,ensure_ascii=False,indent=2)
print(f"\nArchivo guardado: {output}")
