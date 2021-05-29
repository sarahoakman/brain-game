import React, { useState } from 'react';
import { api } from '../api.jsx';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import styles from './game.module.css';
import { useParams } from 'react-router-dom';

// render the join page
export default function JoinPage () {
  // set up styling of the background
  document.body.style.background = 'linear-gradient(to right top, #fcc35b, #ffb368, #ffa578, #ff998b, #ff929c, #fd89a7, #f681b5, #ea7dc4, #d676d3, #b873e3, #8b74f2, #3377ff) no-repeat';
  // set up variables
  const params = useParams();
  const sessionId = params.id;
  const [pin, setPin] = useState(null);
  const [response, setResponse] = useState({});
  const [name, setName] = useState(null);
  const [error, setError] = useState(false);
  // update pin on change events
  const updatePin = (event) => {
    setPin(event.target.value);
  }

  // update name on change events
  const updateName = (event) => {
    setName(event.target.value);
  }

  const validatePin = async (event) => {
    event.preventDefault();
    const newPin = event.target.pin.value;
    const newName = event.target.name.value;
    // error checking for pin and name
    if (!newPin || !newName || newPin === '' || newName === '') {
      setError(true);
      return;
    } else {
      setError(false);
    }
    // api call to join quiz
    const res = await api.joinQuiz(newPin, newName);
    // go to game page if joined successfully
    if (!res.error) {
      window.location = '/game/' + res.playerId;
    }
    setResponse(res);
  }

  // check for non empty name
  function errorName () {
    if (name === '') {
      return 'Name cannot be empty'
    }
  }

  // check for non empty pins
  function errorGame () {
    if (pin === '') {
      return 'Game pin cannot be empty'
    }
  }

  // set up error text
  function getError () {
    if (error) {
      return 'Error! Fix up empty inputs to join the game'
    } else {
      return 'Error! ' + response.error;
    }
  }

  // render join page
  return (
    <form className={styles.joinContainer} onSubmit={validatePin}>
      {error || response.error
        ? <Alert
            style={{ margin: '10px 0' }}
            severity="error"
          >
            {getError()}
          </Alert>
        : null
      }
      <h1 style={{ margin: 0 }}>
        Join
      </h1>
      <TextField
        style={{ margin: '10px 0' }}
        name='pin'
        value={sessionId}
        label='Game Pin'
        variant='outlined'
        onChange={updatePin}
        error={pin === ''}
        helperText={errorGame()}
      />
      <TextField
        style={{ margin: '10px 0' }}
        name='name'
        label='Name'
        variant='outlined'
        onChange={updateName}
        error={name === ''}
        helperText={errorName()}
      />
      <Button
        variant="contained"
        component="label"
        className={styles.joinButton}
        style={{ backgroundColor: 'white' }}
        id="enterGame"
      >
        Enter
        <input type='submit' value='enter' hidden/>
      </Button>
    </form>
  );
}
