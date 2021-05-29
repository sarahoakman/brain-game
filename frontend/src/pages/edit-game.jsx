import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EditQuestion from '../components/edit-question';
import { api } from '../api.jsx';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { LightTooltip, LightFabButton } from '../components/extended-materials';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import PropTypes from 'prop-types';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import FormHelperText from '@material-ui/core/FormHelperText';
import Alert from '@material-ui/lab/Alert';
import styles from './edit.module.css';
import Nav from '../components/nav';

// styling that overrides Material UI
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
    backgroundColor: 'white'
  },
  errMessage: {
    color: 'red'
  }
}));

// render the edit game page
export default function EditGame () {
  // update the background style
  document.body.style.background = 'linear-gradient(to right top, #3377ff, #4676ff, #5474ff, #6173ff, #6d71ff, #8c6ff8, #a46ef1, #b86de9, #d470d9, #e676ca, #f280bd, #f98db4) no-repeat';
  // set up variables
  const params = useParams();
  const [response, setResponse] = useState({});
  const [questionImage, setQuestionImage] = useState(null);
  const [questionYoutube, setQuestionYoutube] = useState(null);
  const [fetched, setFetched] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [error, setError] = useState(false);
  const [updated, setUpdate] = useState(false);
  const [render, setRender] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  // get quiz data and set up state variables
  useEffect(async () => {
    const quiz = await api.getQuiz(params.id);
    setResponse(quiz);
    setThumbnail(quiz.thumbnail);
    setFetched(true);
  }, []);
  // set up the edit question components
  const questions = () => {
    const itemList = []
    const state = {
      response: response,
      setResponse: setResponse,
      questionImage: questionImage,
      setQuestionImage: setQuestionImage,
      questionYoutube: questionYoutube,
      setQuestionYoutube: setQuestionYoutube,
      deleted: deleted,
      setDeleted: setDeleted,
    }
    for (let i = 0; i < response.questions.length; i++) {
      const quesNum = i + 1;
      const item = <EditQuestion key={i} id={quesNum} state={state}/>;
      itemList.push(item)
    }
    return itemList
  }
  // handles edit submit error checking and success
  const handleSubmit = async (event) => {
    event.preventDefault();
    // go to top of screen
    window.scrollTo(0, 0);
    // error checking
    let check = false;
    if (response.name === '') {
      check = true;
    }
    response.questions.forEach(q => {
      if (q.text === '' || q.time_limit === '00:00') {
        check = true;
      }
      if (q.answer.length < 2 || q.answer.length > 6) {
        check = true;
      }
      let count = 0;
      q.answer.forEach(a => {
        if (a.correct) count++;
        if (a.text === '') {
          check = true;
        }
      })
      if (count === 0) {
        check = true;
      }
      if (q.type === 'single' && count !== 1) {
        check = true;
      }
      if (q.type === 'multiple' && count <= 1) {
        check = true;
      }
    })
    // set the state variables incase of error/success
    setError(check);
    setUpdate(!check);
    // update the new data and send api call
    if (!check) {
      const updateData = {
        questions: response.questions,
        name: response.name,
        thumbnail: response.thumbnail
      }
      await api.updateQuiz(params.id, updateData);
    }
  };
  // creates a new question with default inputs
  const addQuestion = () => {
    const newQuestion = {
      id: response.questions.length,
      type: 'single',
      text: 'Question',
      time_limit: '00:05',
      points: '10',
      answer: [
        {
          id: 0,
          text: 'Answer',
          correct: true,
        },
        {
          id: 1,
          text: 'Answer',
          correct: false,
        },
      ]
    }
    response.questions.push(newQuestion);
    setResponse(response);
    setRender(!render);
  }
  // set up styling
  const classes = useStyles();

  const removeThumbnail = () => {
    response.thumbnail = null;
    setResponse(response);
    setThumbnail(null);
  }

  const updateThumbnail = (event) => {
    convertImage(event.target)
  }
  // converts the thumbnail to base64
  // checks if given an image file
  const convertImage = (img) => {
    const reader = new FileReader();
    reader.readAsDataURL(img.files[0]);
    reader.onload = function () {
      if (reader.result.includes('data:image')) {
        response.thumbnail = reader.result;
        setResponse(response)
        setThumbnail(reader.result);
      } else {
        setThumbnail(false)
      }
    }
  }
  // wait for api data to be collected
  if (!fetched) return null;
  // render the edit page
  return (
    <section className={styles.navPadding}>
      <Nav />
      <form className={styles.glassStyle} onSubmit={handleSubmit}>
        {error ? <Alert severity="error">Error! Fix up the errors to edit the game</Alert> : null}
        {updated ? <Alert severity="success">Successfully updated!</Alert> : null}
        <h2>EDIT GAME</h2>
        <div className={styles.container}>
          <EditDetails response={response} removeThumbnail={removeThumbnail}/>
          <Accordion className={styles.padding}>
            <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="details-content"
            id="details-header"
            >
              <Typography className={classes.heading}>Thumbnail</Typography>
              <Typography className={classes.secondaryHeading}>Edit the thumbnail</Typography>
            </AccordionSummary>
            <AccordionDetails className={styles.flexInput}>
              <div className={styles.inputItem}>
                {thumbnail ? <img className={styles.image} src={response.thumbnail} alt='thumbnail' /> : <FormHelperText>Upload an image for the thumbnail.</FormHelperText>}
                <Button
                  variant="contained"
                  component="label"
                  className={classes.button}
                  startIcon={<CloudUploadIcon />}
                >
                  Update image
                  <input type='file' name='thumbnail' accept='image/*' onChange={updateThumbnail} hidden/>
                </Button>
                <LightTooltip title='Delete Thumbnail'>
                  <IconButton aria-label='delete' className={styles.deleteIcon}
                  onClick={removeThumbnail}>
                    <DeleteIcon fontSize='small' />
                  </IconButton>
                </LightTooltip>
                {thumbnail === false ? <FormHelperText className={classes.errMessage}>Error! An image was not uploaded</FormHelperText> : null}
              </div>
            </AccordionDetails>
          </Accordion>
          {questions()}
        </div>
        <div className={styles.flexColumn}>
        <LightTooltip title='Add Question'>
          <LightFabButton aria-label="add" className={styles.addButton} onClick={addQuestion}
          >
            <AddIcon />
          </LightFabButton>
        </LightTooltip>
        <Button
          variant="contained"
          component="label"
          className={classes.button}
          startIcon={<EditIcon />}
          aria-label='submit-edit'
        >
          Submit
          <input type='submit' value='SubmitEdit' hidden/>
        </Button>
        </div>
      </form>
    </section>
  )
}

// render the edit title component
function EditDetails ({ response }) {
  const [title, setTitle] = useState(true);
  const classes = useStyles();
  // check for title updates
  const updateTitle = (event) => {
    setTitle(event.target.value.trim());
    response.name = event.target.value.trim();
  }

  const errorText = () => {
    if (title === '') {
      return 'Title cannot be empty'
    }
  }

  const getClass = () => {
    if (title === '') {
      return classes.errorHeading;
    } else {
      return classes.secondaryHeading;
    }
  }

  const getText = () => {
    if (title === '') {
      return 'Error! Fix up the title'
    } else {
      return 'Edit the title'
    }
  }

  return (
    <Accordion className={styles.accPadding}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="title-content"
        id="title-header"
      >
        <Typography className={classes.heading}>Title</Typography>
        <Typography className={getClass()}>
          {getText()}
        </Typography>
      </AccordionSummary>
      <AccordionDetails className={styles.flexInput}>
        <div className={styles.inputItem}>
          <TextField
            className={styles.gameTitle}
            id="title-input"
            name='title'
            error={title === ''}
            helperText={errorText()}
            label="Title"
            variant="outlined"
            defaultValue={response.name}
            onChange={updateTitle}
          />
        </div>
      </AccordionDetails>
    </Accordion>
  )
}

EditDetails.propTypes = {
  response: PropTypes.shape({
    name: PropTypes.string,
    thumbnail: PropTypes.string,
  })
}
