"""Word-level timestamps for your recordings (runs locally, no account needed).

Setup (once):   py -3.11 -m venv .venv  then  .venv/Scripts/pip install faster-whisper     (Mac/Linux: .venv/bin/pip)
Usage:          python transcribe.py <model> <language> <audio-or-video> [more files]
Example:        python transcribe.py medium ar 1.mp4 2.mp4
Output:         <file>.words.json with [{text, start, end}]  and  <file>.pauses.txt (silences of 0.2 s or more)

Models: small (fast), medium (good, about 1.5 GB), large-v3 (best, about 3 GB, slow on a laptop CPU).
Languages: en, fr, ar ... For Darija (Algerian Arabic) use ar or fr. Neither writes Darija correctly,
so use the output for TIMING only and write the caption text yourself from your script.
Needs ffmpeg on PATH for the pause detection.
"""
import json
import re
import subprocess
import sys

from faster_whisper import WhisperModel


def pauses(path):
    out = subprocess.run(
        ["ffmpeg", "-v", "info", "-i", path, "-af", "silencedetect=noise=-38dB:d=0.2", "-f", "null", "-"],
        capture_output=True, text=True,
    ).stderr
    times = re.findall(r"silence_(start|end): ([0-9.]+)", out)
    lines, start = [], None
    for kind, v in times:
        if kind == "start":
            start = float(v)
        elif start is not None:
            lines.append(f"{start:.2f} -> {float(v):.2f}  ({float(v) - start:.2f}s)")
            start = None
    return lines


def main():
    if len(sys.argv) < 4:
        sys.exit(__doc__)
    model_name, lang, files = sys.argv[1], sys.argv[2], sys.argv[3:]
    model = WhisperModel(model_name, device="cpu", compute_type="int8")
    for f in files:
        segs, _ = model.transcribe(f, language=lang, word_timestamps=True, beam_size=5)
        words = [{"text": w.word.strip(), "start": round(w.start, 2), "end": round(w.end, 2)} for s in segs for w in s.words]
        with open(f + ".words.json", "w", encoding="utf-8") as fh:
            json.dump(words, fh, ensure_ascii=False, indent=1)
        with open(f + ".pauses.txt", "w", encoding="utf-8") as fh:
            fh.write("\n".join(pauses(f)))
        print(f"{f}: {len(words)} words -> {f}.words.json, pauses -> {f}.pauses.txt")


if __name__ == "__main__":
    main()
