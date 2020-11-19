import { HardhatUserConfig } from 'hardhat/config'

import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'

const config: HardhatUserConfig = {
  paths: {
    sources: './test/helpers/contracts',
    tests: './test/hardhat',
  },
  solidity: {
    version: '0.7.0',
  },
}

export default config
