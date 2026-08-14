/**
 * Warms the browser cache for site media starting the moment the app boots —
 * i.e. while the preloader is on screen — instead of waiting for each route to
 * mount and request its own images.
 *
 * Ordering matters more than raw parallelism here. Browsers only open ~6
 * connections per origin, so firing every image at once would put gallery
 * photos in the same queue as the hero background and delay the one thing the
 * visitor is actually looking at. The tiers below are awaited in sequence:
 *
 *   1. Hero        - above the fold on "/", parallel, high priority
 *   2. Home rest   - speaker cards + footer logo, below the fold
 *   3. Other routes- gallery / team / sponsors, low priority, bounded pool
 */

import bgd5 from "./assets/HeroSection/bgd5.webp";
import hero1 from "./assets/HeroSection/1.webp";
import hero2 from "./assets/HeroSection/2.webp";
import hero31 from "./assets/HeroSection/31.webp";
import hero3 from "./assets/HeroSection/3.webp";
import hero5 from "./assets/HeroSection/5.webp";
import hero6 from "./assets/HeroSection/6.webp";
import hero7 from "./assets/HeroSection/7.webp";
import hero4 from "./assets/HeroSection/4.webp";

// Tier 1 — the hero band. bgd5 is the LCP element, so nothing competes with it.
const HERO = [bgd5, hero1, hero2, hero31, hero3, hero5, hero6, hero7, hero4];

// Tier 2 — the rest of "/", below the fold (Cards + Footer).
const HOME_BELOW_FOLD = [
  "/Speakers/Harini2.jpg",
  "/Speakers/amarabha.jpg",
  "/Speakers/dikshant2.jpg",
  "/Speakers/drishyaa.jpg",
  "/Speakers/keshav2.jpg",
  "/Speakers/mukti.jpg",
  "/Speakers/prateek.jpg",
  "/Speakers/pritika.jpg",
  "/Speakers/sifat.jpg",
  "/Speakers/tapesh.jpg",
  "/ted_logo.png",
];

const EXECUTIVE_BOARD = [
  "AANYAGARG.webp",
  "ANIKETGUPTA.webp",
  "DAKSHSACHDEVA.webp",
  "DISHAVERMA.webp",
  "POORVAPURI.webp",
  "ROHANSHARMA.webp",
  "SANYARAJPUT.webp",
  "SHRADOOL.webp",
  "SURYAPRATAPSINGH.webp",
  "VRINDACHHABRA.webp",
].map((f) => `/ExecutiveBoard/${f}`);

const EXECUTIVE_COMMITTEE = [
  "AADITI.webp",
  "AADYA.webp",
  "AARAV.webp",
  "AYUSH.webp",
  "BHAVYA.webp",
  "DIYA.webp",
  "DOREEN.webp",
  "HARDAKSH.webp",
  "HARDIK.webp",
  "HARKIRAT.webp",
  "JATIN.webp",
  "KANAN.webp",
  "KARTIK.webp",
  "KHUSBOO.webp",
  "KUWAR.webp",
  "NAKUL.webp",
  "NISHTHA.webp",
  "RAGHAV.webp",
  "RAGHU.webp",
  "RAJAT.webp",
  "RHYTHAM.webp",
  "RIDHI.webp",
  "SAMAIRA.png",
  "SHASHANK.webp",
  "SHREYA.webp",
  "TWISHA.webp",
  "UTKARSH.webp",
  "WARIS.webp",
].map((f) => `/ExecutiveCommittee/${f}`);

const SPONSORS = [
  "/Sponsors/Amogh.jpeg",
  "/Sponsors/Astora.jpg",
  "/Sponsors/IMG_2159.JPG",
  "/Sponsors/IMG_2160.JPG",
  "/Sponsors/TooYumm.jpg",
  "/Sponsors/TwistedTails.jpg",
];

// EcGrid / EbGrid / alumni card art. Pulled by directory so adding a file to
// src/assets/gridimages does not need a matching edit here.
const gridContext = require.context(
  "./assets/gridimages",
  false,
  /\.(webp|png|jpe?g)$/
);
const GRID_IMAGES = gridContext.keys().map(gridContext);

// /gallery is the heaviest single route (~6.9 MB), so it goes last.
const GALLERY = Array.from(
  { length: 35 },
  (_, i) => `/Gallery/img${i + 1}.jpeg`
);

// Tier 3 — everything else, cheapest-and-likeliest first.
const OTHER_ROUTES = [
  ...EXECUTIVE_BOARD,
  ...SPONSORS,
  ...GRID_IMAGES,
  ...EXECUTIVE_COMMITTEE,
  ...GALLERY,
];

let started = false;

/** Resolves on load *or* error — one missing file must not stall the chain. */
function fetchImage(src, priority) {
  return new Promise((resolve) => {
    const img = new Image();
    if ("fetchPriority" in img) img.fetchPriority = priority;
    img.onload = resolve;
    img.onerror = resolve;
    img.src = src;
  });
}

/** Keeps at most `size` requests in flight so the tail never saturates. */
function fetchPool(sources, size, priority) {
  const queue = sources.slice();
  const worker = async () => {
    while (queue.length) {
      await fetchImage(queue.shift(), priority);
    }
  };
  return Promise.all(
    Array.from({ length: Math.min(size, queue.length) }, worker)
  );
}

export default function preloadMedia() {
  if (started || typeof window === "undefined") return;
  started = true;

  Promise.all(HERO.map((src) => fetchImage(src, "high")))
    .then(() => fetchPool(HOME_BELOW_FOLD, 4, "auto"))
    .then(() => fetchPool(OTHER_ROUTES, 3, "low"));
}
