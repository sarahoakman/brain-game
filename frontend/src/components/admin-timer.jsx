import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

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
export default function Timer ({ seconds, setFinished, finished, qid, advance, lastQuestion }) {
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
        setTimeout(() => setFinished(true), 1200)
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

  // render the button for next or finish
  function getButton () {
    if (lastQuestion) {
      return (<Button
                style={{ color: 'white' }}
                onClick={finish}
              >
                Finish
              </Button>)
    }
    return (<Button
              style={{ color: 'white' }}
              onClick={advance}
            >
               Next
            </Button>)
  }

  const finish = () => {
    window.location = '/dashboard'
  }
  // render time or the button
  return (
    <h3>
      {finished ? getButton() : convertTime(time)}
    </h3>
  );
}

Timer.propTypes = {
  seconds: PropTypes.number,
  qid: PropTypes.number,
  setFinished: PropTypes.func,
  finished: PropTypes.bool,
  advance: PropTypes.func,
  lastQuestion: PropTypes.bool,
}
