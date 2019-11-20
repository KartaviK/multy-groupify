export type RetrieveFunction = (property: any) => any;

export type KeyValueCollection = { [key: string]: any; };

export interface RetrieveFunctionCollection {
    [propertyName: string]: RetrieveFunction;
}

export interface CompareFunctionCollection {
    [propertyName: string]: (groupValue: any, compareValue: any) => boolean;
}

export interface GroupifyOptions {
    retrieve: RetrieveFunctionCollection | string[],
    compare?: CompareFunctionCollection,
}

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

export default function groupify<T extends KeyValueCollection>(
    collection: T[],
    groupOptions: GroupifyOptions = {
        retrieve: [],
        compare: {},
    },
): Group<T>[] {
    const groups: Group<T>[] = [];
    let attributes: string[] = [];
    let keyValues: KeyValueCollection = {};

    const processGroup: Function = (findGroup: Group<T> | undefined, item: T): void => {
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
            if (groupOptions.compare && groupOptions.compare[attribute] instanceof Function) {
                if (!groupOptions.compare[attribute](group.Keys[attribute], keyValues[attribute])) {
                    return false;
                }
            } else if (group.Keys[attribute] !== keyValues[attribute]) {
                return false;
            }
        }

        return true;
    };

    if (Array.isArray(groupOptions.retrieve)) {
        attributes = groupOptions.retrieve;

        collection.forEach((item: T): void => {
            for (const attribute of attributes) {
                processRetrieve(item, attribute);
            }

            processGroup(groups.find(groupFindHandler), item);
        });
    } else {
        const retrieveParams = Object.entries(groupOptions.retrieve);
        attributes = Object.keys(groupOptions.retrieve);

        collection.forEach((item: T): void => {
            for (const [attribute, callback] of retrieveParams) {
                processRetrieve(item, attribute, callback);
            }

            processGroup(groups.find(groupFindHandler), item);
        });
    }

    return groups;
}
