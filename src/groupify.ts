export interface RetrieveFunctionCollection {
    [propertyName: string]: (property: any) => any;
}

export interface CompareFunctionCollection {
    [propertyName: string]: (groupValue: any, compareValue: any) => boolean;
}

export interface KeyValueCollection {
    [key: string]: any;
}

export class Group {
    private readonly keys: KeyValueCollection = [];
    private readonly items: any[] = [];

    constructor(keys: KeyValueCollection, items: any[]) {
        this.keys = keys;
        this.items = items;
    }

    get Keys(): KeyValueCollection {
        return this.keys;
    }

    get Items(): any[] {
        return this.items;
    }
}

/**
 * Group your items in array by multiple Keys!
 *
 * @param collection
 * @param retrieveFunctions
 * @param compareFunctions
 * @returns {Array}
 */
export default function groupify(
    collection: Array<{ [props: string]: any }>,
    retrieveFunctions: RetrieveFunctionCollection,
    compareFunctions?: CompareFunctionCollection
): Array<Group> {
    const groups: Array<Group> = [];
    let keyValues: KeyValueCollection = {};

    collection.forEach((item: KeyValueCollection) => {
        for (let attribute in retrieveFunctions) {
            keyValues[attribute] = retrieveFunctions.hasOwnProperty(attribute)
                ? retrieveFunctions[attribute](item[attribute])
                : undefined;
        }
        let group = groups.find((group: Group) => {
            for (let key in retrieveFunctions) {
                if (!group || !group.Keys[key]) {
                    return false;
                }
                if (compareFunctions && compareFunctions[key] instanceof Function) {
                    if (!compareFunctions[key](group.Keys[key], keyValues[key])) {
                        return false;
                    }
                } else if (group.Keys[key] !== keyValues[key]) {
                    return false;
                }
            }

            return true;
        });

        if (group) {
            group.Items.push(item);
        } else {
            groups.push(new Group(keyValues, [item]));
        }

        keyValues = {};
    });

    return groups;
}
