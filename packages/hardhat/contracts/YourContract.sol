// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract YourContract {
    address public owner;
    mapping(address => bool) public voters;
    mapping(uint => uint) public votes;
    uint[] public options;
    bool public votingActive;

    event VoterAdded(address voter);
    event Voted(address voter, uint option);

    constructor() {
        owner = msg.sender;
        votingActive = false;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    modifier onlyVoter() {
        require(voters[msg.sender], "You are not allowed to vote");
        _;
    }

    function addVoter(address _voter) public onlyOwner {
        require(!votingActive, "Voting is already active");
        voters[_voter] = true;
        emit VoterAdded(_voter);
    }

    function startVoting(uint[] memory _options) public onlyOwner {
        require(!votingActive, "Voting is already active");
        options = _options;
        votingActive = true;
    }

    function vote(uint _option) public onlyVoter {
        require(votingActive, "Voting is not active");
        require(isOptionValid(_option), "Invalid option");
        votes[_option] += 1;
        voters[msg.sender] = false; // Prevent double voting
        emit Voted(msg.sender, _option);
    }

    function isOptionValid(uint _option) public view returns (bool) {
        for (uint i = 0; i < options.length; i++) {
            if (options[i] == _option) {
                return true;
            }
        }
        return false;
    }

    function getVotes(uint _option) public view returns (uint) {
        return votes[_option];
    }

    function getOptions() public view returns (uint[] memory) {
        return options;
    }

    function endVoting() public onlyOwner {
        require(votingActive, "Voting is not active");
        votingActive = false;
    }
}