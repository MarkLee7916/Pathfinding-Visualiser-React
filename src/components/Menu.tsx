import React from "react";

interface Props {
    updateTilePlacementType: (tilePlacementType: string) => void
    updatePathAlgo: (algo: string) => void
    updateHeuristic: (heuristic: string) => void
    updateGridPattern: (pattern: string) => void
    updateNeighboursGenerated: (type: string) => void
    runAlgorithm: () => Promise<void>
    generateGridPattern: () => void
    clearWallsAndWeights: () => void
    clearSearch: () => void
    pathAlgo: string
    running: boolean
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

export const Menu = ({
    updateTilePlacementType,
    updatePathAlgo,
    updateHeuristic,
    updateGridPattern,
    updateNeighboursGenerated,
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

    function handleUpdateNeighboursGenerated(event) {
        updateNeighboursGenerated(event.target.value);
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
                            <option value="hill-climbing">Hill Climbing</option>
                            <option value="two-beam">Two Beam Search</option>
                            <option value="three-beam">Three Beam Search</option>
                        </select>

                        <select id="heuristic-type" className="menu-button" onChange={handleUpdateHeuristic}>
                            <option value="manhattan">Manhattan Heuristic</option>
                            <option value="chebyshev">Chebyshev Heuristic</option>
                            <option value="euclidean">Euclidean Heuristic</option>
                        </select>

                        <select id="block-type" className="menu-button" onChange={handleUpdateTilePlacementType}>
                            <option value="wall">Add Walls</option>
                            <option value="weight">Add Weights</option>
                        </select>

                        <select id="neighbours" className="menu-button" onChange={handleUpdateNeighboursGenerated}>
                            <option value="non-diagonals">Non Diagonals Only</option>
                            <option value="diagonals">Diagonals Only</option>
                            <option value="both">All Directions</option>
                        </select>

                        <select id="wall-pattern" className="menu-button" onChange={handleUpdateGridPattern}>
                            <option value="random-maze">Random Maze</option>
                            <option value="divide-horizontal">Divide Horizontal</option>
                            <option value="divide-vertical">Divide Vertical</option>
                        </select>

                        <button className="menu-button"
                            id="generate-wall-pattern"
                            onClick={generateGridPattern}
                            style={{ visibility: runVisibility }}>
                            Generate Grid Pattern
                        </button>

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