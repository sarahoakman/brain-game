/*
 For a given data structure of a question, produce another
 object that doesn't contain any important meta data (e.g. the answer)
 to return to a "player"
*/
export const quizQuestionPublicReturn = question => {
  let publicQuestion = {
    "id": question.id,
    "type": question.type,
    "text": question.text,
    "time_limit": question.time_limit,
    "points": question.points,
    "answer": [],
    "src": question.src,
    "youtube": question.youtube,
  };
  question.answer.forEach(a => {
    publicQuestion.answer.push({
      "id": a.id,
      "text": a.text
    });
  });
  return publicQuestion;
};

/*
 For a given data structure of a question, get the IDs of
 the correct answers (minimum 1).
*/
export const quizQuestionGetCorrectAnswers = question => {
  let answers = [];
  question.answer.forEach(a => {
    if (a.correct) {
      answers.push(a.id);
    }
  })
  return answers;
};

/*
 For a given data structure of a question, get the IDs of
 all of the answers, correct or incorrect.
*/
export const quizQuestionGetAnswers = question => {
  let answers = [];
  question.answer.forEach(a => {
    answers.push(a.id)
  })
  return answers;
};

/*
 For a given data structure of a question, get the duration
 of the question once it starts. (Seconds)
*/
export const quizQuestionGetDuration = question => {
  let min = question.time_limit.split(':')[0];
  if (min[0] === '0') {
    min = min[1];
  }
  let sec = question.time_limit.split(':')[1];
  if (sec[0] === '0') {
    sec = sec[1];
  }
  return parseInt(min) * 60 + parseInt(sec);
};

/*
 example questions
 "questions": [
        {
          "id": 0,
          "type": "multiple",
          "text": "question 1 !",
          "time_limit": "00:20",
          "points": "10",
          "src": null,
          "answer": [
            {
              "id": 0,
              "text": "a",
              "correct": true
            },
            {
              "id": 1,
              "text": "b",
              "correct": true
            },
            {
              "id": 2,
              "text": "c",
              "correct": false
            },
            {
              "id": 3,
              "text": "d",
              "correct": false
            },
            {
              "id": 4,
              "text": "e",
              "correct": false
            },
            {
              "id": 5,
              "text": "f",
              "correct": false
            }
          ],
          "youtube": "https://www.youtube.com/watch?v=ug50zmP9I7s"
        }
  ],
*/