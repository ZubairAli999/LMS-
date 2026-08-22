const mongoose = require("mongoose");

const { Schema } = mongoose;

/**
 * Create the Academic Term Schema
 */

const academicTermSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        duration: {
            type: String,
            required: true,
            default: "3 months", // TODO: make this dynamic based on user input
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            required: true,
        },
    },
    { timestamps: true }
);

const AcademicTerm = mongoose.model("AcademicTerm", academicTermSchema);

module.exports = AcademicTerm;