// Template from Material UI: https://material-ui.com/getting-started/templates/
import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { api } from '../api.jsx';
import Alert from '@material-ui/lab/Alert';
import Link from '@material-ui/core/Link';
import Copyright from '../components/copyright';
import './auth.css';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#3064d0',
    },
    secondary: {
      main: '#69738b',
    },
  },
});

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    padding: theme.spacing(5),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: 'rgba( 255, 255, 255, 0.25 )',
    boxShadow: '0 8px 32px 0 rgba( 31, 38, 135, 0.37 )',
    backdropFilter: 'blur( 4px )',
    borderRadius: '10px',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: 'transparent',
    color: theme.palette.text.secondary,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Login () {
  const loginInitialState = { email: '', password: '' };
  const loginInitialErrorState = {
    email: { error: false, message: '' },
    password: { error: false, message: '' },
  };
  const [data, setData] = useState(loginInitialState);
  const [errors, setErrors] = useState(loginInitialErrorState);
  const [isFormValid, setIsFormValid] = useState(false);
  const [notificationError, setNotificationError] = useState(false);
  const [notificationErrorMessage, setNotificationErrorMessage] = useState('');

  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleChange = (e) => {
    setIsFormValid(true);
    const { name, value } = e.target;
    setErrors({
      ...errors,
      [name]: {
        error: false,
        message: '',
      },
    });

    if (value === '') {
      setIsFormValid(false);
      setErrors({
        ...errors,
        [name]: {
          error: true,
          message: 'Please fill out all fields',
        },
      });
    }

    if (name === 'email') {
      if (!validateEmail(value)) {
        setIsFormValid(false);
        setErrors({
          ...errors,
          [name]: {
            error: true,
            message: 'Please enter a valid email',
          },
        });
      }
    }

    setData({ ...data, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = data;
    api.login(email, password)
      .then((res) => {
        if (res.error) {
          setNotificationError(true);
          setNotificationErrorMessage(res.error);
        } else {
          api.setToken(res.token);
          localStorage.setItem('token', res.token)
          window.location = '/dashboard';
        }
      })
  };

  const classes = useStyles();
  document.body.style.background = 'transparent';
  document.getElementsByTagName('html')[0].className = 'login';
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" color="textSecondary">
            Hi There!
          </Typography>
          <form className={classes.form} noValidate>
            {notificationError && (
              <Alert variant="outlined" severity="error">
                {notificationErrorMessage}
              </Alert>
            )}
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              color="primary"
              onChange={handleChange}
              error={errors.email.error}
              helperText={errors.email.message}
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              color="primary"
              onChange={handleChange}
              error={errors.password.error}
              helperText={errors.password.message}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={handleSubmit}
              disabled={!isFormValid}
              id='submitLogin'
            >
              Log In
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    </ThemeProvider>
  );
}
