'use strict';

/**
 * Написать функцию sostavChisla(massivChisel: number[], chislo: number),
 которая бы находила все возможные комбинации чисел из massivChisel,
 сумма которых равна chislo. При этом:
 1) massivChisel содержит, только уникальные положительные числа (> 0)
 2) в комбинации не должно быть повторений чисел
 3) все комбинации должны быть уникальными

 Для проверки работоспособности функции запустить runTests()

 @param arrayOfNumbers: number[]
 @param sum: number[]
 @return Array<Array<number>>
 */
function sostavChisla(arrayOfNumbers, sum) {
    const matrix = new Matrix(arrayOfNumbers, sum);

    return matrix.getCombinations();
}

/*
    В какой-то момент пришёл к решению запаковать это всё в класс Matrix, logMatrix() - стал этим самым моментом.
    В принципе, класс здесь излишен, по идее это всё можно было закинуть в sostavChisla() линейно и не запариваться,
    но так выглядит красивее.
*/
class Matrix {
    /** матрица (карта) на основании которой будем собирать комбинации чисел */
    matrix;
    /** исходный массив чисел */
    arrayOfNumbers;
    /** искомая сумма */
    sum;

    constructor(arrayOfNumbers, sum) {
        // + нулевой элемент массива
        const countColumns = sum + 1;
        const row = new Array(countColumns)
            .fill(false)
            // первый столбец будет в true
            .fill(true, 0, 1)
        ;

        this.matrix = arrayOfNumbers.reduce((matrixResult) => {
                return [
                    ...matrixResult,
                    [...row],
                ];
            }, [[...row]]
        );

        this.arrayOfNumbers = arrayOfNumbers;
        this.sum = sum;

        this.fillMatrix();
    }

    fillMatrix() {
        const {
            matrix,
            arrayOfNumbers,
        } = this;

        // с нулевой строкой не работаем
        for (let indexRow = 1; indexRow < matrix.length; indexRow++) {
            const row = matrix[indexRow];
            const numberOfCurrentRow = arrayOfNumbers[indexRow - 1];

            // с нулевым столбцом не работаем
            for (let indexColumn = 1; indexColumn < row.length; indexColumn++) {
                const sumToSearchForCombination_current = indexColumn;

                // если совпало значение числа и номер столбца, то это true
                if (numberOfCurrentRow === sumToSearchForCombination_current) {
                    row[indexColumn] = true;

                    continue;
                }

                const indexCellOfBeforeRow = sumToSearchForCombination_current - numberOfCurrentRow;
                // отступили на одну строку вверх
                const indexOfRowBefore = indexRow - 1;

                /*
                    Если разность отрицательная или вверху есть true,
                    то пойдём вверх за значением true вышестоящей ячейки и сохраним в текущую ячейку.
                    В принципе, здесь на разность можно и не смотреть, но так понятней.
                 */
                if (
                    /*
                        Эту проверку можно убрать, но на всякий случай тоже пусть будет.
                        Если ниже единицы
                    */
                    indexCellOfBeforeRow < 1
                    /* А вот эта проверка - ключевая, без неё всё сломается :) */
                    || matrix[indexOfRowBefore][indexColumn]
                ) {
                    // здесь мы просто берём и сохраняем true из вышестоящей true-ячейки в текущую согласно алгоритму
                    row[indexColumn] = matrix[indexOfRowBefore][indexColumn];

                    continue;
                }

                // на одну строку поднимаемся выше, что бы посмотреть что там, а смотрим там ячейку из столбца-разности
                row[indexColumn] = matrix[indexOfRowBefore][indexCellOfBeforeRow]
            }
        }
    }

    /** Дебажный метод, можно удалить, но пусть будет */
    logMatrix() {
        const {
            matrix,
            arrayOfNumbers,
            sum,
        } = this;
        const [nullRow] = matrix;
        const rowOfHeaders = new Array(sum + 1);

        for (let i = 0; i <= sum; i++) {
            rowOfHeaders[i] = i;
        }

        // нулевую строку вырезали и закинули в исходный объект в свойство "х"
        const matrixVisualize = matrix.slice(1, matrix.length).reduce((resultMatrix, currentRow, indexRow) => {
                return [
                    ...resultMatrix,
                    [arrayOfNumbers[indexRow], ...currentRow],
                ]
            }, [
                ['headers', ...rowOfHeaders],
                ['x', ...nullRow],
            ]
        );

        console.table(matrixVisualize);
    }

    /**
     * @param _currentRootMatrix_indexRow
     * @param _currentRootMatrix_indexColumn
     * @param {number[]} arrayOfCombinations_current
     * @returns {number[][]}
     */
     getCombinations(
        _currentRootMatrix_indexRow = void 0,
        _currentRootMatrix_indexColumn = void 0,
        arrayOfCombinations_current = [],
    ) {
        const {
            matrix,
            arrayOfNumbers,
         } = this;
        const arrayOfCombinations_result = [];
        let currentRootMatrix_indexRow = _currentRootMatrix_indexRow;
        let currentRootMatrix_indexColumn = _currentRootMatrix_indexColumn;
        /*
            Индекс строки в массиве чисел ВСЕГДА на один ниже чем соответствующий в матрице,
            поскольку мы в матрицу докинули нулевую строку (опять же, согласно алгоритму).
         */
        let currentRootArrayOfNumbers_indexRow = _currentRootMatrix_indexRow - 1;

        // в первый вызов рекурсии нет аргументов, начнём с самого последнего элемента матрицы
        if (currentRootMatrix_indexRow === void 0 && currentRootMatrix_indexColumn === void 0) {
            // минус 1, потому что вытаскиваем индекс последней строки массива
            currentRootMatrix_indexRow = matrix.length - 1;
            /*
                Минус 1, потому что вытаскиваем индекс последнего столбца у строки
                (а ноль, потому что строку выдёргиваем, можно любую строку взять)
                (это ячейка в левом нижнем углу, она - корень дерева)
             */
            currentRootMatrix_indexColumn = matrix[0].length - 1;

            // смещение на 1 для массива чисел, поскольку там нет нулевой строки, а в матрице есть
            currentRootArrayOfNumbers_indexRow = currentRootMatrix_indexRow - 1;
        }


        const currentNumber = arrayOfNumbers[currentRootArrayOfNumbers_indexRow];
        const nextSum = currentRootMatrix_indexColumn - currentNumber;
        // на одну строку выше поднялись
        const nextRow = currentRootMatrix_indexRow - 1;

        // условие выхода из рекурсии
        if (!matrix[currentRootMatrix_indexRow][currentRootMatrix_indexColumn]) {
            // больше ничего нет, мы в самом вверху дерева, это конец.
            return [];
        }
        /*
            Поднялись вверх, а там вышли за пределы массива? На этом всё,
            рекурсия возвращается назад вниз не забывая прихватить с собой собранную (готовую) комбинацию.
         */
        else if (nextRow < 0) {
            return [ arrayOfCombinations_current ];
        }

        // поднимаемся на клетку выше и смотрим второй вариант комбинации
        arrayOfCombinations_result.push(
            ...this.getCombinations(
                nextRow,
                // тот же столбец
                currentRootMatrix_indexColumn,
                [ ...arrayOfCombinations_current ],
            ),
        );

        // если есть остаток, то продолжаем поиск новых комбинаций
        if (nextSum >= 0) {
            arrayOfCombinations_current.push(currentNumber);

            arrayOfCombinations_result.push(
                ...this.getCombinations(
                    nextRow,
                    // новый столбец
                    nextSum,
                    [ ...arrayOfCombinations_current ],
                ),
            );
        }

        return arrayOfCombinations_result;
    }
}

function compareNumericArrays(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    }

    arr1 = [...arr1].sort();
    arr2 = [...arr2].sort();

    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }

    return true;
}

function compareArraysOfNumericArrays(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    }

    for (let el1 of arr1) {
        if (arr2.findIndex(el2 => compareNumericArrays(el1, el2)) < 0) {
            return false;
        }
    }

    return true;
}

runTests();

function runTests() {
    const tests = [
        {
            chislo: 5,
            massivChisel: [8, 2, 3, 4, 6, 7, 1],
            result: [[2, 3], [4, 1]]
        },
        {
            chislo: 99,
            massivChisel: [8, 2, 3, 4, 6, 7, 1],
            result: []
        },
        {
            chislo: 8,
            massivChisel: [1, 2, 3, 4, 5, 6, 7, 8],
            result: [[1, 3, 4], [1, 2, 5], [3, 5], [2, 6], [1, 7], [8]]
        },
        {
            chislo: 8,
            massivChisel: [7, 8, 3, 4, 5, 6, 1, 2],
            result: [[1, 3, 4], [1, 2, 5], [3, 5], [2, 6], [1, 7], [8]]
        },
        {
            chislo: 15,
            massivChisel: [7, 8, 3, 4, 5, 6, 1, 2],
            result: [[1, 2, 3, 4, 5], [2, 3, 4, 6], [1, 3, 5, 6], [4, 5, 6], [1, 3, 4, 7], [1, 2, 5, 7], [3, 5, 7], [2, 6, 7], [1, 2, 4, 8], [3, 4, 8], [2, 5, 8], [1, 6, 8], [7, 8]]
        },
    ];

    let errors = 0;
    for (const test of tests) {
        let result;
        try {
            result = sostavChisla(test.massivChisel, test.chislo);

            if (!compareArraysOfNumericArrays(
                result,
                test.result)
            ) {
                errors++;
                console.log('--------------------------------------------')
                console.log("failed for test", test, "Got result", result);
            }
        } catch (e) {
            errors++;
            console.log("failed for", test, 'exception', e.message);
        }
    }

    if (errors === 0) {
        console.log('checkStringForBracects test successfuly completed');
    } else {
        console.log(`checkStringForBracects test failed with ${errors} errors`);
    }
}
