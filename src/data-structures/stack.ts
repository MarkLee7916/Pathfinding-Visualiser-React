import { Collection } from "./collection";

// A wrapper around the default list to implement the collection interface
export class Stack<T> implements Collection<T> {
    private readonly stack: T[];

    constructor() {
        this.stack = [];
    }

    public add(item: T) {
        this.stack.push(item);
    }

    public remove() {
        return this.stack.pop();
    }

    public isEmpty() {
        return this.stack.length === 0;
    }
}