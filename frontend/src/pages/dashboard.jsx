import React from 'react';
import QuizGrid from '../components/quiz-grid';
import Nav from '../components/nav';

// render the dashboard
export default function Dashboard () {
  clearStyling();
  return (
    <div>
    <Nav />
    <main>
      <QuizGrid />
    </main>
  </div>
  )
}

// clear styling from login/signup and update the background
function clearStyling () {
  document.body.style.background = 'linear-gradient(to right top, #3377ff, #4676ff, #5474ff, #6173ff, #6d71ff, #8c6ff8, #a46ef1, #b86de9, #d470d9, #e676ca, #f280bd, #f98db4) no-repeat';
  document.getElementsByTagName('html')[0].className = '';
}
