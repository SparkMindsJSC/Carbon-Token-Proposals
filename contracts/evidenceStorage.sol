// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "./Owner.sol";

contract EvidenceStorage is Owner {

    struct Evidence {
        address submitter;
        uint256 createAt;
        bytes signature;
    }
    
    constructor(address _owner) Owner(_owner) {

    } 

    mapping(bytes32 => Evidence) public evidences;
    
    bytes32[] public evidenceHashList;

    event EvidenceSubmitted(address indexed submitter, bytes32 indexed evidenceHash, bytes indexed _signature, uint256 createAt);

    modifier onlySubmitter(bytes32 evidenceHash) {
        require(msg.sender == evidences[evidenceHash].submitter, "Not the submmiter");
        _;
    }

    function submitEvidence(bytes32 _evidenceHash, bytes memory _signature) external  {
        require(evidences[_evidenceHash].submitter == address(0), "Evidence already submitted.");       
        uint256 timestamp = block.timestamp; 
        evidences[_evidenceHash] = Evidence({
            submitter: msg.sender,
            createAt: timestamp,
            signature:_signature
        });
        evidenceHashList.push(_evidenceHash);
       
        emit EvidenceSubmitted(msg.sender, _evidenceHash, _signature, timestamp);
    }

    function retrieveEvidence(bytes32 evidenceHash) external view onlySubmitter(evidenceHash) returns (address, uint256, bytes memory) {
        Evidence memory evidence = evidences[evidenceHash];
        return (evidence.submitter, evidence.createAt, evidence.signature);
    }

    function getAllEvidenceHashes() external onlyOwner view returns (bytes32[] memory) {
        return evidenceHashList;
    }

    function getCreateAtFromHash(bytes32 evidenceHash) external view returns (uint256) {
        return evidences[evidenceHash].createAt;
    }
}