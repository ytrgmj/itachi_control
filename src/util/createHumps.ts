import { transform, set } from 'lodash'
import {
    isArray, isObjectLike, isPlainObject, map
} from 'lodash/fp'

function createIteratee(converter, self) {
    return (result, value, key) => {
        set(result, _isValidCol(key) ? converter(key) : key, isObjectLike(value) ? self(value) : value)
    }
}

function _isValidCol(col: string): boolean {
    if (col == 'pageNo' || col == 'pageSize' || col == 'orderBy') {
        return false
    }
    return col.substring(0, 1) != '_';
}

export default function createHumps(keyConverter) {
    return function humps(node) {
        if (isArray(node)) return map(humps, node)
        if (Object.prototype.toString.call(node) === '[object Object]') return transform(node, createIteratee(keyConverter, humps))
        return node
    }
}
