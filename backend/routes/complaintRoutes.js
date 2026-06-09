const express = require("express");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
const {
  createComplaint,
  getComplaints,
  updateComplaint,
  deleteComplaint,
  voteComplaint,
  updateStatus,
  getMyComplaints,
} = require("../controllers/complaintController");

const router = express.Router();

router.post("/", protect, createComplaint);
router.get("/", getComplaints);
router.get("/my", protect, getMyComplaints);

router.put("/:id/vote", protect, voteComplaint);
router.put("/:id/status", protect, adminOnly, updateStatus);

router.put("/:id", protect, adminOnly, updateComplaint);
router.delete("/:id", protect, adminOnly, deleteComplaint);

module.exports = router;