const mongoose = require("mongoose");

const questionnaireSchema = new mongoose.Schema({
    question: {
        type: String
    },
    options: {
        type: [String]
    },
    correctAnswer: {
        type: Number
    }
});

const Questionnaire = mongoose.model("Questionnaire", questionnaireSchema);
module.exports = Questionnaire;