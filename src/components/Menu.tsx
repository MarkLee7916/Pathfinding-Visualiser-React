import React from "react";

interface Props {
    updateTilePlacementType: (tilePlacementType: string) => void
    updatePathAlgo: (algo: string) => void
    updateHeuristic: (heuristic: string) => void
    updateGridPattern: (pattern: string) => void
    runAlgorithm: () => Promise<void>
    generateGridPattern: () => void
    clearWallsAndWeights: () => void
    clearSearch: () => void
    pathAlgo: string
    running: boolean
}

// Map an algorithm onto its description
const pathAlgoDescriptions = new Map([
    ["best-first-search", "Best first search is entirely heuristic based, so is unweighted and doesn't guarantee the shortest path"],
    ["a-star", "A* combines heuristics and lowest weight path, so guarantees the shortest path if our heuristic doesn't overestimate the distance"],
    ["depth-first-search", "DFS always considers the most recent node it's seen, so is unweighted and doesn't guarantee shortest path"],
    ["breadth-first-search", "BFS always considers the least recent node it's seen, so is unweighted and guarantees shortest path"],
    ["dijkstra", "Dijkstra's always considers the lowest weight nodes, so is weighted and guarantees the shortest path"],
    ["bidirectional-BFS", "Bidirectional BFS does a BFS from both directions, so is unweighted and guarantees the shortest path"],
    ["bidirectional-DFS", "Bidirectional DFS does a DFS from both directions, so is unweighted and doesn't guarantee shortest path"],
    ["bidirectional-GBFS", "Bidirectional GBFS runs from both directions, so is unweighted and doesn't guarantee the shortest path"],
    ["bidirectional-dijkstra", "Bidirectional Dijkstra's runs from both directions, so is weighted and guarantees the shortest path"],
    ["bidirectional-a-star", "Bidirectional A* is weighted and guarantees the shortest path if our heuristic doesn't overestimate the distance"],
    ["random", "Random search searches the grid randomly without any purpose, so is unweighted and guarantees nothing"],
    ["bidirectional-random", "Random search running concurrently from both the start and goal nodes"]
]);


export const Menu = ({
  updateTilePlacementType,
  updatePathAlgo,
  updateHeuristic,
  updateGridPattern,
  runAlgorithm,
  generateGridPattern,
  clearWallsAndWeights,
  clearSearch,
  pathAlgo,
  running,
}: Props) => {
    // Some elements in menu are hidden when algorithm is running
    const runVisibility = running ? "hidden" : "visible";

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

    return (
        <>
            <header>
                <nav>
                    <ul id="menu">
                        <select id="select-algo" className="menu-button" onChange={handleUpdateAlgo}>
                            <option value="a-star">A*</option>
                            <option value="best-first-search">Greedy Best First Search</option>
                            <option value="depth-first-search">Depth First Search</option>
                            <option value="breadth-first-search">Breadth First Search</option>
                            <option value="dijkstra">Dijkstra's</option>
                            <option value="random">Random Search</option>
                            <option value="bidirectional-a-star">Bidirectional A*</option>
                            <option value="bidirectional-GBFS">Bidirectional GBFS</option>
                            <option value="bidirectional-DFS">Bidirectional DFS</option>
                            <option value="bidirectional-BFS">Bidirectional BFS</option>
                            <option value="bidirectional-dijkstra">Bidirectional Dijkstra's</option>
                            <option value="bidirectional-random">Bidirectional Random</option>
                        </select>

                        <select id="wall-pattern" className="menu-button" onChange={handleUpdateGridPattern}>
                            <option value="random-maze">Random Maze</option>
                            <option value="divide-horizontal">Divide Horizontal</option>
                            <option value="divide-vertical">Divide Vertical</option>
                        </select>

                        <select id="block-type" className="menu-button" onChange={handleUpdateTilePlacementType}>
                            <option value="wall">Add Walls</option>
                            <option value="weight">Add Weights</option>
                        </select>

                        <select id="heuristic-type" className="menu-button" onChange={handleUpdateHeuristic}>
                            <option value="manhattan">Manhattan Heuristic</option>
                            <option value="chebyshev">Chebyshev Heuristic</option>
                            <option value="euclidean">Euclidean Heuristic</option>
                        </select>

                        <button className="menu-button"
                            id="reset-walls"
                            onClick={clearWallsAndWeights}
                            style={{ visibility: runVisibility }}>
                            Reset Walls and Weights
                        </button>

                        <button className="menu-button"
                            id="reset-path"
                            onClick={clearSearch}
                            style={{ visibility: runVisibility }}>
                            Reset Search
                        </button>

                        <button className="menu-button"
                            id="generate-wall-pattern"
                            onClick={generateGridPattern}
                            style={{ visibility: runVisibility }}>
                            Generate Grid Pattern
                        </button>

                        <button className="menu-button"
                            id="run-algo"
                            onClick={runAlgorithm}
                            style={{ visibility: runVisibility }}>
                            Run Algorithm
                        </button>
                    </ul>
                </nav>
            </header>

            <span className="color-codes">🟥 Start</span>
            <span className="color-codes">🟧 Goal</span>
            <span className="color-codes">🟦 Searching</span>
            <span className="color-codes">🟩 Frontier</span>
            <span className="color-codes">⬜ Unvisited</span>
            <span className="color-codes">⬛ Wall</span>
            <span className="color-codes">🟨 Final Path</span>

            <div id="description">
                {pathAlgoDescriptions.get(pathAlgo)}
            </div>           
        </>
    )
}