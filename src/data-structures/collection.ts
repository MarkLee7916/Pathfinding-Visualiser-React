// Generic interface that allows us to write pathfinding algos generically
export interface Collection<T> {
    add: (item: T) => void,
    remove: () => T,
    isEmpty: () => boolean
}