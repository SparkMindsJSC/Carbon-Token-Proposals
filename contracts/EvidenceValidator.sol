// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./interfaces/IToken.sol";
import "./Token.sol";
import "./EvidenceStorage.sol";

contract EvidenceValidator {
    IToken public tokenContract;
    address public addressEvidenceStorage;

    event EvidenceValidated(address indexed submitter, bytes32 indexed evidenceHash, bool isValid);

    mapping(bytes32 => bool) public validatedEvidence;

    constructor(
        address _tokenContract,
        address _evidenceStorage) {
        tokenContract = IToken(_tokenContract);
        addressEvidenceStorage = _evidenceStorage; 
    }

    function isEvidenceValid(bytes32 evidenceHash) public view returns (bool) {
        // uint256 validDuration = 7 days;
        uint256 validDuration = 10 seconds;
        uint256 createAt = getCreateAtFromEvidenceStorage(evidenceHash);
        return (block.timestamp - createAt) >= validDuration;
    }

    function getCreateAtFromEvidenceStorage(bytes32 evidenceHash) public  view  returns  (uint256) {
        EvidenceStorage evidenceStorage = EvidenceStorage(addressEvidenceStorage);
        return evidenceStorage.getCreateAtFromHash(evidenceHash);
    } 

    function validateEvidence(bytes32 evidenceHash) public returns (bool) {
        require(!validatedEvidence[evidenceHash], "Evidence has already been validated");
        bool isValid = isEvidenceValid(evidenceHash);

        if (!isValid) {
            emit EvidenceValidated(msg.sender, evidenceHash, false);
            return false;
        }
   
        tokenContract.rewardForValidEvidence(msg.sender);
        validatedEvidence[evidenceHash] =true;
        emit EvidenceValidated(msg.sender, evidenceHash, true);
        return true;
    }

    modifier onlyValidEvidence(bytes32 evidenceHash) {
        require(isEvidenceValid(evidenceHash), "Evidence is not valid");
        _;
    } 
}