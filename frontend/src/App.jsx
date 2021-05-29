import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import Dashboard from './pages/dashboard';
import Login from './pages/login';
import Signup from './pages/signup';
import './App.css';
import EditGame from './pages/edit-game';
import Results from './pages/results';
import JoinGame from './pages/join-game';
import Game from './pages/game';
import AdminGame from './pages/advance';
import PlayerResults from './pages/player-results';
import Lobby from './pages/lobby';
import OldSessions from './pages/old-sessions';

export default function App () {
  return (
    <Router>
      <Switch>
        <Route path="/dashboard"
          render={(props) => {
            if (localStorage.getItem('token')) return <Dashboard/>;
            else return <Login/>;
          }} />
        <Route path="/login"
          render={(props) => {
            if (localStorage.getItem('token')) return <Dashboard/>;
            else return <Login/>;
          }} />
        <Route path="/signup"
          render={(props) => {
            if (localStorage.getItem('token')) return <Dashboard/>;
            else return <Signup/>;
          }} />
        <Route path="/results/:quiz/:id"
          render={(props) => {
            if (localStorage.getItem('token')) return <Results/>;
            else return <Login/>;
          }} />
        <Route path="/edit/game/:id"
          render={(props) => {
            if (localStorage.getItem('token')) return <EditGame/>;
            else return <Login/>;
          }} />
        <Route path="/sessions/:id"
          render={(props) => {
            if (localStorage.getItem('token')) return <OldSessions/>;
            else return <Login/>;
          }} />
        <Route path="/admin/game/:quiz/:session"
          render={(props) => {
            if (localStorage.getItem('token')) return <AdminGame/>;
            else return <Login/>;
          }} />
        <Route path="/join/:id?" component={JoinGame}/>
        <Route path="/lobby/:id" component={Lobby}/>
        <Route path="/game/:id" component={Game}/>
        <Route path="/player/results/:id" component={PlayerResults}/>
        <Route path="/"
          render={(props) => {
            if (localStorage.getItem('token')) return <Dashboard/>;
            else return <Login/>;
          }} />
      </Switch>
    </Router>
  );
}
