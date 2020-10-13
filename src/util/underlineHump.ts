import {
    camelCase
} from 'lodash/fp'
import createHumps from './createHumps'

function toCamelCase(str) {
    return str.replace(/_(\w)/g, function (m, $1) {
        return $1 ? $1.toUpperCase() : m
    })
}
export default createHumps(toCamelCase)
