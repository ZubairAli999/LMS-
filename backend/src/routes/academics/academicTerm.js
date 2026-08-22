const express = require("express");
const {
  createAcademicTerm,
  getAcademicTerm,
  deleteAcademicTerm,
  getAcademicTerms,
  updateAcademicTerm,
} = require("../../controller/academics/academicTermCtrl");
const advancedResults = require("../../middlewares/advancedResults");
const AcademicTerm = require("../../model/Academic/AcademicTerm");
const isAuthenticated = require("../../middlewares/isAuthenticated");
const Admin = require("../../model/Staff/Admin");
const roleRestriction = require("../../middlewares/roleRestriction");

const academicTermRouter = express.Router();

/**
 * updated chained routes
 */
academicTermRouter
  .route("/")
  .post(isAuthenticated(Admin), roleRestriction("admin"), createAcademicTerm)
  .get(isAuthenticated(Admin), roleRestriction("admin"), advancedResults(AcademicTerm), getAcademicTerms);

academicTermRouter
  .route("/:id")
  .get(isAuthenticated(Admin), roleRestriction("admin"), getAcademicTerm)
  .put(isAuthenticated(Admin), roleRestriction("admin"), updateAcademicTerm)
  .delete(isAuthenticated(Admin), roleRestriction("admin"), deleteAcademicTerm);

module.exports = academicTermRouter;
