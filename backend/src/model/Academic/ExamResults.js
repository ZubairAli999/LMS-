const mongoose = require("mongoose");

const { Schema } = mongoose;

// Exam result Schema
const  examResultSchema = new Schema(
  {
    studentID: {
        type: String,
        required: true,
    },
    exam: {
        type: Schema.Types.ObjectId,
        ref: "Exam",
        required: true,
    },
    grade: {
        type: Number,
        required: true,
    },
    score: {
        type: Number,
        required: true,
    },
    passMark: {
        type: Number,
        required: true,
        default: 30,
    },
    answeredQuestions : [
        {
            type: Object,
        }
    ],
    // failed/passed
    status: {
        type: String,
        required: true,
        enum: ["Fail", "Pass"],
        default: "Fail",
    },
    // Excellent/Good/Poor
    remarks: {
        type: String,
        required: true,
        enum: ["Excellent!", "Very Good", "Good", "Fair", "Needs Improvement"],
        default: "Poor",
    },
    classLevel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ClassLevel",
    },
    academicTerm: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AcademicTerm",
        required: true,
    },
    academicYear: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AcademicYear",
        required: true,
    },
    isPublished: {
        type: Boolean,
        default: false,
    },
  },
  {
    timestamps: true,
  },
);

const ExamResult = mongoose.model("ExamResult", examResultSchema);

module.exports = ExamResult;