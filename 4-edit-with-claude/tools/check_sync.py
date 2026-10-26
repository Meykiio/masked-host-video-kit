"""Compare a motion-transfer output with your original recording.

Usage:  python check_sync.py original.mp4 higgsfield-output.mp4

Prints both lengths, then the audio offset at four points in the clip.
0 ms everywhere means your original voice lines up perfectly with the new video.
If the output is shorter, the seconds that are missing are printed so you can cover them with graphics.
Needs: ffmpeg on PATH, numpy (pip install numpy).
"""
import subprocess
import sys

import numpy as np

SR = 8000


def load(path):
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", path, "-vn", "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"],
        capture_output=True, check=True,
    ).stdout
    return np.frombuffer(raw, dtype=np.int16).astype(np.float32)


def envelope(x, hop=SR // 100):  # 10 ms steps
    n = len(x) // hop
    return np.abs(x[: n * hop]).reshape(n, hop).mean(1)


def main():
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    src, out = envelope(load(sys.argv[1])), envelope(load(sys.argv[2]))
    print(f"original: {len(src) / 100:.2f}s   output: {len(out) / 100:.2f}s")
    missing = len(src) / 100 - len(out) / 100
    if missing > 0.3:
        print(f"-> the output is {missing:.2f}s shorter. Missing audio at {len(out) / 100:.2f}s to {len(src) / 100:.2f}s of your original.")
    span = 500  # compare 5 s windows
    for start in [1.0, len(out) / 100 * 0.35, len(out) / 100 * 0.65, len(out) / 100 - 6.0]:
        s0 = int(max(0, start) * 100)
        a = out[s0:s0 + span]
        if len(a) < span:
            continue
        best = None
        for lag in range(-150, 151):  # +-1.5 s
            b0 = s0 + lag
            if b0 < 0 or b0 + span > len(src):
                continue
            c = np.corrcoef(a, src[b0:b0 + span])[0, 1]
            if best is None or c > best[0]:
                best = (c, lag)
        if best:
            print(f"  at {start:5.1f}s: offset {best[1] * 10:+5d} ms   (match {best[0]:.3f})")


if __name__ == "__main__":
    main()
