import React, { useEffect, useRef, useState } from "react";
import { divideHorizontal, divideVertical, randomMaze } from "../algorithms/mazeAlgorithms";
import { breadthFirstSearch, Algorithm, depthFirstSearch, bestFirstSearch, dijkstra, aStar, randomSearch, bidirectionalBFS, bidirectionalDFS, bidirectionalGBFS, bidirectionalDijkstra, bidirectionalAStar, bidirectionalRandom, hillClimbing, twoBeamSearch, threeBeamSearch } from "../algorithms/pathfindingAlgorithms";
import { Coord, initialseGridWith, HEIGHT, isSameCoord, TileFrame, WIDTH, generateDiagonalNeighbours, generateNonDiagonalNeighbours, generateAllNeighbours, GenNeighbours } from "../data-structures/grid";
import { deepCopy, randomIntBetween, wait } from "../utils";
import { Grid } from "./Grid";
import { INITIAL_DELAY, Menu } from "./Menu";
import { Modal } from "./Modal";

const MODAL_REDISPLAY_DELAY = 100000;

export const PathfindingVisualiser = () => {
    // A reference to the delay that can be updated while animation is running
    const delayRef = useRef(INITIAL_DELAY);

    // True iff walls or weights have changed. Used to batch recomputation of animations
    const hasGridChangedRef = useRef(false);

    // A list of all the precomputed animations for the current algorithm config
    const gridFrames = useRef([initialseGridWith(TileFrame.Blank)]);

    // An index into the grid frames that controls which frame is currently being displayed
    const [frameIndex, setFrameIndex] = useState(0);

    // Coordinate of starting tile that we search from
    const [start, setStart] = useState({ row: 1, col: 1 });

    // Coordinate of goal tile that we're aiming to find a path to
    const [goal, setGoal] = useState({ row: HEIGHT - 2, col: WIDTH - 2 });

    // A grid of weights that define the cost of moving to a tile
    const [weights, setWeights] = useState(initialseGridWith(1));

    // A grid of walls that act as obstacles to the pathfinding algorithms
    const [walls, setWalls] = useState(initialseGridWith(false));

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

    // True if user is currently holding their mouse down, otherwise false
    const [isMouseDown, setMouseDown] = useState(false);

    // True if modal is currently displayed on the screen, otherwise false
    const [isModalVisible, setModalVisibility] = useState(getModalVisibilityFromUserHistory());

    // True if an animation is currently in the process of being shown on screen, otherwise false
    const [isAnimationRunning, setAlgorithmRunning] = useState(false);

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

    // Whenever use4 updates state, clear search and mark algorithm for updating
    useEffect(() => {
        clearSearch();
        hasGridChangedRef.current = true;
    }, [walls, weights, neighboursGenerated, start, goal, heuristic, pathAlgo]);

    // Clear search whenever the algorithm is recomputed
    useEffect(() => {
        clearSearch();
    }, [gridFrames])

    // Upon start, initialise event listeners and cache data visited
    useEffect(() => {
        const currDateStr = JSON.stringify(new Date().getTime());

        window.addEventListener("resize", () => location.reload());
        window.addEventListener("error", () => location.reload());
        window.addEventListener("beforeunload", () => localStorage.setItem("lastvisit", currDateStr));

        recomputeGridFrames()
    }, []);

    // Automatically cycle through the current grid frames, hiding the menu
    async function animateAlgorithm() {
        recomputeGridFrames();
        setAlgorithmRunning(true);

        for (let i = 0; i < gridFrames.current.length; i++) {
            await wait(delayRef.current);

            setFrameIndex(i);
        }

        setAlgorithmRunning(false);
    }

    // Rerun the algorithm with the current state and update the gridFrames
    function recomputeGridFrames() {
        const algorithm = stringToAlgorithm.get(pathAlgo);
        const frames = algorithm(start, goal, walls, neighboursGeneratedToFunction.get(neighboursGenerated), weights, heuristic);

        hasGridChangedRef.current = false;
        gridFrames.current = frames;
    }

    // Return true if user hasn't been on site in a while, otherwise return false
    function getModalVisibilityFromUserHistory() {
        const lastDateVisitedStr = localStorage.getItem("lastvisit");

        if (lastDateVisitedStr === null) {
            return true;
        } else {
            const lastDateVisited = JSON.parse(lastDateVisitedStr);
            const currentDate = new Date().getTime();

            return currentDate - lastDateVisited > MODAL_REDISPLAY_DELAY;
        }
    }

    function toggleWeightAt(pos: Coord) {
        if (!isSameCoord(start, pos) && !isSameCoord(goal, pos) && !isAnimationRunning) {
            setWeights(weights => {
                const weightsCopy = deepCopy(weights);

                if (weightsCopy[pos.row][pos.col] === 1) {
                    weightsCopy[pos.row][pos.col] = randomIntBetween(10, 100);
                } else {
                    weightsCopy[pos.row][pos.col] = 1;
                }

                return weightsCopy;
            });
        }
    }

    function toggleWallAt(pos: Coord) {
        if (!isSameCoord(start, pos) && !isSameCoord(goal, pos) && !isAnimationRunning) {
            setWalls(walls => {
                const wallsCopy = deepCopy(walls);

                wallsCopy[pos.row][pos.col] = !wallsCopy[pos.row][pos.col];

                return wallsCopy;
            });
        }
    }

    // Place either a wall or a weight at the given tile depending on what user has selected
    function placeAtTile(row: number, col: number) {
        const placingFunction = tilePlacementTypeToFunction.get(tilePlacementType);

        placingFunction({ row: row, col: col });
    }

    // Deal with the user dropping a tile onto another one i.e moving the start or goal tile
    function handleDrop(targetRow: number, targetCol: number, tileFrame: TileFrame) {
        const target = { row: targetRow, col: targetCol };

        if (!isAnimationRunning && !isSameCoord(start, target) && !isSameCoord(goal, target) && !walls[targetRow][targetCol]) {
            if (tileFrame === TileFrame.Start) {
                setStart(target);
            } else if (tileFrame === TileFrame.Goal) {
                setGoal(target);
            }
        }

        setMouseDown(false);
    }

    function clearSearch() {
        setFrameIndex(0);
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

    function handleShowTutorial() {
        setModalVisibility(true);
    }

    function handleUpdateDelayRef(delay: string) {
        delayRef.current = parseInt(delay);
    }

    // Update the current frame in the animation that we're on
    function handleUpdateFrameIndex(index: string) {
        if (hasGridChangedRef.current) {
            recomputeGridFrames();
        } else if (!isAnimationRunning) {
            setFrameIndex(parseInt(index));
        }
    }

    return (
        <>
            <div id="main-content"
                style={{ opacity: isModalVisible ? "0.1" : "1" }}
                onMouseDown={() => setMouseDown(true)}
                onMouseUp={() => setMouseDown(false)}
            >
                <Menu
                    updateTilePlacementType={handleUpdateTilePlacementType}
                    updatePathAlgo={handleUpdatePathAlgo}
                    updateHeuristic={handleUpdateHeuristic}
                    updateGridPattern={handleUpdateGridPattern}
                    updateNeighboursGenerated={handleUpdateNeighboursGenerated}
                    updateDelayRef={handleUpdateDelayRef}
                    updateFrameIndex={handleUpdateFrameIndex}
                    showTutorial={handleShowTutorial}
                    frameIndex={frameIndex}
                    runAlgorithm={animateAlgorithm}
                    generateGridPattern={generateGridPattern}
                    clearWallsAndWeights={clearWallsAndWeights}
                    clearSearch={clearSearch}
                    pathAlgo={pathAlgo}
                    running={isAnimationRunning}
                    animationSize={gridFrames.current.length}
                />
                <Grid
                    start={start}
                    goal={goal}
                    gridFrame={gridFrames.current[frameIndex < gridFrames.current.length ? frameIndex : 0]}
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



