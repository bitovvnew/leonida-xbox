"""Turns a frametime capture (one ms value per line, or CSV with a `ms` column)
into avg fps and 1% low, the numbers used in the bench table.

usage: python frametimes.py capture.csv [--label "rtx 4070 1440p ultra"]
"""
import argparse
import csv
import statistics
import sys
from pathlib import Path


def load(path: Path) -> list[float]:
    text = path.read_text(encoding="utf-8").strip().splitlines()
    if not text:
        return []
    if "ms" in text[0].lower().split(","):
        rows = csv.DictReader(text)
        key = next(k for k in rows.fieldnames if k.strip().lower() == "ms")
        return [float(r[key]) for r in rows if r[key].strip()]
    return [float(line) for line in text if line.strip()]


def summarize(ms: list[float]) -> dict:
    fps = sorted(1000.0 / t for t in ms if t > 0)
    if not fps:
        raise ValueError("empty capture")
    cut = max(1, len(fps) // 100)
    return {
        "frames": len(fps),
        "avg": round(len(ms) / (sum(ms) / 1000.0), 1),
        "low1": round(statistics.fmean(fps[:cut]), 1),
        "median": round(statistics.median(fps), 1),
    }


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("capture", type=Path)
    ap.add_argument("--label", default="")
    a = ap.parse_args()
    s = summarize(load(a.capture))
    print(f"{a.label or a.capture.stem:<32} avg {s['avg']:>6}  1% {s['low1']:>6}  med {s['median']:>6}  ({s['frames']} frames)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
