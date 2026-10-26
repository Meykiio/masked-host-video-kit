# Step 3b: Motion transfer (you become the character)

- **Tool:** Higgsfield, the motion transfer model called **Genjutsu** (also listed as Motion Control) at the time of writing. Model names change, so look for "transfer motion from a video onto a character image".
- **Resolution:** 1080p
- **Time:** 5 to 10 minutes per clip

## Upload these 4 things for every clip

| Tag | File |
|---|---|
| `@video1` | Your clip (1 of N) |
| `@image1` | `character-sheet.png` |
| `@image2` | `room.png` |
| `@image3` | `room-sheet.png` |

## The prompt

Use the **exact same prompt for every clip**. If you change even a few words between clips, the lighting or the costume changes and the clips will not match when you join them.

Replace the brackets in the `CHARACTER` paragraph with your real costume (copy it from the prompt you used in step 1).

```
Replace the person in @video1 with the masked man from @image1, seated in his room from @image2, filmed from the camera position shown in the "TALKING ANGLE" panel of @image3. Keep 100% of the body motion, hand gestures, head movement, timing and speed of @video1, frame for frame: same duration, no slow motion, no speed ramp, no added or skipped gestures.

CHARACTER (exactly as @image1, every detail locked): [PASTE YOUR COSTUME DESCRIPTION: the mask, the eyes, which side each lens is on, the prop, the clothes, the gloves]. No cap, no t-shirt from the original video, no microphone from the original video.

SPEAKING: he speaks from inside the mask. The mask never opens: no mouth, no lips, no teeth, no mouth shape ever appears. Only the fabric over the jaw shifts very slightly with each sentence, and his chest and shoulders rise and fall with natural breathing, like a real man talking behind thick fabric.

EYE LINE: his head stays level and his eyepieces look straight into the camera lens for the whole clip. When the original performer glances down, keep the head facing the camera and transfer only small natural nods and tilts.

HANDS: anatomically correct, five fingers on each hand, natural speed, real motion blur on fast gestures, and the gloves and any cloth tape keep their shape. When a hand exits the frame it exits naturally, with no warping.

FRAMING: the same 9:16 framing as @video1: seated in the chair, chest-up, his head at the same height in the frame as the original performer. The upper part of the frame is room background, softly out of focus with shallow depth of field.

LOOK: real live-action footage of a real man in a handmade costume, shot on a cinema camera with a 35mm lens, static locked-off tripod. [LIGHTING: your warm and cool light sources]. Real fabric texture, subtle film grain. Not CGI, not 3D, not animated, not a video game render. The room stays perfectly still, no flicker.
```

## If something goes wrong

| Problem | Fix |
|---|---|
| **A mouth or lips appear** | Replace the `SPEAKING` paragraph with: `SPEAKING: the mask is completely rigid over the face. No mouth, lips or mouth movement at all. The speech is conveyed only by head movement, hand gestures and natural breathing in the chest and shoulders.` |
| **The character looks like a 3D render** | Make sure the `LOOK` paragraph is intact. Add `photographed on real film, natural imperfections` |
| **The character looks down at a script** | Re-record with the script next to the lens (step 3a). The prompt helps but cannot fully fix it |
| **Hands melt or have the wrong finger count** | Regenerate (try 2 to 3 times). Hands are the least stable part. Record with slower, bigger gestures if it keeps failing |
| **The costume or lighting differs between clips** | You changed the prompt. Use the identical text, and the same `@image` files, for every clip |
| **The clip came back shorter than your source** | Normal. See "Check each output" |

## Check each output before moving on

- [ ] **Duration:** compare it to your source clip. Short by a second or two is common
- [ ] **No mouth, no cap, no microphone** at any moment
- [ ] **Lenses do not swap sides**
- [ ] **Hands have five fingers**, nothing melts
- [ ] **Clips match:** same lighting and same costume

If a clip is short, you have two choices: cover the missing end with graphics (what we did, see step 4), or re-export from a source trimmed to a whole second.

Check the timing with the included tool, it takes 10 seconds:

```
python 4-edit-with-claude/tools/check_sync.py your-original.mp4 higgsfield-output.mp4
```

It prints the audio offset between the two files. `0 ms` everywhere means your voice will line up perfectly with the character.

Save the outputs as `part1.mp4`, `part2.mp4`, and so on, **in the same folder as your original recordings**.

**Next:** [Step 4, edit with Claude](../4-edit-with-claude/1-master-prompt.md)
