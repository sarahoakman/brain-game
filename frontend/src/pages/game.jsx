import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api.jsx';
import ReactPlayer from 'react-player';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Timer from '../components/timer';
import styles from './game.module.css';

// styling to override Material UI
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
const answerStyleSelected = {
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
  border: '5px solid white'
}

// styling for answer containers
const useStyles = makeStyles((theme) => ({
  answerDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
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

// render the game page for the player
export default function Game () {
  document.body.style.background = 'linear-gradient(to right top, #fcc35b, #ffb368, #ffa578, #ff998b, #ff929c, #fd89a7, #f681b5, #ea7dc4, #d676d3, #b873e3, #8b74f2, #3377ff) no-repeat';
  const params = useParams();
  const [response, setResponse] = useState({});
  const [fetched, setFetched] = useState(false);
  const [answer, setAnswer] = useState([]);
  const [finished, setFinished] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  // set interval
  let interval = null;
  // set question info or go to lobby
  useEffect(async () => {
    const game = await api.getQuestion(params.id);
    if (game.question) {
      setResponse(game.question);
      setFetched(true);
    } else {
      window.location = '/lobby/' + params.id;
    }
  }, []);
  // set up an interval
  // continuously checks if the admin has advanced
  // interval starts/ends when a questions time is up/finished
  useEffect(async () => {
    const checkAdvanced = async () => {
      const checkGame = await api.getQuestion(params.id);
      if (checkGame.question) {
        if (checkGame.question.id !== response.id) {
          setResponse(checkGame.question);
          setAnswer([]);
          setFinished(false);
          setCorrectAnswers([]);
          clearInterval(interval)
        }
      } else {
        clearInterval(interval)
        window.location = '/player/results/' + params.id;
      }
    }
    interval = setInterval(checkAdvanced, 1000);
    return () => clearInterval(interval);
  }, [finished]);

  // sends answer to api and records all answers
  const handleAnswer = async (id) => {
    if (!finished) {
      const newAnswer = answer.concat([id])
      const res = await api.putAnswer(params.id, newAnswer);
      if (res.error) return;
      setAnswer(prev => [...prev, id]);
    }
  }
  // converts time into seconds
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

  // set up the answers
  // correct styling for incorrect/correct
  // different colours for each answer
  // disable the button if already pressed
  // disable the buttons if question finished
  // disable the buttons if one selected and is single type
  function getAnswer () {
    const ans = [];
    let i = 0;
    response.answer.forEach(a => {
      let classStyle = classes.answerStyle1;
      if (correctAnswers.length === 0 && answer.includes(a.id)) {
        classStyle = classes.answerDisabled;
      } else if (correctAnswers.length !== 0 && !correctAnswers.includes(a.id)) {
        classStyle = classes.answerIncorrect;
      } else if (correctAnswers.includes(a.id)) {
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
        <Grid
          key={a.id}
          item
          xs={12}
          sm={6}
          style={{ padding: '10px' }}
        >
          <Button
            disabled={answer.includes(a.id) ||
                      finished || (answer.length === 1 &&
                      response.type === 'single')
                      }
            className={classStyle}
            style={answer.includes(a.id)
              ? answerStyleSelected
              : answerStyle}
            onClick={() => handleAnswer(a.id)}
          >
            <h3>{a.text}</h3>
          </Button>
        </Grid>
      )
      i++;
    })
    return ans;
  }

  // text notifies how many answers to select
  // text notifies if answers are correct
  function getTitle () {
    if (correctAnswers.length === 0) {
      if (response.type === 'single') {
        return <h3>Select an answer</h3>;
      } else {
        return <h3>Select 1 or more answers</h3>;
      }
    } else {
      const check = checkAnswers();
      let message = ''
      if (check) {
        message = <h3>Correct!</h3>
      } else if (response.type === 'multiple') {
        for (let i = 0; i < answer.length; i++) {
          const a = answer[i];
          if (correctAnswers.includes(a)) {
            message = <h3>Partially Correct!</h3>;
            break;
          }
        }
        if (message === '') {
          message = <h3>Incorrect!</h3>
        }
      } else {
        message = <h3>Incorrect!</h3>;
      }
      return message;
    }
  }

  // check if answers given were correct
  function checkAnswers () {
    if (answer.length !== correctAnswers.length) return false;
    for (let i = 0; i < answer.length; i++) {
      if (answer[i] !== correctAnswers[i]) return false;
    }
    return true;
  }
  // set up styling
  const classes = useStyles();
  // wait for api to set up data
  if (!fetched) return null;
  return (
    <section className={styles.gameContainer}>
      <h2 className={styles.titleStyle}>
        QUESTION {response.id + 1}
      </h2>
      <div className={styles.gameFlexRow}>
        <div className={styles.titleDiv}>
          <h3>{response.text}</h3>
        </div>
        <div className={styles.clockDiv}>
          <Timer
            seconds={convertTime(response.time_limit)}
            setFinished={setFinished}
            id={params.id}
            setCorrectAnswers={setCorrectAnswers}
            finished={finished}
            qid={response.id}
          />
        </div>
      </div>
      <div className={styles.attachmentStyle}>
        {response.src
          ? <img
              className={styles.imageStyle}
              src={response.src}
              alt='Question Image'/>
          : null
        }
        {response.youtube
          ? <ReactPlayer
              muted={true}
              playing={true}
              controls={true}
              url={response.youtube}
              width='100%'
            />
          : null
        }
      </div>
      <div className={styles.answerDiv}>
        {getTitle()}
        <Grid container className={styles.gridContainer}>
          {getAnswer()}
        </Grid>
      </div>
    </section>
  )
}
