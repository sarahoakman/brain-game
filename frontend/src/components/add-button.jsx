import React, { useState } from 'react';
import { api } from '../api.jsx';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Alert from '@material-ui/lab/Alert';
import PropTypes from 'prop-types';
import AddIcon from '@material-ui/icons/Add';
import { LightTooltip, FabButton } from './extended-materials';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import FormHelperText from '@material-ui/core/FormHelperText';

// render new game button that appears on the dashboard
export function NewGameButton ({ open, onClick }) {
  return (
    <LightTooltip
      id='add-game-tooltip'
      title='Add Game'
      aria-label='add-game-tooltip'
      aria-modal={open}
      onClick={onClick}
    >
      <FabButton
        aria-label="add-game-button"
        aria-describedby='add-game-tooltip'
      >
        <AddIcon />
      </FabButton>
    </LightTooltip>
  )
}

// render the Add button component
// includes new game button and the modal to create a game
export default function AddButton ({ data }) {
  const open = data.open;
  const setOpen = data.setOpen;
  const setResponse = data.setResponse;
  const [title, setTitle] = useState(null);
  const [error, setError] = useState(false);
  const [game, setGame] = useState('');
  // open a  modal and refresh content
  const openModal = () => {
    setOpen(true);
    setError(false);
    setTitle(null);
    setGame('');
  };
  // set up data for the modal page
  function getData () {
    const props = {
      open: open,
      setOpen: setOpen,
      setResponse: setResponse,
      title: title,
      setTitle: setTitle,
      error: error,
      setError: setError,
      game: game,
      setGame: setGame
    }
    return props;
  }

  return (
    <div>
      <NewGameButton
        key='new-game-button'
        onClick={openModal}
        open={open}
      />
      <NewGameModal
        key='new-game-modal'
        data={getData()}
      />
    </div>
  )
}

// render a new game modal
export function NewGameModal ({ data }) {
  // set up variables for easier access
  const open = data.open;
  const setOpen = data.setOpen;
  const setResponse = data.setResponse;
  const title = data.title;
  const setTitle = data.setTitle;
  const error = data.error;
  const setError = data.setError;
  const game = data.game;
  const setGame = data.setGame;
  const [content, setContent] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  // close modal and refresh content
  const closeModal = () => {
    setOpen(false);
    setTitle(null);
    setGame('');
  };

  // update the game title on change
  const updateTitle = (event) => {
    setTitle(event.target.value);
  }

  // update the json game input on change
  const updateGame = (event) => {
    // check if json file
    if (event.target.value.slice(-4) === 'json') {
      // get json data of the file content
      setGame(event.target.files[0].name);
      const reader = new FileReader();
      reader.readAsText(event.target.files[0], 'UTF-8');
      reader.onload = (file) => {
        setContent(JSON.parse(file.target.result));
      }
    } else {
      setGame(null);
    }
  }

  // add game on submit
  const addGame = async () => {
    // check the title or json file is given
    // shows error message to provide inputs
    if ((title === '' || title == null) &&
         (game === '' || game == null)) {
      setErrorMessage('Error! Game name and json upload is empty');
      setError(true)
      return;
    }
    // use json file if it is given
    if (game !== '' && game != null) {
      // check json file content
      // gives the error message if parsed incorrectly
      const check = validateContent();
      if (!(typeof check === 'boolean')) {
        setErrorMessage('Error! ' + check);
        setError(true);
        return;
      }
    }
    // create a new quiz with the title given
    const id = await api.newQuiz(title);
    // sets up game card data
    const load = {
      id: id.quizId,
      published: new Date().toISOString(),
      title: title,
      img: null,
      questions: 0,
      total_time: 0,
      sessions: []
    };
    // set up game card data if json file given
    if (game !== '' && game != null) {
      // calculate total time
      let totalTime = 0;
      content.questions.forEach(ques => {
        const time = ques.time_limit.split(':');
        const seconds = parseInt(time[0]) * 60 + parseInt(time[1]);
        totalTime = totalTime + parseInt(seconds);
      });
      // update the quiz with json file content
      const res = await api.updateQuiz(id.quizId, content);
      // show error if api does not accept
      if (res.error) {
        setErrorMessage('Error! ' + res.error);
        setError(true);
        return;
      }
      // change title of game if given in json file
      load.title = content.name;
      if (title !== '' && title != null) {
        load.title = title;
      }
      // update data for given data in json file
      load.img = content.thumbnail;
      load.questions = content.questions.length;
      load.total_time = new Date(totalTime * 1000).toISOString().substr(11, 8);
    }
    // close modal and add game card to state variable
    setOpen(false);
    setResponse(prevRes => [...prevRes, load]);
  };

  // check structure of json file
  function checkStructure () {
    if ((typeof content) !== 'object') return 'Game must be a dict';
    if (Object.keys(content).length === 0) {
      return 'Invalid JSON/Empty dict cannot create a game';
    }
    if (!('name' in content)) return 'Must supply a game title';
    if (!content.name || content.name === '') {
      return 'Must supply a game title';
    }
    for (const key of Object.keys(content)) {
      if (!(key === 'name' || key === 'thumbnail' || key === 'questions')) {
        return 'Only name, thumbnail and question keys should exist'
      }
    }
    return true;
  }

  // check id of questions given in the json file
  function checkQuestionId (i) {
    if (!('id' in content.questions[i])) {
      return 'Question ' + (i + 1).toString() + ' must have an id';
    }
    if (content.questions[i].id.toString() !== i.toString()) {
      return 'Question ' + (i + 1).toString() + ' must have a consecutive id';
    }
    return true;
  }

  // check text of questions given in the json file
  function checkQuestionText (i) {
    if (!('text' in content.questions[i])) {
      return 'Question ' + (i + 1).toString() + ' must have text';
    }
    if (!content.questions[i].text || content.questions[i].text === '') {
      return 'Question ' + (i + 1).toString() + ' must have text';
    }
    return true;
  }

  // check points of questions given in the json file
  function checkQuestionPoints (i) {
    if (!('points' in content.questions[i])) {
      return 'Question ' + (i + 1).toString() + ' must have points';
    }
    const points = parseInt(content.questions[i].points);
    const err = 'Question ' + (i + 1).toString() + ' must have points between 1-10';
    if (Number.isNaN(points)) {
      return err;
    }
    if (points > 10) {
      return err;
    }
    if (points < 1) {
      return err;
    }
    return true;
  }

  // check time of questions given in the json file
  function checkQuestionTime (i) {
    if (!('time_limit' in content.questions[i])) {
      return 'Question ' + (i + 1).toString() + ' must have time limit';
    }
    const min = parseInt(content.questions[i].time_limit.split(':')[0]);
    const sec = parseInt(content.questions[i].time_limit.split(':')[1]);
    if (Number.isNaN(min) || Number.isNaN(sec) ||
       min > 4 || min < 0 || sec < 0 || sec >= 60) {
      return 'Question ' + (i + 1).toString() + ' must have a time limit between 00:00-04:59';
    }
    return true;
  }

  // check type of questions given in the json file
  function checkQuestionType (i) {
    if (!('type' in content.questions[i])) {
      return 'Question ' + (i + 1).toString() + ' must have a type';
    }
    if (!(content.questions[i].type === 'single' ||
        content.questions[i].type === 'multiple')) {
      return 'Question ' + (i + 1).toString() + ' must have a type of single or multiple';
    }
    return true;
  }

  // check answers of questions given in the json file
  function checkQuestionAnswer (i) {
    if (!('answer' in content.questions[i])) {
      return 'Question ' + (i + 1).toString() + ' must have answers';
    }
    if (!Array.isArray(content.questions[i].answer) ||
        content.questions[i].answer.length < 2 ||
        content.questions[i].answer.length > 6) {
      return 'Question ' + (i + 1).toString() + ' must have 2-6 answers';
    }
    return true;
  }

  // check answer ids of questions given in the json file
  function checkAnswerId (i, ans, a) {
    if (!('id' in ans)) {
      return 'Question ' + (i + 1).toString() + ' must have answers with an id';
    }
    if (ans.id.toString() !== a.toString()) {
      return 'Question ' + (i + 1).toString() + ' must have answers with a consecutive id';
    }
    return true;
  }

  // check answer text of questions given in the json file
  function checkAnswerText (i, ans) {
    if (!('text' in ans)) {
      return 'Question ' + (i + 1).toString() + ' must have answers written as text';
    }
    if (!ans.text || ans.text === '') {
      return 'Question ' + (i + 1).toString() + ' must have answers with non-empty text';
    }
    return true;
  }

  // check answer correct of questions given in the json file
  function checkAnswerCorrect (i, ans) {
    if (!('correct' in ans)) {
      return 'Question ' + (i + 1).toString() + ' must have answers that specify if they are correct';
    }
    if (!(ans.correct === true || ans.correct === false)) {
      return 'Question ' + (i + 1).toString() + ' must have answers that specify if they are correct using boolean';
    }
    return true;
  }

  // calls above helper functions to validate the json file
  function validateContent () {
    const structureCheck = checkStructure();
    if (!(typeof structureCheck === 'boolean')) {
      return structureCheck;
    }
    if (content.questions) {
      if (!Array.isArray(content.questions)) {
        return 'Questions must be given in a list';
      }
      for (let i = 0; i < content.questions.length; i++) {
        if ((typeof content.questions[i]) !== 'object') {
          return 'Question must be a dict';
        }
        const idCheck = checkQuestionId(i);
        if (!(typeof idCheck === 'boolean')) {
          return idCheck;
        }
        const textCheck = checkQuestionText(i);
        if (!(typeof textCheck === 'boolean')) {
          return textCheck;
        }
        const pointsCheck = checkQuestionPoints(i);
        if (!(typeof pointsCheck === 'boolean')) {
          return pointsCheck;
        }
        const timeLimitCheck = checkQuestionTime(i);
        if (!(typeof timeLimitCheck === 'boolean')) {
          return timeLimitCheck;
        }
        const typeCheck = checkQuestionType(i);
        if (!(typeof typeCheck === 'boolean')) {
          return typeCheck;
        }
        const answerCheck = checkQuestionAnswer(i);
        if (!(typeof answerCheck === 'boolean')) {
          return answerCheck;
        }
        for (let a = 0; a < content.questions[i].answer; a++) {
          const ans = content.questions[i].answer[a];
          if ((typeof ans) !== 'object') {
            return 'Question ' + (i + 1).toString() + ' must have answers as a dict';
          }
          const ansIdCheck = checkAnswerId(i, ans, a);
          if (!(typeof ansIdCheck === 'boolean')) {
            return ansIdCheck;
          }
          const ansTextCheck = checkAnswerText(i, ans);
          if (!(typeof ansTextCheck === 'boolean')) {
            return ansTextCheck;
          }
          const ansCorrectCheck = checkAnswerCorrect(i, ans);
          if (!(typeof ansCorrectCheck === 'boolean')) {
            return ansCorrectCheck;
          }
        }
      }
    } else {
      content.questions = [];
    }
    return true;
  }

  return (
      <Dialog
        open={open}
        onClose={closeModal}
        aria-labelledby="form-dialog-title"
        aria-modal={open}
      >
        {error
          ? <Alert severity="error">{errorMessage}</Alert>
          : null
        }
        <DialogTitle id="form-dialog-title">
          Add Game
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            To add an empty new game, please provide a name.
            Otherwise, add a json file of the game content.
          </DialogContentText>
          <NameInput onChange={updateTitle} title={title}/>
          <GameInput
            onChange={updateGame}
            game={game}
          />
        </DialogContent>
        <DialogActions>
          <ModalButton
            onClick={closeModal}
            color='secondary'
            text='Cancel'
            id='cancel'
          />
          <ModalButton
            onClick={addGame}
            color='primary'
            text='Add Game'
            id='add-game'
          />
        </DialogActions>
      </Dialog>
  )
}

// renders the name input for the new game modal
export function NameInput ({ onChange, title }) {
  return (
   <TextField
      autoFocus
      id="game-name"
      label="Game Name"
      type="text"
      fullWidth
      variant="outlined"
      onChange={onChange}
      error={title === ''}
      helperText='Game name is empty'
    />
  )
}

// renders the game input for the new game modal
export function GameInput ({ onChange, game }) {
  function getFile () {
    if (game) {
      return game;
    }
    return 'Error! Only upload json files'
  }

  function getStyle () {
    const error = {
      color: 'red',
      marginLeft: '15px'
    }
    const normal = {
      marginLeft: '15px'
    }
    if (game) {
      return normal;
    }
    return error;
  }
  return (
    <div>
      <Button
        variant="contained"
        component="label"
        style={{ backgroundColor: 'white' }}
        startIcon={<CloudUploadIcon />}
      >
        Upload Game
        <input
          type='file'
          name='thumbnail'
          accept='application/JSON'
          onChange={onChange}
          hidden
        />
      </Button>
      {game === ''
        ? null
        : <FormHelperText style={getStyle()} >
          {getFile()}
        </FormHelperText>
      }
    </div>
  )
}

// renders the cancel/submit button for the new game modal
export function ModalButton ({ onClick, color, text, id }) {
  return (
    <Button id={id} onClick={onClick} color={color}>
      {text}
    </Button>
  )
}

AddButton.propTypes = {
  data: PropTypes.shape({
    open: PropTypes.bool,
    setOpen: PropTypes.func,
    setResponse: PropTypes.func,
  })
}

ModalButton.propTypes = {
  onClick: PropTypes.func,
  color: PropTypes.string,
  text: PropTypes.string,
  id: PropTypes.string,
}

NewGameModal.propTypes = {
  data: PropTypes.shape({
    open: PropTypes.bool,
    setOpen: PropTypes.func,
    setResponse: PropTypes.func,
    title: PropTypes.string,
    setTitle: PropTypes.func,
    error: PropTypes.bool,
    setError: PropTypes.func,
    game: PropTypes.string,
    setGame: PropTypes.func,
  })
}

NameInput.propTypes = {
  title: PropTypes.string,
  onChange: PropTypes.func,
}

GameInput.propTypes = {
  game: PropTypes.string,
  getFile: PropTypes.func,
  getStyle: PropTypes.func,
  onChange: PropTypes.func,
}

NewGameButton.propTypes = {
  open: PropTypes.bool,
  onClick: PropTypes.func,
}
