'use strict';

import heavyMetalUmlauts from "./latinCapitalLetters";

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