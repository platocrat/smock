import * as fs from 'fs'
import * as path from 'path'
import { glob } from 'glob'

export const getTestHelperJSON = (name: string): any => {
  const artifactPaths = glob.sync(
    path.resolve(__dirname, './temp/artifacts') + `/**/${name}.json`
  )

  if (artifactPaths.length === 0) {
    throw new Error(
      `[hardhat] Smock Test Error: Could not find artifact for: ${name}`
    )
  }

  if (artifactPaths.length > 1) {
    throw new Error(
      `[hardhat] Smock Test Error: Found multiple artifacts for: ${name}`
    )
  }

  const artifact = fs.readFileSync(artifactPaths[0]).toString()
  return JSON.parse(artifact)
}
