import React, { useEffect, useState } from "react";
import { divideHorizontal, divideVertical, randomMaze } from "../algorithms/mazeAlgorithms";
import { breadthFirstSearch, Algorithm, depthFirstSearch, bestFirstSearch, dijkstra, aStar, randomSearch, bidirectionalBFS, bidirectionalDFS, bidirectionalGBFS, bidirectionalDijkstra, bidirectionalAStar, bidirectionalRandom } from "../algorithms/pathfindingAlgorithms";
import { Coord, initialseGridWith, HEIGHT, isSameCoord, TileFrame, WIDTH } from "../data-structures/grid";
import { deepCopy, randomIntBetween, wait } from "../utils";
import { Grid } from "./Grid";
import { Menu } from "./Menu";
import { Modal } from "./Modal";

export const PathfindingVisualiser = () => {
    const [start, setStart] = useState({ row: 1, col: 1 });
    const [goal, setGoal] = useState({ row: HEIGHT - 2, col: WIDTH - 2 });

    const [weights, setWeights] = useState(initialseGridWith(1));
    const [walls, setWalls] = useState(initialseGridWith(false));
    const [gridFrame, setGridFrame] = useState(initialseGridWith(TileFrame.Blank));

    const [tilePlacementType, setTilePlacementType] = useState("wall");

    const [isMouseDown, setMouseDown] = useState(false);
    const [isModalVisible, setModalVisibility] = useState(true);
    const [running, setRunning] = useState(false);

    // Detect if user has their mouse held down
    useEffect(() => {
        document.addEventListener("mousedown", () => setMouseDown(true));
        document.addEventListener("mouseup", () => setMouseDown(false));
    }, []);

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
        ["bidirectional-random", bidirectionalRandom]
    ]);

    // Map a tile placements JSX representation onto its implementation
    const tilePlacementTypeToFunction = new Map<string, Function>([
        ["wall", toggleWallAt],
        ["weight", toggleWeightAt]
    ]);

    // Map a maxe generation algorithms JSX representation onto its implementation
    const tilePatternToFunction = new Map<string, Function>([
        ["random-maze", randomMaze],
        ["divide-horizontal", divideHorizontal],
        ["divide-vertical", divideVertical]
    ]);

    const DELAY = calculateDelay();

    const opacity = isModalVisible ? "0.1" : "1";

    async function animateAlgorithm(pathAlgo: string, heuristic: string) {
        const algorithm = stringToAlgorithm.get(pathAlgo);
        const frames = algorithm(start, goal, walls, weights, heuristic);

        setRunning(true);

        for (let i = 0; i < frames.length; i++) {
            await wait(DELAY);

            setGridFrame(frames[i]);
        }

        setRunning(false);
    }

    function calculateDelay() {
        const modifier = 2400;

        return modifier / (HEIGHT + WIDTH);
    }

    function toggleWeightAt(pos: Coord) {
        setWeights(weights => {
            const weightsCopy = deepCopy(weights);

            if (!isSameCoord(start, pos) && !isSameCoord(goal, pos) && !running) {
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

            if (!isSameCoord(start, pos) && !isSameCoord(goal, pos) && !running) {
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

        if (!running && !isSameCoord(start, target) && !isSameCoord(goal, target) && !walls[targetRow][targetCol]) {
            switch (tileFrame) {
                case TileFrame.Start:
                    setStart({ row: targetRow, col: targetCol });
                    break;
                case TileFrame.Goal:
                    setGoal({ row: targetRow, col: targetCol });
                    break;
                default:
                    throw `Tile type: ${tileFrame} not supported for drag and drop`;
            }
        }

        setMouseDown(false);
    }

    function clearSearch() {
        setGridFrame(initialseGridWith(TileFrame.Blank));
    }

    function clearWallsAndWeights() {
        setWeights(initialseGridWith(1));
        setWalls(initialseGridWith(false));
    }

    function updateTilePlacementType(tilePlacementType: string) {
        setTilePlacementType(tilePlacementType);
    }

    // Generate a maze with whatever tile placement type user has selected
    function generateGridPattern(tilePattern: string) {
        const gridPatternFunction = tilePatternToFunction.get(tilePattern);
        const placingFunction = tilePlacementTypeToFunction.get(tilePlacementType);

        clearWallsAndWeights();

        gridPatternFunction(placingFunction);
    }

    function handleHideModal() {
        setModalVisibility(false);
    }

    return (
        <>
            <div id="main-content" style={{ opacity: opacity }}>
                <Menu
                    runAlgorithm={animateAlgorithm}
                    generateGridPattern={generateGridPattern}
                    updateTilePlacementType={updateTilePlacementType}
                    clearWallsAndWeights={clearWallsAndWeights}
                    clearSearch={clearSearch}
                    running={running}
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