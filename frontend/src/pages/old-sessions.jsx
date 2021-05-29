import React, { useEffect, useState } from 'react';
import { api } from '../api.jsx';
import Paper from '@material-ui/core/Paper';
import {
  makeStyles, withStyles,
  createMuiTheme, ThemeProvider
} from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import styles from '../components/dashboard.module.css';
import Button from '@material-ui/core/Button';
import Nav from '../components/nav';
import PropTypes from 'prop-types';

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
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    display: 'flex',
    flexDirection: 'column',
  },
}));

const StyledTableCell = withStyles((theme) => ({
  head: {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.primary.main,
  },
  body: {
    color: theme.palette.common.white,
  },
}))(TableCell);

export function ViewResultsButton ({ onClick }) {
  return (
    <Button
      variant="contained"
      aria-label="View Results Button"
      color="primary"
      onClick={onClick}
    >
      View Results
    </Button>
  )
}

export function SessionTable ({ data }) {
  const sessions = data.sessions;
  const classes = useStyles();
  function handleClick (id) {
    window.location = '/results/' + data.id + '/' + id;
  }

  return (
    <Table id="table" className={classes.table} aria-label="table of past sessions">
      <TableHead id = 'tableHead'>
        <TableRow>
          <StyledTableCell className = 'tableHeaders' align='center'>
            Past Session IDs
          </StyledTableCell>
          <StyledTableCell className = 'tableHeaders' align='center'>
            See Game Results
          </StyledTableCell>
        </TableRow>
      </TableHead>
      <TableBody id = 'tableBody'>
        {sessions.map((session) => (
          <TableRow className = 'tableRows' key={session}>
            <StyledTableCell className = 'tableCells' align='center'
              component="th" scope="row">
              {session}
            </StyledTableCell>
            <StyledTableCell className = 'tableCells' align='center'>
              <ViewResultsButton
                onClick={e => handleClick(session)}
              />
            </StyledTableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default function OldSessions () {
  const params = useParams();
  const classes = useStyles();
  const [sessions, setSessions] = useState([]);

  document.body.style.background =
    'linear-gradient(to right bottom, #3377ff, #0094ff, #00abf9, #58bfec, #93cfe2) no-repeat';
  const glassStyle = {
    background: 'rgba( 255, 255, 255, 0.25 )',
    boxShadow: '0 8px 32px 0 rgba( 31, 38, 135, 0.37 )',
    backdropFilter: 'blur( 4px )',
    borderRadius: '10px',
    color: 'white',
  }

  useEffect(async () => {
    const quiz = await api.getQuiz(params.id);
    setSessions(quiz.oldSessions);
  }, []);

  function getData () {
    const props = {
      sessions: sessions,
      id: params.id,
    }
    return props;
  }

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <Nav />
        <section className={styles.container}>
          <div>
            <h1>PAST SESSIONS</h1>
          </div>
          <div className={styles.navPadding}>
            <TableContainer component={Paper} style = {glassStyle}>
              <SessionTable data={getData()}/>
            </TableContainer>
          </div>
        </section>
      </div>
    </ThemeProvider>
  );
}

ViewResultsButton.propTypes = {
  onClick: PropTypes.func,
}

SessionTable.propTypes = {
  data: PropTypes.shape({
    sessions: PropTypes.arrayOf(PropTypes.string),
    setSessions: PropTypes.func,
    id: PropTypes.string,
  })
}
