import React, { useState, useRef } from 'react';
import { api } from '../api.jsx';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import TextField from '@material-ui/core/TextField';
import StopIcon from '@material-ui/icons/Stop';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';
import { makeStyles } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBrain } from '@fortawesome/free-solid-svg-icons';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import styles from './dashboard.module.css';
import { LightTooltip } from './extended-materials';
import PropTypes from 'prop-types';
import BarChartIcon from '@material-ui/icons/BarChart';

// overrides Material UI styling
const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    borderRadius: '10px',
    background: 'rgba( 255, 255, 255, 0.25 )',
    boxShadow: '0 8px 32px 0 rgba( 31, 38, 135, 0.37 )',
    backdropFilter: 'blur( 4px )',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: 'white'
  },
  button: {
    color: theme.palette.common.white,
  },
}));

// renders a game card in a grid for the dashboard
export default function GridItem ({ quiz, render, setRender, response, setResponse }) {
  const [link, setLink] = useState('');
  const [open, setOpen] = useState(false);
  const [openResults, setOpenResults] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');
  const textAreaRef = useRef(null);

  // show results after stopping game
  const handleCloseShowResults = async () => {
    setOpenResults(false);
    const res = await api.getQuiz(quiz.id);
    await api.stopQuiz(quiz.id);
    window.location = '/results/' + quiz.id + '/' + res.active;
  };

  // render page if results not wanted
  const handleCloseNoResults = async () => {
    await api.stopQuiz(quiz.id);
    setOpenResults(false);
    setRender(!render);
  };

  // close popups and render to show changes
  const handleClose = () => {
    setOpen(false);
    setRender(!render);
  };

  // copy the join link
  function copyToClipboard (e) {
    textAreaRef.current.select();
    document.execCommand('copy');
    e.target.focus();
    setCopySuccess('Copied!');
  }

  return (
    <Grid item xs={12} sm={6} md={4} lg={3} style={{ marginBottom: '25px' }}>
      <GameCard
        quiz={quiz}
        setLink={setLink}
        setOpen={setOpen}
        setOpenResults={setOpenResults}
        response={response}
        setResponse={setResponse}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='form-dialog-title-start'
      >
        <DialogTitle id='form-dialog-title-start'>
          Starting session...
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Copy the following url link into your browser to join and play. Once you close this popup, you will not be able to retrieve this session id again.
          </DialogContentText>
          <form>
            <TextField
              autoFocus
              id='session'
              label='Session id'
              type='text'
              value={link}
              inputRef={textAreaRef}
              fullWidth
              variant='outlined'
            />
          </form>
          <div>
            <Button onClick={copyToClipboard} color='primary'>
              Copy
            </Button>
            {copySuccess}
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            aria-label='submit-start'
            onClick={handleClose}
            color='primary'
          >
            Ok, got it
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openResults}
        onClose={handleCloseNoResults}
        aria-labelledby='form-dialog-title-stop'
      >
        <DialogTitle id='form-dialog-title-stop'>
          Stopping session...
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Would you like to view the results?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNoResults} color='textSecondary'>
            No thanks
          </Button>
          <Button
            onClick={handleCloseShowResults}
            color='primary'
            aria-label='view-results'
          >
           View Results
          </Button>
        </DialogActions>
    </Dialog>
  </Grid>
  );
}

// render the game card
export function GameCard ({ quiz, setLink, setOpen, setOpenResults, response, setResponse }) {
  // go to edit page
  const editGame = () => {
    window.location = '/edit/game/' + quiz.id;
  }

  // delete a game and remove from state variable
  const deleteGame = async () => {
    await api.deleteQuiz(quiz.id);
    const newRes = response.filter(r => r.id !== quiz.id);
    setResponse(newRes);
  };

  // start a game and set up the url
  const startGame = async () => {
    await api.startQuiz(quiz.id);
    const res = await api.getQuiz(quiz.id);
    setLink(window.location.href.slice(0, window.location.href.lastIndexOf('/') + 1) + 'join/' + res.active);
    setOpen(true);
  };

  // stop the game
  const stopGame = () => {
    setOpenResults(true);
  };

  // advance the game through the quiz
  // sends admin to advance pages
  const advanceGame = async () => {
    const res = await api.getQuiz(quiz.id);
    window.location = '/admin/game/' + quiz.id + '/' + res.active;
  };

  // go to past sessions on click
  const seeSessions = () => {
    window.location = '/sessions/' + quiz.id;
  };

  // set up the past result buttons
  function Results () {
    if (quiz.sessions !== undefined &&
        quiz.sessions.length !== 0) {
      return (
        <LightTooltip title='See Past Sessions'>
          <IconButton
            aria-label='See Past Sessions'
            className={classes.button}
            onClick={seeSessions}
          >
            <BarChartIcon />
          </IconButton>
      </LightTooltip>)
    } else {
      return (
          <IconButton
            aria-label='See Past Sessions'
            className={classes.button}
            onClick={seeSessions}
            disabled={true}
          >
            <BarChartIcon />
          </IconButton>)
    }
  }

  // set up the img tag
  let img = <img
              className={styles.thumbnail}
              src={quiz.img}
              alt='game-thumbnail'
            />
  // use default quiz image if no image provided
  if (quiz.img == null) {
    img = <FontAwesomeIcon icon={faBrain} size='6x' />
  }
  // set up styling
  const classes = useStyles();
  return (
    <Paper className={classes.paper}>
      <h2
        id={quiz.title}
        aria-label='game-name'
      >
        {quiz.title}
      </h2>
      <div
        aria-label='game-thumbnail'
        className={styles.thumbnailContainer}
      >
        {img}
      </div>
      <p
        aria-label='game-num-questions'
        style={{ margin: '5px' }}
      >
        {quiz.questions} questions
      </p>
      <p
        aria-label='game-time'
        style={{ margin: '5px' }}
      >
        Total time: {quiz.total_time}
      </p>
      <div aria-label='game-buttons'>
        <GameCardButton
          onClick={editGame}
          title='Edit Game'
        />
        <GameCardButton
          onClick={deleteGame}
          title='Delete Game'
        />
        <StopStartButton
          quiz={quiz}
          startGame={startGame}
          stopGame={stopGame}
          advanceGame={advanceGame}
        />
        <Results />
      </div>
    </Paper>
  )
}

// render buttons related to playing the game
// includes edit, delete, play, stop, advance buttons
export function GameCardButton ({ onClick, title }) {
  // set up the icon to show
  let icon = <EditIcon aria-label='edit'/>;
  if (title === 'Delete Game') {
    icon = <DeleteIcon aria-label='delete'/>;
  } else if (title === 'Start Game') {
    icon = <PlayArrowIcon aria-label='play'/>;
  } else if (title === 'Stop Game') {
    icon = <StopIcon aria-label='stop'/>;
  } else if (title === 'Advance Game') {
    icon = <SportsEsportsIcon aria-label='advance'/>;
  }
  const classes = useStyles();
  return (
    <LightTooltip
      aria-label='game-card-tooltip'
      title={title}
      onClick={onClick}
    >
      <IconButton
        aria-label='game-card-button'
        className={classes.button}
      >
        {icon}
      </IconButton>
    </LightTooltip>
  )
}

// render the play or advance and/or stop buttons
// depends on whether quiz is active, has questions, has begun
export function StopStartButton ({ quiz, startGame, stopGame, advanceGame }) {
  if (quiz.active == null) {
    return (
      <GameCardButton onClick={startGame} title='Start Game'/>
    )
  } else {
    if (quiz.questions === 0 || quiz.position !== -1) {
      return (
        <GameCardButton onClick={stopGame} title='Stop Game'/>
      )
    }
    return (
      <div>
        <GameCardButton
          key='advance-game'
          onClick={advanceGame}
          title='Advance Game'
        />
        <GameCardButton
          key='stop-game'
          onClick={stopGame}
          title='Stop Game'
        />
      </div>
    )
  }
}

GridItem.propTypes = {
  quiz: PropTypes.shape({
    id: PropTypes.number,
    active: PropTypes.number,
    img: PropTypes.string,
    published: PropTypes.string,
    title: PropTypes.string,
    questions: PropTypes.number,
    total_time: PropTypes.string,
    position: PropTypes.number,
    sessions: PropTypes.arrayOf(
      PropTypes.number
    )
  }),
  render: PropTypes.bool,
  setRender: PropTypes.func,
  response: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      active: PropTypes.number,
      img: PropTypes.string,
      published: PropTypes.string,
      questions: PropTypes.number,
      title: PropTypes.string,
      total_time: PropTypes.string,
    }),
  ),
  setResponse: PropTypes.func,
}

GameCard.propTypes = {
  quiz: PropTypes.shape({
    id: PropTypes.number,
    active: PropTypes.number,
    img: PropTypes.string,
    published: PropTypes.string,
    title: PropTypes.string,
    questions: PropTypes.number,
    total_time: PropTypes.string,
    position: PropTypes.number,
    sessions: PropTypes.arrayOf(
      PropTypes.number
    )
  }),
  response: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      active: PropTypes.number,
      img: PropTypes.string,
      published: PropTypes.string,
      questions: PropTypes.number,
      title: PropTypes.string,
      total_time: PropTypes.string,
    }),
  ),
  setResponse: PropTypes.func,
  setLink: PropTypes.func,
  setOpen: PropTypes.func,
  setOpenResults: PropTypes.func,
}

GameCardButton.propTypes = {
  onClick: PropTypes.func,
  title: PropTypes.string,
}

StopStartButton.propTypes = {
  quiz: PropTypes.shape({
    active: PropTypes.number,
    questions: PropTypes.number,
    position: PropTypes.number,
  }),
  startGame: PropTypes.func,
  advanceGame: PropTypes.func,
  stopGame: PropTypes.func,
}
