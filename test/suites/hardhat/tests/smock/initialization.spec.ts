import { expect } from '../../../../common/setup'

/* Imports: External */
import { ethers } from 'hardhat'

/* Imports: Internal */
import { smockit } from '../../../../../src/hardhat'
import { isSmockContract } from '../../../../common/type-checks'
import { getTestHelperJSON } from '../../utils'

describe('[hardhat] smock: initialization tests', () => {
  describe('initialization: ethers objects', () => {
    it('should be able to create a SmockContract from an ethers ContractFactory', async () => {
      const spec = await ethers.getContractFactory('TestHelpers_EmptyContract')
      const mock = await smockit(spec)

      expect(isSmockContract(mock)).to.be.true
    })

    it('should be able to create a SmockContract from an ethers Contract', async () => {
      const factory = await ethers.getContractFactory(
        'TestHelpers_EmptyContract'
      )

      const spec = await factory.deploy()
      const mock = await smockit(spec)

      expect(isSmockContract(mock)).to.be.true
    })

    it('should be able to create a SmockContract from an ethers Interface', async () => {
      const factory = await ethers.getContractFactory(
        'TestHelpers_EmptyContract'
      )

      const spec = factory.interface
      const mock = await smockit(spec)

      expect(isSmockContract(mock)).to.be.true
    })
  })

  describe('initialization: other', () => {
    it('should be able to create a SmockContract from a contract name', async () => {
      const spec = 'TestHelpers_EmptyContract'
      const mock = await smockit(spec)

      expect(isSmockContract(mock)).to.be.true
    })

    it('should be able to create a SmockContract from a JSON contract artifact object', async () => {
      const spec = getTestHelperJSON('TestHelpers_BasicReturnContract')
      const mock = await smockit(spec)

      expect(isSmockContract(mock)).to.be.true
    })

    it('should be able to create a SmockContract from a JSON contract ABI object', async () => {
      const spec = getTestHelperJSON('TestHelpers_BasicReturnContract')
      const mock = await smockit(spec.abi)

      expect(isSmockContract(mock)).to.be.true
    })

    it('should be able to create a SmockContract from a JSON contract ABI string', async () => {
      const json = getTestHelperJSON('TestHelpers_BasicReturnContract')

      const spec = JSON.stringify(json.abi)
      const mock = await smockit(spec)

      expect(isSmockContract(mock)).to.be.true
    })
  })
})
