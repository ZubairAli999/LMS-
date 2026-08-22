const express = require("express");
const { createSubject, getSubjects, getSubject, updateSubject, deleteSubject } = require("../../controller/academics/subjectCtrl");
const isAdmin = require("../../middlewares/isAdmin");
const isLogin = require("../../middlewares/isLogin");
const advancedResults = require("../../middlewares/advancedResults");
const Subject = require("../../model/Academic/Subject");

const subjectRouter = express.Router();

/**
 * updated chained routes
 */
subjectRouter.post('/:programID', isLogin, isAdmin, createSubject);
subjectRouter.get('/', isLogin, isAdmin, advancedResults(Subject), getSubjects);
subjectRouter.get('/:id', isLogin, isAdmin, getSubject);
subjectRouter.put('/:id', isLogin, isAdmin, updateSubject);
subjectRouter.delete('/:id', isLogin, isAdmin, deleteSubject);

module.exports = subjectRouter;
