import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  problem: {
    type: String,
    requires: true,
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    required: true,
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  participant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  status: {
    type: String,
    enume: ["active", "completed"],
    default: "active"
  },
  callId: {
    type: String,
    default: ""
  }
});

const Session = mongoose.model("Session", sessionSchema);

export default Session;
