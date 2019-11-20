# Multy-groupify

[![Build Status](https://travis-ci.com/KartaviK/multy-groupify.svg?branch=master)](https://travis-ci.com/KartaviK/multy-groupify)
[![codecov](https://codecov.io/gh/KartaviK/multy-groupify/branch/master/graph/badge.svg)](https://codecov.io/gh/KartaviK/multy-groupify)

Base method to group elements in collection by custom properties and compare calbacks

## Installation

```bash
npm install multy-groupify
```

## Usage

There are two methods for usage:
- `groupify(...) => Group<T>[]`
- `groupBy(...) => T[][]`

### groupify/groupBy

|argument|type|required|description|
|----|----|----|----|
|collection|`any[]`|true|Your own collection that you want to group|
|retrieveFunctions|`{[p: string]: (value: any) => any}`, `string[]`|true|Collection of attributes, or collection of custom retrieve functions, where property is target attribute|
|compareFunctions|`{[p: string]: (groupValue: any, compareValue: any) => boolean}`,`undefined`|false|Your custom compare functions|

### Examples

TODO: add examples

## Author
- [Roman Varkuta](https://www.linkedin.com/in/roman-varkuta-431a9b169/)

## License
- [MIT](./LICENSE.md)
