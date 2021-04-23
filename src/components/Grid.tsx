import React from "react";
import { Coord, GridFrame, TileFrame } from "../data-structures/grid";
import { Tile } from "./Tile";

interface Props {
    start: Coord
    goal: Coord
    gridFrame: GridFrame
    weights: number[][]
    walls: boolean[][]
    notifyClicked: (row: number, col: number) => void
    notifyDrop: (row: number, col: number, tileFrame: TileFrame) => void
    isMouseDown: boolean
}

export const Grid = ({ start, goal, gridFrame, weights, walls, notifyClicked, notifyDrop, isMouseDown }: Props) => {
    function renderRow(row: TileFrame[], rowIndex: number) {
        return (
            <tr className="row" key={rowIndex}>
                {row.map((tileFrame, colIndex) =>
                    <Tile isStart={start.row === rowIndex && start.col === colIndex}
                        isGoal={goal.row === rowIndex && goal.col === colIndex}
                        isWall={walls[rowIndex][colIndex]}
                        tileFrame={tileFrame}
                        key={colIndex}
                        weight={weights[rowIndex][colIndex]}
                        row={rowIndex}
                        col={colIndex}
                        notifyClicked={notifyClicked}
                        notifyDrop={notifyDrop}
                        isMouseDown={isMouseDown}
                    />
                )}
            </tr>
        );
    }

    return (
        <table id="grid">
            <tbody>
                {gridFrame.map((row, index) => renderRow(row, index))}
            </tbody>
        </table>
    );
}
