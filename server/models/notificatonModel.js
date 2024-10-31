import mongoose from "mongoose";
const { Schema } = mongoose;

const notificationSchema = Schema(
  {
    receiver: [{ type: Schema.Types.ObjectId, ref: "User" }],
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
