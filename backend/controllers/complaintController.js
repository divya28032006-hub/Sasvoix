const Complaint = require("../models/Complaint");

const createComplaint = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    const complaint = await Complaint.create({
      title,
      description,
      category,
      user: req.user.id,
    });

    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("user", "name email")
      .sort({ votes: -1 });

    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(complaints);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const updateComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },  
      { new: true, runValidators: false }
    );

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.status(200).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const deleteComplaint = async (req, res) => {
  try {
    await Complaint.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Complaint deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// voteComplaint — replace the entire function body
const voteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    const alreadyVoted = complaint.voters.some(
      (voter) => voter.toString() === req.user.id
    );

    if (alreadyVoted) {
      return res.status(400).json({ message: "You already voted" });
    }

    // ✅ atomic update — no race condition
    const updated = await Complaint.findByIdAndUpdate(
      req.params.id,
      {
        $inc: { votes: 1 },
        $push: { voters: req.user.id },
      },
      { new: true }
    );

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updateStatus = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { $set: { status: req.body.status } },
      { new: true, runValidators: false }
    );

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.status(200).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getDashboardStats = async (req, res) => {
  try {
    const totalComplaints =
      await Complaint.countDocuments();

    const pendingComplaints =
      await Complaint.countDocuments({
        status: "Pending",
      });

    const inProgressComplaints =
      await Complaint.countDocuments({
        status: "In Progress",
      });

    const resolvedComplaints =
      await Complaint.countDocuments({
        status: "Resolved",
      });

    const topComplaint =
      await Complaint.findOne().sort({
        votes: -1,
      });

    res.status(200).json({
      totalComplaints,
      pendingComplaints,
      inProgressComplaints,
      resolvedComplaints,
      topComplaint,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = { createComplaint,getComplaints,updateComplaint,deleteComplaint 
,voteComplaint,updateStatus,getMyComplaints,getDashboardStats
};  