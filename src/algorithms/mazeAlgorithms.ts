import { Coord, HEIGHT, WIDTH } from "../data-structures/grid";
import { PriorityQueue } from "../data-structures/priority-queue";
import { randomIntBetween } from "../utils";

// Generate a vertical maze of whatever wall type user has selected
export function divideVertical(placement: (pos: Coord) => void) {
    divideVertically(placement, 0, 0, HEIGHT, WIDTH);
}

// Generate a horizontal maze of whatever wall type user has selected
export function divideHorizontal(placement: (pos: Coord) => void) {
    divideHorizontally(placement, 0, 0, HEIGHT, WIDTH);
}

// Generate a random maze of whatever wall type user has selected
export function randomMaze(placement: (pos: Coord) => void) {
    for (let row = 0; row < HEIGHT; row++) {
        fillRowRandomly(placement, row);
    }
}

// Algorithm for generating a vertical maze
function divideVertically(placement: (pos: Coord) => void, baseRow: number, baseCol: number, height: number, width: number) {
    if (width > 2 && height > 2) {
        const upperCol = baseCol + width;
        const upperRow = baseRow + height;
        const wallCol = randomIntBetween(baseCol + 1, upperCol - 1);
        const hole = randomIntBetween(baseRow, upperRow);

        for (let row = baseRow; row < upperRow; row++) {
            if (row !== hole) {
                placement({ row: row, col: wallCol });
            }
        }

        divideVertically(placement, baseRow, baseCol, height, (wallCol - baseCol) - 1);
        divideVertically(placement, baseRow, wallCol + 1, height, (baseCol + width - wallCol) - 1);
    }
}

// Algorithm for generating a horizontal maze
function divideHorizontally(placement: (pos: Coord) => void, baseRow: number, baseCol: number, height: number, width: number) {
    if (width > 2 && height > 2) {
        const upperRow = baseRow + height;
        const upperCol = baseCol + width;
        const wallRow = randomIntBetween(baseRow + 1, upperRow - 1);
        const hole = randomIntBetween(baseCol, upperCol);

        for (let col = baseCol; col < upperCol; col++) {
            if (col !== hole) {
                placement({ row: wallRow, col: col });
            }
        }

        divideHorizontally(placement, baseRow, baseCol, (wallRow - baseRow) - 1, width);
        divideHorizontally(placement, wallRow + 1, baseCol, (baseRow + height - wallRow) - 1, width);
    }
}

// Fill some tiles in a row while leaving others
function fillRowRandomly(placement: (pos: Coord) => void, row: number) {
    const randomComparator = (x, y) => Math.random() - 0.5;
    const priorityQueue = new PriorityQueue<number>(randomComparator);
    const density = 4;

    for (let col = 0; col < WIDTH; col++) {
        priorityQueue.add(col);
    }

    for (let i = 0; i < WIDTH / density; i++) {
        placement({ row: row, col: priorityQueue.remove() });
    }
}