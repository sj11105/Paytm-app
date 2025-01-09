const express = require("express");
const { authMiddleware } = require("../middleware");
const router = express.Router();
const { account } = require("../db");
const { startSession, default: mongoose } = require("mongoose");

router.get("/balance", authMiddleware, async (req, res) => {
  const Accounts = await account.findOne({
    userId: req.userId,
  });
  res.json({
    balance: Accounts.balance,
  });
});

router.post("/transfer", authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { to, amount } = req.body;

    // Find sender's account
    const Account = await account
      .findOne({ userId: req.userid })
      .session(session);
    if (!Account) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Sender account not found" });
    }

    // Check if sender has sufficient balance
    if (Account.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Find recipient's account
    const toAccount = await account.findOne({ userId: to }).session(session);
    if (!toAccount) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Recipient account not found" });
    }

    await Account.updateOne(
      { userId: req.userId },
      { $inc: { balance: -amount } }
    ).session(session);
    await Account.updateOne(
      { userId: to },
      { $inc: { balance: -amount } }
    ).session(session);

    res.json({ message: "Transaction successful" });
  } catch (error) {
    // Rollback transaction on error
    await session.abortTransaction();
    session.endSession();
    res
      .status(500)
      .json({ message: "Transaction failed", error: error.message });
  }
});

module.exports = router;
