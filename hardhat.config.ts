import { HardhatUserConfig } from 'hardhat/config'

import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'

const config: HardhatUserConfig = {
  paths: {
    sources: './test/contracts',
    tests: './test',
    artifacts: './test/temp/artifacts',
    cache: './test/temp/cache',
  },
  solidity: {
    version: '0.7.0',
  },
}

export default config
