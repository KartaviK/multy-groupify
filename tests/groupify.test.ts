import groupify from '../src/groupify';

describe('Simple groupifying', () => {
    it('Group by only one attribute', () => {
        const collection = [
            {name: 'Kasper', age: 12},
            {name: 'Roman', age: 12},
            {name: 'John', age: 6},
            {name: 'Elena', age: 16},
            {name: 'Urgant', age: 16},
        ];

        const groupsByName = groupify(collection, {
            age: value => value,
        });

        expect(groupsByName.length).toBe(3);
        expect(groupsByName[0].Keys.age).toBe(12);
        expect(groupsByName[1].Keys.age).toBe(6);
        expect(groupsByName[2].Keys.age).toBe(16);
    })
});
