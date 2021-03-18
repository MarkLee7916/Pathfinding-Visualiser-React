import { Coord, initialseGridWith, GridFrame } from "../data-structures/grid";
import { HashMap } from "../data-structures/hashmap";
import { PriorityQueue } from "../data-structures/priority-queue";
import { Queue } from "../data-structures/queue";
import { Stack } from "../data-structures/stack";
import { generateAStarComparator, generateDijkstraComparator, generateRandomComparator, stringToHeuristic } from "./comparators";
import { genericBidirectionalSearch, genericUnidirectionalSearch } from "./genericPathfinding";

export type Algorithm = (start: Coord, goal: Coord, walls: boolean[][], weights: number[][], heuristic: string) => GridFrame[];

export function breadthFirstSearch(start: Coord, goal: Coord, walls: boolean[][], weights: number[][], _: string) {
    const queue = new Queue<Coord>();
    const distances = new HashMap<Coord, number>();

    return genericUnidirectionalSearch(start, goal, queue, distances, weights, walls);
}

export function depthFirstSearch(start: Coord, goal: Coord, walls: boolean[][], weights: number[][], _: string) {
    const stack = new Stack<Coord>();
    const distances = new HashMap<Coord, number>();

    return genericUnidirectionalSearch(start, goal, stack, distances, weights, walls);
}

export function bestFirstSearch(start: Coord, goal: Coord, walls: boolean[][], weights: number[][], heuristic: string) {
    const heuristicComparator = stringToHeuristic.get(heuristic)(goal);
    const priorityQueue = new PriorityQueue(heuristicComparator);
    const distances = new HashMap<Coord, number>();

    return genericUnidirectionalSearch(start, goal, priorityQueue, distances, weights, walls);
}

export function dijkstra(start: Coord, goal: Coord, walls: boolean[][], weights: number[][], _: string) {
    const distances = new HashMap<Coord, number>();
    const distanceComparator = generateDijkstraComparator(distances);
    const priorityQueue = new PriorityQueue(distanceComparator);

    return genericUnidirectionalSearch(start, goal, priorityQueue, distances, weights, walls);
}

export function aStar(start: Coord, goal: Coord, walls: boolean[][], weights: number[][], heuristic: string) {
    const distances = new HashMap<Coord, number>();
    const comparator = generateAStarComparator(goal, distances, heuristic);
    const priorityQueue = new PriorityQueue(comparator);

    return genericUnidirectionalSearch(start, goal, priorityQueue, distances, weights, walls);
}

export function randomSearch(start: Coord, goal: Coord, walls: boolean[][], weights: number[][], _: string) {
    const distances = new HashMap<Coord, number>();
    const comparator = generateRandomComparator();
    const priorityQueue = new PriorityQueue(comparator);

    return genericUnidirectionalSearch(start, goal, priorityQueue, distances, weights, walls);
}

export function bidirectionalBFS(start: Coord, goal: Coord, walls: boolean[][], weights: number[][], _: string) {
    const forwardsDistances = new HashMap<Coord, number>();
    const backwardsDistances = new HashMap<Coord, number>();
    const forwardQueue = new Queue<Coord>();
    const backwardQueue = new Queue<Coord>();

    return genericBidirectionalSearch(forwardQueue, backwardQueue, forwardsDistances, backwardsDistances, start, goal, weights, walls);
}

export function bidirectionalDFS(start: Coord, goal: Coord, walls: boolean[][], weights: number[][], _: string) {
    const forwardsDistances = new HashMap<Coord, number>();
    const backwardsDistances = new HashMap<Coord, number>();
    const forwardsStack = new Stack<Coord>();
    const backwardStack = new Stack<Coord>();

    return genericBidirectionalSearch(forwardsStack, backwardStack, forwardsDistances, backwardsDistances, start, goal, weights, walls);
}

export function bidirectionalGBFS(start: Coord, goal: Coord, walls: boolean[][], weights: number[][], heuristic: string) {
    const forwardsDistances = new HashMap<Coord, number>();
    const backwardsDistances = new HashMap<Coord, number>();
    const forwardsComparator = stringToHeuristic.get(heuristic)(goal);
    const backwardsComparator = stringToHeuristic.get(heuristic)(start);
    const forwardsQueue = new PriorityQueue<Coord>(forwardsComparator);
    const backwardQueue = new PriorityQueue<Coord>(backwardsComparator);

    return genericBidirectionalSearch(forwardsQueue, backwardQueue, forwardsDistances, backwardsDistances, start, goal, weights, walls);
}

export function bidirectionalDijkstra(start: Coord, goal: Coord, walls: boolean[][], weights: number[][], heuristic: string) {
    const forwardsDistances = new HashMap<Coord, number>();
    const backwardsDistances = new HashMap<Coord, number>();
    const forwardsComparator = generateDijkstraComparator(forwardsDistances);
    const backwardsComparator = generateDijkstraComparator(backwardsDistances);
    const forwardsQueue = new PriorityQueue<Coord>(forwardsComparator);
    const backwardQueue = new PriorityQueue<Coord>(backwardsComparator);

    return genericBidirectionalSearch(forwardsQueue, backwardQueue, forwardsDistances, backwardsDistances, start, goal, weights, walls);
}

export function bidirectionalAStar(start: Coord, goal: Coord, walls: boolean[][], weights: number[][], heuristic: string) {
    const forwardsDistances = new HashMap<Coord, number>();
    const backwardsDistances = new HashMap<Coord, number>();
    const forwardsComparator = generateAStarComparator(goal, forwardsDistances, heuristic);
    const backwardsComparator = generateAStarComparator(start, backwardsDistances, heuristic);
    const forwardsQueue = new PriorityQueue<Coord>(forwardsComparator);
    const backwardQueue = new PriorityQueue<Coord>(backwardsComparator);

    return genericBidirectionalSearch(forwardsQueue, backwardQueue, forwardsDistances, backwardsDistances, start, goal, weights, walls);
}

export function bidirectionalRandom(start: Coord, goal: Coord, walls: boolean[][], weights: number[][], heuristic: string) {
    const forwardsDistances = new HashMap<Coord, number>();
    const backwardsDistances = new HashMap<Coord, number>();
    const comparator = generateRandomComparator();
    const forwardsQueue = new PriorityQueue<Coord>(comparator);
    const backwardQueue = new PriorityQueue<Coord>(comparator);

    return genericBidirectionalSearch(forwardsQueue, backwardQueue, forwardsDistances, backwardsDistances, start, goal, weights, walls);
}
