// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

contract TestHelpers_InternalReturnContract {
    function getBoolean()
        public
        returns (
            bool _out1
        )
    {
        return _getBoolean();
    }

    function _getBoolean()
        internal
        returns (
            bool _out1
        )
    {}

    function getUint256()
        public
        returns (
            uint256 _out1
        )
    {
        return _getUint256();
    }

    function _getUint256()
        internal
        returns (
            uint256 _out1
        )
    {}

    function getBytes32()
        public
        returns (
            bytes32 _out1
        )
    {
        return _getBytes32();
    }

    function _getBytes32()
        internal
        returns (
            bytes32 _out1
        )
    {}

    function getBytes()
        public
        returns (
            bytes memory _out1
        )
    {
        return _getBytes();
    }

    function _getBytes()
        internal
        returns (
            bytes memory _out1
        )
    {}

    function getString()
        public
        returns (
            string memory _out1
        )
    {
        return _getString();
    }

    function _getString()
        internal
        returns (
            string memory _out1
        )
    {}

    function getInputtedBoolean(
        bool _in1
    )
        public
        returns (
            bool _out1
        )
    {
        return _getInputtedBoolean(_in1);
    }

    function _getInputtedBoolean(
        bool _in1
    )
        internal
        returns (
            bool _out1
        )
    {}

    function getInputtedUint256(
        uint256 _in1
    )
        public
        returns (
            uint256 _out1
        )
    {
        return _getInputtedUint256(_in1);
    }

    function _getInputtedUint256(
        uint256 _in1
    )
        internal
        returns (
            uint256 _out1
        )
    {}

    function getInputtedBytes32(
        bytes32 _in1
    )
        public
        returns (
            bytes32 _out1
        )
    {
        return _getInputtedBytes32(_in1);
    }

    function _getInputtedBytes32(
        bytes32 _in1
    )
        internal
        returns (
            bytes32 _out1
        )
    {}

    struct StructFixedSize {
        bool valBoolean;
        uint256 valUint256;
        bytes32 valBytes32;
    }

    function getStructFixedSize()
        public
        returns (
            StructFixedSize memory _out1
        )
    {
        return _getStructFixedSize();
    }

    function _getStructFixedSize()
        internal
        returns (
            StructFixedSize memory _out1
        )
    {}

    struct StructDynamicSize {
        bytes valBytes;
        string valString;
    }

    function getStructDynamicSize()
        public
        returns (
            StructDynamicSize memory _out1
        )
    {
        return _getStructDynamicSize();
    }

    function _getStructDynamicSize()
        internal
        returns (
            StructDynamicSize memory _out1
        )
    {}

    struct StructMixedSize {
        bool valBoolean;
        uint256 valUint256;
        bytes32 valBytes32;
        bytes valBytes;
        string valString;
    }

    function getStructMixedSize()
        public
        returns (
            StructMixedSize memory _out1
        )
    {
        return _getStructMixedSize();
    }

    function _getStructMixedSize()
        internal
        returns (
            StructMixedSize memory _out1
        )
    {}

    struct StructNested {
        StructFixedSize valStructFixedSize;
        StructDynamicSize valStructDynamicSize;
    }

    function getStructNested()
        public
        returns (
            StructNested memory _out1
        )
    {
        return _getStructNested();
    }

    function _getStructNested()
        internal
        returns (
            StructNested memory _out1
        )
    {}

    function getArrayUint256()
        public
        returns (
            uint256[] memory _out
        )
    {
        return _getArrayUint256();
    }

    function _getArrayUint256()
        internal
        returns (
            uint256[] memory _out
        )
    {}
}
