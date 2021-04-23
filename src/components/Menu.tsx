import React, { useState } from "react";
import { Dropdown } from "./Dropdown";

interface Props {
    updateTilePlacementType: (tilePlacementType: string) => void
    updatePathAlgo: (algo: string) => void
    updateHeuristic: (heuristic: string) => void
    updateGridPattern: (pattern: string) => void
    updateNeighboursGenerated: (type: string) => void
    updateDelayRef: (delay: string) => void
    updateFrameIndex: (index: string) => void
    frameIndex: number
    runAlgorithm: () => Promise<void>
    generateGridPattern: () => void
    clearWallsAndWeights: () => void
    clearSearch: () => void
    pathAlgo: string
    running: boolean
    animationSize: number
}

// Map an algorithm onto its description
const pathAlgoDescriptions = new Map([
    ["best-first-search", "GBFS always takes the tile with the lowest estimated distance to the goal"],
    ["a-star", "A* always takes the tile with the lowest value of (weighted distance from start + estimated distance to the goal)"],
    ["depth-first-search", "DFS always considers the most recent tile it's seen, keeping track of not yet considered tiles using a stack"],
    ["breadth-first-search", "BFS always considers the least recent tile it's seen, keeping track of not yet considered tiles using a queue"],
    ["dijkstra", "Dijkstra's always takes the tile with the lowest weighted distance from the start"],
    ["bidirectional-BFS", "Breadth first search running concurrently from both the start and goal tiles"],
    ["bidirectional-DFS", "Depth first search running concurrently from both the start and goal tiles"],
    ["bidirectional-GBFS", "Greedy best first search running concurrently from both the start and goal tiles"],
    ["bidirectional-dijkstra", "Dijkstra's running concurrently from both the start and goal tiles"],
    ["bidirectional-a-star", "A* search running concurrently from both the start and goal tiles"],
    ["random", "Random search searches the grid randomly without any purpose"],
    ["bidirectional-random", "Random search running concurrently from both the start and goal tiles"],
    ["iddfs", "Repeats a depth first search to a limited depth, and increments the limit until it reaches the goal"],
    ["hill-climbing", "Repeatedly takes the tile with lowest estimated distance to the goal and stops when there's no adjacent tile with a lower estimate"],
    ["two-beam", "Like a greedy best first search, but it only keeps the two adjacent tiles with the smallest estimated distances for every tile it visits"],
    ["three-beam", "Like a greedy best first search, but it only keeps the three adjacent tiles with the smallest estimated distances for every tile it visits"]
]);

export const INITIAL_DELAY = 50;

export const Menu = ({
    updateTilePlacementType,
    updatePathAlgo,
    updateHeuristic,
    updateGridPattern,
    updateNeighboursGenerated,
    updateDelayRef,
    updateFrameIndex,
    frameIndex,
    runAlgorithm,
    generateGridPattern,
    clearWallsAndWeights,
    clearSearch,
    pathAlgo,
    running,
    animationSize
}: Props) => {
    // Keep track of delay so we can render it on the screen
    const [delay, setDelay] = useState(INITIAL_DELAY);

    // Some elements in menu are hidden when algorithm is running
    const menuVisibilityRunning = running ? "hidden" : "visible";

    function handleUpdateAlgo(event) {
        updatePathAlgo(event.target.value);
    }

    function handleUpdateHeuristic(event) {
        updateHeuristic(event.target.value);
    }

    function handleUpdateTilePlacementType(event) {
        updateTilePlacementType(event.target.value);
    }

    function handleUpdateGridPattern(event) {
        updateGridPattern(event.target.value);
    }

    function handleUpdateNeighboursGenerated(event) {
        updateNeighboursGenerated(event.target.value);
    }

    function handleUpdateDelay(event) {
        const newDelay = event.target.value;

        setDelay(newDelay);
        updateDelayRef(newDelay);
    }

    function handleUpdateFrameIndex(event) {
        updateFrameIndex(event.target.value);
    }

    return (
        <>
            <header>
                <nav>
                    <ul id="navmenu" style={{ visibility: menuVisibilityRunning }}>
                        <Dropdown
                            callback={handleUpdateAlgo}
                            displays={[
                                "A*",
                                "Greedy Best First Search",
                                "Depth First Search",
                                "Breadth First Search",
                                "Dijkstra's",
                                "Random Search",
                                "Bidirectional A*",
                                "Bidirectional GBFS",
                                "Bidirectional DFS",
                                "Bidirectional BFS",
                                "Bidirectional Dijkstra's",
                                "Bidirectional Random",
                                "Hill Climbing",
                                "Two Beam Search",
                                "Three Beam Search"
                            ]}
                            values={[
                                "a-star",
                                "best-first-search",
                                "depth-first-search",
                                "breadth-first-search",
                                "dijkstra",
                                "random",
                                "bidirectional-a-star",
                                "bidirectional-GBFS",
                                "bidirectional-DFS",
                                "bidirectional-BFS",
                                "bidirectional-dijkstra",
                                "bidirectional-random",
                                "hill-climbing",
                                "two-beam",
                                "three-beam"
                            ]}
                            description={
                                "The algorithm that tries to find the path"
                            }
                        />

                        <Dropdown
                            callback={handleUpdateHeuristic}
                            displays={[
                                "Manhattan Heuristic",
                                "Chebyshev Heuristic",
                                "Euclidean Heuristic",
                            ]}
                            values={["manhattan", "chebyshev", "euclidean"]}
                            description={
                                "The method that our algorithms are using to estimate the distance to the goal in the grid"
                            }
                        />

                        <Dropdown
                            callback={handleUpdateTilePlacementType}
                            displays={["Add Walls", "Add Weights"]}
                            values={["wall", "weight"]}
                            description={
                                "The type of barrier to set for the algorithm. Walls block the algorithm from passing completely, while weights make weighted algorithms view the barrier as costly to pass, making them less likely to use a route through it"
                            }
                        />

                        <Dropdown
                            callback={handleUpdateNeighboursGenerated}
                            displays={[
                                "Non Diagonals Only",
                                "Diagonals Only",
                                "All directions",
                            ]}
                            values={["non-diagonals", "diagonals", "both"]}
                            description={
                                "The directions we allow an algorithm to expand into when searching"
                            }
                        />

                        <Dropdown
                            callback={handleUpdateGridPattern}
                            displays={[
                                "Random Maze",
                                "Divide Horizontal",
                                "Divide Vertical",
                            ]}
                            values={[
                                "random-maze",
                                "divide-horizontal",
                                "divide-vertical",
                            ]}
                            description={
                                "The type of grid pattern we'd like to generate"
                            }
                        />

                        <button className="menu-button" onClick={generateGridPattern}>
                            Generate Grid Pattern
                        </button>

                        <button className="menu-button" onClick={clearWallsAndWeights}>
                            Reset Walls and Weights
                        </button>

                        <button className="menu-button" onClick={clearSearch}>
                            Reset Search
                        </button>

                        <button className="menu-button" onClick={runAlgorithm}>
                            Run Animation
                        </button>
                    </ul>
                </nav>
            </header>

            <ul id="slidermenu">
                <div className="slider-container">
                    <input type="range" onChange={handleUpdateDelay} />
                    <span>Animation Delay: {delay}ms</span>
                </div>

                <div className="slider-container">
                    <input type="range" onChange={handleUpdateFrameIndex} value={frameIndex} max={animationSize - 1} />
                    <span>Step through animations</span>
                </div>
            </ul>

            <div id="description">
                {pathAlgoDescriptions.get(pathAlgo)}
            </div>
        </>
    )
}