import React, { useEffect, useState } from 'react';
import { api } from '../api.jsx';
import GridItem from './grid-item.jsx';
import EmptyDashboard from './empty-dashboard.jsx';
import Grid from '@material-ui/core/Grid';
import AddButton from '../components/add-button';
import styles from './dashboard.module.css';

// render the grid of game cards
export default function QuizGrid () {
  const [response, setResponse] = useState([]);
  const [fetched, setFetched] = useState(false);
  const [open, setOpen] = useState(false);
  const [render, setRender] = useState(false);
  const data = {
    open: open,
    setOpen: setOpen,
    setResponse: setResponse
  }
  // set up data for the page
  useEffect(async () => {
    // empty list incase of no games
    setResponse([]);
    // get all quizzes
    const q = await api.getQuizzes();
    for (let i = 0; i < q.quizzes.length; i++) {
      const quiz = q.quizzes[i];
      // get particular quiz data
      const res = await api.getQuiz(quiz.id);
      // calculate the total time of the quiz
      let totalTime = 0;
      res.questions.forEach(ques => {
        const time = ques.time_limit.split(':');
        const seconds = parseInt(time[0]) * 60 + parseInt(time[1]);
        totalTime = totalTime + parseInt(seconds);
      });
      // set up data to give to the game card
      const data = {
        id: quiz.id,
        published: quiz.createdAt,
        title: quiz.name,
        img: quiz.thumbnail,
        questions: res.questions.length,
        total_time: new Date(totalTime * 1000).toISOString().substr(11, 8),
        active: quiz.active,
        sessions: quiz.oldSessions
      };
      // get the position of the game if active
      // used to detect what button to show like advance/stop
      if (quiz.active) {
        const game = await api.getAdminStatus(quiz.active);
        if (!game.error) {
          data.position = game.results.position;
        }
      }
      // add data to the response
      setResponse(prevRes => [...prevRes, data]);
      // set fetched after all data is collected
      if (i === q.quizzes.length - 1) {
        setFetched(true);
      }
    }
    // set fetched if no data found
    if (q.quizzes.length === 0) {
      setFetched(true);
    }
  }, [render]);

  // show the empty dashboard or set up grid
  function getGames (response) {
    if (response.length === 0) {
      return (
        <EmptyDashboard />
      )
    } else {
      return (
        <div className={styles.navPadding}>
          <Grid container spacing={5} className={styles.stretchHeight}>
            {sortItems(response)}
          </Grid>
        </div>
      )
    }
  }

  // sort items by published date
  // stops game cards shuffling randomly on render
  const sortItems = (response) => {
    const items = []
    let i = 0;
    response.forEach(r => {
      const item = <GridItem key={r.id + i} quiz={r} response={response} setResponse={setResponse} render={render} setRender={setRender}/>
      items.push(item);
      i++;
    })
    const sorted = items.sort((a, b) => (new Date(a.props.quiz.published)) - (new Date(b.props.quiz.published)));
    return sorted;
  }

  if (!fetched) return null;
  return (
    <section className={styles.container}>
      <div>
        <h1 id='dashboard-title'>
          DASHBOARD
        </h1>
      </div>
      {getGames(response)}
      <AddButton
        id='newGame'
        aria-label='Add Game'
        data={data}
        aria-modal={open}
      />
    </section>
  );
}
