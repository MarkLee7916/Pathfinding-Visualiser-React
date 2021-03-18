// Adapter pattern implementation of a hashmap to allow arbitrary objects as keys
export class HashMap<K, V> {
    private readonly map: Map<string, V>;

    constructor() {
        this.map = new Map<string, V>();
    }

    public add(key: K, val: V) {
        this.map.set(JSON.stringify(key), val);
    }

    public get(key: K) {
        return this.map.get(JSON.stringify(key));
    }

    public size() {
        return this.map.size;
    }
}