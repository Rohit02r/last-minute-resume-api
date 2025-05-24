const express = require("express");
const router = express.Router();
const { createResume, updateResume ,getResumeByLoginId  } = require("../controllers/resumeController");

router.post("/resume", createResume);

router.patch("/resume/:loginId", updateResume);

router.get('/resume/:loginId', getResumeByLoginId);
module.exports = router;
