#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Compatibilidad con el constructor anterior del banco de 400 ejercicios."""

if __package__:
    from .build_exercise_bank import DEFAULT_OUTPUT, generate_bank
else:
    from build_exercise_bank import DEFAULT_OUTPUT, generate_bank


def generate_base_400(seed=42, out_dir=DEFAULT_OUTPUT):
    return generate_bank(total=400, seed=seed, out_dir=out_dir)


if __name__ == "__main__":
    generate_base_400()
