"""Render the invitation's original instrumental loop. Requires NumPy."""
import wave
from pathlib import Path

import numpy as np

rate = 24000
beat = 0.52
track = np.zeros(round(64 * beat * rate))
rng = np.random.default_rng(28)

def pluck(beat_number, semitone, amplitude, length):
    t = np.arange(round(length * rate)) / rate
    frequency = 220 * 2 ** (semitone / 12)
    phase = 2 * np.pi * frequency * t
    partials = (
        np.sin(phase + 0.13 * np.sin(2 * np.pi * 3 * t))
        + 0.24 * np.sin(2 * phase) * np.exp(-3 * t)
        + 0.15 * np.sin(3.006 * phase) * np.exp(-8 * t)
        + 0.045 * rng.normal(size=t.size) * np.exp(-28 * t)
    )
    envelope = np.minimum(1, t * 110) * np.exp(-2.9 * t)
    envelope *= np.minimum(1, (length - t) * 7)
    i = round(beat_number * beat * rate) + np.arange(t.size)
    track[i % track.size] += amplitude * partials * envelope

phrases = [
    [(0,0),(2,4),(3.5,7),(5,9),(6.5,7)],
    [(0,4),(1.5,2),(3,4),(5,7),(6.5,4)],
    [(0,9),(2,12),(3.5,14),(5,12),(6.5,9)],
    [(0,7),(2.5,9),(4,7),(5.5,4),(7,2)],
    [(0,4),(1.5,7),(3,9),(5,12),(6.5,14)],
    [(0,16),(2,14),(3.5,12),(5,9),(7,7)],
    [(0,9),(2,7),(4,4),(6,2),(7,4)],
    [(0,2),(2,4),(3.5,2),(5,0)],
]
for measure, phrase in enumerate(phrases):
    for time, note in phrase:
        pluck(measure * 8 + time, note + 12, 0.24, 1.65)
    for time, note, strength in [(0,-12,.18),(2,-5,.08),(4,0,.13),(6,-5,.08)]:
        pluck(measure * 8 + time, note, strength, 2.5)
    if measure in {0, 2, 4, 7}:
        pluck(measure * 8 + .15, 31, .055, 2.2)

dry = track.copy()
for seconds, strength in [(0.068,.19),(0.129,.13),(0.24,.10),(0.36,.06)]:
    track += strength * np.roll(dry, round(seconds * rate))

with wave.open(str(Path(__file__).resolve().parents[1] / 'public/art/theme.wav'), 'wb') as audio:
    audio.setparams((1, 2, rate, 0, 'NONE', ''))
    audio.writeframes((np.clip(track, -1, 1) * 32767).astype('<i2').tobytes())
