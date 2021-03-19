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
            <p className="modal-text">If you select an item from the dropdown menu under "Random Maze" and then click
            "Generate Grid Pattern" it will generate a maze of walls or weights automatically</p>

            <img className="modal-image" src="assets/maze.png" />
            <button className="finish-tutorial modal-button" onClick={hide}>Skip Tutorial</button>
            <button className="previous-page modal-button" onClick={prevPage}>Previous</button>
            <button className="next-page modal-button" onClick={nextPage}>Next</button>
        </div>,

        <div className="tutorial-modal">
            <h1 className="heading">Automatic Path Rerendering</h1>
            <p className="modal-text">Once a path has been rendered, you can move the start or goal tiles to have it instantly rerender</p>

            <img className="modal-image" src="assets/beforeDrag.png" />
            <img className="modal-image" src="assets/afterDrag.png" />
            <button className="finish-tutorial modal-button" onClick={hide}>Skip Tutorial</button>
            <button className="previous-page modal-button" onClick={prevPage}>Previous</button>
            <button className="next-page modal-button" onClick={nextPage}>Next</button>
        </div>,

        <div className="tutorial-modal">
            <h1 className="heading">Running an Algorithm</h1>
            <p className="modal-text">Simply select an algorithm from the dropdown menu at the top left corner and click "run algorithm"</p>

            <img className="modal-image" src="assets/runAlgo.png" />
            <button className="finish-tutorial modal-button" onClick={hide}>Skip Tutorial</button>
            <button className="previous-page modal-button" onClick={prevPage}>Previous</button>
            <button className="next-page modal-button" onClick={nextPage}>Next</button>
        </div>,

        <div className="tutorial-modal">
            <h1 className="heading">Enjoy!</h1>
            <p className="modal-text">That's all folks! If you enjoyed you can check out the source code on 
            <a href="https://github.com/MarkLee7916/Pathfinding-Visualiser-React"> GitHub</a></p>

            <img className="modal-image" src="assets/code.png" />

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