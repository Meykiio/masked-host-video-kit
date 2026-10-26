# Edit rules (Claude reads this before building)

These rules come from making the example video and from published short-form editing guidance. Most sources are creator blogs and vendor pages, not controlled studies, so treat the numbers as starting points and check your own retention graph after posting.

## 1. Structure: talking head vs cutaways

- **The character is on screen for about a quarter of the video**, in short beats of 1.5 to 3 seconds. The rest are cutaways that show the thing being said.
- **Open with the claim and a face in the first frame.** Headline text on frame 1. About half of viewers watch muted.
- **Something new appears every 1 to 2 seconds.** A new proof item, a highlighter, a stamp, a counter, or a transition. Never hold one static image for more than about 2 seconds.
- **Re-trigger attention where people tend to leave:** right after the hook (seconds 3 to 8) and in the middle. Put a pattern break there, such as a stamp or a switch from graphics back to the character.
- **Cut on a change of idea.** Each cutaway shows exactly the claim in the sentence being spoken. When the sentence changes, the picture changes.
- **Saved moments:** one big visual payoff (for example a number counting up) near the middle or the 70% mark, and a short, clear final card.
- **End card:** hold about 1 to 1.5 seconds after your last word. State the takeaway or point to the next video only if you will really post it soon.

## 2. The reserved top space

You left empty space at the top of the recordings. Use it for headline strips that land on the beat of the spoken word. Keep headlines to 2 to 5 words, in large condensed type. On the talking-head beats, the strip text is the point of the sentence, not a repeat of the caption.

## 3. Captions

- **Write the captions from your script, not from the transcription.** Speech-to-text gets Darija, French and mixed-language spelling wrong. Use the transcription only for **timestamps**.
- 3 to 5 words per caption, one idea per line, one highlighted keyword per line.
- Place them between 55% and 75% of the screen height. The bottom of the screen is covered by the app's own buttons.
- Each caption appears exactly when the first word starts and leaves when the last word ends.
- Check with the audio: pick 5 random captions and compare their timing against the waveform pauses.

## 4. Transitions

- **Fast blurred whip between segments**, about 0.16s out and 0.3s in, with the motion blur wrapping around the frame edges so the frame is never blank. Direction alternates.
- Hide each cut inside the whip. A hard cut is allowed only between two beats of the same scene.
- A new idea inside a scene can use a "new sheet slides up" move instead of a whip.

## 5. Proof and honesty

- Use **real screenshots, real numbers and real clips** from the creators you talk about. Crop for legibility, never edit the numbers.
- Anything you invent for illustration must be drawn as a **diagram** (a flat play-button card, an arrow), never as a fake screenshot with fake numbers.
- If a number could be misread (a market cap read as profit), write the label next to it ("MARKET CAP").
- If a claim has a real caveat, say it on screen.

## 6. Sound

- **No music.** It competes with the voice and invites copyright claims.
- Every sound is tied to a visible event: paper cutout landing, slide, marker stroke, highlighter sweep, a whoosh on each transition, counter ticks, and **one** stamp and **one** impact for the biggest moments.
- Effects sit about **20 dB under the voice**. At most 3 sounds at once. Leave small silences so the big hit reads.
- Your original voice is the only voice. Apply a light high-pass at 80 Hz and gentle compression.
- Final loudness: **-14 LUFS** (integrated), true peak below -1.5 dB.

## 7. Quality checks (do all of them, every time)

1. **Render stills** at every beat and look at them. Check overflow, overlap, readability at phone size and that nothing important is under the top or bottom 10%.
2. **Check every transition** by tiling 12 consecutive frames. No blank frames, no black flash, the blur direction looks natural.
3. **Check the first and last frames.** The first one must already carry the claim. The last one must hold the takeaway.
4. **Check sync** by comparing the final audio against the original voice. The offset must be 0 ms at the start, middle and end.
5. **Check duration** of the video and the audio match.
6. **Play it** once on a phone, with the sound on and with the sound off.

## 8. Delivery

- MP4, H.264 video, AAC audio, 1080x1920, 24 or 30 fps, yuv420p
- Keep it under 150 MB. If it is bigger, re-encode with `-crf 20`
- No watermark from any tool
- The final export goes in `out/FINAL.mp4`
