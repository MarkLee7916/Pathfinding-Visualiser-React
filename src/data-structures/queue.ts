import { Collection } from "./collection";

// A wrapper around the default list to implement the collection interface
export class Queue<T> implements Collection<T> {
    private readonly queue: T[];

    constructor() {
        this.queue = [];
    }

    public add(item: T) {
        this.queue.push(item);
    }

    public remove() {
        return this.queue.shift();
    }

    public isEmpty() {
        return this.queue.length === 0;
    }
}