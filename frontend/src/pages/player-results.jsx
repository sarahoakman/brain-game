import React, { useEffect, useState } from 'react';
import { api } from '../api.jsx';
import { useParams } from 'react-router-dom';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import styles from './game.module.css';
import PropTypes from 'prop-types';

// render the players results
export default function PlayerResults () {
  // set up the background sytling
  document.body.style.background = 'linear-gradient(to right bottom, #3377ff, #0094ff, #00abf9, #58bfec, #93cfe2) no-repeat';
  // set up variables
  const [results, setResults] = useState([]);
  const params = useParams();
  // get results from the game
  useEffect(async () => {
    const res = await api.getPlayerResults(params.id);
    setResults(res);
  }, []);
  // show the results if api has fetched
  if (!results) return;
  return (
    <section className={styles.resultContainer}>
      <h1>Game Results</h1>
      <AllResults results={results} error={results.error}/>
      <h3>Points System</h3>
        <p>
          The final score is calculated by adding up the points for each question.
        </p>
        <p>
          Points for individual questions take into account the max points for the question and the time taken to answer.
        </p>
        <p>
          Incorrect answers score 0 points whilst correct answers score max points * (time limit - time taken(in seconds)).
        </p>

    </section>
  );
}

// set up the list of results
// show message if no questions were answered
export function AllResults ({ results, error }) {
  function getResults () {
    if (error || results.length === 0) {
      return <p>0 questions answered</p>;
    }
    const res = [];
    let i = 1;
    results.forEach(r => {
      let time = null;
      // calculate time taken to answer question
      if (r.questionStartedAt && r.answeredAt) {
        const start = new Date(r.questionStartedAt)
        const end = new Date(r.answeredAt)
        const seconds = Math.round((end - start) / 1000);
        let min = Math.floor(seconds / 60);
        if (min === -1) min = 0;
        let sec = seconds - min * 60;
        if (min < 10) {
          min = '0' + min.toString();
        }
        if (sec < 10) {
          sec = '0' + sec.toString();
        }
        time = min + ':' + sec
      }
      // get each question result
      res.push(<ResultAccordian
                key={i}
                question={i}
                time={time}
                status={r.correct}
              />);
      i++;
    })
    return res;
  }
  return (
    <div className={styles.resultDiv}>
      {getResults()}
    </div>
  )
}

// renders a result accordian
export function ResultAccordian ({ question, time, status }) {
  // styling that overrides Material UI
  const correctHeading = {
    color: '#30691b',
    backgroundColor: '#d4f1ca',
  }

  const incorrectHeading = {
    color: '#b70000',
    backgroundColor: '#ffdede',
  }

  const useStyles = makeStyles((theme) => ({
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: '33.33%',
      flexShrink: 0,
    }
  }));

  const classes = useStyles();
  return (
    <Accordion
      style={status
        ? correctHeading
        : incorrectHeading}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
      >
        <Typography className={classes.heading}>
          Question {question}
        </Typography>
      </AccordionSummary>
      <ResultDetails time={time} status={status} />
    </Accordion>
  )
}

// renders details within the expanded section of accordian
export function ResultDetails ({ time, status }) {
  // styling that overrides Material UI
  const correctSub = {
    backgroundColor: '#56bc32',
    color: 'white',
  }

  const incorrectSub = {
    backgroundColor: '#ff6060',
    color: 'white',
  }

  return (
    <AccordionDetails
      style={status
        ? correctSub
        : incorrectSub
      }
      className={styles.flexColumn}
    >
      <div className={styles.flexRow}>
        <div className={styles.icon}>
          {status
            ? <InsertEmoticonIcon />
            : <SentimentVeryDissatisfiedIcon />
          }
        </div>
        <div className={styles.text}>
          {status ? <p>Correct!</p> : <p>Incorrect!</p>}
        </div>
      </div>
      <div className={styles.flexRow}>
        <div className={styles.icon}>
          <DirectionsRunIcon />
        </div>
        <div className={styles.text}>
          {!time
            ? <p>Not Answered</p>
            : <p>Answered in {time}</p>
          }
        </div>
      </div>
    </AccordionDetails>
  )
}

AllResults.propTypes = {
  results: PropTypes.arrayOf(
    PropTypes.shape({
      questionStartedAt: PropTypes.string,
      answeredAt: PropTypes.string,
      correct: PropTypes.bool,
    }),
  ),
  error: PropTypes.bool,
}

ResultAccordian.propTypes = {
  question: PropTypes.number,
  time: PropTypes.string,
  status: PropTypes.bool
}

ResultDetails.propTypes = {
  time: PropTypes.string,
  status: PropTypes.bool
}
