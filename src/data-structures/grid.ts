import { deepCopy } from "../utils";

export type Coord = { row: number, col: number }

export type GridFrame = TileFrame[][];

export const HEIGHT = computeHeightAndWidth().height;

export const WIDTH = computeHeightAndWidth().width;

export const enum TileFrame {
    Start,
    Goal,
    Searching,
    Frontier,
    Path,
    Wall,
    Blank
}

// Initialise a grid of dimensions HEIGHT x WIDTH with some value
export function initialseGridWith<T>(input: T): T[][] {
    const grid = [];

    for (let row = 0; row < HEIGHT; row++) {
        grid.push([]);
        for (let col = 0; col < WIDTH; col++) {
            grid[row].push(deepCopy(input));
        }
    }

    return grid;
}

export function isOutOfBounds({ row, col }: Coord) {
    return row < 0 || col < 0 || row >= HEIGHT || col >= WIDTH;
}

export function isSameCoord(coord1: Coord, coord2: Coord) {
    return coord1.row === coord2.row && coord1.col === coord2.col;
}

// Get all nodes one step away from a given node (diagonals not considered)
export function generateNeighbours({ row, col }: Coord) {
    const neighbours: Coord[] = [];

    addToNeighbours(neighbours, { row: row + 1, col: col });
    addToNeighbours(neighbours, { row: row - 1, col: col });
    addToNeighbours(neighbours, { row: row, col: col + 1 });
    addToNeighbours(neighbours, { row: row, col: col - 1 });

    return neighbours;
}

// Return true if the given grids have any tiles in common filled in
export function hasIntersection(grid: boolean[][], matrix: boolean[][]) {
    const { row, col } = getIntersection(grid, matrix);

    return row !== -1 && col !== -1;
}

// Return the coordinates of the tiles that the given grids both have filled in
export function getIntersection(grid: boolean[][], matrix: boolean[][]): Coord {
    for (let row = 0; row < HEIGHT; row++) {
        for (let col = 0; col < WIDTH; col++) {
            if (grid[row][col] && matrix[row][col]) {
                return { row: row, col: col };
            }
        }
    }

    return { row: -1, col: -1 };
}

function addToNeighbours(neighbours: Coord[], pos: Coord) {
    if (!isOutOfBounds(pos)) {
        neighbours.push(pos)
    }
}

// Calculate height and width based off of the size of the users screen
function computeHeightAndWidth() {
    const sizeModifier = 35;
    const height = Math.floor(window.innerHeight / sizeModifier);
    const width = Math.floor(window.innerWidth / sizeModifier);

    return { height: height, width: width };
}
