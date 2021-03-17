// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

contract TestHelpers_FallbackCaller {
    address target;

    function setTarget(
        address _target
    )
        external
    {
        target = _target;
    }

    function doFallback()
        public
        returns (
            bytes memory
        )
    {
        address tgt = target;
        bytes memory data = msg.data;
        bool success;
        bytes memory returndata;

        assembly {
            success := call(gas(), tgt, 0, add(data, 36), sub(mload(data), 4), 0, 0)
            let size := returndatasize()
            returndata := mload(0x40)
            mstore(0x40, add(add(returndata, 0x20), size))
            mstore(returndata, size)
            returndatacopy(add(returndata, 0x20), 0, size)
        }

        if (success) {
            return returndata;
        } else {
            assembly {
                revert(add(returndata, 0x20), mload(returndata))
            }
        }
    }
}
