import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api.jsx';
import ReactPlayer from 'react-player';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Timer from '../components/admin-timer';
import styles from './game.module.css';
import Nav from '../components/nav';

// styling that overrides Material UI
const startStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translateX(-50%) translateY(-60%)',
  maxWidth: '200px',
  width: '90%',
  borderRadius: '10px',
  background: 'rgba( 255, 255, 255, 0.25 )',
  boxShadow: '0 8px 32px 0 rgba( 31, 38, 135, 0.37 )',
  backdropFilter: 'blur( 4px )',
  color: 'white',
  padding: '30px 50px'
}

const answerStyle = {
  padding: '0 10px',
  textAlign: 'center',
  borderRadius: '10px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  minHeight: '80px',
  height: '100%',
  margin: '0',
}

// styling for the different answer containers
const useStyles = makeStyles((theme) => ({
  answerCorrect: {
    backgroundColor: '#9dff9d',
  },
  answerIncorrect: {
    backgroundColor: '#ff595d'
  },
  answerStyle1: {
    color: '#3377ff',
    backgroundColor: '#cfeaf2',
  },
  answerStyle2: {
    color: '#956203',
    backgroundColor: '#fedea6',
  },
  answerStyle3: {
    color: '#f64457',
    backgroundColor: '#fdd6e4',
  },
  answerStyle4: {
    backgroundColor: '#bcc8ff',
    color: '#6357ff'
  },
  answerStyle5: {
    color: '#546d27',
    backgroundColor: '#d6dc9d',
  },
  answerStyle6: {
    color: '#3377ff',
    backgroundColor: '#a3dad2',
  },
}));

// render the admin game page
export default function AdminGame () {
  // change the background style
  document.body.style.background = 'linear-gradient(to right top, #3377ff, #4676ff, #5474ff, #6173ff, #6d71ff, #8c6ff8, #a46ef1, #b86de9, #d470d9, #e676ca, #f280bd, #f98db4) no-repeat';
  // set up variables
  const params = useParams();
  const [response, setResponse] = useState({});
  const [fetched, setFetched] = useState(false);
  const [finished, setFinished] = useState(false);
  const [lastQuestion, setLastQuestion] = useState(false);
  // get status of game at render
  useEffect(async () => {
    const game = await api.getAdminStatus(params.session);
    setResponse(game.results);
    setFetched(true);
  }, []);
  // handle last question, update on every response change
  useEffect(async () => {
    const checkGame = await api.getAdminStatus(params.session);
    // reset finished to false as new question is started
    if (checkGame.results.position !== checkGame.results.questions.length) {
      setFinished(false);
    } else {
      window.location = '/dashboard';
    }
  }, [response]);
  // convert time in format '01:20' to seconds
  function convertTime (time) {
    let min = time.split(':')[0];
    if (min[0] === '0') {
      min = min[1];
    }
    let sec = time.split(':')[1];
    if (sec[0] === '0') {
      sec = sec[1];
    }
    return parseInt(min) * 60 + parseInt(sec);
  }
  // get the answer containers with styling
  // if question is finished, show correct/incorrect styling
  function getAnswer () {
    const ans = [];
    let i = 0;
    // goes through current question and answers
    response.questions[response.position].answer.forEach(a => {
      let classStyle = classes.answerStyle1;
      if (finished && !a.correct) {
        classStyle = classes.answerIncorrect;
      } else if (finished) {
        classStyle = classes.answerCorrect;
      } else {
        if (i === 1) {
          classStyle = classes.answerStyle2;
        } else if (i === 2) {
          classStyle = classes.answerStyle3;
        } else if (i === 3) {
          classStyle = classes.answerStyle4;
        } else if (i === 4) {
          classStyle = classes.answerStyle5;
        } else if (i === 5) {
          classStyle = classes.answerStyle6;
        }
      }
      ans.push(
        <Grid key={a.id} item xs={12} sm={6} style={{ padding: '10px' }}>
          <Button
            disabled={true}
            style={answerStyle}
            className={classStyle}
          >
            <h3>{a.text}</h3>
          </Button>
        </Grid>
      )
      i++;
    })
    return ans;
  }
  // text that notifies on amount of answers to select
  function getTitle () {
    if (response.questions[response.position].type === 'single') {
      return <h3>Select an answer</h3>;
    } else {
      return <h3>Select 1 or more answers</h3>;
    }
  }
  // advance the game
  const advanceGame = async () => {
    // go to dashboard if quiz is finished
    if (response.questions.length === 0) {
      window.location = '/dashboard';
      return;
    }
    // move to next question
    await api.advanceGame(params.quiz);
    // get information for new question
    const game = await api.getAdminStatus(params.session);
    // set last question (to show 'finish' instead of 'next')
    if (game.results.position === game.results.questions.length - 1) {
      setLastQuestion(true);
    }
    // set response and trigger useEffect
    setResponse(game.results);
  }
  // setup styling
  const classes = useStyles();
  // check data has been gathered
  if (!fetched) return null;
  // show start game page if not started yet
  if (response.position === -1) {
    return (
      <div>
        <Nav />
        <Button style={startStyle} onClick={advanceGame}>
          Start Game
        </Button>
      </div>
    )
  }
  // show admin game page that is non-interactive
  return (
    <div>
      <Nav />
      <section className={styles.gameContainer}>
        <h2 className={styles.titleStyle}>
          QUESTION {response.position + 1}
        </h2>
        <div className={styles.gameFlexRow}>
          <div className={styles.titleDiv}>
            <h3>
              {response.questions[response.position].text}
            </h3>
          </div>
          <div className={styles.clockDiv}>
            <Timer
              seconds={convertTime(response.questions[response.position].time_limit)}
              setFinished={setFinished}
              finished={finished}
              qid={response.position}
              advance={advanceGame}
              lastQuestion={lastQuestion}
            />
          </div>
        </div>
        <div className={styles.attachmentStyle}>
          {response.questions[response.position].src
            ? <img
                className={styles.imageStyle}
                src={response.questions[response.position].src}
                alt='Question Image'
              />
            : null}
          {response.questions[response.position].youtube
            ? <ReactPlayer
                muted={true}
                playing={true}
                controls={true}
                url={response.questions[response.position].youtube}
                width='100%'
              />
            : null}
        </div>
        <div className={styles.answerDiv}>
          {getTitle()}
          <Grid container className={styles.gridContainer}>
            {getAnswer()}
          </Grid>
        </div>
      </section>
    </div>
  )
}
