import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import FormHelperText from '@material-ui/core/FormHelperText';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { LightTooltip } from '../components/extended-materials';
import styles from '../pages/edit.module.css';

// override Material UI styling
const useStyles = makeStyles((theme) => ({
  answerPaper: {
    padding: theme.spacing(4),
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.2)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    '& > p': {
      marginBottom: '10px'
    }
  }
}));

// render an edit answer component for the edit page
export default function EditAnswer ({ id, qid, question, setDeleted, deleted, corrected, setCorrected, setRender }) {
  const answer = question.answer[id];
  const [checked, setChecked] = useState(answer.correct);
  const [answerInput, setAnswerInput] = useState(answer.text);
  // set up required data for answers
  useEffect(() => {
    setAnswerInput(answer.text);
    setChecked(answer.correct);
  }, [answer]);

  // error message for empty answer text
  function errorText () {
    if (answerInput === '') {
      return 'Answer cannot be empty'
    }
  }

  // update the answer text on change
  const updateAnswerInput = (event) => {
    setAnswerInput(event.target.value.trim());
    answer.text = event.target.value.trim();
    setRender(prev => !prev)
  }

  // delete an answer on click
  const updateDeleted = (event) => {
    // remove the answer
    question.answer.splice(id, 1)
    setDeleted(!deleted);
    // change count of correct answer
    let count = 0;
    question.answer.forEach(a => {
      if (a.correct) count++;
    })
    setCorrected(count)
  }

  // toggle check symbol
  const handleCheck = () => {
    setChecked(prev => !prev);
    answer.correct = !checked;
    // change count of correct answers
    let count = 0;
    question.answer.forEach(a => {
      if (a.correct) count++;
    })
    setCorrected(count)
  }

  // set up styling
  const classes = useStyles();
  return (
    <Grid item xs={12}>
      <Paper className={classes.answerPaper}>
        <FormHelperText>
          Question for the player to answer
        </FormHelperText>
        <TextField
          id={qid + 'ans-input' + answer.id}
          label='Answer'
          variant='outlined'
          value={answerInput}
          onChange={updateAnswerInput}
          error={answerInput === ''}
          helperText={errorText()}
        />
        <div className={styles.flexAnswerRow}>
          <FormControlLabel
            className={styles.answerCorrectLabel}
            control={<Switch
                      color='primary'
                      checked={checked}
                      onChange={handleCheck}
                    />}
            label='Correct Answer'
          />
          <LightTooltip title='Delete Answer'>
            <IconButton
              aria-label='delete'
              onClick={updateDeleted}
            >
              <DeleteIcon fontSize='small'/>
            </IconButton>
          </LightTooltip>
        </div>
      </Paper>
    </Grid>
  )
}

EditAnswer.propTypes = {
  question: PropTypes.shape({
    answer: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        text: PropTypes.string,
        correct: PropTypes.bool
      })
    ),
  }),
  qid: PropTypes.number,
  id: PropTypes.number,
  deleted: PropTypes.bool,
  setDeleted: PropTypes.func,
  corrected: PropTypes.number,
  setCorrected: PropTypes.func,
  setRender: PropTypes.func
}
