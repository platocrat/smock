// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.7.0;

contract TestHelpers_BasicReturnContract {
    function empty()
        public
    {}

    function getBoolean()
        public
        returns (
            bool _out1
        )
    {
        return _out1;
    }

    function getUint256()
        public
        returns (
            uint256 _out1
        )
    {
        return _out1;
    }

    function getBytes32()
        public
        returns (
            bytes32 _out1
        )
    {
        return _out1;
    }

    function getBytes()
        public
        returns (
            bytes memory _out1
        )
    {
        return _out1;
    }

    function getString()
        public
        returns (
            string memory _out1
        )
    {
        return _out1;
    }
}
