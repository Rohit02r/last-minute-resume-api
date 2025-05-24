const Resume = require('../models/Resume');

exports.createResume = async (req, res) => {
  try {
    if (req.body._id) delete req.body._id;

    const existingResume = await Resume.findOne({ "user.loginId": req.body.user?.loginId });

    if (existingResume) {
      return res.status(400).json({ error: "Resume already exists for this user. Use update instead." });
    }

    const resume = new Resume(req.body);
    await resume.save();
    res.status(201).json(resume);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.updateResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { "user.loginId": req.params.loginId },
      req.body,
      { new: true }
    );
    if (!resume) return res.status(404).json({ error: "Resume not found" });
    res.json(resume);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getResumeByLoginId = async (req, res) => {
  try {
    console.log("Fetching resume for loginId:", req.params.loginId);

    const resume = await Resume.findOne({ "user.loginId": req.params.loginId });

    if (!resume) {
      console.log("Resume not found for loginId:", req.params.loginId);
      return res.status(404).json({ error: "Resume not found" });
    }

    res.json(resume);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

