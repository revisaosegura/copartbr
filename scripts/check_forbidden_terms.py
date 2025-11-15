#!/usr/bin/env python3
"""Utility script to ensure personal identifiers are not present in the repository."""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path
from typing import Iterator

# Terms explicitly requested to be removed from the codebase
FORBIDDEN_TERMS = {"samany", "cutrim", "manyc"}
EXCLUDED_NAMES = {".git", "node_modules", "dist", "build", ".turbo", "coverage", "tmp", "pnpm-lock.yaml"}
SCRIPT_PATH = Path(__file__).resolve()

FORBIDDEN_PATTERNS = [
    re.compile(rf"\b{re.escape(term)}\b", re.IGNORECASE) for term in FORBIDDEN_TERMS
]


def scan_path(path: Path) -> list[tuple[Path, int, str]]:
    """Scan a file for forbidden terms.

    Returns a list of tuples containing the file path, line number, and offending line.
    """
    findings: list[tuple[Path, int, str]] = []
    try:
        content = path.read_text(encoding="utf-8")
    except (UnicodeDecodeError, OSError):
        # Skip binary files or unreadable paths
        return findings

    for idx, line in enumerate(content.splitlines(), start=1):
        if any(pattern.search(line) for pattern in FORBIDDEN_PATTERNS):
            findings.append((path, idx, line.strip()))
    return findings


def iter_files(base: Path) -> Iterator[Path]:
    if base.is_file():
        yield base
        return

    if not base.is_dir():
        return

    for entry in base.iterdir():
        if entry.name in EXCLUDED_NAMES or entry.is_symlink():
            continue
        if entry.is_dir():
            yield from iter_files(entry)
        elif entry.is_file():
            yield entry


def main() -> int:
    parser = argparse.ArgumentParser(description="Check repository for forbidden personal identifiers.")
    parser.add_argument(
        "paths",
        nargs="*",
        default=["."],
        help="Paths to scan. Defaults to the current directory.",
    )
    args = parser.parse_args()

    base_paths = [Path(p) for p in args.paths]
    all_findings: list[tuple[Path, int, str]] = []

    for base in base_paths:
        for path in iter_files(base.resolve()):
            if path.name in EXCLUDED_NAMES:
                continue
            if path == SCRIPT_PATH:
                continue
            all_findings.extend(scan_path(path))

    if all_findings:
        for file_path, line_number, snippet in all_findings:
            print(f"{file_path}:{line_number}: {snippet}")
        print(
            "\nErro: foram encontradas menções a termos proibidos. Remova-as antes de prosseguir.",
            file=sys.stderr,
        )
        return 1

    print("Nenhuma menção a termos proibidos foi encontrada.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
