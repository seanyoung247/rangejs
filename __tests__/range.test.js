import Range from "../range.js";

describe('Range class', () => {

    describe('range creation', () => {
        test('Creates correct range with no parameters', () => {
            const rng = new Range();
            expect(rng.size).toBeGreaterThan(0);
        });
        test('Creates correct range with one parameter', () => {
            const rng = new Range(5);
            const comp = [0,1,2,3,4,5];
            expect([...rng]).toEqual(comp);
        });
        test('Creates correct range with two parameters', () => {
            const rng = new Range(1, 5);
            const comp = [1,2,3,4,5];
            expect([...rng]).toEqual(comp);
        });
        test('Creates correct range with three parameters', () => {
            const rng = new Range(1, 10, 2);
            const comp = [1,3,5,7,9];
            expect([...rng]).toEqual(comp);
        });
        test('Creates reverse ranges', () => {
            const rng = new Range(10, 1, -1);
            const comp = [10,9,8,7,6,5,4,3,2,1];
            expect([...rng]).toEqual(comp);
        });

        test('Floating point ranges', () => {
            const rng = new Range(0.5, 0.55, 0.01);
            const comp = [0.5,0.51,0.52,0.53,0.54,0.55];
            expect([...rng]).toEqual(comp);
        });

        test('Handles ranges with no valid steps', () => {
            const rng = new Range(10,1,1);
            const comp = [];
            expect([...rng]).toEqual(comp);
        });
        test('Throws error on incorrect parameters', () => {
            expect(() => new Range(1, 10, '2')).toThrow(TypeError);
            expect(() => new Range(1, {}, 2)).toThrow('All range inputs must be valid numbers');
        });
    });

    describe('Range iteration', () => {
        function compareRangeValues(rng, vals) {
            let i = 0;
            expect(rng.size).toBe(vals.length);
            for (const val of rng) {
                expect(val).toBe(vals[i++]);
            }
        }
        test('Can iterate forward range', () => {
            compareRangeValues(
                new Range(10), 
                [0,1,2,3,4,5,6,7,8,9,10]
            );
        });
        test('Can iterate reverse range', () => {
            compareRangeValues(
                new Range(10,0,-1),
                [10,9,8,7,6,5,4,3,2,1,0]
            );
        });
        test('Iterates ranges with floating point steps', () => {
            compareRangeValues(
                new Range(0,5,0.5),
                [0,0.5,1,1.5,2,2.5,3,3.5,4,4.5,5]
            )
        });
    });

    describe('Range properties', () => {
        test('Can get range size', () => {
            const rng1 = new Range(10);
            const rng2 = new Range(10,0,-1);
            expect(rng1.size).toBe(11);
            expect(rng2.size).toBe(11);
        });
    });

    describe('Range values', () => {
        describe('Detects valid step values', () => {
            test('Detects integer values in range', () => {
                const rng = new Range(0, 10, 2);
                expect(rng.inRange(6)).toBe(true);
            });
            test('Detects floating point values in range', () => {
                const rng = new Range(0, 2, 0.25);
                expect(rng.inRange(0.75)).toBe(true);
            });
            test('Detects integer values out of range', () => {
                const rng = new Range(10);
                expect(rng.inRange(-4)).toBe(false);
                expect(rng.inRange(12)).toBe(false);
            });
            test('Detects floating point values out of range', () => {
                const rng = new Range(0, 2, 0.25);
                expect(rng.inRange(-1.5)).toBe(false);
                expect(rng.inRange(5.5)).toBe(false);
            });
            test('Detects integer values in range but not valid step', () => {
                const rng = new Range(0, 10, 2);
                expect(rng.inRange(5)).toBe(false);
                expect(rng.inRange(6.5)).toBe(false);
            });
            test('Detects floating point values in range but not valid step', () => {
                const rng = new Range(0, 2, 0.25);
                expect(rng.inRange(0.126)).toBe(false);
                expect(rng.inRange(1.1)).toBe(false);
            });
        });
    });

    describe('Allows step indexing', () => {
        test('Can get integer step from index', () => {
            const rng = new Range(0, 10, 2);
            const comp = [0,2,4,6,8,10];
            const idx = Math.floor(Math.random() * comp.length);
            expect(rng.step(idx)).toBe(comp[idx]);
        });
        test('Can get floating point step from index', () => {
            const rng = new Range(0, 2, 0.25);
            const comp = [0,0.25,0.5,0.75,1.0,1.25,1.5,1.75,2.0];
            const idx = Math.floor(Math.random() * comp.length);
            expect(rng.step(idx)).toBe(comp[idx]);
        });
        test('Can get index from integer step value', () => {
            const rng = new Range(0, 10, 2);
            const comp = [0,2,4,6,8,10];
            const idx = Math.floor(Math.random() * comp.length);
            expect(rng.indexOf(comp[idx])).toBe(idx);
        });
        test('Can get index from floating point step', () => {
            const rng = new Range(0, 2, 0.25);
            const comp = [0,0.25,0.5,0.75,1.0,1.25,1.5,1.75,2.0];
            const idx = Math.floor(Math.random() * comp.length);
            expect(rng.indexOf(comp[idx])).toBe(idx);
        });
        test('Throws error on index out of bounds', () => {
            const rng = new Range(0, 10, 2);
            expect(() => rng.step(-1)).toThrow(Error);
            expect(() => rng.step(10)).toThrow('Invalid index');
            expect(() => rng.step(2.5)).toThrow(Error);
        });
    });
});