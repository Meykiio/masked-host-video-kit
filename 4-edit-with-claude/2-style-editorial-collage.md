# Style brief: Editorial Essay Collage

The look of the "animated opinion essay": warm paper, torn halftone photos, newspaper clippings, a yellow highlighter, a red marker, masking tape and big cut-out headlines. Everything feels like cut paper on a desk. It works well for explainers and "exposé" videos because real screenshots become **evidence on the table**.

Claude: build the video in this style from scratch. Everything below is the target. The sample frames in `examples/` show it.

## Why this style

- Screenshots keep their legibility (they are printed as clippings), so proof stays proof
- It matches a warm-and-cold look (warm paper, cool footage)
- The camera whip transitions and stepped cutouts keep constant visual change without chaos

## The rules of the medium

### Canvas and code
- Single HTML page with one `<canvas>` at **1080x1920** (vertical). Use 24 fps.
- Every frame is a **pure function of time `t`**: no `Math.random()`, no `Date.now()`. Use a seeded random generator so the same `t` always gives the same pixels. This makes rendering deterministic.
- Expose these on `window` so the render tool can drive the page:
  - `window.seek = async (t) => { /* load needed images/frames, draw the frame for time t */ }`
  - `window.DURATION` (seconds)
  - `window.READY = true` once everything is loaded
  - `window.renderSFX = async (duration, sampleRate) => Float32Array` (interleaved stereo sound effects, see Sound)
- Cache every static texture and sprite once. Only the animated parts redraw per frame. A frame should take well under 200 ms.
- Load fonts before the first draw: `document.fonts.load()` for each font spec.

### Paper and color

| Item | Value |
|---|---|
| Paper | `#f0e9d9` with a fibre texture multiplied over it |
| Newsprint | `#e9e1cb` |
| Card | `#f5f1e7` |
| Kraft | `#c9a878` |
| Ink | `#1a1816` |
| Red | `#b8483a` (paper blocks and the marker) |
| Highlighter | `rgba(255,226,38,0.84)`, blended with `multiply` |
| One accent from the character | e.g. indigo `#2a3352`, so graphics and footage feel related |

**Paper fibre texture:** build once, about 1600x2600. Start with white, add a low-resolution noise field upscaled smooth, then thousands of short dark and light fibre strokes (random angle, 4 to 20 px, low alpha) and tiny dust specks. Multiply it over the paper color and over every cutout (alpha 0.35 to 0.8).

### Fonts
- **Anton** for headlines (condensed, heavy)
- **Oswald 700** for labels, stickers and captions
- **Libre Baskerville** (bold and italic) for newspaper clippings
- Headlines at 100 px or larger, labels and captions at 52 to 66 px on a 1080-wide canvas. It must read on a phone.

### Cutouts (the building block)
- Each element is a separate **sprite**: a rectangle with some sides **torn** (ragged edge, made from fractal noise along the edge) and other sides **straight** (scissor cut), a white or paper border for photos, fibre texture multiplied on top, and a **soft drop shadow** (blur 15, offset 4 and 8) plus a tight contact shadow (blur 2).
- **Strips:** a text label cut from paper. Light card with ink text, or dark ink with off-white text. Draw the text, measure it, then size the strip around it.
- **Clippings:** a newspaper cutout with a kicker line, a bold serif headline, an italic deck, and greeked body text columns (random letters in tiny serif type).
- **Photos:** convert portraits to a **halftone duotone**: gray, slight blur, add film noise, then render dots on a 45-degree grid (cell 4 px) between ink and paper colors. Add a white border and tape.
- **Screenshots and screen recordings are NOT halftoned.** Keep them readable: slightly desaturate, warm tint, light paper texture, a few dust specks, then print them as a paper cutout.
- **Phones:** a flat dark-ink silhouette with a playing screen, for showing social feeds.
- **Tape:** a semi-transparent beige strip (alpha 0.8) with a jagged short edge, rotated a few degrees, with a faint shadow.

### Marks drawn live
- **Highlighter:** a translucent yellow band that sweeps **left to right** over a key phrase in about 0.4 to 0.5 s. Uneven top and bottom edges, a few felt streaks, a darker pool where the tip lands. Blend mode `multiply`.
- **Red marker ring:** a hand-drawn loop (an ellipse with noise and overshoot) drawn on over about 0.45 s, a second thinner offset stroke for the marker texture.
- **Ink arrow:** a polyline drawn on by fraction, round caps, dashed when it is a "flow", with a filled head when finished.
- **Stamp:** a rotated double-border rectangle with big condensed text in red, a light paper fill so it stays readable, rough knocked-out specks. It lands scaled 1.25 to 1.0 in one step.
- **Counter:** numbers on a paper strip that count up in steps (re-cut digits), not smoothly.

### Motion
- **Cutouts arrive on 12 fps steps**, in exactly 4 frames (hand-animated feel):
  - `drop`: scale 1.16, 1.05, 0.985, 1 with a small rotation that settles to 0
  - `slide` from a side: offsets about -420, -150, -36, 0 px (and the same vertically), with a small rotation
- Quantize time for these moves: `tq = floor(t * 12) / 12`.
- **Camera:** a smooth continuous parallax. Each layer has a depth `p` (0.2 for paper, 0.5 to 0.7 for background blocks, 1 for the main plane, 1.05 to 1.12 for text in front). Camera position and zoom are scaled by `p`. Use a slow drift and a small push-in over each segment.
- **Whip transition between segments:** during the last 0.16 s of a segment the picture slides off in a direction while blurring (directional blur, up to about 22 px, 7 samples), and the next segment slides in over 0.3 s with a cubic ease out. **Wrap the blurred picture around the frame edges** so there is never a blank frame. Alternate the direction between segments.
- **New sheet slides up:** a full-height paper sheet with a torn top edge slides over the old scene on 12 fps steps. Use it for a new idea inside one scene.
- **Pull-back reveal:** the camera zooms out to show a wall made of many small prints (for "everywhere").

### Finishing pass (run on every frame)
- **Film grain:** four pre-made 256x256 noise tiles, one picked per 1/12 s, overlay blend at alpha 0.13 on the talking-head beats and 0.26 on the paper scenes
- **Warm vignette:** a radial gradient multiplied from white to a warm gray at the corners
- On the talking-head footage also apply a soft warm tint (`soft-light`, alpha 0.18) so the footage sits in the same world as the paper

### Talking-head beats
- The character clip fills the frame. Apply a slow punch-in: scale 1.0 to 1.1 over the beat.
- Headline strips sit in the top 40%. They land with the `drop` arrival on the spoken word and the key phrase gets a highlighter sweep.

## Sound (synthesized, no sound files)

Write a small sound kit using the Web Audio API that can run in an `OfflineAudioContext` (so the render tool can bake it to a WAV). Use seeded noise so renders are identical. The sounds:

| Event | Recipe |
|---|---|
| Paper cutout lands | Short brown-noise thud (lowpass 650 Hz, 70 ms) plus a sine drop from 150 to 70 Hz, plus a tiny bandpass tap at 1.7 kHz |
| Slide | 0.25 s of pink noise, lowpass sweeping 420 to 1100 Hz |
| Highlighter | Pink noise bandpass 800 to 1300 Hz for the sweep length, plus a soft stroke texture |
| Marker or pen | Many tiny noise bursts (bandpass about 2.9 kHz) across the stroke length |
| Whoosh at a transition | 0.6 s of pink noise, bandpass sweeping 350 to 1700 Hz and back, peaking on the hidden cut |
| Counter tick | 18 ms bandpass noise burst at 3 kHz, thinning as the number settles |
| Stamp | Thud at 160 Hz plus a bandpass burst at 1.3 kHz. **Use once** |
| Big impact | Thud plus 0.7 s of pink noise with a lowpass falling from 2400 to 300 Hz plus a soft low ding. **Use once, on the key number** |
| Resolve | Two quiet rising chime notes at the very end |

Keep the sound master quiet. The render tool mixes these about 20 dB under the voice.

## Structure
- The first frame already shows the claim as text.
- The timeline is a list of segments, `{ a, b, type: 'talking' | 'cutaway', id }`, with a direction for each whip. Build every cutaway as its own function that draws at time `t`.
- Captions are a list of `[start, end, text, highlightedWord]`.
- Keep one big payoff and one clear last card.

## Free to adapt
You can change the palette to match the character, the proof material and the headlines. Keep the medium: paper, tape, torn edges, highlighter, marker, stepped arrivals, whip transitions, grain.
