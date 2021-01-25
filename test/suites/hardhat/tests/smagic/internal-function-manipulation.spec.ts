import { expect } from '../../../../common/setup'

/* Imports: External */
import { toPlainObject, toArray } from 'lodash'
import { BigNumber } from 'ethers'

/* Imports: Internal */
import { smock } from '../../../../../src/hardhat'

describe.skip('[hardhat] smagic: internal function manipulation', () => {
  let mock: any
  beforeEach(async () => {
    mock = await smock.magic('TestHelpers_BasicReturnContract')
  })

  describe('returning with data', () => {
    describe('fixed data types', () => {
      describe('from a specified value', () => {
        it('should be able to return a boolean', async () => {
          const expected = true
          mock.smocked.internal.functions._getBoolean.will.return.with(expected)

          expect(await mock.callStatic.getBoolean()).to.equal(expected)
        })

        it('should be able to return a uint256', async () => {
          const expected = 1234
          mock.smocked.internal.functions._getUint256.will.return.with(expected)

          expect(await mock.callStatic.getUint256()).to.equal(expected)
        })

        it('should be able to return a bytes32', async () => {
          const expected =
            '0x1234123412341234123412341234123412341234123412341234123412341234'
          mock.smocked.internal.functions._getBytes32.will.return.with(expected)

          expect(await mock.callStatic.getBytes32()).to.equal(expected)
        })
      })

      describe('from a function', () => {
        describe('without input arguments', () => {
          it('should be able to return a boolean', async () => {
            const expected = true
            mock.smocked.internal.functions._getBoolean.will.return.with(() => {
              return expected
            })

            expect(await mock.callStatic.getBoolean()).to.equal(expected)
          })

          it('should be able to return a uint256', async () => {
            const expected = 1234
            mock.smocked.internal.functions._getUint256.will.return.with(() => {
              return expected
            })

            expect(await mock.callStatic.getUint256()).to.equal(expected)
          })

          it('should be able to return a bytes32', async () => {
            const expected =
              '0x1234123412341234123412341234123412341234123412341234123412341234'
            mock.smocked.internal.functions._getBytes32.will.return.with(() => {
              return expected
            })

            expect(await mock.callStatic.getBytes32()).to.equal(expected)
          })
        })

        describe('with input arguments', () => {
          it('should be able to return a boolean', async () => {
            const expected = true
            mock.smocked.internal.functions._getInputtedBoolean.will.return.with(
              (arg1: boolean) => {
                return arg1
              }
            )

            expect(await mock.callStatic.getInputtedBoolean(expected)).to.equal(
              expected
            )
          })

          it('should be able to return a uint256', async () => {
            const expected = 1234
            mock.smocked.internal.functions._getInputtedUint256.will.return.with(
              (arg1: number) => {
                return arg1
              }
            )

            expect(await mock.callStatic.getInputtedUint256(expected)).to.equal(
              expected
            )
          })

          it('should be able to return a bytes32', async () => {
            const expected =
              '0x1234123412341234123412341234123412341234123412341234123412341234'
            mock.smocked.internal.functions._getInputtedBytes32.will.return.with(
              (arg1: string) => {
                return arg1
              }
            )

            expect(await mock.callStatic.getInputtedBytes32(expected)).to.equal(
              expected
            )
          })
        })
      })

      describe('from an asynchronous function', () => {
        describe('without input arguments', () => {
          it('should be able to return a boolean', async () => {
            const expected = async () => {
              return true
            }
            mock.smocked.internal.functions._getBoolean.will.return.with(async () => {
              return expected()
            })

            expect(await mock.callStatic.getBoolean()).to.equal(
              await expected()
            )
          })

          it('should be able to return a uint256', async () => {
            const expected = async () => {
              return 1234
            }
            mock.smocked.internal.functions._getUint256.will.return.with(async () => {
              return expected()
            })

            expect(await mock.callStatic.getUint256()).to.equal(
              await expected()
            )
          })

          it('should be able to return a bytes32', async () => {
            const expected = async () => {
              return '0x1234123412341234123412341234123412341234123412341234123412341234'
            }
            mock.smocked.internal.functions._getBytes32.will.return.with(async () => {
              return expected()
            })

            expect(await mock.callStatic.getBytes32()).to.equal(
              await expected()
            )
          })
        })
      })

      describe('resetting function behavior', () => {
        describe('for a boolean', () => {
          it('should return false after resetting', async () => {
            const expected1 = true
            mock.smocked.internal.functions._getBoolean.will.return.with(expected1)

            expect(await mock.callStatic.getBoolean()).to.equal(expected1)

            const expected2 = false
            mock.smocked.internal.functions._getBoolean.reset()

            expect(await mock.callStatic.getBoolean()).to.equal(expected2)
          })

          it('should be able to reset and change behaviors', async () => {
            const expected1 = true
            mock.smocked.internal.functions._getBoolean.will.return.with(expected1)

            expect(await mock.callStatic.getBoolean()).to.equal(expected1)

            const expected2 = false
            mock.smocked.internal.functions._getBoolean.reset()

            expect(await mock.callStatic.getBoolean()).to.equal(expected2)

            const expected3 = true
            mock.smocked.internal.functions._getBoolean.will.return.with(expected3)

            expect(await mock.callStatic.getBoolean()).to.equal(expected3)
          })
        })

        describe('for a uint256', () => {
          it('should return zero after resetting', async () => {
            const expected1 = 1234
            mock.smocked.internal.functions._getUint256.will.return.with(expected1)

            expect(await mock.callStatic.getUint256()).to.equal(expected1)

            const expected2 = 0
            mock.smocked.internal.functions._getUint256.reset()

            expect(await mock.callStatic.getUint256()).to.equal(expected2)
          })

          it('should be able to reset and change behaviors', async () => {
            const expected1 = 1234
            mock.smocked.internal.functions._getUint256.will.return.with(expected1)

            expect(await mock.callStatic.getUint256()).to.equal(expected1)

            const expected2 = 0
            mock.smocked.internal.functions._getUint256.reset()

            expect(await mock.callStatic.getUint256()).to.equal(expected2)

            const expected3 = 4321
            mock.smocked.internal.functions._getUint256.will.return.with(expected3)

            expect(await mock.callStatic.getUint256()).to.equal(expected3)
          })
        })

        describe('for a bytes32', () => {
          it('should return 32 zero bytes after resetting', async () => {
            const expected1 =
              '0x1234123412341234123412341234123412341234123412341234123412341234'
            mock.smocked.internal.functions._getBytes32.will.return.with(expected1)

            expect(await mock.callStatic.getBytes32()).to.equal(expected1)

            const expected2 =
              '0x0000000000000000000000000000000000000000000000000000000000000000'
            mock.smocked.internal.functions._getBytes32.reset()

            expect(await mock.callStatic.getBytes32()).to.equal(expected2)
          })

          it('should be able to reset and change behaviors', async () => {
            const expected1 =
              '0x1234123412341234123412341234123412341234123412341234123412341234'
            mock.smocked.internal.functions._getBytes32.will.return.with(expected1)

            expect(await mock.callStatic.getBytes32()).to.equal(expected1)

            const expected2 =
              '0x0000000000000000000000000000000000000000000000000000000000000000'
            mock.smocked.internal.functions._getBytes32.reset()

            expect(await mock.callStatic.getBytes32()).to.equal(expected2)

            const expected3 =
              '0x4321432143214321432143214321432143214321432143214321432143214321'
            mock.smocked.internal.functions._getBytes32.will.return.with(expected3)

            expect(await mock.callStatic.getBytes32()).to.equal(expected3)
          })
        })
      })
    })
  })
})
