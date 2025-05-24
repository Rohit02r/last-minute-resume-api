const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema({
  user: {
    name: String,
    // photo: String,
    loginId:  String ,
    
  },
  values: {
    name: String,
    summary: String,
  },
  skillsNo: [String],
  languagesNo: [String],
  hobbiesNo: [String],
  sskillsNo: [String],
  certificationNo: [
    {
      certificationName: String,
      provider: String,
    },
  ],
  acheivementNo: [
    {
      achievementName: String,
      achievementExplanation: String,
    },
  ],
  projectNo: [
    {
      projectName: String,
      projectExplanation: String,
    },
  ],
  edNo: [
    {
      collegeName: String,
      degreeName: String,
      percentage: String,
      completedYear: String,
    },
  ],
  contactEntries: [{ contact: String }],
});
ResumeSchema.index({ "user.loginId": 1 }, { unique: true });
module.exports = mongoose.model("Resume", ResumeSchema);
