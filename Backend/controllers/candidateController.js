import Candidate from "../models/Candidate.js";

// PUBLIC
export const applyCandidate = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const candidate = await Candidate.create({
      name,
      email,
      phone,
      resumeUrl: "later", // we’ll add upload next
    });

    res.status(201).json({
      message: "Application submitted",
      candidate,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// HR ONLY
export const getAllCandidates = async (req, res) => {
  const candidates = await Candidate.find().sort({ createdAt: -1 });
  res.json(candidates);
};

// HR ONLY
export const updateCandidateStatus = async (req, res) => {
  const { status } = req.body;

  const candidate = await Candidate.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  res.json(candidate);
};
