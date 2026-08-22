const express = require("express");
const {
  checkExamResults,
  getExamResults,
  adminToggleExamResult,
} = require("../../controller/academics/examResults");
const isStudent = require("../../middlewares/isStudent");
const isStudentLogin = require("../../middlewares/isStudentLogin");
const isAdmin = require("../../middlewares/isAdmin");
const isLogin = require("../../middlewares/isLogin");

const examResultRouter = express.Router();

examResultRouter.get("/:id/check", isStudentLogin, isStudent, checkExamResults);
examResultRouter.get("/", isStudentLogin, isStudent, getExamResults);

examResultRouter.put(
  "/:id/admin-toggle-publish",
  isLogin,
  isAdmin,
  adminToggleExamResult
);

module.exports = examResultRouter;
