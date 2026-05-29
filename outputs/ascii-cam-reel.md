# ascii-cam Instagram reel

**Status:** Draft (awaiting Erin's approval)
**Platform:** Instagram
**Format:** Reel — hybrid (voiceover-heavy, ~75-90s, Wacomo style)
**Last updated:** 2026-05-20

---

## Reel script (Erin's draft, lightly cleaned)

This is my favorite piece of art
It's really fun to watch
It sounds pretty nice
it has nice colors
and it keeps showing up in my dreams

The problem is that
it's really expensive
I live too far to visit it
and I don't think I can build it myself (yet) [drill]

But I do know how to code [ding]
So I explained my situation to Claude [claude thinking zoomed in]
and after some back and forth [move to ny?]

It gave me 3 options:

move to brooklyn
go into debt
build something that reminds you of it [ding ding ding]

since I love the Pink Sunset
and I love ASCII

I decided
the next best thing
was to build
ascii vision [glasses with green ascii cut out and put in them]
that can switch characters
like the little flip-discs
that draw you on the wall

ASCII art is really
just characters on a grid

our webcams
are so high tech now [poking webcam]
they send gazillions of pixels [drawing?]
and we just don't need that many [sad webcam]

so we shrink the frames down [shrink until it's tiny] [a big stick figure then smaller smaller smaller or same person bigger background page]
until it fits onto a grid

then we ask each cell [How bright are you word bubble]
"How bright are you?" [scale handdrawn,]

based on it's answer [not so bright] fingers with speech bubbles getting slid in
we give it a character [yay!] [give it a dot]

but really fast [ask give, ask give, sped up]
30 times a second fast [clock sped up]

kind of like the little flip-discs

anyways
I don't think it'll fill the void left in my heart
but it does fit in my pocket [well most of my pockets]

and I can use it to see in ascii vision

whenever I'm feeling down so
I'm calling this one a win

---

## Caption

i can't afford pink sunset by breakfast so i built the next best thing 🤍

ascii vision (sorry, ascii-cam) turns your webcam into live ASCII art in real time. live at ascii-cam.com (try it on your face, your dog, anything)

here's how it works under the hood:

getUserMedia streams your webcam into the browser as a video element

ASCII art is really just characters on a grid, so each frame draws onto a tiny offscreen canvas sized in CHARACTERS, not pixels (default is 120×70 = 8,400 cells). the browser's built-in image scaler does the downsampling for free

for each cell, we read the RGBA values and compute brightness using the BT.709 luminosity formula (0.2126 × R + 0.7152 × G + 0.0722 × B, weighted because humans see green brightest and blue dimmest). that gives us a brightness value 0-255

then we map that brightness to a character from a "ramp", a string ordered darkest to lightest. the default is circles: ●◉○◌·· (space at the end). swap in hearts ♥♡·· or type your own

contrast / brightness sliders shift the brightness curve before the mapping

render to the visible canvas at 30fps. that's a live ASCII video of your face

claude wrote the conversion math
cursor knocked out the entire mobile redesign in one session

live at ascii-cam.com (yes i should've just called it ascii vision)

#buildinpublic #ascii #asciiart #webdev #canvas #frontend #typescript #react #creativecoding #generativeart

---

## Notes

- **Tag in caption:** @cursor @anthropicai (verify Claude's IG handle — could be @claude_ai or @anthropicai)
- **Tag in reel:** @cursor + @anthropicai on the credit beats
- **Pink Sunset credit:** BREAKFAST, NY (their IG handle if known — verify before posting)
- **Music:** instrumental loop + sound effects layered. See music recs in conversation (chiptune / lo-fi instrumental / Cosmo Sheldrake / Joe Hisaishi territory; effects from IG library, Freesound, or CapCut)
