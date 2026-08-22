const express = require("express");
const isTeacher = require("../../middlewares/isTeacher");
const isTeacherLogin = require("../../middlewares/isTeacherLogin");
const { createExam, getExams, getExam, updateExam, deleteExam } = require("../../controller/academics/examsCtrl");
const Exam = require("../../model/Academic/Exam");
const advancedResults = require("../../middlewares/advancedResults");

const examRouter = express.Router();

examRouter
    .route("/")
    .post(isTeacherLogin, isTeacher, createExam)
    .get(isTeacherLogin, isTeacher, advancedResults(Exam, {
        path: "questions",
        populate: {
            path: "createdBy",
        }
    }), 
    getExams
);
    
examRouter
    .route("/:id")
    .get(isTeacherLogin, isTeacher, getExam)
    .put(isTeacherLogin, isTeacher, updateExam)
    .delete(isTeacherLogin, isTeacher, deleteExam);

module.exports=examRouter;