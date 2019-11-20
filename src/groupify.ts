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
    private readonly items: any[] = [];
    private readonly keys: KeyValueCollection = [];

    constructor(keys: KeyValueCollection, items: any[]) {
        this.items = items;
        this.keys = keys;
    }

    get Items(): any[] {
        return this.items;
    }

    get Keys(): KeyValueCollection {
        return this.keys;
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
    compareFunctions?: CompareFunctionCollection,
): Group[] {
    const groups: Group[] = [];
    let keyValues: KeyValueCollection = {};

    collection.forEach((item: KeyValueCollection) => {
        for (const attribute in retrieveFunctions) {
            keyValues[attribute] = retrieveFunctions.hasOwnProperty(attribute)
                ? retrieveFunctions[attribute](item[attribute])
                : undefined;
        }
        const findGroup: Group|undefined = groups.find((group: Group) => {
            for (const key in retrieveFunctions) {
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

        if (findGroup !== undefined) {
            findGroup.Items.push(item);
        } else {
            groups.push(new Group(keyValues, [item]));
        }

        keyValues = {};
    });

    return groups;
}
