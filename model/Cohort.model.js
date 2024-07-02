const mongoose = require("mongoose");
const { Schema } = mongoose;

//Mongoose Schemas
const cohortSchema = new Schema({
  cohortSlug: { type: String, unique: true, required: true }, // String is shorthand for {type: String}
  cohortName: { type: String, required: true },
  program: {
    type: String,
    enum: ["Web Dev", "UX/UI", "Data Analytics", "Cybersecurity"],
  },
  format: { type: String, enum: ["Full Time", "Part Time"] },
  campus: {
    type: String,
    enum: [
      "Madrid",
      "Barcelona",
      "Miami",
      "Paris",
      "Berlin",
      "Amsterdam",
      "Lisbon",
      "Remote",
    ],
  },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  inProgress: { type: Boolean, default: false },
  programManager: { type: String, required: true },
  leadTeacher: { type: String, required: true },
  totalHours: { type: Number, default: 360 },
});

//Export Mongoose models
const Cohort = mongoose.model("Cohort", cohortSchema); //creating a Model
module.exports = Cohort; //Exporting the created module.
