import { subtask } from 'hardhat/config'
import { TASK_COMPILE_SOLIDITY_GET_COMPILATION_JOB_FOR_FILE } from 'hardhat/builtin-tasks/task-names'
import { TASK_COMPILE_SOLIDITY_GET_ARTIFACT_FROM_COMPILATION_OUTPUT } from 'hardhat/builtin-tasks/task-names'

subtask(
  TASK_COMPILE_SOLIDITY_GET_COMPILATION_JOB_FOR_FILE,
  async (_, __, runSuper) => {
    const compilationJob = await runSuper()

    // Make sure we actually have an "outputSelection" object here. We won't have this field if the
    // compiler throws an error.
    const outputSelection =
      compilationJob?.solidityConfig?.settings?.outputSelection
    if (outputSelection) {
      // outputSelection['*']['*'] refers to selections that will be applied to all contracts. We
      // want the 'storageLayout' option to be applied to all contracts. First we need to make sure
      // that outputSelection['*']['*'] exists and is an array.

      // Handle the case where outputSelection['*'] doesn't exist.
      outputSelection['*'] = outputSelection['*'] || { '*': [] }

      // Handle the case where outputSelection['*']['*'] doesn't exist
      outputSelection['*']['*'] = outputSelection['*']['*'] || []

      // Make sure our contracts will be compiled with the 'storageLayout' option enabled.
      outputSelection['*']['*'].push('storageLayout')

      // Quick solution to ensure that we don't accidentally push 'storageLayout' to the settings
      // repeatedly and end up bloating the compiler output. I've seen it happen. Compiler doesn't
      // care if the same thing is in this array multiple times, so we remove any duplicates for
      // the sake of developer experience.
      outputSelection['*']['*'] = Array.from(new Set(outputSelection['*']['*']))
    }

    return compilationJob
  }
)

subtask(
  TASK_COMPILE_SOLIDITY_GET_ARTIFACT_FROM_COMPILATION_OUTPUT,
  async ({ contractOutput }: { contractOutput: any }, __, runSuper) => {
    const artifact = await runSuper()
    artifact.storageLayout = contractOutput.storageLayout
    return artifact
  }
)
