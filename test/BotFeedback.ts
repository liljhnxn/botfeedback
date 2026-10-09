import { expect } from "chai";
import hre from "hardhat";
const { ethers } = hre;
import { BotFeedback } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("BotFeedback Smart Contract", function () {
  let botFeedback: BotFeedback;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    const BotFeedbackFactory = await ethers.getContractFactory("BotFeedback");
    botFeedback = (await BotFeedbackFactory.deploy()) as BotFeedback;
    await botFeedback.waitForDeployment();
  });

  describe("Initial State", function () {
    it("should start with 0 feedback entries", async function () {
      expect(await botFeedback.getFeedbackCount()).to.equal(0);
      expect(await botFeedback.getAverageRating()).to.equal(0);
    });
  });

  describe("Submission", function () {
    it("should allow a user to submit valid feedback", async function () {
      const message = "Great network speed and smooth experience!";
      const rating = 5;

      const tx = await botFeedback.connect(user1).submitFeedback(message, rating);
      await tx.wait();

      expect(await botFeedback.getFeedbackCount()).to.equal(1);

      const entry = await botFeedback.getFeedback(0);
      expect(entry.sender).to.equal(user1.address);
      expect(entry.message).to.equal(message);
      expect(entry.rating).to.equal(rating);
      expect(entry.timestamp).to.be.gt(0);
    });

    it("should increase feedback count upon each submission", async function () {
      await botFeedback.connect(user1).submitFeedback("First feedback", 4);
      expect(await botFeedback.getFeedbackCount()).to.equal(1);

      await botFeedback.connect(user2).submitFeedback("Second feedback", 5);
      expect(await botFeedback.getFeedbackCount()).to.equal(2);
    });
  });

  describe("Validation", function () {
    it("should revert if message is empty", async function () {
      await expect(
        botFeedback.connect(user1).submitFeedback("", 5)
      ).to.be.revertedWith("Message cannot be empty");
    });

    it("should revert if message exceeds 280 characters", async function () {
      const longMessage = "a".repeat(281);
      await expect(
        botFeedback.connect(user1).submitFeedback(longMessage, 5)
      ).to.be.revertedWith("Message exceeds 280 characters");
    });

    it("should accept a message of exactly 280 characters", async function () {
      const boundaryMessage = "a".repeat(280);
      await expect(botFeedback.connect(user1).submitFeedback(boundaryMessage, 5)).to.not.be.reverted;
      expect(await botFeedback.getFeedbackCount()).to.equal(1);
    });

    it("should revert if rating is 0", async function () {
      await expect(
        botFeedback.connect(user1).submitFeedback("Valid message", 0)
      ).to.be.revertedWith("Rating must be between 1 and 5");
    });

    it("should revert if rating is greater than 5", async function () {
      await expect(
        botFeedback.connect(user1).submitFeedback("Valid message", 6)
      ).to.be.revertedWith("Rating must be between 1 and 5");
    });
  });

  describe("Multiple Submissions and Order", function () {
    it("should allow multiple wallets to submit feedback in correct order", async function () {
      await botFeedback.connect(user1).submitFeedback("User 1 feedback", 3);
      await botFeedback.connect(user2).submitFeedback("User 2 feedback", 5);
      await botFeedback.connect(owner).submitFeedback("Owner feedback", 4);

      expect(await botFeedback.getFeedbackCount()).to.equal(3);

      const entry0 = await botFeedback.getFeedback(0);
      const entry1 = await botFeedback.getFeedback(1);
      const entry2 = await botFeedback.getFeedback(2);

      expect(entry0.sender).to.equal(user1.address);
      expect(entry0.message).to.equal("User 1 feedback");
      expect(entry0.rating).to.equal(3);

      expect(entry1.sender).to.equal(user2.address);
      expect(entry1.message).to.equal("User 2 feedback");
      expect(entry1.rating).to.equal(5);

      expect(entry2.sender).to.equal(owner.address);
      expect(entry2.message).to.equal("Owner feedback");
      expect(entry2.rating).to.equal(4);
    });
  });

  describe("Events", function () {
    it("should emit FeedbackSubmitted event with correct values", async function () {
      const message = "Awesome dApp!";
      const rating = 5;

      const tx = await botFeedback.connect(user1).submitFeedback(message, rating);
      const receipt = await tx.wait();
      const block = await ethers.provider.getBlock(receipt!.blockNumber);

      await expect(tx)
        .to.emit(botFeedback, "FeedbackSubmitted")
        .withArgs(0, user1.address, rating, message, block!.timestamp);
    });
  });

  describe("Reading Feedback", function () {
    it("should correctly report getFeedbackCount", async function () {
      expect(await botFeedback.getFeedbackCount()).to.equal(0);
      await botFeedback.connect(user1).submitFeedback("Hello", 4);
      expect(await botFeedback.getFeedbackCount()).to.equal(1);
      await botFeedback.connect(user2).submitFeedback("World", 5);
      expect(await botFeedback.getFeedbackCount()).to.equal(2);
    });

    it("should return the correct entry for getFeedback(index)", async function () {
      await botFeedback.connect(user1).submitFeedback("Entry 0", 2);
      const [sender, msg, rating, timestamp] = await botFeedback.getFeedback(0);
      expect(sender).to.equal(user1.address);
      expect(msg).to.equal("Entry 0");
      expect(rating).to.equal(2);
      expect(timestamp).to.be.gt(0);
    });

    it("should revert if index is out of bounds", async function () {
      await expect(botFeedback.getFeedback(0)).to.be.revertedWith("Index out of bounds");

      await botFeedback.connect(user1).submitFeedback("Entry 0", 5);
      await expect(botFeedback.getFeedback(1)).to.be.revertedWith("Index out of bounds");
    });

    it("should calculate average rating correctly", async function () {
      // (4 + 5) / 2 = 4.5 -> scaled by 10 = 45
      await botFeedback.connect(user1).submitFeedback("Good", 4);
      await botFeedback.connect(user2).submitFeedback("Super", 5);

      const avg = await botFeedback.getAverageRating();
      expect(avg).to.equal(45); // represents 4.5
    });

    it("should return all feedback items via getAllFeedback", async function () {
      await botFeedback.connect(user1).submitFeedback("Msg 1", 3);
      await botFeedback.connect(user2).submitFeedback("Msg 2", 4);

      const list = await botFeedback.getAllFeedback();
      expect(list.length).to.equal(2);
      expect(list[0].message).to.equal("Msg 1");
      expect(list[1].message).to.equal("Msg 2");
    });
  });
});
