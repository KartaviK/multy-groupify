import groupify from "../src/groupify";

const simpleCollection = [
    {name: "Kasper", age: 12},
    {name: "Roman", age: 12},
    {name: "John", age: 6},
    {name: "Elena", age: 16},
    {name: "Urgant", age: 16},
];

describe("Groupify by callbacks!", () => {
    it("Group by only one attribute", () => {
        const byAge = groupify(simpleCollection, {
            age: (value: any) => value
        });

        expect(byAge.length).toBe(3);
        expect(byAge[0].Keys.age).toBe(12);
        expect(byAge[1].Keys.age).toBe(6);
        expect(byAge[2].Keys.age).toBe(16);
    });

    it('Group with simple custom compare callback', () => {
        const byAge = groupify(simpleCollection, {
            age: (value: any) => value
        }, {
            age: (groupValue, compareValue) => groupValue === compareValue
        });

        expect(byAge.length).toBe(3);
    });

    it('Group with custom specific compare callback', () => {
        const byAge = groupify(simpleCollection, {
            age: (value: any) => value
        }, {
            age: (groupValue, compareValue) => groupValue === compareValue && compareValue === 16
        });

        expect(byAge.length).toBe(4);
        expect(byAge[0].Keys.age).toBe(12);
        expect(byAge[1].Keys.age).toBe(12);
        expect(byAge[2].Keys.age).toBe(6);
        expect(byAge[3].Keys.age).toBe(16);
    });
});

describe("Groupify by simple array of properties names!", () => {
    it("Group by only one attribute", () => {
        const byAge = groupify(simpleCollection, ['age']);

        expect(byAge.length).toBe(3);
        expect(byAge[0].Keys.age).toBe(12);
        expect(byAge[1].Keys.age).toBe(6);
        expect(byAge[2].Keys.age).toBe(16);
    });
});
