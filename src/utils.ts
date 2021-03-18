// Generate a random integer between lower (inclusive) and upper (not inclusive)
export function randomIntBetween(lower: number, upper: number) {
    return Math.floor(Math.random() * (upper - lower)) + lower;
}

export function deepCopy<T>(item: T): T {
    return JSON.parse(JSON.stringify(item));
}

// Create a delay for the specified amount of time in millis
export function wait(delayTime: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, delayTime));
}


