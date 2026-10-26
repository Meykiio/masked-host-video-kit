# Step 4: Let Claude build and edit the video

You hand Claude your clips and your script. It transcribes, plans the cuts, builds the graphics, adds sound, renders the MP4 and checks every frame. You approve one storyboard in the middle.

## What you need

| Need | Notes |
|---|---|
| **Claude Code** with **Claude Opus 5.5** | Desktop app or terminal. Any strong Claude model works, Opus gives the best result |
| **Node.js 20+** and **ffmpeg** | Check with `node -v` and `ffmpeg -version` |
| **Python 3.11** | Only for the transcription tool |
| **Google Chrome** (or Chromium) | Used to render the frames |

## Set up the project folder (2 minutes)

1. Create a folder for the video, for example `my-video/`
2. Copy into it:
   - your `part1.mp4`, `part2.mp4`, ... (the Higgsfield outputs)
   - your original recordings, `1.mp4`, `2.mp4`, ... (for your real voice)
   - the proof material: screenshots, logos, screen recordings (anything you want shown)
   - this kit's `4-edit-with-claude/` folder
3. Open the folder in Claude Code

## Paste this prompt

Fill the brackets in the first block. Leave the rest.

```
PROJECT
I am making a vertical short video (1080x1920, 24 fps). A masked character speaks my script in his room. I recorded the performance and used motion transfer, so the character's clips are already made.

MY FILES (all in this folder)
- Character clips, in order: [part1.mp4, part2.mp4]
- My original recordings with the real voice, in the same order: [1.mp4, 2.mp4]
- Proof material to show on screen: [list each file and what it is]
- Character sheet (for reference): [character-sheet.png]

MY SCRIPT (what I say, in the order I say it)
[PASTE THE SCRIPT HERE]

MY SETTINGS
- Language of the voice: [Darija / English / French / ...]
- Language of the captions: [same / English]
- Language of the big headline strips: [English / same]
- Platform: [TikTok + Instagram Reels]
- The top 40% of my recordings is empty on purpose, use it for headlines.

WHAT TO DO
Read 4-edit-with-claude/3-edit-rules.md and 4-edit-with-claude/2-style-editorial-collage.md fully before you start. Then:

1. INSPECT. Use ffprobe on every clip. Tell me the durations and whether the character clips are shorter than my originals.
2. TRANSCRIBE. Use 4-edit-with-claude/tools/transcribe.py for word timings on my ORIGINAL recordings. Write the captions from my script text, and use the transcription only for timing. Cross-check against the pauses in the audio.
3. CHECK SYNC. Use 4-edit-with-claude/tools/check_sync.py to confirm the character clips line up with my originals. Tell me about any missing seconds and where they fall in the script. Plan a graphic cutaway over every missing section.
4. PLAN. Split the video into talking-head beats and cutaway beats using the rules. Show me a table: time range, what is on screen, which proof file, headline text, sound.
5. STORYBOARD FIRST. Render one still per beat with the real drawing code (not a mockup), build a single STORYBOARD.html page, and show it to me. WAIT for my approval or changes. Do not render the video before I say yes.
6. BUILD. After approval, build the whole video as one page where every frame is a pure function of time t, with window.seek(t), window.DURATION and window.scoreSound as described in the style file.
7. RENDER. Use 4-edit-with-claude/tools/render.mjs to render the frames, the sound effects, the final mix and the MP4.
8. CHECK. Look at the actual rendered frames. Test: every transition, every caption, the first frame, the last frame, text overflow, and that the audio is in sync. Fix every problem you find, then render again.
9. DELIVER. Give me the final MP4, the storyboard, and a short list of the decisions you made and anything you had to assume (numbers, spellings).

RULES
- Use only real facts and real screenshots from my material. If you invent a diagram, make it clearly a diagram.
- No music. Sound effects only, and sparse.
- My original voice stays. Never use text to speech.
- Keep headline text short, large and readable on a phone.
- Tell me when something is a judgment call. Do not silently change my script.
```

## What happens next

1. Claude reports the inspection and the plan (about 5 minutes)
2. You get `STORYBOARD.html`. Read it on your phone. Reply with changes like "make beat 6 shorter" or "swap the headline on beat 3"
3. You say "approved". Claude builds and renders (the render for a 50-second video took about 8 minutes on a laptop with no GPU)
4. Claude checks the frames, fixes problems and delivers `FINAL.mp4`

## If something is off

| Problem | What to tell Claude |
|---|---|
| Captions are late or early | "The captions drift. Re-time them from the transcription." |
| A headline is cut off or overlaps | "Beat N: the text overflows. Fix it and show me the new still." |
| A transition shows a blank frame | "The whip transition flashes blank paper. Make the blurred picture wrap around so it always fills the frame." |
| Too many sounds | "Remove every sound except the stamp, the whooshes and the big number hit." |
| You want a different look | "Rebuild in a different style" and attach the style brief |

**Back to the [README](../README.md).**
