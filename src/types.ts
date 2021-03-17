/* Imports: External */
import { Contract, ContractFactory, ContractInterface } from 'ethers'
import { Provider } from '@ethersproject/providers'

export interface MockVariable {
  reset: () => void

  will: {
    be: (...args: any[]) => void
  }
}

export interface MockFunction {
  reset: () => void

  callArgsList: any[]
  calledWith: (...args: any[]) => boolean

  will: {
    use: {
      gas: (amount: number) => void
    }

    return: {
      (): void

      with: (...args: any[]) => void
    }

    revert: {
      (): void

      with: (...args: any[]) => void
    }
  }
}

export interface MockLibrary {
  smocked: {
    functions: {
      [name: string]: MockFunction
    }
  }
}

export interface MockContract extends Contract {
  smocked: {
    fallback: MockFunction
    [name: string]: MockFunction
  }
}

export interface ModifiableContract extends Contract {
  smodded: {
    functions: {
      fallback: MockFunction
      [name: string]: MockFunction
    }

    variables: {
      [name: string]: MockVariable
    }
  }
}

// Smockit
export type SmockSpec = Contract | ContractFactory | ContractInterface

export interface SmockOptions {
  address?: string
  provider?: Provider
}

export type Smockit = (
  spec: SmodSpec,
  options?: SmodOptions
) => Promise<MockContract>

// Smoddit
export type SmodSpec = string | Object

export interface SmodOptions {
  address?: string
  provider?: Provider
}

export type Smoddit = (
  spec: SmodSpec,
  options?: SmodOptions
) => Promise<ModifiableContract>
