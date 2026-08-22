const express = require("express");
const isTeacher = require("../../middlewares/isTeacher");
const isTeacherLogin = require("../../middlewares/isTeacherLogin");
const { createQuestion, getQuestions, getQuestion, updateQuestion } = require("../../controller/academics/questionsCtrl");
const advancedResults = require("../../middlewares/advancedResults");
const Question = require("../../model/Academic/Questions");

const questionsRouter = express.Router();

questionsRouter.get('/', isTeacherLogin, isTeacher, advancedResults(Question) ,getQuestions);
questionsRouter.get('/:id', isTeacherLogin, isTeacher, getQuestion);
questionsRouter.post('/:examID', isTeacherLogin, isTeacher, createQuestion);
questionsRouter.put('/:id', isTeacherLogin, isTeacher, updateQuestion);


module.exports = questionsRouter;