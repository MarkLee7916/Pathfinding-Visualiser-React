import { Collection } from "./collection";

export class PriorityQueue<T> implements Collection<T> {
    private readonly queue: T[];

    // Comparator for whatever type user passes in
    private readonly compare: (a: T, b: T) => number;

    constructor(cmp: (a: T, b: T) => number) {
        this.compare = cmp;
        this.queue = [];
    }

    public add(elem: T) {
        this.queue.push(elem);
    }

    public remove() {
        this.queue.sort(this.compare);

        return this.queue.pop();
    }

    public isEmpty() {
        return this.queue.length === 0;
    }


}