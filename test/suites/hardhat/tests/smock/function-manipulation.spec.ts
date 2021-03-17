import { expect } from '../../../../common/setup'

/* Imports: External */
import { ethers } from 'hardhat'
import { toPlainObject, toArray } from 'lodash'
import { BigNumber, Contract } from 'ethers'

/* Imports: Internal */
import { smockit } from '../../../../../src/hardhat'

describe('[hardhat] smock: function manipulation tests', () => {
  let mock: any
  beforeEach(async () => {
    mock = await smockit('TestHelpers_BasicReturnContract')
  })

  let FallbackCaller: Contract
  beforeEach(async () => {
    FallbackCaller = await (
      await ethers.getContractFactory('TestHelpers_FallbackCaller')
    ).deploy()
    await FallbackCaller.setTarget(mock.address)
  })

  describe('manipulating fallback functions', () => {
    it('should return with no data by default', async () => {
      const expected = '0x'

      expect(await FallbackCaller.callStatic.doFallback()).to.equal(expected)
    })

    it('should be able to make a fallback function return without any data', async () => {
      const expected = '0x'
      mock.smocked.fallback.will.return()

      expect(await FallbackCaller.callStatic.doFallback()).to.equal(expected)
    })

    it('should be able to make a fallback function return with data', async () => {
      const expected = '0x1234123412341234'
      mock.smocked.fallback.will.return.with(expected)

      expect(await FallbackCaller.callStatic.doFallback()).to.equal(expected)
    })

    it('should be able to make a fallback function revert without any data', async () => {
      mock.smocked.fallback.will.revert()

      await expect(FallbackCaller.callStatic.doFallback()).to.be.reverted
    })

    it('should be able to make a fallback function revert with a string', async () => {
      const expected = 'this is a revert message'

      mock.smocked.fallback.will.revert.with(expected)

      await expect(FallbackCaller.callStatic.doFallback()).to.be.revertedWith(
        expected
      )
    })

    it('should be able to make a fallback function emit an event', async () => {
      // TODO
    })

    it('should be able to change behaviors', async () => {
      mock.smocked.fallback.will.revert()

      await expect(FallbackCaller.callStatic.doFallback()).to.be.reverted

      const expected = '0x'
      mock.smocked.fallback.will.return()

      expect(await FallbackCaller.callStatic.doFallback()).to.equal(expected)
    })

    describe('resetting the fallback function', () => {
      it('should go back to default behavior when reset', async () => {
        mock.smocked.fallback.will.revert()

        await expect(FallbackCaller.callStatic.doFallback()).to.be.reverted

        const expected = '0x'
        mock.smocked.fallback.reset()

        expect(await FallbackCaller.callStatic.doFallback()).to.equal(expected)
      })
    })
  })

  describe('manipulating functions', () => {
    it('should be able to make a function return without any data', async () => {
      const expected = []
      mock.smocked.functions.empty.will.return()

      expect(await mock.callStatic.empty()).to.deep.equal(expected)
    })

    it('should be able to make a function revert without any data', async () => {
      mock.smocked.functions.empty.will.revert()

      await expect(mock.callStatic.empty()).to.be.reverted
    })

    it('should be able to make a function emit an event', async () => {
      // TODO
    })

    describe('returning with data', () => {
      describe('fixed data types', () => {
        describe('default behaviors', () => {
          it('should return false for a boolean', async () => {
            const expected = false

            expect(await mock.callStatic.getBoolean()).to.equal(expected)
          })

          it('should return zero for a uint256', async () => {
            const expected = 0

            expect(await mock.callStatic.getUint256()).to.equal(expected)
          })

          it('should return 32 zero bytes for a bytes32', async () => {
            const expected =
              '0x0000000000000000000000000000000000000000000000000000000000000000'

            expect(await mock.callStatic.getBytes32()).to.equal(expected)
          })
        })

        describe('from a specified value', () => {
          it('should be able to return a boolean', async () => {
            const expected = true
            mock.smocked.functions.getBoolean.will.return.with(expected)

            expect(await mock.callStatic.getBoolean()).to.equal(expected)
          })

          it('should be able to return a uint256', async () => {
            const expected = 1234
            mock.smocked.functions.getUint256.will.return.with(expected)

            expect(await mock.callStatic.getUint256()).to.equal(expected)
          })

          it('should be able to return a bytes32', async () => {
            const expected =
              '0x1234123412341234123412341234123412341234123412341234123412341234'
            mock.smocked.functions.getBytes32.will.return.with(expected)

            expect(await mock.callStatic.getBytes32()).to.equal(expected)
          })
        })

        describe('from a function', () => {
          describe('without input arguments', () => {
            it('should be able to return a boolean', async () => {
              const expected = true
              mock.smocked.functions.getBoolean.will.return.with(() => {
                return expected
              })

              expect(await mock.callStatic.getBoolean()).to.equal(expected)
            })

            it('should be able to return a uint256', async () => {
              const expected = 1234
              mock.smocked.functions.getUint256.will.return.with(() => {
                return expected
              })

              expect(await mock.callStatic.getUint256()).to.equal(expected)
            })

            it('should be able to return a bytes32', async () => {
              const expected =
                '0x1234123412341234123412341234123412341234123412341234123412341234'
              mock.smocked.functions.getBytes32.will.return.with(() => {
                return expected
              })

              expect(await mock.callStatic.getBytes32()).to.equal(expected)
            })
          })

          describe('with input arguments', () => {
            it('should be able to return a boolean', async () => {
              const expected = true
              mock.smocked.functions.getInputtedBoolean.will.return.with(
                (arg1: boolean) => {
                  return arg1
                }
              )

              expect(
                await mock.callStatic.getInputtedBoolean(expected)
              ).to.equal(expected)
            })

            it('should be able to return a uint256', async () => {
              const expected = 1234
              mock.smocked.functions.getInputtedUint256.will.return.with(
                (arg1: number) => {
                  return arg1
                }
              )

              expect(
                await mock.callStatic.getInputtedUint256(expected)
              ).to.equal(expected)
            })

            it('should be able to return a bytes32', async () => {
              const expected =
                '0x1234123412341234123412341234123412341234123412341234123412341234'
              mock.smocked.functions.getInputtedBytes32.will.return.with(
                (arg1: string) => {
                  return arg1
                }
              )

              expect(
                await mock.callStatic.getInputtedBytes32(expected)
              ).to.equal(expected)
            })
          })
        })

        describe('from an asynchronous function', () => {
          describe('without input arguments', () => {
            it('should be able to return a boolean', async () => {
              const expected = async () => {
                return true
              }
              mock.smocked.functions.getBoolean.will.return.with(async () => {
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
              mock.smocked.functions.getUint256.will.return.with(async () => {
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
              mock.smocked.functions.getBytes32.will.return.with(async () => {
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
              mock.smocked.functions.getBoolean.will.return.with(expected1)

              expect(await mock.callStatic.getBoolean()).to.equal(expected1)

              const expected2 = false
              mock.smocked.functions.getBoolean.reset()

              expect(await mock.callStatic.getBoolean()).to.equal(expected2)
            })

            it('should be able to reset and change behaviors', async () => {
              const expected1 = true
              mock.smocked.functions.getBoolean.will.return.with(expected1)

              expect(await mock.callStatic.getBoolean()).to.equal(expected1)

              const expected2 = false
              mock.smocked.functions.getBoolean.reset()

              expect(await mock.callStatic.getBoolean()).to.equal(expected2)

              const expected3 = true
              mock.smocked.functions.getBoolean.will.return.with(expected3)

              expect(await mock.callStatic.getBoolean()).to.equal(expected3)
            })
          })

          describe('for a uint256', () => {
            it('should return zero after resetting', async () => {
              const expected1 = 1234
              mock.smocked.functions.getUint256.will.return.with(expected1)

              expect(await mock.callStatic.getUint256()).to.equal(expected1)

              const expected2 = 0
              mock.smocked.functions.getUint256.reset()

              expect(await mock.callStatic.getUint256()).to.equal(expected2)
            })

            it('should be able to reset and change behaviors', async () => {
              const expected1 = 1234
              mock.smocked.functions.getUint256.will.return.with(expected1)

              expect(await mock.callStatic.getUint256()).to.equal(expected1)

              const expected2 = 0
              mock.smocked.functions.getUint256.reset()

              expect(await mock.callStatic.getUint256()).to.equal(expected2)

              const expected3 = 4321
              mock.smocked.functions.getUint256.will.return.with(expected3)

              expect(await mock.callStatic.getUint256()).to.equal(expected3)
            })
          })

          describe('for a bytes32', () => {
            it('should return 32 zero bytes after resetting', async () => {
              const expected1 =
                '0x1234123412341234123412341234123412341234123412341234123412341234'
              mock.smocked.functions.getBytes32.will.return.with(expected1)

              expect(await mock.callStatic.getBytes32()).to.equal(expected1)

              const expected2 =
                '0x0000000000000000000000000000000000000000000000000000000000000000'
              mock.smocked.functions.getBytes32.reset()

              expect(await mock.callStatic.getBytes32()).to.equal(expected2)
            })

            it('should be able to reset and change behaviors', async () => {
              const expected1 =
                '0x1234123412341234123412341234123412341234123412341234123412341234'
              mock.smocked.functions.getBytes32.will.return.with(expected1)

              expect(await mock.callStatic.getBytes32()).to.equal(expected1)

              const expected2 =
                '0x0000000000000000000000000000000000000000000000000000000000000000'
              mock.smocked.functions.getBytes32.reset()

              expect(await mock.callStatic.getBytes32()).to.equal(expected2)

              const expected3 =
                '0x4321432143214321432143214321432143214321432143214321432143214321'
              mock.smocked.functions.getBytes32.will.return.with(expected3)

              expect(await mock.callStatic.getBytes32()).to.equal(expected3)
            })
          })
        })
      })

      describe('dynamic data types', () => {
        describe('from a specified value', () => {
          it('should be able to return a bytes value', async () => {
            const expected =
              '0x56785678567856785678567856785678567856785678567856785678567856785678567856785678567856785678567856785678567856785678567856785678'
            mock.smocked.functions.getBytes.will.return.with(expected)

            expect(await mock.callStatic.getBytes()).to.equal(expected)
          })

          it('should be able to return a string value', async () => {
            const expected = 'this is an expected return string'
            mock.smocked.functions.getString.will.return.with(expected)

            expect(await mock.callStatic.getString()).to.equal(expected)
          })

          it('should be able to return a struct with fixed size values', async () => {
            const expected = {
              valBoolean: true,
              valUint256: BigNumber.from(1234),
              valBytes32:
                '0x1234123412341234123412341234123412341234123412341234123412341234',
            }
            mock.smocked.functions.getStructFixedSize.will.return.with(expected)

            expect(
              toPlainObject(await mock.callStatic.getStructFixedSize())
            ).to.deep.include(expected)
          })

          it('should be able to return a struct with dynamic size values', async () => {
            const expected = {
              valBytes:
                '0x56785678567856785678567856785678567856785678567856785678567856785678567856785678567856785678567856785678567856785678567856785678',
              valString: 'this is an expected return string',
            }
            mock.smocked.functions.getStructDynamicSize.will.return.with(
              expected
            )

            expect(
              toPlainObject(await mock.callStatic.getStructDynamicSize())
            ).to.deep.include(expected)
          })

          it('should be able to return a struct with both fixed and dynamic size values', async () => {
            const expected = {
              valBoolean: true,
              valUint256: BigNumber.from(1234),
              valBytes32:
                '0x1234123412341234123412341234123412341234123412341234123412341234',
              valBytes:
                '0x56785678567856785678567856785678567856785678567856785678567856785678567856785678567856785678567856785678567856785678567856785678',
              valString: 'this is an expected return string',
            }
            mock.smocked.functions.getStructMixedSize.will.return.with(expected)

            expect(
              toPlainObject(await mock.callStatic.getStructMixedSize())
            ).to.deep.include(expected)
          })

          it('should be able to return a nested struct', async () => {
            const expected = {
              valStructFixedSize: {
                valBoolean: true,
                valUint256: BigNumber.from(1234),
                valBytes32:
                  '0x1234123412341234123412341234123412341234123412341234123412341234',
              },
              valStructDynamicSize: {
                valBytes:
                  '0x56785678567856785678567856785678567856785678567856785678567856785678567856785678567856785678567856785678567856785678567856785678',
                valString: 'this is an expected return string',
              },
            }
            mock.smocked.functions.getStructNested.will.return.with(expected)

            expect(
              toPlainObject(await mock.callStatic.getStructNested())
            ).to.deep.include({
              valStructFixedSize: toArray(expected.valStructFixedSize),
              valStructDynamicSize: toArray(expected.valStructDynamicSize),
            })
          })

          it('should be able to return an array of uint256 values', async () => {
            const expected = [1234, 2345, 3456, 4567, 5678, 6789].map((n) => {
              return BigNumber.from(n)
            })
            mock.smocked.functions.getArrayUint256.will.return.with(expected)

            expect(await mock.callStatic.getArrayUint256()).to.deep.equal(
              expected
            )
          })
        })
      })
    })

    describe('reverting with data', () => {
      describe('from a specified value', () => {
        it('should be able to revert with a string value', async () => {
          const expected = 'this is a revert string'
          mock.smocked.functions.getUint256.will.revert.with(expected)

          await expect(mock.callStatic.getUint256()).to.be.revertedWith(
            expected
          )
        })
      })

      describe('from a function', () => {
        it('should be able to revert with a string value', async () => {
          const expected = 'this is a revert string'
          mock.smocked.functions.getUint256.will.revert.with(() => {
            return expected
          })

          await expect(mock.callStatic.getUint256()).to.be.revertedWith(
            expected
          )
        })
      })

      describe('from an asynchronous function', () => {
        it('should be able to revert with a string value', async () => {
          const expected = async () => {
            return 'this is a revert string'
          }
          mock.smocked.functions.getUint256.will.revert.with(async () => {
            return expected()
          })

          await expect(mock.callStatic.getUint256()).to.be.revertedWith(
            await expected()
          )
        })
      })

      describe('resetting function behavior', async () => {
        describe('for a boolean', () => {
          it('should return false after resetting', async () => {
            const expected1 = 'this is a revert string'
            mock.smocked.functions.getBoolean.will.revert.with(expected1)

            await expect(mock.callStatic.getBoolean()).to.be.revertedWith(
              expected1
            )

            const expected2 = false
            mock.smocked.functions.getBoolean.reset()

            expect(await mock.callStatic.getBoolean()).to.equal(expected2)
          })

          it('should be able to reset and change behaviors', async () => {
            const expected1 = 'this is a revert string'
            mock.smocked.functions.getBoolean.will.revert.with(expected1)

            await expect(mock.callStatic.getBoolean()).to.be.revertedWith(
              expected1
            )

            const expected2 = false
            mock.smocked.functions.getBoolean.reset()

            expect(await mock.callStatic.getBoolean()).to.equal(expected2)

            const expected3 = true
            mock.smocked.functions.getBoolean.will.return.with(expected3)

            expect(await mock.callStatic.getBoolean()).to.equal(expected3)
          })
        })

        describe('for a uint256', () => {
          it('should return zero after resetting', async () => {
            const expected1 = 'this is a revert string'
            mock.smocked.functions.getUint256.will.revert.with(expected1)

            await expect(mock.callStatic.getUint256()).to.be.revertedWith(
              expected1
            )

            const expected2 = 0
            mock.smocked.functions.getUint256.reset()

            expect(await mock.callStatic.getUint256()).to.equal(expected2)
          })

          it('should be able to reset and change behaviors', async () => {
            const expected1 = 'this is a revert string'
            mock.smocked.functions.getUint256.will.revert.with(expected1)

            await expect(mock.callStatic.getUint256()).to.be.revertedWith(
              expected1
            )

            const expected2 = 0
            mock.smocked.functions.getUint256.reset()

            expect(await mock.callStatic.getUint256()).to.equal(expected2)

            const expected3 = 1234
            mock.smocked.functions.getUint256.will.return.with(expected3)

            expect(await mock.callStatic.getUint256()).to.equal(expected3)
          })
        })

        describe('for a bytes32', () => {
          it('should return 32 zero bytes after resetting', async () => {
            const expected1 = 'this is a revert string'
            mock.smocked.functions.getBytes32.will.revert.with(expected1)

            await expect(mock.callStatic.getBytes32()).to.be.revertedWith(
              expected1
            )

            const expected2 =
              '0x0000000000000000000000000000000000000000000000000000000000000000'
            mock.smocked.functions.getBytes32.reset()

            expect(await mock.callStatic.getBytes32()).to.equal(expected2)
          })

          it('should be able to reset and change behaviors', async () => {
            const expected1 = 'this is a revert string'
            mock.smocked.functions.getBytes32.will.revert.with(expected1)

            await expect(mock.callStatic.getBytes32()).to.be.revertedWith(
              expected1
            )

            const expected2 =
              '0x0000000000000000000000000000000000000000000000000000000000000000'
            mock.smocked.functions.getBytes32.reset()

            expect(await mock.callStatic.getBytes32()).to.equal(expected2)

            const expected3 =
              '0x4321432143214321432143214321432143214321432143214321432143214321'
            mock.smocked.functions.getBytes32.will.return.with(expected3)

            expect(await mock.callStatic.getBytes32()).to.equal(expected3)
          })
        })
      })
    })
  })
})
