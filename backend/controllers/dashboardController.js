const Complaint = require("../models/Complaint");

const getDashboardStats = async (req, res) => {
  try {
    const totalComplaints = await Complaint.countDocuments();

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

    const topComplaint = await Complaint.findOne()
      .sort({ votes: -1 });

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

module.exports = {
  getDashboardStats,
};