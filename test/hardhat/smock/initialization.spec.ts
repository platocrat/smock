import { expect } from '../../setup'

/* Imports: External */
import { ethers } from 'hardhat'

/* Imports: Internal */
import { smock } from '../../../src/hardhat'
import { isSmockContract } from '../../helpers/type-checks'
import { getTestHelperJSON } from '../../helpers/contracts'

describe('[hardhat] smock: initialization tests', () => {
  describe('initialization: ethers objects', () => {
    it('should be able to create a SmockContract from an ethers ContractFactory', async () => {
      const spec = await ethers.getContractFactory('TestHelpers_EmptyContract')
      const mock = await smock(spec)

      expect(isSmockContract(mock)).to.be.true
    })

    it('should be able to create a SmockContract from an ethers Contract', async () => {
      const factory = await ethers.getContractFactory('TestHelpers_EmptyContract')

      const spec = await factory.deploy()
      const mock = await smock(spec)

      expect(isSmockContract(mock)).to.be.true
    })

    it('should be able to create a SmockContract from an ethers Interface', async () => {
      const factory = await ethers.getContractFactory('TestHelpers_EmptyContract')

      const spec = factory.interface
      const mock = await smock(spec)

      expect(isSmockContract(mock)).to.be.true
    })
  })

  describe('initialization: other', () => {
    it('should be able to create a SmockContract from a contract name', async () => {
      const spec = 'TestHelpers_EmptyContract'
      const mock = await smock(spec)

      expect(isSmockContract(mock)).to.be.true
    })

    it('should be able to create a SmockContract from a JSON contract ABI object', async () => {
      const spec = getTestHelperJSON('TestHelpers_EmptyContract')
      const mock = await smock(spec)

      expect(isSmockContract(mock)).to.be.true
    })

    it('should be able to create a SmockContract from a JSON contract ABI string', async () => {
      const json = getTestHelperJSON('TestHelpers_EmptyContract')

      const spec = JSON.stringify(json)
      const mock = await smock(spec)

      expect(isSmockContract(mock)).to.be.true
    })
  })
})
