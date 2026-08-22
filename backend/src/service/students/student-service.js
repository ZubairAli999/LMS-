const Student = require('../../model/Academic/Student');
const StudentRepository = require('../../repository/academics/student-repository');
const ExamRepository = require('../../repository/academics/exam-repository');
const ExamResultsRepository = require('../../repository/academics/examResults-repository');
const AdminRepository = require('../../repository/staff/admin-repository');
const { hashPassword, isPassMatched } = require('../../utils/helpers');
const generateToken = require('../../utils/generateToken');
const { STATUS } = require('../../utils/constants');
const logger = require('../../config/logger');

const studentRepository = new StudentRepository();
const examRepository = new ExamRepository();
const examResultsRepository = new ExamResultsRepository();
const adminRepository = new AdminRepository();

/**
 * adminId -> id of the admin registering the student
 * data    -> object containing name, email and password of the new student
 * returns the newly created student object
 */
const adminRegisterStudent = async (adminId, data) => {
    try {
        // find the admin
        const adminFound = await adminRepository.get(adminId);
        if (!adminFound) {
            logger.warn(`Admin not found with ID: ${adminId}`);
            throw {
                err: 'Admin not found',
                code: STATUS.NOT_FOUND,
            };
        }
        // check if the student already exists
        const student = await studentRepository.findByEmail(data.email);
        if (student) {
            logger.warn(`Student currently exists with email: ${data.email}`);
            throw {
                err: 'Student currently exists',
                code: STATUS.BAD_REQUEST,
            };
        }
        // hash password
        const hashedPassword = await hashPassword(data.password);
        // Student created
        const studentRegistered = await studentRepository.create({
            name: data.name,
            email: data.email,
            password: hashedPassword,
        });
        // push student into admin
        await adminRepository.pushToField(adminId, 'students', studentRegistered?._id);

        logger.info(`Student registered in database with ID: ${studentRegistered._id}`);
        return studentRegistered;
    } catch (error) {
        if (error.name === 'ValidationError') {
            let err = {};
            Object.keys(error.errors).forEach((key) => {
                err[key] = error.errors[key].message;
            });
            logger.warn(`Student validation error: ${JSON.stringify(err)}`);
            throw { err: err, code: STATUS.UNPROCESSABLE_ENTITY };
        }
        logger.error(`Error registering student: ${error.err || error.message}`);
        throw error;
    }
};

/**
 * email    -> email used to identify the student logging in
 * password -> plain text password to verify against the stored hash
 * returns a signed authentication token for the student
 */
const loginStudent = async (email, password) => {
    // find the student user obj
    const student = await studentRepository.findByEmail(email);
    if (!student) {
        logger.warn(`Invalid login credentials for email: ${email}`);
        throw {
            err: 'Invalid login credentials',
            code: STATUS.OK,
        };
    }
    // verify the password
    const isMatched = await isPassMatched(password, student?.password);
    if (!isMatched) {
        logger.warn(`Invalid login credentials for email: ${email}`);
        throw {
            err: 'Invalid login credentials',
            code: STATUS.OK,
        };
    }
    logger.info(`Student logged in with ID: ${student._id}`);
    return generateToken(student?._id);
};

/**
 * studentId -> id of the authenticated student whose profile is being fetched
 * returns an object with the student profile and the current exam result
 */
const getStudentProfile = async (studentId) => {
    const student = await studentRepository.getProfileWithResults(studentId);

    if (!student) {
        logger.warn(`Student not found with ID: ${studentId}`);
        throw {
            err: 'Student not found',
            code: STATUS.NOT_FOUND,
        };
    }
    // Get student profile
    const studentProfile = {
        name: student?.name,
        email: student?.email,
        currentClassLevel: student?.currentClassLevel,
        program: student?.program,
        dateAdmitted: student?.dateAdmitted,
        isSuspended: student?.isSuspended,
        isWithdrawn: student?.isWithdrawn,
        studentId: student?.studentId,
        prefectName: student?.prefectName,
    };
    // get student exam results
    const studentExamResults = student?.examResults;
    // current exam
    const currentExamResult = studentExamResults[studentExamResults.length - 1];
    // check if exam is published
    const isPublished = currentExamResult?.isPublished;

    logger.info(`Student profile fetched for ID: ${studentId}`);
    return {
        studentProfile,
        currentExamResult: isPublished ? currentExamResult : [],
    };
};

/**
 * studentID -> id used to identify the student to be fetched by an admin
 * returns the student object matching the id
 */
const getStudentByAdmin = async (studentID) => {
    try {
        // Try to find the student by ID
        const student = await studentRepository.get(studentID);
        // Check if the student was found
        if (!student) {
            logger.warn(`Student not found with ID: ${studentID}`);
            throw {
                err: 'Student not found',
                code: STATUS.NOT_FOUND,
            };
        }
        logger.info(`Student fetched by admin with ID: ${studentID}`);
        return student;
    } catch (error) {
        if (error.err) {
            throw error;
        }
        // If an error occurs (e.g., CastError for invalid ObjectId)
        logger.error(`Invalid student ID format for ID ${studentID}: ${error.message}`);
        throw {
            err: 'Invalid student ID format',
            code: STATUS.BAD_REQUEST,
            error: error.message,
        };
    }
};

/**
 * studentId -> id of the authenticated student updating their own profile
 * data      -> object containing email and optionally password to update
 * returns the updated student object
 */
const studentUpdateProfile = async (studentId, data) => {
    try {
        const { email, password } = data;
        // if email is taken
        const emailExists = await studentRepository.findByEmail(email);
        if (emailExists) {
            logger.warn(`This email already exists: ${email}`);
            throw {
                err: 'This email already exists',
                code: STATUS.BAD_REQUEST,
            };
        }
        // check if user is updating password
        let student;
        if (password) {
            // update user
            student = await studentRepository.update(studentId, {
                email,
                password: await hashPassword(password),
            });
        } else {
            // update user email
            student = await studentRepository.update(studentId, {
                email,
            });
        }
        logger.info(`Student profile updated with ID: ${studentId}`);
        return student;
    } catch (error) {
        if (error.name === 'ValidationError') {
            let err = {};
            Object.keys(error.errors).forEach((key) => {
                err[key] = error.errors[key].message;
            });
            logger.warn(`Student validation error during update with ID ${studentId}: ${JSON.stringify(err)}`);
            throw { err: err, code: STATUS.UNPROCESSABLE_ENTITY };
        }
        logger.error(`Error updating student profile with ID ${studentId}: ${error.err || error.message}`);
        throw error;
    }
};

/**
 * studentID -> id used to identify the student to be updated by an admin
 * data      -> object containing the fields to update
 * returns the updated student object
 */
const adminUpdateStudent = async (studentID, data) => {
    try {
        const {
            classLevels,
            academicYear,
            program,
            name,
            email,
            prefectName,
            isSuspended,
            isWithdrawn,
        } = data;

        // find the student by id
        const studentFound = await studentRepository.get(studentID);
        if (!studentFound) {
            logger.warn(`Student not found with ID: ${studentID}`);
            throw {
                err: 'Student not found',
                code: STATUS.NOT_FOUND,
            };
        }
        // update
        const studentUpdated = await studentRepository.update(studentID, {
            $set: {
                name,
                email,
                academicYear,
                program,
                prefectName,
                isSuspended,
                isWithdrawn,
            },
            $addToSet: {
                classLevels,
            },
        });
        logger.info(`Student updated by admin with ID: ${studentID}`);
        return studentUpdated;
    } catch (error) {
        if (error.name === 'ValidationError') {
            let err = {};
            Object.keys(error.errors).forEach((key) => {
                err[key] = error.errors[key].message;
            });
            logger.warn(`Student validation error during admin update with ID ${studentID}: ${JSON.stringify(err)}`);
            throw { err: err, code: STATUS.UNPROCESSABLE_ENTITY };
        }
        logger.error(`Error updating student by admin with ID ${studentID}: ${error.err || error.message}`);
        throw error;
    }
};

/**
 * studentAuthId -> id of the authenticated student taking the exam
 * examId        -> id of the exam being written
 * answers       -> array of answers submitted by the student
 * returns the success message payload after submitting the exam
 */
const writeExam = async (studentAuthId, examId, answers) => {
    // get student taking exam
    const studentFound = await studentRepository.get(studentAuthId);
    if (!studentFound) {
        logger.warn(`Student not found with ID: ${studentAuthId}`);
        throw {
            err: 'Student not found',
            code: STATUS.NOT_FOUND,
        };
    }
    // get exam
    // to populate multiple fields at once use .populate() for each field necessary
    const examFound = await examRepository.getWithQuestionsAndTerm(examId);

    if (!examFound) {
        logger.warn(`Exam not found with ID: ${examId}`);
        throw {
            err: 'Exam not found',
            code: STATUS.NOT_FOUND,
        };
    }
    // get questions to be answered
    const questions = examFound?.questions;
    // get all answers the user submitted
    const studentAnswers = answers;
    // check if student answered all questions
    if (studentAnswers.length !== questions.length) {
        logger.warn(`Student ${studentAuthId} has not answered all of the questions for exam ${examId}`);
        throw {
            err: 'You have not answered all of the questions',
            code: STATUS.BAD_REQUEST,
        };
    }

    /** Check if users name is already in students who took this exam using the id from student in the exam results as the query */
    const studentFoundInResults = await examResultsRepository.findByStudent(studentFound?._id);
    if (studentFoundInResults) {
        logger.warn(`Student ${studentAuthId} has already taken exam ${examId}`);
        throw {
            err: 'You have already taken this exam. Wait for your results.',
            code: STATUS.BAD_REQUEST,
        };
    }

    // Check if student is suspended
    if (studentFound.isWithdrawn || studentFound.isSuspended) {
        logger.warn(`Student ${studentAuthId} is withdrawn/suspended and cannot take exam ${examId}`);
        throw {
            err: 'You are withdrawn/suspended and cannot take this exam.',
            code: STATUS.BAD_REQUEST,
        };
    }

    // build report object - this will tell the student how many answers they got right/wrong
    let correctAnswers = 0;
    let wrongAnswers = 0;
    let status = ''; // failed/passed
    let grade = 0;
    let score = 0;
    let answeredQuestions = 0;
    let remarks = '';

    // check for answers
    // loop through questions to the possible answers
    for (let i = 0; i < questions.length; i++) {
        // find the single question
        const question = questions[i];
        // check if the answer is correct
        if (question.correctAnswer === studentAnswers[i]) {
            correctAnswers++;
            score++;
            question.isCorrect = true;
        } else {
            wrongAnswers++;
        }
    }

    // calculate reports
    const totalQuestions = questions.length;
    grade = (correctAnswers / questions.length) * 100;
    answeredQuestions = questions.map((question) => {
        return {
            question: question.question,
            correctAnswers: question.correctAnswer,
            isCorrect: question.isCorrect,
        };
    });

    if (grade >= 50) {
        status = Student.STUDENT_PASS;
    } else {
        status = Student.STUDENT_FAIL;
    }

    // Remarks
    if (grade >= 80) {
        remarks = 'Excellent!';
    } else if (grade >= 70) {
        remarks = 'Very Good';
    } else if (grade >= 60) {
        remarks = 'Good';
    } else if (grade >= 50) {
        remarks = 'Fair';
    } else {
        remarks = 'Needs Improvement';
    }

    // generate exam results
    const examResults = await examResultsRepository.create({
        studentID: studentFound?.studentId,
        exam: examFound?._id,
        grade,
        score,
        status,
        remarks,
        classLevel: examFound?.classLevel,
        academicTerm: examFound?.academicTerm,
        academicYear: examFound?.academicYear,
        answeredQuestions: answeredQuestions,
    });
    // push results into students
    studentFound.examResults.push(examResults?._id);
    // save
    await studentFound.save();

    /**
     * Promote Student to next Class Level or Term/Year if necessary
     */
    // Promote to level 200
    if (
        examFound.academicTerm.name === '3rd term' &&
        status === Student.STUDENT_PASS &&
        studentFound?.currentClassLevel === 'Level 100'
    ) {
        studentFound.classLevels.push('Level 200');
        studentFound.currentClassLevel = 'Level 200';
        await studentFound.save();
    }

    // Promote to level 300
    if (
        examFound.academicTerm.name === '3rd term' &&
        status === Student.STUDENT_PASS &&
        studentFound?.currentClassLevel === 'Level 200'
    ) {
        studentFound.classLevels.push('Level 300');
        studentFound.currentClassLevel = 'Level 300';
        await studentFound.save();
    }

    // Promote to level 400
    if (
        examFound.academicTerm.name === '3rd term' &&
        status === Student.STUDENT_PASS &&
        studentFound?.currentClassLevel === 'Level 300'
    ) {
        studentFound.classLevels.push('Level 400');
        studentFound.currentClassLevel = 'Level 400';
        await studentFound.save();
    }

    // Promote to level 500
    if (
        examFound.academicTerm.name === '3rd term' &&
        status === Student.STUDENT_PASS &&
        studentFound?.currentClassLevel === 'Level 400'
    ) {
        studentFound.classLevels.push('Level 500');
        studentFound.currentClassLevel = 'Level 500';
        await studentFound.save();
    }

    // Promote to Graduate
    if (
        examFound.academicTerm.name === '3rd term' &&
        status === Student.STUDENT_PASS &&
        studentFound?.currentClassLevel === 'Level 500'
    ) {
        studentFound.isGraduated = true;
        studentFound.yearGraduated = new Date();
        await studentFound.save();
    }

    logger.info(`Student ${studentAuthId} submitted exam ${examId} successfully`);
    return 'You have submitted your exam successfully. Check later for your results.';
};

module.exports = {
    adminRegisterStudent,
    loginStudent,
    getStudentProfile,
    getStudentByAdmin,
    studentUpdateProfile,
    adminUpdateStudent,
    writeExam,
};
