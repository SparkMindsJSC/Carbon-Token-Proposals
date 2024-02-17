// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";

import "./interfaces/IToken.sol";
import "./Token.sol";
import "./EvidenceStorage.sol";

contract EvidenceValidator {
    using SignatureChecker for address;

    IToken public tokenContract;
    address public addressEvidenceStorage;

    event EvidenceValidated(address indexed submitter, bytes32 indexed evidenceHash, bool isValid);
    event SignatureVerified(address indexed submitter, bytes indexed signature, bool isVerified);

    mapping(bytes32 => bool) public validatedEvidence;

    constructor(
        address _tokenContract,
        address _evidenceStorage) {
        tokenContract = IToken(_tokenContract);
        addressEvidenceStorage = _evidenceStorage; 
    }

    function isEvidenceValid(bytes32 _evidenceHash) public view returns (bool) {
        // uint256 validDuration = 7 days;
        uint256 validDuration = 1 seconds;
        uint256 createAt = getCreateAtFromEvidenceStorage(_evidenceHash);
        return (block.timestamp - createAt) >= validDuration;
    }

    function getCreateAtFromEvidenceStorage(bytes32 _evidenceHash) public  view  returns  (uint256) {
        EvidenceStorage evidenceStorage = EvidenceStorage(addressEvidenceStorage);
        return evidenceStorage.getCreateAtFromHash(_evidenceHash);
    } 

    function isSignatureValid(bytes32 _evidenceHash, bytes memory _signature) public view returns (bool) {
        address _signer = msg.sender;
        _signer.isValidSignatureNow(_evidenceHash, _signature);

        bool resultValid = _signer.isValidSignatureNow(_evidenceHash, _signature);
        return resultValid;

    }

    function validateEvidence(bytes32 _evidenceHash, bytes memory _signature) public returns (bool) {
        require(!validatedEvidence[_evidenceHash], "Evidence has already been validated");
        require(isSignatureValid(_evidenceHash, _signature), "Signature invalid");

        bool isValid = isEvidenceValid(_evidenceHash);

        if (!isValid) {
            emit EvidenceValidated(msg.sender, _evidenceHash, false);
            return false;
        }
   
        tokenContract.rewardForValidEvidence(msg.sender);
        validatedEvidence[_evidenceHash] =true;
        emit EvidenceValidated(msg.sender, _evidenceHash, true);
        return true;
    }

    modifier onlyValidEvidence(bytes32 _evidenceHash) {
        require(isEvidenceValid(_evidenceHash), "Evidence is not valid");
        _;
    } 
}