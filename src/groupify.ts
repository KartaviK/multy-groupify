/** User callback to retrieve property value and use it to group elements */
export type RetrieveFunction = (property: any) => any;

/**
 * Simple interface to represent an any object
 */
export interface KeyValueCollection {
    [key: string]: any;
}

/**
 * Collection of user's retrieve callbacks
 */
export interface RetrieveFunctionCollection {
    [propertyName: string]: RetrieveFunction;
}

/**
 * User's custom callbacks to compare element in already grouped collection and not grouped element
 */
export interface CompareFunctionCollection {
    [propertyName: string]: (groupValue: any, compareValue: any) => boolean;
}

/**
 * Simple group to represent items and common keys for it
 */
export class Group<T extends KeyValueCollection> {
    private readonly items: T[] = [];
    private readonly keys: KeyValueCollection = {};

    constructor(keys: KeyValueCollection, items: T[] = []) {
        this.items = items;
        this.keys = keys;
    }

    get Items(): T[] {
        return this.items;
    }

    get Keys(): KeyValueCollection {
        return this.keys;
    }
}

/**
 * Simple customizable groupBy method
 *
 * @param collection
 * @param retrieveFunctions
 * @param compareFunctions
 * @return Array<Group<T>>
 */
const groupBy = <T extends KeyValueCollection>(
    collection: T[],
    retrieveFunctions: RetrieveFunctionCollection | string[],
    compareFunctions?: CompareFunctionCollection,
): T[][] => {
    return groupify(collection, retrieveFunctions, compareFunctions)
        .map((group: Group<T>): T[] => {
            return group.Items;
        });
};

/**
 * Group elements in collection by your custom options!
 * Also you will save your keys in unique Group object
 *
 * @param collection
 * @param retrieveFunctions
 * @param compareFunctions
 * @return Array<Group<T>>
 */
const groupify = <T extends KeyValueCollection>(
    collection: T[],
    retrieveFunctions: RetrieveFunctionCollection | string[],
    compareFunctions?: CompareFunctionCollection,
): Array<Group<T>> => {
    const groups: Array<Group<T>> = [];
    let attributes: string[] = [];
    let keyValues: KeyValueCollection = {};

    const processGroup = (findGroup: Group<T> | undefined, item: T): void => {
        if (findGroup !== undefined) {
            findGroup.Items.push(item);
        } else {
            groups.push(new Group<T>(keyValues, [item]));
        }

        keyValues = {};
    };
    const processRetrieve = (item: T, attribute: string, customDeepRetrieve?: RetrieveFunction) => {
        const value = item.hasOwnProperty(attribute) ? item[attribute] : undefined;

        keyValues[attribute] = customDeepRetrieve ? customDeepRetrieve(value) : value;
    };
    const groupFindHandler: (group: Group<T>) => boolean = (group: Group<T>): boolean => {
        for (const attribute of attributes) {
            if (!group || !group.Keys[attribute]) {
                return false;
            }
            if (compareFunctions && compareFunctions[attribute] instanceof Function) {
                if (!compareFunctions[attribute](group.Keys[attribute], keyValues[attribute])) {
                    return false;
                }
            } else if (group.Keys[attribute] !== keyValues[attribute]) {
                return false;
            }
        }

        return true;
    };

    if (Array.isArray(retrieveFunctions)) {
        attributes = retrieveFunctions;

        collection.forEach((item: T): void => {
            for (const attribute of attributes) {
                processRetrieve(item, attribute);
            }

            processGroup(groups.find(groupFindHandler), item);
        });
    } else {
        const retrieveParams = Object.entries(retrieveFunctions);
        attributes = Object.keys(retrieveFunctions);

        collection.forEach((item: T): void => {
            for (const [attribute, callback] of retrieveParams) {
                processRetrieve(item, attribute, callback);
            }

            processGroup(groups.find(groupFindHandler), item);
        });
    }

    return groups;
};

export {
    groupBy,
    groupify
}
