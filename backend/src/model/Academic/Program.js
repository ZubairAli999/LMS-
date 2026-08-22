const mongoose = require("mongoose");

const { Schema } = mongoose;

const ProgramSchema = new Schema(
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
      default: "4 years",
    },
    // created automatically
    //CSFTY
    code: {
      type: String,
      default: function() { // Changed to a regular function
        return (
          this.name
            .split(" ")
            .map(function(name) { return name[0]; })
            .join("")
            .toUpperCase() +
          Math.floor(10 + Math.random() * 90) +
          Math.floor(10 + Math.random() * 90)
        );
      },
    },    
    createdBy: {
      type: Schema.Types.ObjectId, // mongoose referencing
      ref: "Admin", // model to reference
      required: true,
    },
    //we will push the teachers that are in charge of the program
    teachers: [
      {
        type: Schema.Types.ObjectId, // mongoose referencing
        ref: "Teacher", // model
      },
    ],
    students: [
      {
        type: Schema.Types.ObjectId, // mongoose referencing
        ref: "Student", // model
        default: [],
      },
    ],
    //we will push the subjects that are in the program when the program is created
    subjects: [
      {
        type: Schema.Types.ObjectId, // mongoose referencing
        ref: "Subject", // model
        default: [],
      },
    ],
  },
  { timestamps: true }
);
const Program = mongoose.model("Program", ProgramSchema);

module.exports = Program;