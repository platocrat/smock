import { HardhatUserConfig } from 'hardhat/config'

import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'

const config: HardhatUserConfig = {
  paths: {
    sources: '\\/../../../common/contracts', // (sorry) Hack to get around https://github.com/nomiclabs/hardhat/blob/893426c0e0db7179f31a7d12a8513c1c37bd99b8/packages/hardhat-core/src/utils/source-names.ts#L125-L129
    tests: '../tests',
    artifacts: './temp/artifacts',
    cache: './temp/cache',
  },
  solidity: {
    version: '0.7.0',
  },
}

export default config
