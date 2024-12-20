import { expect } from "chai";
import { ethers } from "hardhat";

describe("Voting Contract", function () {
    let voting: any;
    let owner: any;
    let addr1: any;
    let addr2: any;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();
        const Voting = await ethers.getContractFactory("YourContract");
        voting = await Voting.deploy();
    });

    it("Should add a voter", async function () {
        await voting.addVoter(addr1.address);
        expect(await voting.voters(addr1.address)).to.equal(true);
    });

    it("Should start voting with options", async function () {
        await voting.startVoting([1, 2, 3]);
        expect(await voting.votingActive()).to.equal(true);
        const options = await voting.getOptions();
        expect(options).to.deep.equal([1, 2, 3]);
    });

    it("Should allow a voter to vote", async function () {
        await voting.addVoter(addr1.address);
        await voting.startVoting([1, 2, 3]);
        await voting.connect(addr1).vote(1);
        expect(await voting.getVotes(1)).to.equal(1);
    });

    it("Should not allow double voting", async function () {
        await voting.addVoter(addr1.address);
        await voting.startVoting([1, 2, 3]);
        await voting.connect(addr1).vote(1);
        await expect(voting.connect(addr1).vote(2)).to.be.revertedWith("You are not allowed to vote");
    });
});