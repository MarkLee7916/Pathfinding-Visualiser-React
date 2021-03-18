import { Collection } from "../data-structures/collection";
import { Coord, initialseGridWith, generateNeighbours, getIntersection, GridFrame, hasIntersection, HEIGHT, isOutOfBounds, isSameCoord, TileFrame, WIDTH } from "../data-structures/grid";
import { HashMap } from "../data-structures/hashmap";
import { deepCopy } from "../utils";

// Generic pathfinding algo for searching from a source. Parameterized with the data structure used to make it generic
export function genericUnidirectionalSearch(
    start: Coord,
    goal: Coord,
    agenda: Collection<Coord>,
    distances: HashMap<Coord, number>,
    weights: number[][],
    walls: boolean[][]) {

    const path = new HashMap<Coord, Coord>();
    const visited = initialseGridWith(false);
    const considered = initialseGridWith(false);
    const frames: GridFrame[] = [];

    agenda.add(start);
    visited[start.row][start.col] = true;
    distances.add(start, 0);

    while (!agenda.isEmpty()) {
        const isFound = considerNextNode(path, visited, agenda, goal, weights, considered, walls, distances, frames);

        if (isFound) {
            const finalPath = pathMapToGrid(path, goal);

            createFinalPathFrame(finalPath, visited, considered, frames);
            break;
        }
    }

    return frames;
}

// Generic pathfinding algo for searching from both the source and goal concurrently
export function genericBidirectionalSearch(
    forwardAgenda: Collection<Coord>,
    backwardAgenda: Collection<Coord>,
    forwardDistances: HashMap<Coord, number>,
    backwardDistances: HashMap<Coord, number>,
    start: Coord,
    goal: Coord,
    weights: number[][],
    walls: boolean[][]) {

    const forwardPath = new HashMap<Coord, Coord>();
    const backwardPath = new HashMap<Coord, Coord>();

    const forwardVisited = initialseGridWith(false);
    const backwardVisited = initialseGridWith(false);

    const forwardConsidered = initialseGridWith(false);
    const backwardConsidered = initialseGridWith(false);

    const frames: GridFrame[] = [];

    forwardDistances.add(start, 0);
    backwardDistances.add(goal, 0);

    forwardAgenda.add(start);
    backwardAgenda.add(goal);

    forwardVisited[start.row][start.col] = true;
    backwardVisited[goal.row][goal.col] = true;

    while (!forwardAgenda.isEmpty() && !backwardAgenda.isEmpty()) {
        const foundForwards = considerNextNode(forwardPath, forwardVisited, forwardAgenda, goal, weights, forwardConsidered, walls, forwardDistances, frames);
        const foundBackwards = considerNextNode(backwardPath, backwardVisited, backwardAgenda, start, weights, backwardConsidered, walls, backwardDistances, frames);

        mergeFrames(frames);

        if (foundForwards) {
            const finalPath = pathMapToGrid(forwardPath, goal);
            const mergedVisited = mergeGrids(forwardVisited, backwardVisited);
            const mergedConsidered = mergeGrids(forwardConsidered, backwardConsidered);

            createFinalPathFrame(finalPath, mergedVisited, mergedConsidered, frames);
            break;
        } else if (foundBackwards) {
            const finalPath = pathMapToGrid(backwardPath, start);
            const mergedVisited = mergeGrids(forwardVisited, backwardVisited);
            const mergedConsidered = mergeGrids(forwardConsidered, backwardConsidered);

            createFinalPathFrame(finalPath, mergedVisited, mergedConsidered, frames);
            break;
        } else if (hasIntersection(forwardConsidered, backwardConsidered)) {
            const intersection = getIntersection(forwardConsidered, backwardConsidered);
            const finalPath = mergeGrids(pathMapToGrid(forwardPath, intersection), pathMapToGrid(backwardPath, intersection));
            const mergedVisited = mergeGrids(forwardVisited, backwardVisited);
            const mergedConsidered = mergeGrids(forwardConsidered, backwardConsidered);

            createFinalPathFrame(finalPath, mergedVisited, mergedConsidered, frames);
            break;
        }
    }

    return frames;
}

// Generic function for making one step in a pathfinding algorithm
function considerNextNode(
    path: HashMap<Coord, Coord>,
    visited: boolean[][],
    agenda: Collection<Coord>,
    goal: Coord,
    weights: number[][],
    considered: boolean[][],
    walls: boolean[][],
    distances: HashMap<Coord, number>,
    frames: GridFrame[]) {

    const currentPos = agenda.remove();
    const currentNeighbours = generateNeighbours(currentPos);

    considered[currentPos.row][currentPos.col] = true;
    frames.push(generateGridFrame(visited, considered, []));

    if (isSameCoord(currentPos, goal)) {
        return true;
    }

    currentNeighbours.forEach(neighbour => {
        if (!isOutOfBounds(neighbour) && !walls[neighbour.row][neighbour.col]) {
            const neighbourDistance = distances.get(currentPos) + weights[neighbour.row][neighbour.col];

            if (!visited[neighbour.row][neighbour.col]) {
                distances.add(neighbour, neighbourDistance);
                agenda.add(neighbour);
                visited[neighbour.row][neighbour.col] = true;
                path.add(neighbour, currentPos);
            }
        }
    });

    return false;
}

// Given two boolean grids, for all tiles, take the logical OR and return a new grid
function mergeGrids(grid: boolean[][], matrix: boolean[][]) {
    const mergedGrid = initialseGridWith(false);

    for (let row = 0; row < HEIGHT; row++) {
        for (let col = 0; col < WIDTH; col++) {
            mergedGrid[row][col] = grid[row][col] || matrix[row][col];
        }
    }

    return mergedGrid;
}

// Merge two animation frames to produce a frame that contains the information encoded in both
function mergeFrames(frames: GridFrame[]) {
    const backwardsFrame = frames.pop();
    const forwardsFrame = frames.pop();
    const mergedFrame = initialseGridWith(TileFrame.Blank);

    for (let row = 0; row < HEIGHT; row++) {
        for (let col = 0; col < WIDTH; col++) {
            if (forwardsFrame[row][col] === TileFrame.Searching || backwardsFrame[row][col] === TileFrame.Searching) {
                mergedFrame[row][col] = TileFrame.Searching;
            } else if (forwardsFrame[row][col] === TileFrame.Frontier || backwardsFrame[row][col] === TileFrame.Frontier) {
                mergedFrame[row][col] = TileFrame.Frontier;
            }
        }
    }

    frames.push(mergedFrame);
}

// Add a frame containing the final path to the list
function createFinalPathFrame(path: boolean[][], visited: boolean[][], considered: boolean[][], frames: GridFrame[]) {
    frames.push(generateGridFrame(visited, considered, path));
}

// Convert the hashmap pointer based path to a boolean grid based path
function pathMapToGrid(pathMap: HashMap<Coord, Coord>, goal: Coord) {
    const path = initialseGridWith(false);
    let pos = goal;

    while (pathMap.get(pos) !== undefined) {
        path[pos.row][pos.col] = true;

        pos = pathMap.get(pos);
    }

    return path;
}

// Encode the state of a pathfinding algorithm into a frame 
function generateGridFrame(visited: boolean[][], considered: boolean[][], path: boolean[][]) {
    const grid = initialseGridWith(TileFrame.Blank);

    for (let row = 0; row < HEIGHT; row++) {
        for (let col = 0; col < WIDTH; col++) {
            if (path.length > 0 && path[row][col]) {
                grid[row][col] = TileFrame.Path;
            } else if (considered[row][col]) {
                grid[row][col] = TileFrame.Searching;
            } else if (visited[row][col]) {
                grid[row][col] = TileFrame.Frontier;
            }
        }
    }

    return grid;
}

