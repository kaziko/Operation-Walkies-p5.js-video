# Princess Jun Jun — "Operation Walkies": storyboard

## The idea

An animated underground anime concert poster, starring one extremely judgmental Akita.

The song is a morning walk, sung by Jun Jun in the first person as a war report. She is deadly serious. Everything
she describes is tiny and ordinary: a pavement, a Yorkie, a hydrant, a squirrel, her own shadow. The video takes her
side completely. It gives every ordinary thing the full weight of a war film and a punk poster, and never winks.

**The rule that makes it funny: Jun Jun barely moves.** The lettering screams, the ink explodes, the human panics and
gets dragged. The Queen simply stares. Her acting is eyes, brows and a few degrees of head.

**Rule for every shot:** one clear visual event, readable at a glance, landing on the music.

## Measured song map

Measured from the audio (`tools/analyze.py` → `src/songmap.js`). Do not assume other numbers.

- Length 204.72 s. Tempo 90.7 BPM (beat ≈ 0.662 s, bar ≈ 2.65 s). The punk pulse is the eighth note (≈ 0.33 s).
- `barT(n)` gives the start of bar `n`; `barT(n, beat)` adds beats. Bar 0 starts at 2.14 s.
- Word times come from `assets/whisper.json` (in `SONG.words`). They are good to about ±0.15 s.

| Bars | Time (s) | Section | Energy | Chapter file |
|---|---|---|---|---|
| −1 – 7 | 0.0 – 23.44 | Intro: whispered, then "This is WAR" | low → build | `c01_intro.js` |
| 8 – 15 | 23.44 – 44.74 | Verse 1: the patrol begins, the Yorkie | high | `c02_verse1.js` |
| 16 – 19 | 44.74 – 55.34 | Chorus 1 | high | `c03_chorus1.js` |
| 20 – 27 | 55.34 – 76.52 | Verse 2: squirrels, cats, crows, hydrant, the pup | high | `c04_verse2.js` |
| 28 – 37 | 76.52 – 102.99 | Double-time breakdown | highest | `c05_breakdown.js` |
| 38 – 49 | 102.99 – 134.62 | Bridge: slow, cinematic monologue, choir swell at 124.1, snare build 129.4 – 134.6 | low → swell | `c06_bridge.js` |
| 50 – 56 | 134.62 – 153.02 | Chorus 2 (50 – 53) + guitar instrumental (54 – 56) | highest | `c07_chorus2.js` |
| 57 – 66 | 153.02 – 178.10 | Outro: spoken radio report over loud music; the music stops dead at ≈ 177.9 | high → cut | `c08_radio.js` |
| 66 – 75 | 178.10 – 204.72 | Children's a-cappella chorus (to ≈ 189.7), band returns 189.75, "And tomorrow… we redeploy.", silence from ≈ 201.3 | low → high → out | `c09_finale.js` |

### Lyrics by bar (word@time)

```
 0  2.14  Boots on?@1.40   Nah@3.30
 1  4.78  paws@5.24 down@5.92   Leash@6.34
 2  7.45  clicks@7.62 tight@7.88   time@8.30 to@9.18 clear@9.34 this@9.54 town@9.76
 3 10.11  They@10.22 think@10.80 it's@12.50 just@12.70
 4 12.78  a@12.86 stroll@13.04   no.@14.00
 5 15.45  This@17.14 is@17.82
 6 18.11  WAR@18.16 (held to ≈19.4)
 7 20.78  (build; hits at ≈22.75 and ≈23.5)
 8 23.44  Paws…@23.80 (silence 24.25–24.55) hit the concrete with precision ≈24.6–25.6
 9 26.11  Every@25.64 sniff@26.28 a mission@26.68 every@27.12 shadow@27.26 suspicion@27.84
10 28.77  Battle@28.26 chain@28.94 locked@29.24 to my neck@30.00 like@30.28 a tethered@30.68 blade@30.90
11 31.43  But I'll@31.52 drag@31.66 my commander@32.16 through@32.54 a firefight@33.00 parade@33.22
12 34.10  Enemy@33.92 sighted@34.36 at two@35.02 o'clock@35.32  Yorkie@35.72 patrol@36.14
13 36.76  We@36.58 might@37.00 pass@37.20 in peace@37.68  or@38.02 I might@38.38 lose@38.54 control@38.82
14 39.42  Eye@39.24 contact's@39.48 a contract@39.98  you@40.38 bark@40.64  that's@41.08 war@41.34
15 42.09  I'll@41.60 lunge@42.08 so hard@42.56 I'll make@43.00 my human@43.28 hit@43.54 the floor@43.96   I@44.24 love@44.58
16 44.74  the smell@45.30 of biscuits@45.80 in the morning@46.60
17 47.39  Every@47.06 block's@47.58 a war@47.98 zone@48.22 soldier@48.52 I'm warning@49.30
18 50.03  Pass@49.72 in peace@50.52  or you're@51.12 catchin'@51.34 that growl@51.86
19 52.69  Princess@52.32 JunJun's@52.50 on patrol@53.10 movin'@53.56 through the prowl@54.42
20 55.34  Squirrel@54.92 insurgents@55.44 scatter@55.96  cat snipers@56.66 in the alley@57.26
21 57.98  Crows@57.54 call orders@58.46 from the rooftop@59.26 rally@59.60
22 60.64  Hydrant@60.20 checkpoints@60.86  gotta sniff@61.76 and claim@62.34
23 63.29  That's@62.68 territory@63.22 marked@63.54  remember@64.16 the name@64.98
24 65.93  Pup@65.48 on the left@66.50 tryna puff@67.04 his chest@67.62
25 68.59  Better@67.94 tuck@68.40 that tail@69.04 boy@69.44  respect@69.62 the best@70.34
26 71.24  My@70.68 intel's@71.12 sharp@71.52 I'm sniffin'@72.14 truth@72.44 from lies@72.94
27 73.89  Read@73.32 your whole@73.80 history@74.04 through@74.48 your fur@75.10 and eyes@75.60
28 76.52  Bark@76.06 bark@76.88 barkin'@77.08 like a full-on@77.96 riot@78.20
29 79.18  Every@78.54 mutt@79.02 in the cut@79.72 better keep@80.30 it quiet@80.78
30 81.83  Leash@81.16 tight@81.66 but I still@82.34 might bite@82.92  ignite@83.24
31 84.46  Any dog@84.30 tryna front@84.92 gonna lose@85.58 that fight@86.26  I'm—@86.56
32 87.12  Dartin'@87.06 through yards@87.52 disregardin'@88.06 the guard@88.90
33 89.77  I'm hard@89.68 as a shard@90.20 from a bone@91.02 that I gnawed@91.64
34 92.43  Charge@91.94 every yard@92.92 like a bullet@93.66 from a gun@94.28
35 95.06  Outrun@94.56 any hound@95.58 in the midday@96.28 sun@96.80
36 97.72  Tail's a whip@97.64  jaws a clip@98.26  I unload@98.80 when I grip@99.58
37 100.36 If you sniff@100.20 too long@100.82 you gon'@101.36 sink@101.50 this ship@102.06
38 102.99 Sometimes…@102.44 (long hold)
39 105.64 we@106.84 make@107.34 it back@107.96
40 108.28 without@110.48
41 110.92 fire.@110.98   Sometimes…@112.76
42 113.56 (hold)
43 116.20 the@116.44 street@117.28 is battlefield.@118.02
44 118.84 But@120.24 every@121.08 mission…@121.34
45 121.47 every@123.24 walk…@124.08
46 124.10 (choir swell) Is@125.48 a step@126.44
47 126.73 closer@127.12 to@128.62 glory.@129.08
48 129.37 (military snare build, stabs about every 0.5 s)
49 131.99 I@133.58 love@134.42
50 134.62 the smell@135.20 of biscuits@135.68 in the morning@136.48
51 137.24 Every@136.90 block's@137.44 a war@137.82 zone@138.08 soldier@138.26 I'm warning@139.08
52 139.87 Pass@139.54 in peace@140.36 or you're@140.92 catchin'@141.16 that growl@141.64
53 142.50 Princess@142.12 JunJun's@142.32 on patrol@142.92 movin'@143.40 through the prowl@144.20   I love@144.80
54–56 145.13–153.02  guitar instrumental
57 153.02 Alfa@153.52 Akita@154.24 to@155.54
58 155.64 Command.@156.00   This@157.98
59 158.27 is@158.70 Princess@158.86 JunJun@159.20 reporting@160.06
60 160.89 in…@161.48
61 163.51 Hydrants@163.60 secured@164.32  territory@165.64
62 166.14 claimed.@167.04   All@167.58 enemy@168.62
63 168.77 operators@169.02 suppressed.@169.84   Commander@170.48
64 171.40 safely@171.82 returned@172.48 to base.@173.54   Operation@173.90
65 174.02 Walkies:@175.08
66 176.63 mission@176.78 success.@177.50   (kids) I@178.16 love@179.10
67 179.26 the smell@179.82 of biscuits@180.34 in the morning@181.12
68 181.88 Every@181.54 block's@182.08 a war@182.50 zone@182.72 soldier@182.90 I'm warning@183.76
69 184.51 Pass@184.18 in peace@185.00 or you're@185.56 catchin'@185.72 that growl@186.28
70 187.13 Princess@186.72 JunJun's@186.92 on patrol@187.54 movin'@187.76 through the prowl@188.82
71 189.75 (band returns)
72 192.38 And@193.80 tomorrow…@193.94
73 195.00 we@197.58 redeploy.@198.0–199.5
74–75     last hits, ring-out, silence from ≈201.3, file ends 204.72
```

## Cast

| Who | Look | Role |
|---|---|---|
| **Princess Jun Jun** | Marbled tiger-brindle Akita. Tan coat with dark tiger stripes, white face mask, cheeks and legs, grey cheek marbling, curled tail, blue harness with lime trim and a lime ID tag, lime lead. Small crown in royal moments. | The singer. Still, dignified, unimpressed. |
| **The Commander** | The human. Sage hoodie, black trousers, red hair, dot eyes. | Holds the other end of the lead. Gets dragged, floored, exhausted. Does all the panicking. |
| **Yorkie patrol** | Tiny terrier, grey coat, tan head, pink bow. | The enemy. Barks "YIP!". |
| **Squirrel insurgents** | Oxblood squirrels in sage helmets. | Scatter. |
| **Cat sniper** | Black sitting silhouette, lime eyes. | Watches from the alley. |
| **Crow officers** | Black crows, orange beaks, one with a lime cap. | Call orders from the roof. |
| **Hydrant** | Oxblood fire hydrant. | Checkpoint. |
| **The pup** | Small white dog with a violet patch. | Puffs his chest, then tucks his tail. |

## What ties it together

- **Identity:** signal orange, warm paper, ink black. Other colours are accents, one or two per shot.
- **Three type levels:** hero (Anton, huge), rhythmic (Permanent Marker, on the vocal), annotation (IBM Plex Mono,
  small military paperwork about ordinary things). Kanji and katakana (Dela Gothic One) are graphic objects and
  manga sound effects, never subtitles.
- **Not every lyric is on screen.** Pick the one or two words per line that deserve to be huge.
- **Repeats escalate.** Chorus 2 reuses the chorus 1 compositions, inverted and louder. The kids' chorus replays
  them as a child's crayon drawing. The stare returns three times and grows.
- **Stillness against chaos.** Calm passages (intro, bridge, kids' chorus) are really calm, so the hits read.
- **Annotations are the second joke layer:** `THREAT LEVEL: AKITA`, `UNIDENTIFIED DOG — FOLLOWING ME SINCE 06:00`,
  `WITH PRECISION: 41.00 CM ±0.00`. Sparingly: at most one or two per shot.

---

## 1 · Intro (0 – 23.44) · ink black, paper line, almost no colour → orange detonation

Whispered. Dark frames, small things, long holds. Colour arrives only with "WAR".

| Time | Lyric | Shot |
|---|---|---|
| 0 – 3.2 | "Boots on?" | Black. A mono label types `06:00 // FRONT DOOR`. Two human boots step into a pool of paper light. Small hand-lettered "boots on?". |
| 3.3 – 6.3 | "Nah. Paws down." | "NAH." small and flat. On "paws down" one huge white paw slams into frame in front of the boots: `PAWS DOWN` hero type, first shake of the film. |
| 6.34 – 8.2 | "Leash clicks tight…" | Macro: the lead clips onto the lime D-ring. `CLICK` on 7.62. The lime lead snaps taut across the black frame. |
| 8.3 – 10.2 | "time to clear this town." | Two eyes open in the dark (lids rise). Nothing else. |
| 10.2 – 14.6 | "They think it's just a stroll… no." | Fake-out: a pink, soft card, hand-lettered "just a stroll ♥", Jun Jun with the one happy face she has (panting), flowers. On "no." (14.0) the card drops away to black and her face is deadpan. Tiny "no." |
| 14.6 – 18.1 | "This is" | Silence. Slow push on her eyes (stare effect, first use, small). `THIS IS` typed in mono. |
| 18.16 – 20.78 | "WAR" | Impact frame 1: black / white / orange, mono Jun Jun, giant `WAR` and 戦. Shake decays. |
| 20.78 – 23.44 | (build) | Title card, slammed on in pieces with the drum hits: `OPERATION WALKIES`, stamp `CLASSIFIED`, `STARRING PRINCESS JUNJUN`, 作戦. Ends on a hard cut at bar 8. |

## 2 · Verse 1 (23.44 – 44.74) · orange / paper / ink

| Bar | Lyric | Shot |
|---|---|---|
| 8 | Paws… hit the concrete with precision | **The entrance.** Orange field, `PAWS` fills the frame, silence, then Jun Jun walks in from the left on the band's entry, camera pushes, she turns her head to camera. Annotation: `WITH PRECISION: 41.00 CM ±0.00`. |
| 9 | Every sniff a mission, every shadow — suspicion | Nose close-up, two sniffs. Cut: she side-eyes her own shadow. Reticle, `SUSPICION`, `UNIDENTIFIED DOG — FOLLOWING ME SINCE 06:00`. |
| 10 | Battle chain locked to my neck like a tethered blade | The lime lead whips across the frame like a blade and cuts the word `CHAIN` in two. Technical label: `BATTLE CHAIN (LEAD, 1.5 M)`. |
| 11 | But I'll drag my commander through a firefight parade | Wide. Jun Jun marches at walking pace; the Commander flies flat behind her like a flag. `DRAG` in giant type, streaks. |
| 12 | Enemy sighted at two o'clock! Yorkie patrol. | Whip pan. A clock dial with the hand at 2. Reticle locks on a tiny Yorkie. Dossier: `FILE 07 // YORKIE`. |
| 13 | We might pass in peace… or I might lose control | Two halves: calm profile walk past the Yorkie (`PEACE`, soft), then her eye twitches, vibration lines start, `CONTROL` cracks. |
| 14 | Eye contact's a contract, you bark — that's war | **The stare.** Letterboxed eyes, pupils lock, ゴゴゴ, the Yorkie barks in an inset panel, then impact frame 2: `WAR`, 戦. |
| 15 | I'll lunge so hard I'll make my human hit the floor | She leans one inch. The lead goes rigid. The Commander hits the word `FLOOR` face first. Brush wipe into the chorus on "I love". |

## 3 · Chorus 1 (44.74 – 55.34)

| Bar | Lyric | Shot |
|---|---|---|
| 16 | I love the smell of biscuits in the morning | **The royal pose.** Sunburst, `BISCUITS`, Jun Jun on a pink cushion with a lime halo and a crown, eyes shut, biscuits in orbit, 朝. |
| 17 | Every block's a warzone, soldier — I'm warning | Black tactical map of the neighbourhood, hazard tape, `WAR ZONE`, she turns to camera on "soldier", three `WARNING` stamps. |
| 18 | Pass in peace, or you're catchin' that growl | `OPTION A (RECOMMENDED)`: the calmest frame in the film, sage sun, flowers. Slash. `OPTION B`: snarl close-up, `GROWL`, ガルルル. |
| 19 | Princess JunJun's on patrol, movin' through the prowl! | Name card: `PRINCESS` / `JUNJUN` fills the frame, she walks across it in her crown, stamp `ON PATROL`, 巡回中. Brush wipe out. |

## 4 · Verse 2 (55.34 – 76.52) · adds electric blue, violet, sage: the enemy factions

Each faction gets its own accent colour and one gag. Jun Jun is in every shot or reaction shot, unmoved.

| Bar | Lyric | Shot |
|---|---|---|
| 20 | Squirrel insurgents scatter, cat snipers in the alley | Blue. Helmeted squirrels burst out in bouncing arcs across `SCATTER`. Cut on "cat": a black alley, one cat silhouette, lime eyes open, reticle, `SNIPER`. |
| 21 | Crows call orders from the rooftop rally | Violet. Crows on a roofline; each "CAW" is a slab of hero type shouted down like an order. Jun Jun below, looking up, unimpressed. |
| 22 | Hydrant checkpoints — gotta sniff and claim. | The hydrant as a monument, barrier stripes, `CHECKPOINT`. She inspects it (eyes down). Stamp `CLAIMED`. |
| 23 | That's territory marked — remember the name. | Tactical map, a flag goes in. `REMEMBER THE NAME` → her name signed huge in katakana: ジュンジュン. |
| 24 | Pup on the left tryna puff his chest | The pup enters left and inflates his chest like a balloon (squash and stretch). Arrow label: `PUP (LEFT)`. |
| 25 | Better tuck that tail, boy — respect the best | Her slow side-eye. The pup deflates, tail tucks. `RESPECT`. |
| 26 | My intel's sharp, I'm sniffin' truth from lies | Nose macro with a data readout: `TRUTH ☑  LIES ☐`. |
| 27 | Read your whole history through your fur and eyes | The pup's dossier pages fly past: `ATE A SOCK (2023)`, `AFRAID OF THE VACUUM`. Stare builds (second stare, bigger) into the breakdown. |

## 5 · Double-time breakdown (76.52 – 102.99) · maximum energy, palette flips every bar

Fast cuts: one idea per half bar or per bar. Type-led. Jun Jun is cut in as held, almost still poses.

| Bar | Lyric | Shot |
|---|---|---|
| 28 | Bark-bark-barkin' like a full-on riot | Three `BARK` slams on the three barks, each bigger; mono bark pose; ワン！ |
| 29 | Every mutt in the cut better keep it quiet | A line of silhouette dogs; `QUIET` tape slaps across their mouths one by one. |
| 30 | Leash tight but I still might bite, ignite | The lead as a vibrating taut line across the frame; `BITE` with a bite taken out of it; `IGNITE` in flames. |
| 31 | Any dog tryna front gonna lose that fight, I'm— | Fight-card: `JUNJUN VS EVERYONE`. Stamp `LOSE` on everyone. |
| 32 | Dartin' through yards, disregardin' the guard | Fence posts whip past, streaks. She "darts" at exactly the same walking pace. |
| 33 | I'm hard as a shard from a bone that I gnawed | A bone shard gleams like a blade. She chews, deadpan. `HARD`. |
| 34 | Charge every yard like a bullet from a gun | She flies across the frame in a completely rigid standing pose, like a bullet. Speed lines. |
| 35 | Outrun any hound in the midday sun | Lime sun. Hounds sprint in place; she strolls past them. |
| 36 | Tail's a whip, jaws a clip, I unload when I grip | Three fast panels: tail (`WHIP`), jaws (`CLIP`), grip. |
| 37 | If you sniff too long you gon' sink this ship! | A paper boat with a sniffing dog sinks into halftone waves; `SINK` sinks with it. Last hit, then cut to calm. |

## 6 · Bridge (102.99 – 134.62) · letterboxed, dusk: violet, pink, sage. Slow.

The war film's quiet scene, played as a performance: **Jun Jun sings these four lines straight to the camera.** She
is front-facing and big, her mouth moves in sync (`sing(t)`), her eyes do not leave the lens. Nothing else about her
moves. The dusk scenes below play behind her and in the pauses between phrases.

| Time | Lyric | Shot |
|---|---|---|
| 102.99 – 113.5 | Sometimes… we make it back without fire. | Letterbox. She sings to camera. Behind her and in the pauses: a dusk street, she and the Commander walking home in silhouette, slow, long shadows, a butterfly. Nothing happens, beautifully. |
| 113.5 – 121.4 | Sometimes… the street is battlefield. | She sings. Behind her, the same street, after: bins toppled, the Commander wound in the lead, leaves in the air, the Yorkie yipping far away. |
| 118.8 – 124.1 | But every mission… every walk… | Closer. Wind in the fur, eyes closed on the pause, then open, into the lens. |
| 124.1 – 129.4 | Is a step closer to glory. | Choir swell. Low angle: she sings the line from a small mound like a monument, rays behind her, `GLORY` and 栄光 rise, mouth wide on "glory". |
| 129.4 – 134.6 | (snare build) I love… | One flash-cut per snare stab: eyes, paw, lead, hydrant, crown. Faster and faster. A last singing close-up on "I love", into the brush wipe. |

## 7 · Chorus 2 + instrumental (134.62 – 153.02) · the chorus 1 shots, inverted and louder

Use `CHORUS.biscuits / warzone / peaceGrowl / nameCard` with `amp = 1`, and add to them: the whole cast as her court,
flames, bigger shake, more biscuits. The instrumental (bars 54 – 56) is the roll call: one poster card per cast member
with a stamp (`YORKIE — NEUTRALISED`, `SQUIRRELS — AT LARGE`, `COMMANDER — DRAGGED 1.2 KM`), then Jun Jun on her
throne, perfectly still, while everything around her explodes.

## 8 · Radio report (153.02 – 178.10) · field radio: ink, lime, paper

Annotation type takes the lead on purpose here: the screen is her radio report, typed as she says it.

| Time | Lyric | Shot |
|---|---|---|
| 153.0 – 157.9 | Alfa Akita to Command. | Jun Jun in a headset. Waveform. `CALLSIGN: ALFA AKITA`. |
| 157.9 – 163.5 | This is Princess JunJun reporting in… | Her ID card: photo, paw print, rank `PRINCESS`. |
| 163.5 – 167.5 | Hydrants secured - territory claimed. | Map, hydrants ticked one by one, flags. |
| 167.5 – 170.4 | All enemy operators suppressed. | Line-up of the Yorkie, squirrel, cat, crow, pup; `SUPPRESSED` stamped on each. They are fine. They look annoyed. |
| 170.4 – 173.9 | Commander safely returned to base. | The Commander face down on the hall floor, shoes on, lead still in hand. `SAFELY`. |
| 173.9 – 178.1 | Operation Walkies: mission success. | `OPERATION WALKIES`, stamp `MISSION SUCCESS`, 任務完了. The music stops dead at ≈177.9: hold on a still frame. |

## 9 · Kids' chorus and finale (178.10 – 204.72)

| Time | Lyric | Shot |
|---|---|---|
| 178.1 – 189.7 | (children) the chorus | The chorus as a child's crayon drawing on paper: wobbly Jun Jun, biscuits, a sun, stick soldiers, the words in a child's hand. Slowly pull back: the drawing is stuck on a fridge and the real Jun Jun is looking at it. She approves by not disapproving. |
| 189.75 – 193.8 | (band returns) | Curtain call. The whole cast in a row, Jun Jun on the throne, `PRINCESS JUNJUN` behind. |
| 193.8 – 197.5 | And tomorrow… | Everything drops away. Her eyes, close. |
| 197.58 – 201.3 | we redeploy. | Final impact frame: `WE REDEPLOY`, 再出撃. Last hit. |
| 201.3 – 204.72 | (silence) | End card on black: `OPERATION WALKIES`, `TO BE CONTINUED — 06:00`. A paw print. Fade. |
