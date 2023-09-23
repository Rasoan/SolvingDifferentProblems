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
export default function sostavChisla(arrayOfNumbers: number[], sum: number) {
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

    constructor(arrayOfNumbers: number[], sum: number) {
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
        _currentRootMatrix_indexRow?: number,
        _currentRootMatrix_indexColumn?: number,
        arrayOfCombinations_current: number[] = [],
    ): number[][] {
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
        let currentRootArrayOfNumbers_indexRow: number;

        // в первый вызов рекурсии нет аргументов, начнём с самого последнего элемента матрицы
        if (currentRootMatrix_indexRow === void 0
            || currentRootMatrix_indexColumn === void 0
        ) {
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
        else {
            if (_currentRootMatrix_indexRow === void 0) {
                throw new Error("_currentRootMatrix_indexRow is not defined!")
            }

            currentRootArrayOfNumbers_indexRow = _currentRootMatrix_indexRow - 1;
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
