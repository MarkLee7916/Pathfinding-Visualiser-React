import React, { useState } from "react";
import { divideHorizontal, divideVertical, randomMaze } from "../algorithms/mazeAlgorithms";
import { breadthFirstSearch, Algorithm, depthFirstSearch, bestFirstSearch, dijkstra, aStar, randomSearch, bidirectionalBFS, bidirectionalDFS, bidirectionalGBFS, bidirectionalDijkstra, bidirectionalAStar, bidirectionalRandom, hillClimbing, twoBeamSearch, threeBeamSearch } from "../algorithms/pathfindingAlgorithms";
import { Coord, initialseGridWith, HEIGHT, isSameCoord, TileFrame, WIDTH, generateDiagonalNeighbours, generateNonDiagonalNeighbours, generateAllNeighbours, GenNeighbours } from "../data-structures/grid";
import { deepCopy, randomIntBetween, wait } from "../utils";
import { Grid } from "./Grid";
import { Menu } from "./Menu";
import { Modal } from "./Modal";

export const PathfindingVisualiser = () => {
    // Coordinate of starting tile that we search from
    const [start, setStart] = useState({ row: 1, col: 1 });

    // Coordinate of goal tile that we're aiming to find a path to
    const [goal, setGoal] = useState({ row: HEIGHT - 2, col: WIDTH - 2 });

    // A grid of weights that define the cost of moving to a tile
    const [weights, setWeights] = useState(initialseGridWith(1));

    // A grid of walls that act as obstacles to the pathfinding algorithms
    const [walls, setWalls] = useState(initialseGridWith(false));

    // A grid of values that define a frame in a search animation
    const [gridFrame, setGridFrame] = useState(initialseGridWith(TileFrame.Blank));

    // The type of placement user currently has selected in the dropdown
    const [tilePlacementType, setTilePlacementType] = useState("wall");

    // The pathfinding algorithm user currently has selected in the dropdown
    const [pathAlgo, setPathAlgo] = useState("a-star");

    // The heuristic user currently has selected in the dropdown
    const [heuristic, setHeuristic] = useState("manhattan");

    // The grid pattern user currently has selected in the dropdown
    const [gridPattern, setGridPattern] = useState("random-maze");

    // The types of neighbours generated user currently has selected in the dropdown
    const [neighboursGenerated, setNeighboursGenerated] = useState("non-diagonals");

    const [isMouseDown, setMouseDown] = useState(false);

    const [isModalVisible, setModalVisibility] = useState(true);

    const [isAlgorithmRunning, setAlgorithmRunning] = useState(false);

    // Map an algorithms JSX representation onto its implementation
    const stringToAlgorithm = new Map<string, Algorithm>([
        ["breadth-first-search", breadthFirstSearch],
        ["depth-first-search", depthFirstSearch],
        ["best-first-search", bestFirstSearch],
        ["dijkstra", dijkstra],
        ["a-star", aStar],
        ["random", randomSearch],
        ["bidirectional-BFS", bidirectionalBFS],
        ["bidirectional-DFS", bidirectionalDFS],
        ["bidirectional-GBFS", bidirectionalGBFS],
        ["bidirectional-dijkstra", bidirectionalDijkstra],
        ["bidirectional-a-star", bidirectionalAStar],
        ["bidirectional-random", bidirectionalRandom],
        ["hill-climbing", hillClimbing],
        ["two-beam", twoBeamSearch],
        ["three-beam", threeBeamSearch]
    ]);

    // Map a tile placements JSX representation onto its implementation
    const tilePlacementTypeToFunction = new Map<string, Function>([
        ["wall", toggleWallAt],
        ["weight", toggleWeightAt]
    ]);

    // Map a maze generation algorithms JSX representation onto its implementation
    const tilePatternToFunction = new Map<string, Function>([
        ["random-maze", randomMaze],
        ["divide-horizontal", divideHorizontal],
        ["divide-vertical", divideVertical]
    ]);

    // Map a generate neighbours settings JSX representation onto its implementation
    const neighboursGeneratedToFunction = new Map<string, GenNeighbours>([
        ["diagonals", generateDiagonalNeighbours],
        ["non-diagonals", generateNonDiagonalNeighbours],
        ["both", generateAllNeighbours],
    ]);

    const DELAY = calculateDelay();

    const opacity = isModalVisible ? "0.1" : "1";

    async function animateAlgorithm() {
        const algorithm = stringToAlgorithm.get(pathAlgo);
        const frames = algorithm(start, goal, walls, neighboursGeneratedToFunction.get(neighboursGenerated), weights, heuristic);

        setAlgorithmRunning(true);

        for (let i = 0; i < frames.length; i++) {
            await wait(DELAY);

            setGridFrame(frames[i]);
        }

        setAlgorithmRunning(false);
    }

    function isDisplayingSearch() {
        return gridFrame.some(gridRow => gridRow.includes(TileFrame.Searching) || gridRow.includes(TileFrame.Path));
    }

    function calculateDelay() {
        const modifier = 2400;

        return modifier / (HEIGHT + WIDTH);
    }

    function toggleWeightAt(pos: Coord) {
        setWeights(weights => {
            const weightsCopy = deepCopy(weights);

            if (!isSameCoord(start, pos) && !isSameCoord(goal, pos) && !isAlgorithmRunning) {
                if (weightsCopy[pos.row][pos.col] === 1) {
                    weightsCopy[pos.row][pos.col] = randomIntBetween(10, 100);
                } else {
                    weightsCopy[pos.row][pos.col] = 1;
                }
            }

            return weightsCopy;
        });
    }

    function toggleWallAt(pos: Coord) {
        setWalls(walls => {
            const wallsCopy = deepCopy(walls);

            if (!isSameCoord(start, pos) && !isSameCoord(goal, pos) && !isAlgorithmRunning) {
                wallsCopy[pos.row][pos.col] = !wallsCopy[pos.row][pos.col];
            }

            return wallsCopy;
        });
    }

    // Place either a wall or a weight at the given tile depending on what user has selected
    function placeAtTile(row: number, col: number) {
        const placingFunction = tilePlacementTypeToFunction.get(tilePlacementType);

        placingFunction({ row: row, col: col });
    }

    // Deal with the user dropping a tile onto another one i.e moving the start or goal tile
    function handleDrop(targetRow: number, targetCol: number, tileFrame: TileFrame) {
        const target = { row: targetRow, col: targetCol };

        if (!isAlgorithmRunning && !isSameCoord(start, target) && !isSameCoord(goal, target) && !walls[targetRow][targetCol]) {
            if (tileFrame === TileFrame.Start) {
                setStart(target);
                handleAutomaticPathRefit(target, goal);
            } else if (tileFrame === TileFrame.Goal) {
                setGoal(target);
                handleAutomaticPathRefit(start, target);
            }
        }

        setMouseDown(false);
    }

    function handleAutomaticPathRefit(start: Coord, goal: Coord) {
        if (isDisplayingSearch()) {
            const algorithm = stringToAlgorithm.get(pathAlgo);
            const frames = algorithm(start, goal, walls, neighboursGeneratedToFunction.get(neighboursGenerated), weights, heuristic);

            setGridFrame(frames[frames.length - 1]);
        }
    }

    function clearSearch() {
        setGridFrame(initialseGridWith(TileFrame.Blank));
    }

    function clearWallsAndWeights() {
        setWeights(initialseGridWith(1));
        setWalls(initialseGridWith(false));
    }

    // Generate a maze with whatever tile placement type user has selected
    function generateGridPattern() {
        const gridPatternFunction = tilePatternToFunction.get(gridPattern);
        const placingFunction = tilePlacementTypeToFunction.get(tilePlacementType);

        clearWallsAndWeights();

        gridPatternFunction(placingFunction);
    }

    function handleHideModal() {
        setModalVisibility(false);
    }

    function handleUpdatePathAlgo(algo: string) {
        setPathAlgo(algo);
    }

    function handleUpdateHeuristic(heuristic: string) {
        setHeuristic(heuristic);
    }

    function handleUpdateGridPattern(pattern: string) {
        setGridPattern(pattern);
    }

    function handleUpdateTilePlacementType(type: string) {
        setTilePlacementType(type);
    }

    function handleUpdateNeighboursGenerated(type: string) {
        setNeighboursGenerated(type);
    }

    return (
        <>
            <div id="main-content"
                style={{ opacity: opacity }}
                onMouseDown={() => setMouseDown(true)}
                onMouseUp={() => setMouseDown(false)}
            >
                <Menu
                    updateTilePlacementType={handleUpdateTilePlacementType}
                    updatePathAlgo={handleUpdatePathAlgo}
                    updateHeuristic={handleUpdateHeuristic}
                    updateGridPattern={handleUpdateGridPattern}
                    updateNeighboursGenerated={handleUpdateNeighboursGenerated}
                    runAlgorithm={animateAlgorithm}
                    generateGridPattern={generateGridPattern}
                    clearWallsAndWeights={clearWallsAndWeights}
                    clearSearch={clearSearch}
                    pathAlgo={pathAlgo}
                    running={isAlgorithmRunning}
                />
                <Grid
                    start={start}
                    goal={goal}
                    gridFrame={gridFrame}
                    weights={weights}
                    walls={walls}
                    notifyClicked={placeAtTile}
                    notifyDrop={handleDrop}
                    isMouseDown={isMouseDown}
                />
            </div>
            <Modal
                isVisible={isModalVisible}
                hide={handleHideModal}
            />
        </>
    )
}

