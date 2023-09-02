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

function heavyMetalUmlauts(boringText) {
    let textWithDiaeresisLetters = '';

    for (let currentLetter of boringText) {
        const isVowel = ~VOWELS.indexOf(currentLetter);

        if (isVowel) {
            const charCodeLetter = currentLetter.codePointAt(0);

            textWithDiaeresisLetters += String.fromCodePoint(charCodeLetter, DIAERESIS_LETTERS_MODIFIER);

            continue;
        }

        textWithDiaeresisLetters += currentLetter;
    }

    return textWithDiaeresisLetters.normalize();
}

describe('Example tests', () => {
    it("Tests", () => {
        expect(
            heavyMetalUmlauts("Announcing the Macbook Air Guitar")
        ).toBe("Ännöüncïng thë Mäcböök Äïr Güïtär");
        expect(
            heavyMetalUmlauts("Facebook introduces new heavy metal reaction buttons")
        )
            .toBe("Fäcëböök ïntrödücës nëw hëävÿ mëtäl rëäctïön büttöns");
        expect(
            heavyMetalUmlauts("Strong sales of Google's VR Metalheadsets send tech stock prices soaring")
        )
            .toBe("Ströng sälës öf Gööglë's VR Mëtälhëädsëts sënd tëch stöck prïcës söärïng");
        expect(
            heavyMetalUmlauts("Vegan Black Metal Chef hits the big time on Amazon TV")
        )
            .toBe("Vëgän Bläck Mëtäl Chëf hïts thë bïg tïmë ön Ämäzön TV");
    });
});