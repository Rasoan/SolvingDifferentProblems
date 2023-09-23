'use strict';

const DIAERESIS_LETTERS_MODIFIER = 776;
const VOWELS = [
    'A',
    'E',
    'I',
    'O',
    'U',
    'Y',
    'a',
    'e',
    'i',
    'o',
    'u',
    'y',
];

export default function heavyMetalUmlauts(boringText: string): string {
    let textWithDiaeresisLetters = '';

    for (let currentLetter of boringText) {
        const isVowel: 0 | number = ~VOWELS.indexOf(currentLetter);

        if (isVowel) {
            const charCodeLetter = currentLetter.codePointAt(0) as number;

            textWithDiaeresisLetters += String.fromCodePoint(charCodeLetter, DIAERESIS_LETTERS_MODIFIER);

            continue;
        }

        textWithDiaeresisLetters += currentLetter;
    }

    return textWithDiaeresisLetters.normalize();
}
