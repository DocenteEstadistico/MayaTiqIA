#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Transforma los 981 ejercicios de quimica a opcion multiple (4 opciones)
y asigna 3 niveles de dificultad: facil, intermedio, intermedio_dificil.
Genera distractores pedagogicos basados en errores tipicos.
"""

import json, random
from collections import Counter

random.seed(2026)

INPUT  = "src/data/ejercicios_quimica_1000.json"
OUTPUT = "src/data/ejercicios_quimica_1000_mcq.json"

# ---------------------------------------------------------------------
# NIVELES
# ---------------------------------------------------------------------
LEVEL_BY_TEMPLATE = {
    # ---------- FACIL ----------
    "CONV_VOL_CC_ML": "facil",
    "ELEM_SIM_NOM":   "facil",
    "ELEM_NOM_SIM":   "facil",
    "ELEM_Z_NOM":     "facil",
    "MATER_ESTADO_01":"facil",
    "MATER_CLASS_01": "facil",
    "MASA_ATOM_01":   "facil",
    "ION_TIPO_01":    "facil",
    "TABLA_CLASS_01": "facil",
    # ---------- INTERMEDIO ----------
    "CONV_VOL_L_ML":  "intermedio",
    "CONV_VOL_ML_L":  "intermedio",
    "CONV_MASA_G_MG": "intermedio",
    "CONV_MASA_KG_G": "intermedio",
    "CONV_MASA_MG_G": "intermedio",
    "CONV_MASA_G_KG": "intermedio",
    "TEMP_C_K":       "intermedio",
    "ATOM_PART_01":   "intermedio",
    "ISOTOPO_01":     "intermedio",
    "TABLA_LOC_01":   "intermedio",
    "PROP_FQ_01":     "intermedio",
    "CAMBIO_FQ_01":   "intermedio",
    "CONS_MASA_01":   "intermedio",
    # ---------- INTERMEDIO-DIFICIL ----------
    "TEMP_C_F":        "intermedio_dificil",
    "TEMP_F_C":        "intermedio_dificil",
    "TEMP_K_C":        "intermedio_dificil",
    "DENS_CALC_D":     "intermedio_dificil",
    "DENS_CALC_V":     "intermedio_dificil",
    "DENS_CALC_M":     "intermedio_dificil",
    "MASA_MOLAR_01":   "intermedio_dificil",
    "OXNUM_01":        "intermedio_dificil",
    "NOMEN_BIN_3S":    "intermedio_dificil",
    "NOMEN_BIN_FORM":  "intermedio_dificil",
    "NOMEN_ACID_01":   "intermedio_dificil",
    "NOMEN_ACID_FORM": "intermedio_dificil",
    "NOMEN_HIDRO_01":  "intermedio_dificil",
    "NOMEN_HIDRO_FORM":"intermedio_dificil",
    "NOMEN_SAL_01":    "intermedio_dificil",
    "NOMEN_SAL_FORM":  "intermedio_dificil",
}
LEVEL_LABEL = {
    "facil": "Fácil",
    "intermedio": "Intermedio",
    "intermedio_dificil": "Intermedio-Difícil"
}

# ---------------------------------------------------------------------
# POOLS PARA DISTRACTORES
# ---------------------------------------------------------------------
ELEM_NAMES = ["Hidrogeno","Helio","Litio","Berilio","Boro","Carbono","Nitrogeno",
    "Oxigeno","Fluor","Neon","Sodio","Magnesio","Aluminio","Silicio","Fosforo",
    "Azufre","Cloro","Argon","Potasio","Calcio","Escandio","Titanio","Vanadio",
    "Cromo","Manganeso","Hierro","Cobalto","Niquel","Cobre","Zinc","Galio",
    "Germanio","Arsenico","Selenio","Bromo","Kripton","Rubidio","Estroncio",
    "Itrio","Zirconio","Niobio","Molibdeno","Tecnecio","Rutenio","Rodio",
    "Paladio","Plata","Cadmio","Indio","Estano","Antimonio","Teluro","Yodo",
    "Xenon","Cesio","Bario","Lantano"]
ELEM_SYMS = ["H","He","Li","Be","B","C","N","O","F","Ne","Na","Mg","Al","Si",
    "P","S","Cl","Ar","K","Ca","Sc","Ti","V","Cr","Mn","Fe","Co","Ni","Cu",
    "Zn","Ga","Ge","As","Se","Br","Kr","Rb","Sr","Y","Zr","Nb","Mo","Tc","Ru",
    "Rh","Pd","Ag","Cd","In","Sn","Sb","Te","I","Xe","Cs","Ba","La"]

OXOACIDS = ["acido sulfurico","acido sulfuroso","acido nitrico","acido nitroso",
    "acido fosforico","acido fosforoso","acido perclorico","acido clorico",
    "acido cloroso","acido hipocloroso","acido carbonico","acido bromico",
    "acido hipobromoso","acido yodico","acido cromico","acido permanganico",
    "acido borico","acido arsenico","acido arsenioso","acido molibdico",
    "acido peryodico","acido tungico","acido yodoso","acido telurico",
    "acido teluroso","acido selenico","acido selenioso","acido hipofosforoso"]
HYDROX = ["hidroxido de sodio","hidroxido de potasio","hidroxido de calcio",
    "hidroxido de magnesio","hidroxido de aluminio","hidroxido de hierro(II)",
    "hidroxido de hierro(III)","hidroxido de cobre(II)","hidroxido de bario",
    "hidroxido de amonio","hidroxido de zinc","hidroxido de plomo(II)",
    "hidroxido de cromo(III)","hidroxido de manganeso(II)","hidroxido de plata",
    "hidroxido de estano(II)","hidroxido de estano(IV)","hidroxido de niquel(II)",
    "hidroxido de cobalto(II)","hidroxido de bismuto(III)","hidroxido de litio",
    "hidroxido de berilio","hidroxido de cadmio","hidroxido de titanio(IV)"]
# Triples completos (clasico / estequiometrico / stock) para distractores NOMEN_BIN_3S
BINARY_TRIPLES = [
    "cloruro sodico / cloruro de sodio / cloruro de sodio(I)",
    "cloruro ferroso / dicloruro de hierro / cloruro de hierro(II)",
    "cloruro ferrico / tricloruro de hierro / cloruro de hierro(III)",
    "cloruro cuproso / cloruro de cobre / cloruro de cobre(I)",
    "cloruro cuprico / dicloruro de cobre / cloruro de cobre(II)",
    "oxido ferroso / monoxido de hierro / oxido de hierro(II)",
    "oxido ferrico / trioxido de dihierro / oxido de hierro(III)",
    "oxido cuprico / monoxido de cobre / oxido de cobre(II)",
    "oxido cuproso / monoxido de dicobre / oxido de cobre(I)",
    "oxido magnesico / monoxido de magnesio / oxido de magnesio(II)",
    "oxido aluminico / trioxido de dialuminio / oxido de aluminio(III)",
    "oxido sodico / monoxido de disodio / oxido de sodio(I)",
    "oxido calcico / monoxido de calcio / oxido de calcio(II)",
    "oxido carbonoso / monoxido de carbono / oxido de carbono(II)",
    "dioxido carbonico / dioxido de carbono / oxido de carbono(IV)",
    "dioxido sulfuroso / dioxido de azufre / oxido de azufre(IV)",
    "trioxido sulfurico / trioxido de azufre / oxido de azufre(VI)",
    "oxido nitroso / monoxido de nitrogeno / oxido de nitrogeno(II)",
    "pentozido fosforico / pentoxido de difosforo / oxido de fosforo(V)",
    "cloruro magnesico / dicloruro de magnesio / cloruro de magnesio(II)"
]

SALES = ["sulfato de sodio","sulfato de calcio","sulfato de magnesio",
    "sulfato de hierro(II)","sulfato de hierro(III)","sulfato de cobre(II)",
    "sulfato de aluminio","sulfato de zinc","nitrato de sodio","nitrato de calcio",
    "nitrato de potasio","nitrato de plomo(II)","fosfato de calcio","fosfato de sodio",
    "carbonato de potasio","carbonato de sodio","carbonato de calcio","nitrato de plata",
    "sulfato de bario","bicarbonato de sodio"]

# Pool de formulas binarias para distractores NOMEN_BIN_FORM
BINARY_FORMULAS = ["NaCl","MgCl2","AlCl3","FeCl2","FeCl3","CuCl","CuCl2","SnCl2",
    "SnCl4","PbCl2","FeO","Fe2O3","Fe3O4","CuO","Cu2O","MgO","Al2O3","Na2O",
    "CaO","CO","CO2","SO2","SO3","NO","NO2","N2O5","P2O5","P2O3","Cr2O3","CrO3",
    "MnO2","HF","HBr","HI","H2S","CCl4","PCl3","PCl5","SiO2","B2O3"]
# Pool de formulas de oxoacidos para distractores NOMEN_ACID_FORM
ACID_FORMULAS = ["H2SO4","H2SO3","HNO3","HNO2","H3PO4","H3PO3","HClO4","HClO3",
    "HClO2","HClO","H2CO3","HBrO3","HBrO","HIO3","H2CrO4","HMnO4","H3BO3",
    "H3AsO4","H3AsO3","H2MoO4","HIO4","H2WO4","HIO2","H5IO6","H2TeO4","H2TeO3",
    "H2SeO4","H2SeO3","H3PO2","H4P2O7"]
# Pool de formulas de hidroxidos
HIDRO_FORMULAS = ["NaOH","KOH","Ca(OH)2","Mg(OH)2","Al(OH)3","Fe(OH)2","Fe(OH)3",
    "Cu(OH)2","Ba(OH)2","NH4OH","Zn(OH)2","Pb(OH)2","Cr(OH)3","Mn(OH)2","AgOH",
    "Sn(OH)2","Sn(OH)4","Ni(OH)2","Co(OH)2","Bi(OH)3","LiOH","Be(OH)2","Cd(OH)2",
    "Hg(OH)2","Ti(OH)4"]
# Pool de formulas de sales
SAL_FORMULAS = ["Na2SO4","CaSO4","MgSO4","FeSO4","Fe2(SO4)3","CuSO4","Al2(SO4)3",
    "ZnSO4","NaNO3","Ca(NO3)2","KNO3","Pb(NO3)2","Ca3(PO4)2","Na3PO4","K2CO3",
    "Na2CO3","CaCO3","AgNO3","BaSO4","NaHCO3"]
FAMILIAS = ["IA","IIA","IIIA","IVA","VA","VIA","VIIA","VIII A","IB","IIB","IIIB",
    "IVB","VB","VIB","VIIB","VIII B"]

# ---------------------------------------------------------------------
# HELPERS
# ---------------------------------------------------------------------
def fmt_num(x):
    """Formatea un numero sin ceros innecesarios."""
    if isinstance(x, int):
        return str(x)
    f = float(x)
    if f == int(f):
        return str(int(f))
    return f"{f:g}"

def unique_options(correct, candidates, n=3):
    """Devuelve hasta n distractores unicos y distintos del correcto."""
    seen = {str(correct).strip()}
    out = []
    for c in candidates:
        s = str(c).strip()
        if s and s not in seen:
            out.append(s)
            seen.add(s)
            if len(out) >= n:
                break
    i = 0
    while len(out) < n:
        s = f"Ninguna de las anteriores ({i})" if i else "Ninguna de las anteriores"
        if s not in seen:
            out.append(s)
            seen.add(s)
        i += 1
    return out[:n]

def build_choices(correct, distractors):
    """Construye [{text, correct}] con el correcto en posicion aleatoria."""
    opts = [str(correct)] + [str(d) for d in distractors]
    random.shuffle(opts)
    choices = []
    marked = False
    for o in opts:
        is_c = (o == str(correct)) and not marked
        if is_c: marked = True
        choices.append({"text": o, "correct": is_c})
    # garantizar que al menos uno este marcado
    if not any(c["correct"] for c in choices):
        for c in choices:
            if c["text"] == str(correct):
                c["correct"] = True
                break
    correct_index = next(i for i,c in enumerate(choices) if c["correct"])
    return choices, correct_index

# ---------------------------------------------------------------------
# GENERADORES DE DISTRACTORES POR TEMPLATE
# ---------------------------------------------------------------------
def distractors(e):
    tid = e["template_id"]
    disp = e["answer_display"]
    ans = e["answer"]
    vp = e.get("variant_params", {})

    # -------- Conversiones multiplicativas ×1000 --------
    if tid in ("CONV_VOL_L_ML","CONV_MASA_G_MG","CONV_MASA_KG_G"):
        v = vp.get("valor", 0)
        unit = disp.split()[-1]
        return [f"{fmt_num(round(v*100,4))} {unit}",
                f"{fmt_num(round(v*10,4))} {unit}",
                f"{fmt_num(round(v/1000,6))} {unit}"]
    # -------- Conversiones divisivas /1000 --------
    if tid in ("CONV_VOL_ML_L","CONV_MASA_MG_G","CONV_MASA_G_KG"):
        v = vp.get("valor", 0)
        unit = disp.split()[-1]
        return [f"{fmt_num(round(v*1000,2))} {unit}",
                f"{fmt_num(round(v/100,6))} {unit}",
                f"{fmt_num(round(v/10000,8))} {unit}"]
    # -------- cc = mL --------
    if tid == "CONV_VOL_CC_ML":
        v = vp.get("valor", 0)
        return [f"{fmt_num(v*1000)} mL",
                f"{fmt_num(round(v/1000,4))} mL",
                f"{fmt_num(v*10)} mL"]
    # -------- Temperatura C→F --------
    if tid == "TEMP_C_F":
        t = vp.get("valor", 0)
        return [f"{round(t+32,2)} °F",
                f"{round(t*9/5,2)} °F",
                f"{round((t-32)*5/9,2)} °F"]
    # -------- Temperatura F→C --------
    if tid == "TEMP_F_C":
        t = vp.get("valor", 0)
        return [f"{round(t-32,2)} °C",
                f"{round((t+32)*5/9,2)} °C",
                f"{round(t*5/9,2)} °C"]
    # -------- Temperatura C→K --------
    if tid == "TEMP_C_K":
        t = vp.get("valor", 0)
        return [f"{round(t-273.15,2)} K",
                f"{round(t+273,2)} K",
                f"{round(t*273.15,2)} K"]
    # -------- Temperatura K→C --------
    if tid == "TEMP_K_C":
        k = vp.get("valor", 0)
        return [f"{round(k+273.15,2)} °C",
                f"{round(k-273,2)} °C",
                f"{round(k/273.15,2)} °C"]
    # -------- Densidad d = m/V --------
    if tid == "DENS_CALC_D":
        m = vp.get("masa",1); V = vp.get("volumen",1)
        return [f"{round(V/m,2)} g/mL",
                f"{round(m*V,2)} g/mL",
                f"{round(m+V,2)} g/mL"]
    # -------- Densidad V = m/d --------
    if tid == "DENS_CALC_V":
        m = vp.get("masa",1); d = vp.get("densidad",1)
        return [f"{round(m*d,2)} mL",
                f"{round(d/m,4)} mL",
                f"{round(abs(m-d),2)} mL"]
    # -------- Densidad m = d·V --------
    if tid == "DENS_CALC_M":
        d = vp.get("densidad",1); V = vp.get("volumen",1)
        return [f"{round(d/V,4)} g" if V else "0 g",
                f"{round(V/d,2)} g" if d else "0 g",
                f"{round(d+V,2)} g"]
    # -------- Conservacion de masa --------
    if tid == "CONS_MASA_01":
        v = float(ans)
        return [f"{fmt_num(v+10)} g", f"{fmt_num(v-5)} g", f"{fmt_num(v*2)} g"]
    # -------- Clasificacion materia (fijo 4 opciones) --------
    if tid == "MATER_CLASS_01":
        opts = ["Sustancia pura / Elemento",
                "Sustancia pura / Compuesto",
                "Mezcla / Homogenea",
                "Mezcla / Heterogenea"]
        return [o for o in opts if o != disp]
    # -------- Estados fisicos (fijo 4) --------
    if tid == "MATER_ESTADO_01":
        opts = ["Solido","Liquido","Gaseoso","Plasma"]
        return [o for o in opts if o != disp]
    # -------- Propiedades F vs Q --------
    if tid == "PROP_FQ_01":
        opts = ["Propiedad fisica","Propiedad quimica",
                "Propiedad biologica","Propiedad mecanica"]
        return [o for o in opts if o != disp]
    # -------- Cambios F vs Q --------
    if tid == "CAMBIO_FQ_01":
        opts = ["Cambio fisico","Cambio quimico","Cambio nuclear","Cambio biologico"]
        return [o for o in opts if o != disp]
    # -------- Simbolo → Nombre --------
    if tid in ("ELEM_SIM_NOM","ELEM_Z_NOM"):
        others = [n for n in ELEM_NAMES if n != ans]
        random.shuffle(others)
        return others[:3]
    # -------- Nombre → Simbolo --------
    if tid == "ELEM_NOM_SIM":
        others = [s for s in ELEM_SYMS if s != ans]
        random.shuffle(others)
        return others[:3]
    # -------- Particulas subatomicas --------
    if tid == "ATOM_PART_01":
        v = int(ans)
        candidates = [v+1, v-1, v+2, v-2, v*2]
        candidates = [c for c in candidates if c > 0 and c != v]
        random.shuffle(candidates)
        return [str(c) for c in candidates[:3]]
    # -------- Isotopos (fijo) --------
    if tid == "ISOTOPO_01":
        opts = ["Si, son isotopos","No, son isobaros",
                "No, son isotonos","No, son elementos diferentes"]
        return [o for o in opts if o != disp]
    # -------- Masa atomica --------
    if tid == "MASA_ATOM_01":
        v = float(ans)
        return [f"{round(v+5,3)} uma", f"{round(v*2,3)} uma", f"{round(abs(v-5),3)} uma"]
    # -------- Ubicacion en tabla --------
    if tid == "TABLA_LOC_01":
        import re
        m = re.match(r"Periodo (\d+) / Familia (.+)", disp)
        if m:
            p = int(m.group(1)); fam = m.group(2).strip()
            others = [f for f in FAMILIAS if f != fam]
            random.shuffle(others)
            # construir 3 variantes distintas al original
            p_up = p+1 if p < 7 else p-1
            p_dn = p-1 if p > 1 else p+2
            opts = [f"Periodo {p_up} / Familia {fam}",
                    f"Periodo {p} / Familia {others[0]}",
                    f"Periodo {p_dn} / Familia {others[1]}",
                    f"Periodo {p} / Familia {others[2]}"]
            uniq = []
            for o in opts:
                if o != disp and o not in uniq:
                    uniq.append(o)
            return uniq[:3]
        return ["Periodo 1 / Familia IIA","Periodo 3 / Familia IVA","Periodo 4 / Familia VIIIA"]
    # -------- Metal/no metal/metaloide (fijo) --------
    if tid == "TABLA_CLASS_01":
        opts = ["Metal","No metal","Metaloide","Gas noble"]
        return [o for o in opts if o != disp]
    # -------- Iones (fijo) --------
    if tid == "ION_TIPO_01":
        opts = ["Cation","Anion","Molécula neutra","Radical libre"]
        return [o for o in opts if o != disp]
    # -------- Masa molar --------
    if tid == "MASA_MOLAR_01":
        v = float(ans)
        candidates = [round(v+2,2), round(v-2,2), round(v*2,2),
                      round(v/2,2), round(v+10,2)]
        candidates = [c for c in candidates if c > 0 and c != v]
        random.shuffle(candidates)
        return [f"{c} g/mol" for c in candidates[:3]]
    # -------- Numero de oxidacion --------
    if tid == "OXNUM_01":
        v = int(ans)
        sign = lambda n: ("+" if n>0 else "") + str(n)
        candidates = [-v, v+1, v-1, v+2, v-2]
        candidates = [c for c in candidates if c != v]
        random.shuffle(candidates)
        return [sign(c) for c in candidates[:3]]
    # -------- Nomenclatura binaria 3 sistemas --------
    if tid == "NOMEN_BIN_3S":
        others = [t for t in BINARY_TRIPLES if t != disp]
        random.shuffle(others)
        return others[:3]
    # -------- Formula desde nombre Stock --------
    if tid == "NOMEN_BIN_FORM":
        others = [x for x in BINARY_FORMULAS if x != ans]
        random.shuffle(others)
        return others[:3]
    # -------- Oxoacidos: nombre --------
    if tid == "NOMEN_ACID_01":
        others = [a for a in OXOACIDS if a != ans]
        random.shuffle(others)
        return others[:3]
    # -------- Oxoacidos: formula --------
    if tid == "NOMEN_ACID_FORM":
        others = [x for x in ACID_FORMULAS if x != ans]
        random.shuffle(others)
        return others[:3]
    # -------- Hidroxidos: nombre --------
    if tid == "NOMEN_HIDRO_01":
        others = [h for h in HYDROX if h != ans]
        random.shuffle(others)
        return others[:3]
    # -------- Hidroxidos: formula --------
    if tid == "NOMEN_HIDRO_FORM":
        others = [x for x in HIDRO_FORMULAS if x != ans]
        random.shuffle(others)
        return others[:3]
    # -------- Sales: nombre --------
    if tid == "NOMEN_SAL_01":
        others = [s for s in SALES if s != ans]
        random.shuffle(others)
        return others[:3]
    # -------- Sales: formula --------
    if tid == "NOMEN_SAL_FORM":
        others = [x for x in SAL_FORMULAS if x != ans]
        random.shuffle(others)
        return others[:3]
    # Default: variantes genericas
    return [disp + " (variante A)", disp + " (variante B)", disp + " (variante C)"]

# ---------------------------------------------------------------------
# MAIN
# ---------------------------------------------------------------------
def main():
    with open(INPUT, "r", encoding="utf-8") as f:
        exercises = json.load(f)

    out = []
    level_counts = Counter()

    for e in exercises:
        tid = e["template_id"]
        diff = float(e.get("difficulty", 1.5))
        level = LEVEL_BY_TEMPLATE.get(tid,
            "facil" if diff <= 1.3 else
            "intermedio" if diff <= 1.7 else
            "intermedio_dificil")
        correct = e["answer_display"]
        dists = distractors(e)
        dists = unique_options(correct, dists, n=3)
        choices, correct_idx = build_choices(correct, dists)
        new = dict(e)
        new["level"] = level
        new["level_label"] = LEVEL_LABEL[level]
        new["choices"] = choices
        new["correct_index"] = correct_idx
        new["answer_type"] = "multiple_choice"
        out.append(new)
        level_counts[level] += 1

    print(f"\nTotal ejercicios transformados: {len(out)}")
    print("\nDistribucion por nivel:")
    for k in ("facil","intermedio","intermedio_dificil"):
        print(f"  {LEVEL_LABEL[k]:>20}: {level_counts[k]}")

    # Verificar que todos tengan exactamente 1 correcta y 4 opciones
    bad = 0
    for e in out:
        if len(e["choices"]) != 4 or sum(1 for c in e["choices"] if c["correct"]) != 1:
            bad += 1
    print(f"\nEjercicios con problema (len!=4 o correct!=1): {bad}")

    with open(OUTPUT, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)
    print(f"\nArchivo guardado: {OUTPUT}")

if __name__ == "__main__":
    main()
