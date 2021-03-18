import { Coord } from "../data-structures/grid";
import { HashMap } from "../data-structures/hashmap";

type Heuristic = (goal: Coord) => (c1: Coord, c2: Coord) => number;

// Map a heuristics JSX representation onto its implementation 
export const stringToHeuristic = new Map<string, Heuristic>([
    ["manhattan", generateManhattanComparator],
    ["euclidean", generateEuclideanComparator],
    ["chebyshev", generateChebyshevComparator]
]);

// Return a comparator that compares by adding the distance from the starting tile and estimated distance from the goal
export function generateAStarComparator(goal: Coord, distances: HashMap<Coord, number>, heuristic: string) {
    return (c1: Coord, c2: Coord) => {
        const heuristicGenerator = stringToHeuristic.get(heuristic);
        const dijkstraComparison = generateDijkstraComparator(distances)(c1, c2);
        const heuristicComparison = heuristicGenerator(goal)(c1, c2);

        return dijkstraComparison + heuristicComparison;
    }
}

// Returns a comparator that compares using the distance from the starting tile
export function generateDijkstraComparator(distances: HashMap<Coord, number>) {
    return (c1: Coord, c2: Coord) =>
        distances.get(c2) - distances.get(c1);
}

// Returns a comparator that selects an item randomly
export function generateRandomComparator() {
    return (c1: Coord, c2: Coord) => Math.random() - 0.6;
}

// Given two coordinates (p1, p2) and (g1, g2), return comparator that compares using formula max(abs(p1 - g1), abs(p2 - g2))
function generateChebyshevComparator({ row: goalRow, col: goalCol }: Coord) {
    return ({ row: r1, col: c1 }: Coord, { row: r2, col: c2 }: Coord) =>
        Math.max(Math.abs(r2 - goalRow), Math.abs(c2 - goalCol)) - Math.max(Math.abs(r1 - goalRow), Math.abs(c1 - goalCol));

}

// Given two coordinates (p1, p2) and (g1, g2), return comparator that compares using formula sqrt((p1 - g1)^2 + abs(p2 - g2)^2)
function generateEuclideanComparator({ row: goalRow, col: goalCol }: Coord) {
    return ({ row: r1, col: c1 }: Coord, { row: r2, col: c2 }: Coord) => {
        const r1Dist = Math.sqrt(Math.pow(r1 - goalRow, 2) + Math.pow(c1 - goalCol, 2));
        const r2Dist = Math.sqrt(Math.pow(r2 - goalRow, 2) + Math.pow(c2 - goalCol, 2));

        return r2Dist - r1Dist;
    }
}

// Given two coordinates (p1, p2) and (g1, g2), return comparator that compares using formula abs(p1 - g1) + abs(p2 - g2) 
function generateManhattanComparator({ row: goalRow, col: goalCol }: Coord) {
    return ({ row: r1, col: c1 }: Coord, { row: r2, col: c2 }: Coord) =>
        (Math.abs(r2 - goalRow) + Math.abs(c2 - goalCol)) - (Math.abs(r1 - goalRow) + Math.abs(c1 - goalCol));

}

