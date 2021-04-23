import { Coord, initialseGridWith, GridFrame, isSameCoord, isOutOfBounds, GenNeighbours } from "../data-structures/grid";
import { HashMap } from "../data-structures/hashmap";
import { PriorityQueue } from "../data-structures/priority-queue";
import { Queue } from "../data-structures/queue";
import { Stack } from "../data-structures/stack";
import { generateAStarComparator, generateDijkstraComparator, generateRandomComparator, stringToHeuristic } from "./comparators";
import { genericBidirectionalSearch, genericUnidirectionalSearch, kBeamSearch } from "./genericPathfinding";

export type Algorithm = (start: Coord, goal: Coord, walls: boolean[][], generateNeighbours: GenNeighbours, weights: number[][], heuristic: string) => GridFrame[];

const unweighted = initialseGridWith(0);

export function breadthFirstSearch(start: Coord, goal: Coord, walls: boolean[][], generateNeighbours: GenNeighbours, weights: number[][], _: string) {
    const queue = new Queue<Coord>();
    const distances = new HashMap<Coord, number>();

    return genericUnidirectionalSearch(start, goal, queue, distances, unweighted, walls, generateNeighbours);
}

export function depthFirstSearch(start: Coord, goal: Coord, walls: boolean[][], generateNeighbours: GenNeighbours, weights: number[][], _: string) {
    const stack = new Stack<Coord>();
    const distances = new HashMap<Coord, number>();

    return genericUnidirectionalSearch(start, goal, stack, distances, unweighted, walls, generateNeighbours);
}

export function bestFirstSearch(start: Coord, goal: Coord, walls: boolean[][], generateNeighbours: GenNeighbours, weights: number[][], heuristic: string) {
    const heuristicComparator = stringToHeuristic.get(heuristic)(goal);
    const priorityQueue = new PriorityQueue(heuristicComparator);
    const distances = new HashMap<Coord, number>();

    return genericUnidirectionalSearch(start, goal, priorityQueue, distances, unweighted, walls, generateNeighbours);
}

export function dijkstra(start: Coord, goal: Coord, walls: boolean[][], generateNeighbours: GenNeighbours, weights: number[][], _: string) {
    const distances = new HashMap<Coord, number>();
    const distanceComparator = generateDijkstraComparator(distances);
    const priorityQueue = new PriorityQueue(distanceComparator);

    return genericUnidirectionalSearch(start, goal, priorityQueue, distances, weights, walls, generateNeighbours);
}

export function aStar(start: Coord, goal: Coord, walls: boolean[][], generateNeighbours: GenNeighbours, weights: number[][], heuristic: string) {
    const distances = new HashMap<Coord, number>();
    const comparator = generateAStarComparator(goal, distances, heuristic);
    const priorityQueue = new PriorityQueue(comparator);

    return genericUnidirectionalSearch(start, goal, priorityQueue, distances, weights, walls, generateNeighbours);
}

export function randomSearch(start: Coord, goal: Coord, walls: boolean[][], generateNeighbours: GenNeighbours, weights: number[][], _: string) {
    const distances = new HashMap<Coord, number>();
    const comparator = generateRandomComparator();
    const priorityQueue = new PriorityQueue(comparator);

    return genericUnidirectionalSearch(start, goal, priorityQueue, distances, unweighted, walls, generateNeighbours);
}

export function bidirectionalBFS(start: Coord, goal: Coord, walls: boolean[][], generateNeighbours: GenNeighbours, weights: number[][], _: string) {
    const forwardsDistances = new HashMap<Coord, number>();
    const backwardsDistances = new HashMap<Coord, number>();
    const forwardQueue = new Queue<Coord>();
    const backwardQueue = new Queue<Coord>();

    return genericBidirectionalSearch(forwardQueue, backwardQueue, forwardsDistances, backwardsDistances, start, goal, unweighted, walls, generateNeighbours);
}

export function bidirectionalDFS(start: Coord, goal: Coord, walls: boolean[][], generateNeighbours: GenNeighbours, weights: number[][], _: string) {
    const forwardsDistances = new HashMap<Coord, number>();
    const backwardsDistances = new HashMap<Coord, number>();
    const forwardsStack = new Stack<Coord>();
    const backwardStack = new Stack<Coord>();

    return genericBidirectionalSearch(forwardsStack, backwardStack, forwardsDistances, backwardsDistances, start, goal, unweighted, walls, generateNeighbours);
}

export function bidirectionalGBFS(start: Coord, goal: Coord, walls: boolean[][], generateNeighbours: GenNeighbours, weights: number[][], heuristic: string) {
    const forwardsDistances = new HashMap<Coord, number>();
    const backwardsDistances = new HashMap<Coord, number>();
    const forwardsComparator = stringToHeuristic.get(heuristic)(goal);
    const backwardsComparator = stringToHeuristic.get(heuristic)(start);
    const forwardsQueue = new PriorityQueue<Coord>(forwardsComparator);
    const backwardQueue = new PriorityQueue<Coord>(backwardsComparator);

    return genericBidirectionalSearch(forwardsQueue, backwardQueue, forwardsDistances, backwardsDistances, start, goal, unweighted, walls, generateNeighbours);
}

export function bidirectionalDijkstra(start: Coord, goal: Coord, walls: boolean[][], generateNeighbours: GenNeighbours, weights: number[][], heuristic: string) {
    const forwardsDistances = new HashMap<Coord, number>();
    const backwardsDistances = new HashMap<Coord, number>();
    const forwardsComparator = generateDijkstraComparator(forwardsDistances);
    const backwardsComparator = generateDijkstraComparator(backwardsDistances);
    const forwardsQueue = new PriorityQueue<Coord>(forwardsComparator);
    const backwardQueue = new PriorityQueue<Coord>(backwardsComparator);

    return genericBidirectionalSearch(forwardsQueue, backwardQueue, forwardsDistances, backwardsDistances, start, goal, weights, walls, generateNeighbours);
}

export function bidirectionalAStar(start: Coord, goal: Coord, walls: boolean[][], generateNeighbours: GenNeighbours, weights: number[][], heuristic: string) {
    const forwardsDistances = new HashMap<Coord, number>();
    const backwardsDistances = new HashMap<Coord, number>();
    const forwardsComparator = generateAStarComparator(goal, forwardsDistances, heuristic);
    const backwardsComparator = generateAStarComparator(start, backwardsDistances, heuristic);
    const forwardsQueue = new PriorityQueue<Coord>(forwardsComparator);
    const backwardQueue = new PriorityQueue<Coord>(backwardsComparator);

    return genericBidirectionalSearch(forwardsQueue, backwardQueue, forwardsDistances, backwardsDistances, start, goal, weights, walls, generateNeighbours);
}

export function bidirectionalRandom(start: Coord, goal: Coord, walls: boolean[][], generateNeighbours: GenNeighbours, weights: number[][], _: string) {
    const forwardsDistances = new HashMap<Coord, number>();
    const backwardsDistances = new HashMap<Coord, number>();
    const comparator = generateRandomComparator();
    const forwardsQueue = new PriorityQueue<Coord>(comparator);
    const backwardQueue = new PriorityQueue<Coord>(comparator);

    return genericBidirectionalSearch(forwardsQueue, backwardQueue, forwardsDistances, backwardsDistances, start, goal, unweighted, walls, generateNeighbours);
}

export function hillClimbing(start: Coord, goal: Coord, walls: boolean[][], generateNeighbours: GenNeighbours, _: number[][], heuristic: string) {
    return kBeamSearch(start, goal, walls, generateNeighbours, 1, heuristic);
}

export function twoBeamSearch(start: Coord, goal: Coord, walls: boolean[][], generateNeighbours: GenNeighbours, _: number[][], heuristic: string) {
    return kBeamSearch(start, goal, walls, generateNeighbours, 2, heuristic);
}

export function threeBeamSearch(start: Coord, goal: Coord, walls: boolean[][], generateNeighbours: GenNeighbours, _: number[][], heuristic: string) {
    return kBeamSearch(start, goal, walls, generateNeighbours, 3, heuristic);
}



