const express = require("express");
const {
  createAcademicYear,
  getAcademicYears,
  getAcademicYear,
  updateAcademicYear,
  deleteAcademicYear,
} = require("../../controller/academics/academicYearCtrl");
const { create } = require("../../model/Academic/AcademicYear");
const AcademicYear = require("../../model/Academic/AcademicYear");
const advancedResults = require("../../middlewares/advancedResults");
const isAuthenticated = require("../../middlewares/isAuthenticated");
const Admin = require("../../model/Staff/Admin");
const roleRestriction = require("../../middlewares/roleRestriction");

const academicYearRouter = express.Router();

academicYearRouter
  .route("/")
  .post(isAuthenticated(Admin), roleRestriction("admin"), createAcademicYear)
  .get(
    isAuthenticated(Admin),
    roleRestriction("admin"),
    advancedResults(AcademicYear),
    getAcademicYears
  );

academicYearRouter
  .route("/:id")
  .get(isAuthenticated(Admin), roleRestriction("admin"), getAcademicYear)
  .put(isAuthenticated(Admin), roleRestriction("admin"), updateAcademicYear)
  .delete(isAuthenticated(Admin), roleRestriction("admin"), deleteAcademicYear);

module.exports = academicYearRouter;
