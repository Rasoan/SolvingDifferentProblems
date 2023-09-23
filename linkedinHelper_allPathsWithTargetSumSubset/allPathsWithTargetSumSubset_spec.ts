'use strict';

import sostavChisla from "./allPathsWithTargetSumSubset";

describe("allPathsWithTargetSumSubset", () => {
    it('5', () => {
        const arrayOfCombinations_actual = sostavChisla([8, 2, 3, 4, 6, 7, 1], 5);
        const arrayOfCombinations_expect = [
            [2, 3],
            [4, 1]
        ];

        const isIdentical = test__compareTwoCombinations(
            arrayOfCombinations_actual,
            arrayOfCombinations_expect,
        );

        expect(isIdentical).toBeTruthy();
    });

    it('99', () => {
        const arrayOfCombinations_actual: number[][] = sostavChisla([8, 2, 3, 4, 6, 7, 1], 99);
        const arrayOfCombinations_expect: number[][] = [];

        const isIdentical = test__compareTwoCombinations(
            arrayOfCombinations_actual,
            arrayOfCombinations_expect,
        );

        expect(isIdentical).toBeTruthy();
    });

    it('8', () => {
        {
            const arrayOfCombinations_actual: number[][] = sostavChisla([1, 2, 3, 4, 5, 6, 7, 8], 8);
            const arrayOfCombinations_expect: number[][] = [
                [1, 3, 4],
                [1, 2, 5],
                [3, 5],
                [2, 6],
                [1, 7],
                [8],
            ];

            const isIdentical = test__compareTwoCombinations(
                arrayOfCombinations_actual,
                arrayOfCombinations_expect,
            );

            expect(isIdentical).toBeTruthy();
        }

        {
            const arrayOfCombinations_actual: number[][] =  sostavChisla([7, 8, 3, 4, 5, 6, 1, 2], 8);
            const arrayOfCombinations_expect: number[][] = [
                [1, 3, 4],
                [1, 2, 5],
                [3, 5],
                [2, 6],
                [1, 7],
                [8]
            ];

            const isIdentical = test__compareTwoCombinations(
                arrayOfCombinations_actual,
                arrayOfCombinations_expect,
            );

            expect(isIdentical).toBeTruthy();
        }
    });

    it('99', () => {
        const arrayOfCombinations_actual: number[][] = sostavChisla([7, 8, 3, 4, 5, 6, 1, 2], 15);
        const arrayOfCombinations_expect: number[][] = [
            [1, 2, 3, 4, 5],
            [2, 3, 4, 6],
            [1, 3, 5, 6],
            [4, 5, 6],
            [1, 3, 4, 7],
            [1, 2, 5, 7],
            [3, 5, 7],
            [2, 6, 7],
            [1, 2, 4, 8],
            [3, 4, 8],
            [2, 5, 8],
            [1, 6, 8],
            [7, 8]
        ];

        const isIdentical = test__compareTwoCombinations(
            arrayOfCombinations_actual,
            arrayOfCombinations_expect,
        );

        expect(isIdentical).toBeTruthy();
    });
});

function test__compareTwoCombinations(combinationsList_actual: number[][], combinationsList_expect: number[][]): boolean {
    const _combinationsList_actual = test__normalizeListOfCombinations(combinationsList_actual);
    const _combinationsList_expect = test__normalizeListOfCombinations(combinationsList_expect);

    if (_combinationsList_actual.length !== _combinationsList_expect.length) {
        console.error(`Different lengths in list of actual combinations \n[${combinationsList_actual}]\n and list of expected combinations \n[${combinationsList_expect}]\n`);

        return false;
    }

    for (const currentCombination_actual of _combinationsList_actual) {
        if (
            !_combinationsList_expect.includes(currentCombination_actual)
        ) {
            console.error(`Can't find result combination - \n[${currentCombination_actual}]\n of expectCombinations \n[${combinationsList_expect}]\n`);

            return false;
        }
    }

    return true;
}

function test__normalizeListOfCombinations(listOfCombinations: number[][]) {
    return listOfCombinations
        .map(currentCombination => {
            return JSON.stringify(
                currentCombination.sort((prevNumber, nextNumber) => prevNumber - nextNumber)
            )
        })
    ;
}