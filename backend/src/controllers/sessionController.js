import { chatClient, streamClient } from "../lib/stream.js";
import Session from "../models/Session.js";
import { randomUUID } from "crypto";

export async function createSession(req, res) {
  // generate a unique call id for stream video
  const callId = `session_${randomUUID()}`;

  try {
    const { problem, difficulty } = req.body;
    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    if (!problem || !difficulty) {
      return res
        .status(400)
        .json({ message: "Problem and difficulty are required" });
    }

    // we will need to set session because it will be bassing in streamcliente
    const session = await Session.create({
      problem,
      difficulty,
      host: userId,
      callId,
    });

    // create stream video call
    await streamClient.video.call("default", callId).getOrCreate({
      data: {
        created_by_id: clerkId,
        custom: { problem, difficulty, sessionId: session._id.toString() },
      },
    });

    // chat messaging
    const channel = chatClient.channel("messaging", callId, {
      name: `${problem} Session`,
      created_by_id: clerkId,
      members: [clerkId],
    });

    await channel.create();

    res.status(201).json({ session });
  } catch (error) {
    try {
      console.error("Error in createSession controller:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
      const exist = await Session.findOne({ callId });
      if (exist) {
        await Session.deleteOne({ callId });
        try {
          await streamClient.video
            .call("default", callId)
            .delete({ hard: true });
        } catch (cleanupError) {
          console.error("Failed to cleanup video call:", cleanupError.message);
        }
        try {
          const channel = chatClient.channel("messaging", callId);
          await channel.delete();
        } catch (cleanupError) {
          console.error(
            "Failed to cleanup chat channel:",
            cleanupError.message
          );
        }
      }
    } catch (rollback) {
      console.error(
        "Failed rollback on error of createSession: ",
        rollback.message
      );
    }
  }
}

export async function getActiveSessions(_, res) {
  try {
    const sessions = await Session.find({ status: "active" })
      .populate("host", "name profileImage email clerkId")
      .populate("participant", "name profileImage email clerkId")
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ sessions });
  } catch (error) {
    console.log("Error in getActiveSessions controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getMyRecentSessions(req, res) {
  try {
    const userId = req.user._id;

    // get sessions where user is either host or participant
    const sessions = await Session.find({
      status: "completed",
      $or: [{ host: userId }, { participant: userId }],
    })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ sessions });
  } catch (error) {
    console.log("Error in getMyRecentSessions controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getSessionById(req, res) {
  try {
    const { id } = req.params;

    const session = await Session.findById(id)
      .populate("host", "name email profileImage clerkId")
      .populate("participant", "name email profileImage clerkId");

    if (!session) return res.status(404).json({ message: "Session not found" });

    res.status(200).json({ session });
  } catch (error) {
    console.log("Error in getSessionById controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function joinSession(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    const session = await Session.findById(id);

    if (!session) return res.status(404).json({ message: "Session not found" });

    if (session.status !== "active") {
      return res
        .status(400)
        .json({ message: "Cannot join a completed session" });
    }

    if (session.host.toString() === userId.toString()) {
      return res
        .status(400)
        .json({ message: "Host cannot join their own session as participant" });
    }

    // check if session is already full - has a participant
    if (session.participant)
      return res.status(409).json({ message: "Session is full" });

    const channel = chatClient.channel("messaging", session.callId);
    await channel.addMembers([clerkId]);

    // add it at the end so if chat fails no false data stored
    session.participant = userId;
    await session.save();

    res.status(200).json({ session });
  } catch (error) {
    console.log("Error in joinSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function endSession(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const session = await Session.findById(id);

    if (!session) return res.status(404).json({ message: "Session not found" });

    // check if user is the host
    if (session.host.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Only the host can end the session" });
    }

    // check if session is already completed
    if (session.status === "completed") {
      return res.status(400).json({ message: "Session is already completed" });
    }

    // delete stream video call
    try {
      const call = streamClient.video.call("default", session.callId);
      await call.delete({ hard: true });
    } catch (externalError) {
      console.error("Stream could not being deleted: ", externalError.members);
    }

    // delete stream chat channel
    try {
      const channel = chatClient.channel("messaging", session.callId);
      await channel.delete();
    } catch (externalError) {
      console.error("Chat could not being deleted", externalError.message);
    }

    // first complete session in db before closing the others
    session.status = "completed";
    await session.save();

    res.status(200).json({ session, message: "Session ended successfully" });
  } catch (error) {
    console.log("Error in endSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
