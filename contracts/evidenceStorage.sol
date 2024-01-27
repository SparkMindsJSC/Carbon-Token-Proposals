// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "./Owner.sol";

contract EvidenceStorage is Owner {

    struct Evidence {
        address submitter;
        uint256 createAt;
    }
    
    constructor(address _owner) Owner(_owner) {

    } 

    mapping(bytes32 => Evidence) public evidences;
    
    bytes32[] public evidenceHashList;

    event EvidenceSubmitted(address indexed submitter, bytes32 indexed evidenceHash, uint256 createAt);

    modifier onlySubmitter(bytes32 evidenceHash) {
        require(msg.sender == evidences[evidenceHash].submitter, "Not the submmiter");
        _;
    }

    function submitEvidence(bytes32 evidenceHash, uint256 createAt) external  {
        require(evidences[evidenceHash].submitter == address(0), "Evidence already submitted.");        
        evidences[evidenceHash] = Evidence(msg.sender, createAt);
        evidenceHashList.push(evidenceHash);
       
        emit EvidenceSubmitted(msg.sender, evidenceHash, createAt);
    }

    function retrieveEvidence(bytes32 evidenceHash) external view onlySubmitter(evidenceHash) returns (address, uint256) {
        Evidence memory evidence = evidences[evidenceHash];
        return (evidence.submitter, evidence.createAt);
    }

    function getAllEvidenceHashes() external onlyOwner view returns (bytes32[] memory) {
        return evidenceHashList;
    }

    function getCreateAtFromHash(bytes32 evidenceHash) external view returns (uint256) {
        return evidences[evidenceHash].createAt;
    }
}