# Step 1: Your character (one image, one prompt)

You will make a **masked host** who speaks your script instead of you. You do not show your face. This one prompt creates the character **and** the detailed reference sheet in a single image.

- **Model:** Nano Banana Pro (in Higgsfield)
- **Aspect ratio:** 2:3
- **Save as:** `character-sheet.png`
- **Time:** 3 minutes

## Why a full mask with no mouth

Motion transfer copies your movement onto the character. If the character has a mouth, the model has to invent lip-sync, and it looks fake. If the whole face is covered, your head, hands and breathing carry the performance and it reads as a real person talking behind fabric.

## Make it yours: pick 7 things (worth the thinking time)

A generic superhero looks like everyone else's. Give the character **props that say something about you or your topic**. Fill this table first, then copy the answers into the prompt below.

| # | Decide | Rule | Example (a developer from Algiers) |
|---|---|---|---|
| 1 | **Name** | 1 word, easy to say | MOFTAH (means "the key") |
| 2 | **Mask** | Covers the whole head and face. Say the material and how it is worn | Hand-stitched indigo canvas hood with a visible cream seam |
| 3 | **Eyes** | The only expressive part. Make them distinct | Brass goggle: one white mesh lens, one dark lens with a flip-up loupe |
| 4 | **Signature prop** | One object that is your idea in physical form | Brass skeleton key on a cord (free access to tools) |
| 5 | **Top** | Real clothes, slightly worn. Avoid a skin-tight suit | Worn indigo workwear jacket, pencils in the pocket |
| 6 | **Hands** | Visible hands are your best acting tool. Dress them so they read clearly | Black fingerless gloves, cream tape on the forearms |
| 7 | **Palette** | 3 to 5 colors, one warm and one cool | Indigo, sand, brass, cream, charcoal |

**How to choose the props:** list 3 things you are known for, then turn each into an object.

| If you are... | Prop ideas |
|---|---|
| A developer | Keyring, circuit-board patches, a pencil behind the ear |
| A finance creator | Ledger book, brass scales, a pocket watch |
| A fitness coach | Taped wrists, a stopwatch, a chalk-dusted hood |
| A teacher | Chalk-dusted sleeves, a rolled map, reading glasses on the mask |
| A cook | Apron straps, a wooden spoon in the belt, a flour-dusted scarf |

## The prompt

Replace every `[BRACKET]`. Keep everything else.

```
Professional character design reference sheet of an original masked character named [NAME], photorealistic cinematic render, warm light-grey paper background, clean editorial layout with small grey uppercase labels.

CHARACTER: A lean, athletic man of average height, real human proportions, not a bodybuilder. He wears [MASK], covering the whole head and face with no mouth, no nose and no hair visible. [EYES]. [SIGNATURE PROP]. [NECK: scarf, collar or nothing]. He wears [TOP], [UNDER LAYER], with the sleeves pushed up to the forearms. [HANDS: gloves, tape, bare]. He wears [LEGS] and [SHOES]. Small details that show he made this himself: [2 or 3 small details: patches, stitching, pencils, a notebook in the pocket].

LAYOUT: Left half: one large full-body front view, standing relaxed and confident, one hand in his pocket, labeled "FRONT". Top right: three small full-body turnaround views labeled "FRONT", "SIDE", "BACK". Middle right: three pose thumbnails labeled "THE SECRET" (leaning toward the viewer, one finger raised), "THE POINT" (pointing straight at the viewer), and "THE PROP" (holding the signature prop up toward the viewer). Bottom right: three close-up detail panels labeled "MASK", "PROP", "HANDS", then a row of color swatches ([LIST YOUR PALETTE]).

Mood: [MOOD: e.g. warm and cold at once, quietly mysterious, timeless]. Soft directional light, realistic fabric texture, visible stitching and wear. The design is identical in every view. 8k, sharp focus, no extra text beyond the labels.
```

## Check the result (30 seconds)

- [ ] No mouth, no nose, no hair visible, in **every** view
- [ ] Both eyes/lenses look the same in the front, side and back views
- [ ] Hands have 5 fingers
- [ ] The prop is clear and big enough to recognize
- [ ] It looks like a real person in a costume, not a toy

Generate 3 or 4 versions and pick the best one. Every later step copies this image, so the choice matters.

If the result looks too much like a 3D game render, change `photorealistic cinematic render` to `costume photography, shot on a studio backdrop` and regenerate. (This variation is untested. The original wording is the one that produced the finished example video.)

## Not sure what to write? Let Claude do it

Paste this into Claude and answer the questions it asks. It will give you the finished prompt.

```
I want a character design prompt for Nano Banana Pro. The character is a masked host (full-head mask, no mouth) who will speak my videos in my place.

Ask me these questions one at a time, short:
1. What do I make videos about?
2. What 3 things am I known for or care about?
3. What colors do I like, one warm and one cool?
4. Where do I live or what culture do I want to hint at (subtle, never a flag)?
5. What mood: mysterious, friendly, serious, funny?

Then turn my answers into one prompt that follows the template in 1-character/1-character-sheet-prompt.md (fill every bracket), and explain in one line what each prop says about me.
```

## Optional: a hero portrait (for thumbnails and covers)

Upload `character-sheet.png` as `@image_1`.

```
Low-angle cinematic portrait of the masked character from @image_1, with an identical mask, outfit and props, standing in a dark doorway and holding [SIGNATURE PROP] up toward the camera. The prop catches a warm beam of light while cool moonlight comes from behind. Dust drifts in the light, soft haze, quietly mysterious. Photorealistic, 8k, vertical 2:3, no text.
```

**Next:** [Step 2, the room](../2-room/1-room-prompt.md)
