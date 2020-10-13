import {
     snakeCase
} from 'lodash/fp'
import createHumps from './createHumps'

export default createHumps(snakeCase)