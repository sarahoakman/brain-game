import React, { useEffect, useState } from 'react';
import { api } from '../api.jsx';
import PropTypes from 'prop-types';

// convert time from seconds to 00:00 format
function convertTime (time) {
  let min = Math.floor(time / 60);
  if (min < 10) {
    min = '0' + min.toString();
  }
  let sec = time - min * 60;
  if (sec < 10) {
    sec = '0' + sec.toString();
  }
  return min + ':' + sec;
}

// render the timer
export default function Timer ({ seconds, setFinished, id, setCorrectAnswers, finished, qid }) {
  const [time, setTime] = useState(seconds);
  // create an interval for the timer
  // counts down until 0 then sets finished for game page
  // new timer when a new time is given
  let timer = null;
  useEffect(() => {
    const countDown = async () => {
      if (time > 0) {
        setTime(time - 1);
      } else {
        setFinished(true);
        // get correct answers for game page
        const correct = await api.getAnswer(id);
        setCorrectAnswers(correct.answerIds);
        clearInterval(timer);
      }
    };
    timer = setInterval(countDown, 1000);
    return () => clearInterval(timer);
  }, [time]);
  // when timer has finished, get new time limit
  useEffect(() => {
    if (!timer) {
      setTime(seconds);
    }
  }, [qid]);
  // render the time remaining
  return (
    <h3>
      {convertTime(time)}
    </h3>
  );
}

Timer.propTypes = {
  seconds: PropTypes.number,
  qid: PropTypes.number,
  id: PropTypes.string,
  setFinished: PropTypes.func,
  setCorrectAnswers: PropTypes.func,
  finished: PropTypes.bool
}
