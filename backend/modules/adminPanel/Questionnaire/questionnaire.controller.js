const Questionnaire = require("./questionnaire.model");

exports.addQuestionnaire = async (req, res, next) => {
    const { question, options, correctAnswer } = req.body;
    try {
    } catch (err) {
        next(err)
    }
}