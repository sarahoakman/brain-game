import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import EditAnswer from './edit-answer';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import FormHelperText from '@material-ui/core/FormHelperText';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import AddIcon from '@material-ui/icons/Add';
import { LightTooltip, FabButton } from '../components/extended-materials';
import styles from '../pages/edit.module.css';

// override Material UI styling
const useStyles = makeStyles((theme) => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  errorHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: 'red',
  },
  button: {
    color: 'white',
    height: '40px',
    margin: 'auto',
  },
  errMessage: {
    color: 'red'
  },
  errAnswer: {
    color: 'red',
    margin: '12px 0 0 12px'
  },
}));

// render an edit question component
export default function EditQuestion ({ id, state }) {
  // set up variables for easier use
  const response = state.response;
  const question = state.response.questions[id - 1];
  const setResponse = state.setResponse;
  const questionImage = state.questionImage;
  const setQuestionImage = state.setQuestionImage;
  const questionYoutube = state.questionYoutube;
  const setQuestionYoutube = state.setQuestionYoutube;
  const deleted = state.deleted;
  const setDeleted = state.setDeleted;
  // set up state variables
  const [youtubeInput, setYoutubeInput] = useState('');
  const [imageInput, setImageInput] = useState('');
  const [timeError, setTimeError] = useState(false);
  const [questionInput, setQuestionInput] = useState(question.text);
  const [type, setType] = useState(question.type)
  const [render, setRender] = useState(false);
  // set up the amount of answers that are correct
  let count = 0;
  question.answer.forEach(a => {
    if (a.correct) count++;
  })
  const [checkCorrect, setCheckCorrect] = useState(count);
  // update the question text on change
  const updateQuestionInput = (event) => {
    setQuestionInput(event.target.value.trim());
    question.text = event.target.value.trim();
  }

  // setup styling
  const classes = useStyles();

  // get new youtube url on change
  const updateURL = (event) => {
    setYoutubeInput(event.target.value);
  }

  // get new image on change
  const updateImage = (event) => {
    setImageInput(event.target);
  }

  // check youtube variable and set on submit
  const submitURL = () => {
    if (youtubeInput === '') return;
    if (!ReactPlayer.canPlay(youtubeInput)) {
      setYoutubeInput(null);
      return;
    }
    question.youtube = youtubeInput;
    question.src = null;
    setResponse(response);
    setQuestionImage(false);
    setQuestionYoutube(true);
  }

  // show convert image on submit
  const submitImage = () => {
    if (!imageInput) return;
    question.youtube = null;
    setResponse(response);
    setQuestionYoutube(false);
    convertImage(imageInput)
  }

  // convert image to base64
  // check if image and set variables
  const convertImage = (img) => {
    const reader = new FileReader();
    reader.readAsDataURL(img.files[0]);
    reader.onload = function () {
      if (reader.result.includes('data:image')) {
        question.src = reader.result;
        setResponse(response)
        setQuestionImage(reader.result);
      } else {
        setQuestionImage('')
      }
    }
  }

  // delete a youtube url and image
  const removeImage = () => {
    question.src = null;
    question.youtube = null;
    setQuestionImage(false);
    setQuestionYoutube(false);
  }

  // update points on change
  const updatePoints = (event) => {
    question.points = event.target.value;
  }

  // update minutes on change
  const updateMinutes = (event) => {
    const sec = question.time_limit.split(':')[1];
    // convert to time_limit to check if valid time given
    question.time_limit = event.target.value + ':' + sec;
    checkTime();
  }

  // update seconds on change
  const updateSeconds = (event) => {
    const min = question.time_limit.split(':')[0];
    // convert to time_limit to check if valid time given
    question.time_limit = min + ':' + event.target.value;
    checkTime();
  }

  // update question type on change
  const updateType = (event) => {
    question.type = event.target.value;
    setType(question.type);
  }

  // remove question if deleted
  const updateDeleted = (event) => {
    response.questions.splice(id - 1, 1)
    setDeleted(!deleted);
  }

  // add an answer to the question with default values
  const addAnswer = () => {
    question.answer.push({
      id: question.answer.length + 1,
      text: '',
      correct: false
    });
    setResponse(response);
    setRender(!render)
  }

  // check if time limit is valid
  const checkTime = () => {
    if (question.time_limit === '00:00' ||
        question.time_limit === '00:01' ||
        question.time_limit === '00:02' ||
        question.time_limit === '00:03' ||
        question.time_limit === '00:04'
    ) {
      setTimeError(true);
    } else {
      setTimeError(false);
    }
  }

  // get seconds for the dropdown select
  function seconds () {
    const menuItems = []
    for (let i = 0; i < 60; i++) {
      let sec = i;
      if (i < 10) {
        sec = '0' + sec;
      }
      const item = <MenuItem
                    key={sec}
                    value={sec}
                  >
                    {i}
                  </MenuItem>
      menuItems.push(item)
    }
    return menuItems;
  }

  // check for errors in each input
  function checkErrors () {
    if (questionInput === '' || timeError || checkCorrect === 0 || (type === 'single' && checkCorrect !== 1) || (type === 'multiple' && checkCorrect <= 1)) {
      return true;
    }
    let flag = false;
    question.answer.forEach(a => {
      if (a.text === '') {
        flag = true;
      }
    });
    return flag;
  }

  // show error or normal styling
  function getClass () {
    if (checkErrors()) {
      return classes.errorHeading;
    } else {
      return classes.secondaryHeading;
    }
  }

  // show error or normal sub heading
  function getText () {
    if (checkErrors()) {
      return 'Error! Fix up the question'
    } else {
      return 'Edit the question'
    }
  }

  // get error for empty text for questions
  function errorText () {
    if (questionInput === '') {
      return 'Question cannot be empty'
    }
  }

  // create a question
  // uses accordians from material ui
  function createQuestion () {
    return (
      <div className={styles.questionContainer}>
        <Accordion style={{ width: '100%' }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='content'
            id={'question' + id + '-header'}
          >
            <Typography className={classes.heading}>
              {'Question ' + id}
            </Typography>
            <Typography className={getClass()}>
              {getText()}
            </Typography>
          </AccordionSummary>
          <AccordionDetails className={styles.questionDetails}>
            <div className={styles.questionItem}>
              <FormHelperText>
                Question for the player to answer
              </FormHelperText>
              <TextField
                id={'ques-input' + id}
                label='Question'
                variant='outlined'
                defaultValue={question.text}
                onChange={updateQuestionInput}
                error={questionInput === ''}
                helperText={errorText()}
              />
            </div>
            {getImage()}
            <div className={styles.questionItem}>
              <FormHelperText>
                Game points for the question
              </FormHelperText>
              <FormControl variant='outlined'>
                <InputLabel id={'points-label' + id}>
                  Points
                </InputLabel>
                <Select
                  labelId={'points-label' + id}
                  id={'points-select' + id}
                  onChange={updatePoints}
                  label='type'
                  defaultValue={question.points}
                >
                  <MenuItem value='1'>1</MenuItem>
                  <MenuItem value='2'>2</MenuItem>
                  <MenuItem value='3'>3</MenuItem>
                  <MenuItem value='4'>4</MenuItem>
                  <MenuItem value='5'>5</MenuItem>
                  <MenuItem value='6'>6</MenuItem>
                  <MenuItem value='7'>7</MenuItem>
                  <MenuItem value='8'>8</MenuItem>
                  <MenuItem value='9'>9</MenuItem>
                  <MenuItem value='10'>10</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className={styles.questionItem}>
              <FormHelperText>
                Time limit for the question
              </FormHelperText>
              <FormControl
                style={{ marginRight: '10px' }}
                variant='outlined'
              >
                <InputLabel id={'min-label' + id}>
                  Minutes
                </InputLabel>
                <Select
                  labelId={'min-label' + id}
                  id={'min-select' + id}
                  onChange={updateMinutes}
                  label='minutes'
                  defaultValue={question.time_limit.split(':')[0]}
                >
                  <MenuItem value='00'>0</MenuItem>
                  <MenuItem value='01'>1</MenuItem>
                  <MenuItem value='02'>2</MenuItem>
                  <MenuItem value='03'>3</MenuItem>
                  <MenuItem value='04'>4</MenuItem>
                </Select>
              </FormControl>
              <FormControl variant='outlined'>
                <InputLabel id={'sec-label' + id}>
                  Seconds
                </InputLabel>
                <Select
                  labelId={'sec-label' + id}
                  id={'sec-select' + id}
                  onChange={updateSeconds}
                  label='seconds'
                  defaultValue={question.time_limit.split(':')[1]}
                >
                  {seconds()}
                </Select>
              </FormControl>
              {timeError
                ? <FormHelperText
                    className={classes.errMessage}
                  >
                    Error! Time limit must be at least 5 seconds
                  </FormHelperText>
                : null
              }
            </div>
            <div className={styles.questionItem}>
              <FormHelperText>
                Number of answers
              </FormHelperText>
              <FormControl
                className={classes.questionInput}
                variant='outlined'
              >
                <InputLabel id={'type-label' + id}>
                  Type
                </InputLabel>
                <Select
                  className={classes.questionInput}
                  labelId={'type-label' + id}
                  id={'type-options' + id}
                  onChange={updateType}
                  label='type'
                  defaultValue={question.type}
                >
                  <MenuItem value='single'>Single</MenuItem>
                  <MenuItem value='multiple'>Multiple</MenuItem>
                </Select>
              </FormControl>
              {checkCorrect !== 1 && type === 'single'
                ? <FormHelperText
                    className={classes.errMessage}
                  >
                    Error!
                    Single type means only 1 correct answer
                  </FormHelperText>
                : null
                }
                {checkCorrect <= 1 && type === 'multiple'
                  ? <FormHelperText
                      className={classes.errMessage}
                    >
                      Error!
                      Multiple type means more than
                      1 correct answer
                    </FormHelperText>
                  : null
                }
            </div>
            <div>
              <FormHelperText className={styles.answerItem}>
                Answers
              </FormHelperText>
              <div className={styles.container}>
                {checkCorrect === 0
                  ? <FormHelperText
                      className={classes.errMessage}
                    >
                      Error! Must have at least
                      1 correct answer
                    </FormHelperText>
                  : null
                }
                <Grid container spacing={3}>
                  {getAnswers()}
                </Grid>
                <LightTooltip title='Add Answer'>
                  <FabButton
                    aria-label="add"
                    style={{ color: 'grey' }} onClick={addAnswer}
                  >
                    <AddIcon />
                  </FabButton>
                </LightTooltip>
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
        <LightTooltip title='Delete Question'>
          <IconButton
            aria-label='delete'
            className={classes.button}
            onClick={updateDeleted}
          >
            <DeleteIcon fontSize='small' />
          </IconButton>
        </LightTooltip>
      </div>
    )
  }

  // get and show the image or youtube url on upload
  function getImage () {
    return (
      <div className={styles.questionItem}>
        <div className={styles.flexImageRow}>
          {question.youtube
            ? <div>
                <FormHelperText>
                  Current youtube video for the question
                </FormHelperText>
                <ReactPlayer
                  url={question.youtube}
                  width='100%'
                />
              </div>
            : null
          }
          {question.src
            ? <div>
                <FormHelperText>
                  Current image for the question
                </FormHelperText>
                <img
                  className={styles.image}
                  src={question.src}
                  alt='question image'
                />
              </div>
            : null
          }
          {question.src || question.youtube
            ? <LightTooltip
                title='Delete Image or URL'
              >
                <IconButton
                  aria-label='delete'
                  className={styles.icon}
                  onClick={removeImage}
                >
                  <DeleteIcon fontSize='small'/>
                </IconButton>
              </LightTooltip>
            : null
          }
        </div>
        <FormHelperText>
          Upload a new image or youtube video
        </FormHelperText>
        <div className={styles.flexImageRow}>
          <input
            type='file'
            accept='image/*'
            onChange={updateImage}
          />
          <LightTooltip
            title='Submit Image'
            onChange={updateURL}
          >
            <IconButton
              aria-label='submit'
              className={styles.icon}
              onClick={submitImage}
            >
              <CloudUploadIcon fontSize='small' />
            </IconButton>
          </LightTooltip>
        </div>
        {questionImage === ''
          ? <FormHelperText
              className={classes.errMessage}
            >
              Error! An image was not uploaded and
              has been discarded
            </FormHelperText>
          : null
        }
        <div>
          <div className={styles.flexImageRow}>
            <TextField
              id='youtube-link1'
              label='Youtube URL'
              variant='outlined'
              defaultValue={questionYoutube}
              onChange={updateURL}
            />
            <LightTooltip title='Submit URL'>
              <IconButton
                aria-label='delete'
                className={styles.icon}
                onClick={submitURL}
              >
                <CloudUploadIcon fontSize='small' />
              </IconButton>
            </LightTooltip>
          </div>
          {youtubeInput === null
            ? <FormHelperText
                className={classes.errMessage}
              >
                Error! The URL given cannot be played
                and has been discarded
              </FormHelperText>
            : null
          }
        </div>
      </div>
    )
  }

  // check for errors and set up answers to edit
  function getAnswers () {
    const items = [];
    if (question.answer.length < 2 ||
        question.answer.length > 6) {
      items.push(
        <FormHelperText className={classes.errAnswer}>
          Error! You need 2-6 answers
        </FormHelperText>
      )
    }
    for (let i = 0; i < question.answer.length; i++) {
      const item = <EditAnswer
                    key={id + '-' + i}
                    id={i} qid={id}
                    question={question}
                    deleted={deleted}
                    corrected={checkCorrect} setCorrected={setCheckCorrect} setDeleted={setDeleted} setRender={setRender}
                  />;
      items.push(item);
    }
    return items;
  }
  return (
    <div>
      {createQuestion()}
    </div>
  )
}

EditQuestion.propTypes = {
  id: PropTypes.number,
  state: PropTypes.shape({
    response: PropTypes.shape({
      questions: PropTypes.arrayOf(
        PropTypes.shape({
          text: PropTypes.string,
          type: PropTypes.string,
          points: PropTypes.string,
          time_limit: PropTypes.string,
          src: PropTypes.string,
          youtube: PropTypes.string,
          answer: PropTypes.arrayOf(
            PropTypes.shape({
              id: PropTypes.number,
              text: PropTypes.string,
              correct: PropTypes.boolean
            })
          ),
        })
      ),
    }),
    setResponse: PropTypes.func,
    questionImage: PropTypes.string,
    setQuestionImage: PropTypes.func,
    questionYoutube: PropTypes.bool,
    setQuestionYoutube: PropTypes.func,
    deleted: PropTypes.bool,
    setDeleted: PropTypes.func
  }),
}
