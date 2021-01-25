// All paths here are relative to package.json in the root directory.
module.exports = {
  contracts_directory: "./test/common/contracts",
  contracts_build_directory: "./test/suites/truffle/utils/temp/output",
  migrations_directory: "./test/suites/truffle/utils/temp/migrations",
  test_directory: "./test/suites/truffle/tests",

  compilers: {
    solc: {
      version: "0.7.6"
    }
  }
}
