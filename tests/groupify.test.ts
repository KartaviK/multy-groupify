import * as grouper from "../src/groupify";

const simpleCollection = [
    {name: "Kasper", age: 12},
    {name: "Roman", age: 12},
    {name: "John", age: 6},
    {name: "Elena", age: 16},
    {name: "Urgant", age: 16},
];

describe("Groupify by callbacks!", () => {
    it("Group by only one attribute", () => {
        const groupsByName = grouper.groupify(simpleCollection, {
            age: (value: any) => value
        });

        expect(groupsByName.length).toBe(3);
        expect(groupsByName[0].Keys.age).toBe(12);
        expect(groupsByName[1].Keys.age).toBe(6);
        expect(groupsByName[2].Keys.age).toBe(16);
    });
});

describe("Groupify by simple array of properties names!", () => {
    it("Group by only one attribute", () => {
        const groupsByName = grouper.groupify(simpleCollection, ['age']);

        expect(groupsByName.length).toBe(3);
        expect(groupsByName[0].Keys.age).toBe(12);
        expect(groupsByName[1].Keys.age).toBe(6);
        expect(groupsByName[2].Keys.age).toBe(16);
    });
});
