import { persistentAtom } from '@nanostores/persistent';
import { type Audio } from "@prisma/client";
import { atom } from "nanostores"

export const $main_theme = persistentAtom<Partial<Audio>>("main_theme", {}, {
    encode: JSON.stringify,
    decode: JSON.parse,
});

export const $use_theme = persistentAtom<boolean | undefined>("use_theme", true, {
    encode: JSON.stringify,
    decode: JSON.parse,
});

export const $themeOff = atom(false);
