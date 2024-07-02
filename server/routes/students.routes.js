const { isAuth } = require("../middleware/jwt.middleware");
const Student = require("../model/Student.model");
const Students = require("../model/Student.model");
const router = require("express").Router();

/**
 * Retrieves all of the students in the database collection
 */
router.get("/", isAuth, async (req, res, next) => {
    try {
        const students = await Students.find({}).populate("cohort");
        res.status(200).json(students);
    } catch (error) {
        next(error);
    }
});

/**
 * Creates a new student
 */
router.post("/", isAuth, async (req, res, next) => {
    try {
        const { firstName, lastName, email, phone, linkedinUrl, languages, program, background, image, cohort } = req.body;

        const newStudent = {
            firstName,
            lastName,
            email,
            phone,
            linkedinUrl,
            languages,
            program,
            background,
            image,
            cohort,
        };
        const createdStudent = await Student.create(newStudent);
        res.status(201).json(createdStudent);
    } catch (error) {
        next(error);
    }
});

/**
 * Retrieves all of the students for a given cohort
 */
router.get("/cohort/:cohortId", isAuth, async (req, res, next) => {
    try {
        const { cohortId } = req.params;
        const studentsCohort = await Student.find({ cohort: cohortId }).populate("cohort");
        res.status(200).json(studentsCohort);
    } catch (error) {
        next(error);
    }
});

/**
 * Retrieves a specific student by id
 */
router.get("/:studentId", isAuth, async (req, res, next) => {
    try {
        const { studentId } = req.params;
        const student = await Student.findById(studentId).populate("cohort");
        res.status(200).json(student);
    } catch (error) {
        next(error);
    }
});
/**
 * ? Updates a specific student by id
 */
router.put("/:studentId", isAuth, async (req, res, next) => {
    try {
        const { studentId } = req.params;
        const updatedStudent = req.body;
        const student = await Student.findByIdAndUpdate(studentId, updatedStudent);
        res.status(200).json(student);
    } catch (error) {
        next(error);
    }
});

/**
 * Deletes a specific student by id
 */
router.delete("/:studentId", isAuth, async (req, res, next) => {
    try {
        const { studentId } = req.params;
        const student = await Student.findByIdAndDelete(studentId);
        res.status(202).json(student);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
