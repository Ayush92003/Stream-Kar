import User from "../models/User.js";
import FriendRequest from "../models/User.js";

export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user._id;
    const currentUser = req.user;

    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId } }, // Excludes current user
        { _id: { $nin: currentUser.friends } }, // Excludes current users's friends
        { isOnboarded: true },
      ],
    });

    res.status(200).json(recommendedUsers);
  } catch (error) {
    console.log("Error in getRecommendedUsers controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getMyFriends(req, res) {
  try {
    const user = await User.findById(req.user._id)
      .select("friends")
      .populate(
        "friends",
        "fullName profilePic nativeLanguage learningLanguage"
      );
    res.status(200).json(user.friends);
  } catch (error) {
    console.log("Error in getMyFriends controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function sendFriendRequest(req, res) {
  try {
    const recipientId = req.params.id;
    const senderId = req.user._id;

    // Check if the recipientId is a valid ObjectId
    if (!recipientId || !senderId) {
      return res
        .status(400)
        .json({ message: "Invalid recipient or sender ID." });
    }

    // Check if the recipientId is the same as the senderId
    if (recipientId === senderId) {
      return res
        .status(400)
        .json({ message: "You cannot send a friend request to yourself." });
    }

    // Check if the recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found." });
    }

    // Check if the recipient is already a friend
    const sender = req.user;
    if (
      sender.friends.includes(recipientId) ||
      recipient.friends.includes(senderId)
    ) {
      return res
        .status(400)
        .json({ message: "You are already friends with this user." });
    }
    // Check if a friend request already exists
    const existingRequest = await FriendRequest.findOne({
      sender: senderId,
      recipient: recipientId,
    });
    if (existingRequest) {
      return res.status(400).json({ message: "Friend request already sent." });
    }
    // Create a new friend request
    const newFriendRequest = new FriendRequest({
      sender: senderId,
      recipient: recipientId,
    });
    await newFriendRequest.save();

    res.status(200).json({ message: "Friend request sent successfully." });
  } catch (error) {
    console.log("Error in sendFriendRequest controller", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function acceptFriendRequest(req, res) {
  try {
    const recipientId = req.user._id;
    const senderId = req.params.id;

    // Check if the recipientId is a valid ObjectId
    if (!recipientId || !senderId) {
      return res
        .status(400)
        .json({ message: "Invalid recipient or sender ID." });
    }

    // Check if the recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found." });
    }

    // Check if the sender exists
    const sender = await User.findById(senderId);
    if (!sender) {
      return res.status(404).json({ message: "Sender not found." });
    }
    // Check if the sender has sent a friend request to the recipient
    const friendRequest = await FriendRequest.findOne({
      sender: senderId,
      recipient: recipientId,
    });
    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found." });
    }
    // Verify if current user is the recipient
    if (friendRequest.recipient.toString() !== recipientId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to accept this request." });
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    // Add the sender to the recipient's friends list
    recipient.friends.push(senderId);
    await recipient.save();
    // Add the recipient to the sender's friends list
    sender.friends.push(recipientId);
    await sender.save();
    // Remove the friend request from the database
    await FriendRequest.deleteOne({ _id: friendRequest._id });

    res.status(200).json({ message: "Friend request accepted successfully." });
  } catch (error) {
    console.log("Error in acceptFriendRequest controller", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getFriendRequests(req, res) {
  try {
    const incomingRequest = await FriendRequest.find({
      recipient: req.user._id,
      status: "pending",
    })
      .populate(
        "sender",
        "fullName",
        "profilePic",
        "nativeLanguage",
        "learningLanguage"
      )
      .sort({ createdAt: -1 });

    const acceptedRequests = await FriendRequest.find({
      sender: req.user._id,
      status: "accepted",
    })
      .populate("recipient", "fullName", "profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json({
      incomingRequest,
      acceptedRequests,
    });
  } catch (error) {
    console.log("Error in getFriendRequests controller", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getOutgoingFriendRequests(req, res) {
  try {
    const outgoingRequests = await FriendRequest.find({
      sender: req.user._id,
      status: "pending",
    })
      .populate(
        "recipient",
        "fullName profilePic nativeLanguage learningLanguage"
      )
      .sort({ createdAt: -1 });

    res.status(200).json(outgoingRequests);
  } catch (error) {
    console.log("Error in getOutgoingFriendRequests controller", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}
