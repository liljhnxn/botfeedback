// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title BotFeedback
 * @notice A minimal on-chain feedback registry deployed on Botchain Testnet.
 * @dev Allows anyone to record short feedback messages and ratings permanently on-chain.
 */
contract BotFeedback {
    struct Feedback {
        address sender;
        string message;
        uint8 rating;
        uint256 timestamp;
    }

    uint256 public constant MAX_MESSAGE_LENGTH = 280;

    Feedback[] public feedbackEntries;

    event FeedbackSubmitted(
        uint256 indexed feedbackId,
        address indexed sender,
        uint8 rating,
        string message,
        uint256 timestamp
    );

    /**
     * @notice Submits a new feedback entry to the blockchain.
     * @param message Feedback text (1-280 bytes)
     * @param rating Rating score between 1 and 5
     */
    function submitFeedback(string calldata message, uint8 rating) external {
        require(bytes(message).length > 0, "Message cannot be empty");
        require(bytes(message).length <= MAX_MESSAGE_LENGTH, "Message exceeds 280 characters");
        require(rating >= 1 && rating <= 5, "Rating must be between 1 and 5");

        Feedback memory newFeedback = Feedback({
            sender: msg.sender,
            message: message,
            rating: rating,
            timestamp: block.timestamp
        });

        feedbackEntries.push(newFeedback);
        uint256 feedbackId = feedbackEntries.length - 1;

        emit FeedbackSubmitted(
            feedbackId,
            msg.sender,
            rating,
            message,
            block.timestamp
        );
    }

    /**
     * @notice Returns total number of submitted feedback entries.
     */
    function getFeedbackCount() external view returns (uint256) {
        return feedbackEntries.length;
    }

    /**
     * @notice Returns feedback details at a specific index.
     * @param index Position in feedbackEntries array
     */
    function getFeedback(uint256 index)
        external
        view
        returns (
            address sender,
            string memory message,
            uint8 rating,
            uint256 timestamp
        )
    {
        require(index < feedbackEntries.length, "Index out of bounds");
        Feedback storage entry = feedbackEntries[index];
        return (entry.sender, entry.message, entry.rating, entry.timestamp);
    }

    /**
     * @notice Returns the average rating scaled by 10 (e.g., 45 represents 4.5).
     * @return Average rating scaled by 10, or 0 if no feedback exists.
     */
    function getAverageRating() external view returns (uint256) {
        uint256 count = feedbackEntries.length;
        if (count == 0) {
            return 0;
        }

        uint256 total = 0;
        for (uint256 i = 0; i < count; i++) {
            total += feedbackEntries[i].rating;
        }

        return (total * 10) / count;
    }

    /**
     * @notice Helper to fetch all feedback entries in a single call.
     */
    function getAllFeedback() external view returns (Feedback[] memory) {
        return feedbackEntries;
    }
}
