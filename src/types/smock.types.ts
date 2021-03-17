export interface MockVariable {
  reset: () => void

  will: {
    be: (...args: any[]) => void
  }
}

export interface MockFunction {
  reset: () => void

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

export interface MockContract {
  smocked: {
    id: string
    address: string

    fallback: MockFunction

    functions: {
      [name: string]: MockFunction
    }
  }
}

export interface ModifiableContract {
  smocked: {
    id: string
    address: string

    fallback: MockFunction

    functions: {
      [name: string]: MockFunction
    }

    internal: {
      functions: {
        [name: string]: MockFunction
      }

      variables: {
        [name: string]: MockVariable
      }
    }
  }
}

export type Smockit<
  TSmockSpec,
  TSmockOptions,
  TSmockHost extends MockContract
> = (spec: TSmockSpec, options?: TSmockOptions) => Promise<TSmockHost>

export type Smoddit<
  TSmodSpec,
  TSmodOptions,
  TSmodHost extends ModifiableContract
> = (spec: TSmodSpec, options?: TSmodOptions) => Promise<TSmodHost>
