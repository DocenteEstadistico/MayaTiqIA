#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Construye un banco equilibrado entre las cinco áreas principales."""

import argparse
import json
import random
from collections import defaultdict
from pathlib import Path

if __package__:
    from . import mayan_generator as mg
else:
    import mayan_generator as mg


THEMES = (
    "aritmetica",
    "algebra",
    "geometria_trigonometria",
    "conjuntos",
    "progresiones",
)
PROJECT_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_OUTPUT = PROJECT_ROOT / "src" / "data"


def _divide_quota(total, parts):
    base, remainder = divmod(total, parts)
    return [base + (index < remainder) for index in range(parts)]


def _templates_by_theme():
    grouped = {theme: defaultdict(list) for theme in THEMES}
    for template in mg.TEMPLATES:
        if template.topic in grouped:
            grouped[template.topic][template.subtopic].append(template)

    missing = [theme for theme, subtopics in grouped.items() if not subtopics]
    if missing:
        raise ValueError(f"No hay plantillas registradas para estas áreas: {', '.join(missing)}")
    return grouped


def _generate_for_template(template, quota, rng, seen):
    generated = []
    attempts = 0
    max_attempts = max(500, quota * 100)
    while len(generated) < quota and attempts < max_attempts:
        attempts += 1
        exercise = mg.generate_one(template, rng)
        if exercise and exercise["content_hash"] not in seen:
            seen.add(exercise["content_hash"])
            generated.append(exercise)

    if len(generated) != quota:
        raise RuntimeError(
            f"La plantilla {template.id} ({template.topic}/{template.subtopic}) "
            f"solo produjo {len(generated)} de {quota} ejercicios únicos "
            f"en {attempts} intentos."
        )
    return generated


def generate_bank(total=1000, seed=42, out_dir=DEFAULT_OUTPUT):
    if total < len(THEMES):
        raise ValueError(f"El total debe ser al menos {len(THEMES)}.")

    out_dir = Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    grouped = _templates_by_theme()
    theme_quotas = _divide_quota(total, len(THEMES))
    rng = random.Random(seed)
    seen = set()
    all_exercises = []

    for theme, theme_quota in zip(THEMES, theme_quotas):
        subtopics = grouped[theme]
        subtopic_quotas = _divide_quota(theme_quota, len(subtopics))
        theme_exercises = []

        for (subtopic, templates), subtopic_quota in zip(subtopics.items(), subtopic_quotas):
            template_quotas = _divide_quota(subtopic_quota, len(templates))
            for template, template_quota in zip(templates, template_quotas):
                theme_exercises.extend(
                    _generate_for_template(template, template_quota, rng, seen)
                )

        if len(theme_exercises) != theme_quota:
            raise RuntimeError(
                f"El área {theme} produjo {len(theme_exercises)} de {theme_quota} ejercicios."
            )
        theme_path = out_dir / f"{theme}_{theme_quota}.json"
        theme_path.write_text(
            json.dumps(theme_exercises, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
        all_exercises.extend(theme_exercises)
        print(f"{theme:<28} {len(theme_exercises):>4}/{theme_quota}")

    if len(all_exercises) != total or len(seen) != total:
        raise RuntimeError(
            f"El banco no alcanzó el total esperado: {len(all_exercises)} de {total}."
        )

    bank_path = out_dir / f"ejercicios_base_{total}.json"
    bank_path.write_text(
        json.dumps(all_exercises, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"Total: {len(all_exercises)} ejercicios únicos -> {bank_path}")
    return all_exercises


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--total", type=int, default=1000, help="cantidad total (por defecto: 1000)")
    parser.add_argument("--seed", type=int, default=42, help="semilla reproducible")
    parser.add_argument(
        "--out",
        type=Path,
        default=DEFAULT_OUTPUT,
        help=f"directorio de salida (por defecto: {DEFAULT_OUTPUT})",
    )
    args = parser.parse_args()
    generate_bank(total=args.total, seed=args.seed, out_dir=args.out)


if __name__ == "__main__":
    main()
