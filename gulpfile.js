import { parallel, series } from 'gulp';

import {
  cleanDev,
  cleanImageStackDev,
  // pagesDev,
  stylesDev,
  imagesDev,
  spriteDev,
  scriptsDev,
  watchingDev,
  fileDev,
  pugPages
} from './gulp/dev.js';

import {
  cleanDist,
  cleanImageStack,
  pages,
  styles,
  images,
  sprite,
  scripts,
  getSprite,
  file,
  server
} from './gulp/prod.js';

export const dev = series(
    cleanDev,
    cleanImageStackDev,
    parallel(
      // pagesDev,
      pugPages,
      stylesDev,
      imagesDev,
      spriteDev,
      fileDev,
      scriptsDev
    ),
    watchingDev
  );

export const build = series(
  cleanDist,
  cleanImageStack,
  parallel(
    pages,
    styles,
    images,
    sprite,
    file,
    scripts
  ),
  getSprite,
  server,
);
