// Scene registry — one immersive scene pack per page architecture.
// Contract: scene(P, R, G) -> { css, heroHtml, sepHtml }
// All 8 modules verified to import + execute cleanly (see integration notes).
import { scene as storybookLight } from './storybook-light.mjs';
import { scene as posterDark } from './poster-dark.mjs';
import { scene as ticketDiner } from './ticket-diner.mjs';
import { scene as majlisHeritage } from './majlis-heritage.mjs';
import { scene as neonArcade } from './neon-arcade.mjs';
import { scene as gardenFresh } from './garden-fresh.mjs';
import { scene as editorialMag } from './editorial-mag.mjs';
import { scene as playfulHand } from './playful-hand.mjs';

export const SCENES = {
  'storybook-light': storybookLight,
  'poster-dark': posterDark,
  'ticket-diner': ticketDiner,
  'majlis-heritage': majlisHeritage,
  'neon-arcade': neonArcade,
  'garden-fresh': gardenFresh,
  'editorial-mag': editorialMag,
  'playful-hand': playfulHand,
};
