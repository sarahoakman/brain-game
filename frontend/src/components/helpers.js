// create summaries of questions
const summariseQuestions = (questionsAnswers, quizQuestions) => {
  quizQuestions.forEach(question => {
    const q = {};
    q.id = question.id;
    q.points = question.points;
    q.time_limit = question.time_limit;
    questionsAnswers.push(q);
  })
  return questionsAnswers;
};

// initiate percentages with all questions to 0
const initialisePercentages = (questionsAnswers, percentages) => {
  for (const ques in questionsAnswers) {
    const newQ = {};
    const qnum = parseInt(ques) + 1;
    newQ.id = 'Question ' + qnum;
    newQ.count = 0;
    percentages.push(newQ);
  }
  return percentages;
}

// initiate time taken with all questions to max time
const initialiseTimeTaken = (questionsAnswers, timeTaken) => {
  for (const ques in questionsAnswers) {
    const newQ = {};
    const qnum = parseInt(ques) + 1;
    newQ.id = 'Question ' + qnum;
    const sections = questionsAnswers[ques].time_limit.split(':')
    newQ.time = parseInt(sections[0]) * 60 + parseInt(sections[1]);
    newQ.num = 0;
    timeTaken.push(newQ);
  }
  return timeTaken;
}

// match each question to points and time limit by index
const getValues = (results, questionsAnswers, players, percentages, timeTaken) => {
  results.forEach(player => {
    const p = {};
    p.name = player.name;
    p.total = 0;
    for (const ques in player.answers) {
      const foundQuestionPoints = questionsAnswers[ques].points;
      const foundQuestionTime = questionsAnswers[ques].time_limit;
      let time = null;
      const limit = '00:' + foundQuestionTime;
      [time, timeTaken] = calculateAvgTime(timeTaken, player.answers[ques], limit, ques);
      if (player.answers[ques].correct === true) {
        // count how many people got this q right
        percentages[ques].count = percentages[ques].count + 1;
        p.total = calculatePoints(time, limit, p.total, foundQuestionPoints);
      }
    }
    players.push(p);
  })
  return [percentages, timeTaken, players];
}

// calculate average time on the spot to answer a question
const calculateAvgTime = (timeTaken, question, limit, ques) => {
  let time = null;
  let seconds = 0;
  if (question.questionStartedAt === null || question.answeredAt === null) {
    // if person did not answer question, they took the whole max time limit
    const sections = limit.split(':')
    seconds = parseInt(sections[1]) * 60 + parseInt(sections[2]);
    time = '00:00:00';
  } else {
    const start = new Date(question.questionStartedAt)
    const end = new Date(question.answeredAt)
    if (end === start) { // no time difference
      time = '00:00:00';
    } else {
      // calculate the minutes and seconds of how long it took
      seconds = Math.round((end - start) / 1000);
      let min = Math.floor(seconds / 60);
      if (min === -1) min = 0;
      let sec = seconds - min * 60;
      if (min < 10) {
        min = '0' + min.toString();
      }
      if (sec < 10) {
        sec = '0' + sec.toString();
      }
      time = '00:' + min + ':' + sec;
    }
  }
  // average out time
  timeTaken[ques].time = Math.round((seconds +
    (timeTaken[ques].time * timeTaken[ques].num)) / (timeTaken[ques].num + 1));
  timeTaken[ques].num = timeTaken[ques].num + 1;
  return [time, timeTaken];
}

// calculate points including speed
const calculatePoints = (time, limit, total, foundQuestionPoints) => {
  const timeStart = new Date('01/01/2007 ' + time);
  const timeEnd = new Date('01/01/2007 ' + limit);
  const difference = Math.round((timeEnd - timeStart) / 1000);
  total = total + (difference * foundQuestionPoints);
  return total;
}

// find top 5 players
const findTopFive = (players) => {
  players.sort(function (a, b) { // descending order of scores
    return b.total - a.total;
  });
  if (players.length > 5) { // get top 5
    players = players.slice(0, 5);
  }
  return players;
}

export {
  summariseQuestions, initialisePercentages, initialiseTimeTaken,
  getValues, findTopFive, calculatePoints, calculateAvgTime
};
