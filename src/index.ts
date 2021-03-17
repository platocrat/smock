import { Smockit, Smoddit } from './types'

let _smockit = null
let _smoddit = null

try {
  _smockit = require('./smockit').smockit
  _smoddit = require('./smoddit').smoddit
} catch (err) {
  // Hardhat unavailable!
}

// Load the plugin in a nice way.
import './plugin'

// Now export everything.
export const smockit: Smockit = _smockit
export const smoddit: Smoddit = _smoddit
export * from './types'
