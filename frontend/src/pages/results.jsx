import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import styles from '../components/dashboard.module.css';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import { api } from '../api.jsx';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Nav from '../components/nav';
import {
  summariseQuestions, initialisePercentages,
  initialiseTimeTaken, getValues, findTopFive
} from '../components/helpers'
import {
  Chart,
  BarSeries,
  Title,
  ArgumentAxis,
  ValueAxis,
  Tooltip,
} from '@devexpress/dx-react-chart-material-ui';
import PropTypes from 'prop-types';

import { EventTracker } from '@devexpress/dx-react-chart';

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
    backgroundColor: theme.palette.common.white,
    color: theme.palette.primary.main,
  },
}))(TableCell);

export function GameResults ({ data }) {
  const glassStyle = {
    background: 'rgba( 255, 255, 255, 0.25 )',
    boxShadow: '0 8px 32px 0 rgba( 31, 38, 135, 0.37 )',
    backdropFilter: 'blur( 4px )',
    borderRadius: '10px',
    color: 'white',
    textAlign: 'center',
  }
  const percentages = data.percentages;
  const timeTaken = data.timeTaken;
  const topPlayers = data.topPlayers;
  const targetItem = data.targetItem;
  const setTargetItem = data.setTargetItem;
  const changeTargetItem = targetItem => setTargetItem(targetItem);
  const classes = useStyles();
  if (topPlayers.length === 0) {
    return (
      <div id='noQuestions' className={styles.navPadding}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Paper style={glassStyle} className={classes.paper}>
              <h3>Points System</h3>
              <p>The final score is calculated by adding up the points for each question.</p>
              <p>Points for individual questions take into account the max points for the question and the time taken to answer.</p>
              <p>Incorrect answers score 0 points whilst correct answers score max points * (time limit - time taken(in seconds)). </p>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Paper style={glassStyle} className={classes.paper}>
              <h3>Sorry, there are no results to show</h3>
              <p>This may be a result of there being no questions to the game at all or no players. Share the join link or edit the game to add questions</p>
            </Paper>
          </Grid>
        </Grid>
      </div>
    )
  } else {
    return (
      <div id='hasQuestions' className={styles.navPadding}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Paper style={glassStyle} className={classes.paper}>
              <h3>Points System</h3>
              <p>The final score is calculated by adding up the points for each question.</p>
              <p>Points for individual questions take into account the max points for the question and the time taken to answer.</p>
              <p>Incorrect answers score 0 points whilst correct answers score max points * (time limit - time taken(in seconds)). </p>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <TableContainer component={Paper} style = {glassStyle}>
              <h3>Leaderboard</h3>
            <Table className={classes.table} aria-label="table of top 5 players">
              <TableHead>
                <TableRow>
                  <StyledTableCell align='center'>Player Name</StyledTableCell>
                  <StyledTableCell align='center'>Score</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topPlayers.map((player) => (
                  <TableRow key={player}>
                    <StyledTableCell align='center' component="th" scope="row">
                      {player.name}
                    </StyledTableCell>
                    <StyledTableCell align='center'>
                      {player.total}
                    </StyledTableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4}>
            <Paper style={glassStyle} className={classes.paper}>
              <Chart
                data={percentages}
              >
              <ArgumentAxis />
              <ValueAxis />

              <BarSeries
                valueField="count"
                argumentField="id"
              />
              <Title
                text="Percentage of Players Who Answered Correctly Per Question"
              />
              <EventTracker />
              <Tooltip targetItem={targetItem} onTargetItemChange={changeTargetItem} />
            </Chart>
           </Paper>
         </Grid>
         <Grid item xs={12} sm={12} md={6} lg={4}>
           <Paper style={glassStyle} className={classes.paper}>
            <Chart
              data={timeTaken}
            >
            <ArgumentAxis />
            <ValueAxis />

            <BarSeries
              valueField="time"
              argumentField="id"
            />
            <Title
              text="Average Seconds to Answer Each Question"
            />
            <EventTracker />
            <Tooltip targetItem={targetItem} onTargetItemChange={changeTargetItem} />
            </Chart>
          </Paper>
        </Grid>
      </Grid>
    </div>
    )
  }
}

export default function Results () {
  const params = useParams();
  const classes = useStyles();
  const [percentages, setPercentages] = useState([]);
  const [timeTaken, setTimeTaken] = useState([]);
  const [topPlayers, setTopPlayers] = useState([]);
  const [targetItem, setTargetItem] = useState(null);

  document.body.style.background =
  'linear-gradient(to right bottom, #3377ff, #4676ff, #5474ff, #00abf9, #58bfec, #93cfe2) no-repeat';

  useEffect(async () => {
    let questionsAnswers = [];
    let players = [];
    let percentages = [];
    let timeTaken = [];
    const results = await api.getResults(params.id);
    const quiz = await api.getQuiz(params.quiz);
    questionsAnswers = summariseQuestions(questionsAnswers, quiz.questions);
    percentages = initialisePercentages(questionsAnswers, percentages);
    timeTaken = initialiseTimeTaken(questionsAnswers, timeTaken);
    [percentages, timeTaken, players] = getValues(results.results,
      questionsAnswers, players, percentages, timeTaken);

    // change count into percentage
    percentages.forEach(percent => {
      percent.count = (percent.count / players.length) * 100;
    })
    players = findTopFive(players);
    setTopPlayers(players);
    setTimeTaken(timeTaken);
    setPercentages(percentages);
  }, []);

  function getData () {
    const props = {
      percentages: percentages,
      timeTaken: timeTaken,
      topPlayers: topPlayers,
      targetItem: targetItem,
      setTargetItem: setTargetItem,
    }
    return props;
  }

  return (
    <div className={classes.root}>
    <Nav />
      <section className={styles.container}>
      <div>
        <h1 aria-label='result-title'>
          GAME RESULTS
        </h1>
      </div>
    </section>
    <GameResults data={getData()}/>
  </div>
  );
}

GameResults.propTypes = {
  data: PropTypes.shape({
    percentages: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      count: PropTypes.number,
    })),
    timeTaken: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      time: PropTypes.number,
      num: PropTypes.number,
    })),
    topPlayers: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      total: PropTypes.number,
    })),
    setTargetItem: PropTypes.func,
    targetItem: PropTypes.shape({
      series: PropTypes.string,
      point: PropTypes.number,
    }),
  })
}
