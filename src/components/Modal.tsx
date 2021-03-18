import React, { useState } from "react"

interface Props {
    isVisible: boolean
    hide: () => void
}

export const Modal = ({ isVisible, hide }: Props) => {
    const [currentModal, setModal] = useState(0);

    const visibility = isVisible ? "visible" : "hidden";

    const modals = [
        <div className="tutorial-modal">
            <h1 className="heading">Pathfinding Visualiser</h1>
            <p className="sub-heading">This tutorial will explain what this app is and walk you through the features</p>
            <p className="modal-text">You can jump in immediately by pressing "skip tutorial", or click "next" to access the next
                portion of the tutorial</p>

            <img id="graph-image" className="modal-image" src="assets/graph.svg" />
            <button className="finish-tutorial modal-button" onClick={hide}>Skip Tutorial</button>
            <button className="next-page modal-button" onClick={nextPage}>Next</button>
        </div>,

        <div className="tutorial-modal">
            <h1 className="heading">What's a pathfinding algorithm exactly?</h1>
            <p className="sub-heading">A pathfinding algorithm is an algorithm that tries to find a path between two points
            </p>
            <p className="modal-text">For instance, when you use Google maps and want to find a route between two places you're using a
                pathfinding algorithm</p>
            <p className="modal-text">This app aims to demonstrate the process of how these algorithms actually go about finding this route</p>
            <p className="modal-text">To demonstrate the algorithms I've used a grid whose tiles light up to show what the algorithm is doing
                at any point in time</p>
            <p className="modal-text">You can add in walls that the algorithm can't cross to see how the algorithms will react</p>

            <button className="finish-tutorial modal-button" onClick={hide}>Skip Tutorial</button>
            <button className="previous-page modal-button" onClick={prevPage}>Previous</button>
            <button className="next-page modal-button" onClick={nextPage}>Next</button>
        </div>,

        <div className="tutorial-modal">
            <h1 className="heading">What makes the algorithms different?</h1>
            <p className="modal-text">All of the algorithms have a different way of going about their job, and they all have different goals
                they want to achieve</p>
            <p className="modal-text">Some algorithms only care about finding a path. They'll take the first path they find no matter how long
                winded the path may be</p>
            <p className="modal-text">Others are designed to always find the shortest path. They don't tend to find the path as fast, but they
                can guarantee that there's no other path that's shorter than theirs</p>
            <p className="modal-text">Some algorithms are what's known as "weighted", and some are "unweighted". We'll get into what this means
                on the next page</p>

            <button className="finish-tutorial modal-button" onClick={hide}>Skip Tutorial</button>
            <button className="previous-page modal-button" onClick={prevPage}>Previous</button>
            <button className="next-page modal-button" onClick={nextPage}>Next</button>
        </div>,

        <div className="tutorial-modal">
            <h1 className="heading">Weighted vs Unweighted</h1>
            <p className="modal-text">When you're exploring the world not all roads are created equal</p>
            <p className="modal-text">Some are smooth and easy to drive on, while some are bumpy and full of potholes</p>
            <p className="modal-text">So what seems like the shortest path might not actually be the shortest path if we have to cross a bunch
                of badly paved roads</p>
            <p className="modal-text">To model this, we can assign a tile a weight which tells us how much it costs to cross it</p>
            <p className="modal-text">To find the shortest path, some algorithms will try to minimise the total cost. Algorithms that do this
                are weighted</p>
            <p className="modal-text">However some algorithms simply ignore these weights. These algorithms are unweighted</p>

            <button className="finish-tutorial modal-button" onClick={hide}>Skip Tutorial</button>
            <button className="previous-page modal-button" onClick={prevPage}>Previous</button>
            <button className="next-page modal-button" onClick={nextPage}>Next</button>
        </div>,

        <div className="tutorial-modal">
            <h1 className="heading">Heuristics</h1>
            <p className="modal-text">A* and Greedy Best First Search both use something called heuristics to find their path faster</p>
            <p className="modal-text">This is essentially where we give an algorithm a bias in favour of tiles that are near the goal</p>
            <p className="modal-text">So when considering which tiles to go to next, the algorithms are more likely to pick ones nearer to the
                goal</p>
            <p className="modal-text">In the dropdown menu, you can select different ways of calculating the distance from the goal</p>
            <p className="modal-text">Depending on which one you pick, the algorithms will behave differently</p>
            <p className="modal-text">Note that this only has an effect for A*, Bidirectional A*, Greedy Best First Search and Bidirectional
                GBFS</p>

            <button className="finish-tutorial modal-button" onClick={hide}>Skip Tutorial</button>
            <button className="previous-page modal-button" onClick={prevPage}>Previous</button>
            <button className="next-page modal-button" onClick={nextPage}>Next</button>
        </div>,

        <div className="tutorial-modal">
            <h1 className="heading">Drawing Walls and Weights</h1>
            <p className="modal-text">You can draw walls and weights on the grid to see how the algorithms react to them</p>
            <p className="modal-text">To do this simply drag your mouse along the grid and it'll smoothly draw across it</p>
            <p className="modal-text">You can configure which one you want to draw using the menu at the top of the screen</p>

            <img className="modal-image" src="assets/walls.png" />
            <button className="finish-tutorial modal-button" onClick={hide}>Skip Tutorial</button>
            <button className="previous-page modal-button" onClick={prevPage}>Previous</button>
            <button className="next-page modal-button" onClick={nextPage}>Next</button>
        </div>,

        <div className="tutorial-modal">
            <h1 className="heading">Moving start and goal tiles</h1>
            <p className="modal-text">To move a start or goal tile, simply drag and drop it onto an empty tile</p>

            <img className="modal-image" src="assets/moveTile.png" />
            <button className="finish-tutorial modal-button" onClick={hide}>Skip Tutorial</button>
            <button className="previous-page modal-button" onClick={prevPage}>Previous</button>
            <button className="next-page modal-button" onClick={nextPage}>Next</button>
        </div>,

        <div className="tutorial-modal">
            <h1 className="heading">Maze Generation</h1>
            <p className="modal-text">You don't have to draw walls and weights manually</p>
            <p className="modal-text">If you select an item from the dropdown menu under "wall patterns" it will generate a maze of walls or
                weights automatically</p>

            <img className="modal-image" src="assets/maze.png" />
            <button className="finish-tutorial modal-button" onClick={hide}>Skip Tutorial</button>
            <button className="previous-page modal-button" onClick={prevPage}>Previous</button>
            <button className="next-page modal-button" onClick={nextPage}>Next</button>
        </div>,

        <div className="tutorial-modal">
            <h1 className="heading">Running an Algorithm</h1>
            <p className="modal-text">Simply select an algorithm from the dropdown menu at the top left corner and click "run algorithm" at the
                top right corner</p>

            <img className="modal-image" src="assets/runAlgo.png" />
            <button className="finish-tutorial modal-button" onClick={hide}>Skip Tutorial</button>
            <button className="previous-page modal-button" onClick={prevPage}>Previous</button>
            <button className="next-page modal-button" onClick={nextPage}>Next</button>
        </div>,

        <div className="tutorial-modal">
            <h1 className="heading">Enjoy!</h1>
            <p className="modal-text">That's all folks! If you enjoyed you can check out the source code on GitHub by clicking on the image
                below</p>

            <a href="https://github.com/MarkLee7916/Pathfinding-Visualiser-React">
                <img className="modal-image" src="assets/code.png" />
            </a>
            <button className="finish-tutorial modal-button" onClick={hide}>Skip Tutorial</button>
            <button className="previous-page modal-button" onClick={prevPage}>Previous</button>
            <button id="finish-final-modal" className="modal-button" onClick={hide}>Done</button>
        </div>
    ];

    function nextPage() {
        setModal(currentModal => currentModal + 1);
    }

    function prevPage() {
        setModal(currentModal => currentModal - 1);
    }

    return (
        <div id="modal-container" style={{ visibility: visibility }}>
            {modals[currentModal]}
        </div>
    )
}