import React from "react";
import { TileFrame } from "../data-structures/grid";

interface Props {
    isStart: boolean
    isGoal: boolean
    isWall: boolean
    tileFrame: TileFrame
    weight: number
    row: number
    col: number
    notifyClicked: (row: number, col: number) => void
    notifyDrop: (row: number, col: number, tileFrame: TileFrame) => void;
    isMouseDown: boolean
}

export const Tile = ({ isStart, isGoal, isWall, tileFrame, weight, row, col, notifyClicked, notifyDrop, isMouseDown }: Props) => {
    const tileTypeToBackgroundColor = new Map<TileFrame, string>([
        [TileFrame.Blank, "rgb(255, 255, 255)"],
        [TileFrame.Wall, "rgb(128, 128, 128)"],
        [TileFrame.Frontier, "rgb(115, 240, 161)"],
        [TileFrame.Goal, "rgb(235, 145, 9)"],
        [TileFrame.Searching, "rgb(3, 148, 252)"],
        [TileFrame.Path, "rgb(245, 209, 66)"],
        [TileFrame.Start, "rgb(255, 80, 80)"]
    ]);

    // Only display a tiles weight if it's greater than 1
    const weightDisplay = weight === 1 ? "" : weight.toString();

    const tileBackgroundColor = getTileBackgroundColor();

    function getTileBackgroundColor() {
        if (isStart) {
            return tileTypeToBackgroundColor.get(TileFrame.Start);
        } else if (isGoal) {
            return tileTypeToBackgroundColor.get(TileFrame.Goal);
        } else if (isWall) {
            return tileTypeToBackgroundColor.get(TileFrame.Wall);
        } else {
            return tileTypeToBackgroundColor.get(tileFrame);
        }
    }

    function handleMouseOver() {
        if (isMouseDown) {
            notifyClicked(row, col);
        }
    }

    // When user drags a tile, save it for when they drop it
    function handleDragStart(event) {
        if (isStart) {
            event.dataTransfer.setData("draggedFrom", JSON.stringify(TileFrame.Start));
        } else if (isGoal) {
            event.dataTransfer.setData("draggedFrom", JSON.stringify(TileFrame.Goal));
        } else {
            event.preventDefault();
        }
    }

    // When user drops, notify PathfindingVisualiser component 
    function handleDrop(event) {
        notifyDrop(row, col, JSON.parse(event.dataTransfer.getData("draggedFrom")));
    }

    return (
        <td className="tile"
            style={{ backgroundColor: tileBackgroundColor }}
            onMouseDown={() => notifyClicked(row, col)}
            draggable="true"
            onMouseOver={handleMouseOver}
            onDragStart={handleDragStart}
            onDragOver={event => event.preventDefault()}
            onDragEnter={event => event.preventDefault()}
            onDrop={handleDrop}
        >
            {weightDisplay}
        </td>
    );
}
