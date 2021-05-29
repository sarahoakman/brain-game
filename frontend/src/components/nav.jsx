import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { api } from '../api.jsx';
import './nav.css';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  button: {
    color: theme.palette.common.white,
  },
  textButton: {
    color: theme.palette.common.white,
    border: theme.palette.common.white,
  },
}));

// copied from https://material-ui.com/components/tooltips/
const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}))(Tooltip);

export function JoinGameButton ({ onClick }) {
  const classes = useStyles();
  return (
    <Button onClick={onClick} variant="outlined" id = 'joinGame' className={classes.textButton}>Join A Game</Button>
  )
}

export function DashboardButton ({ onClick }) {
  const classes = useStyles();
  return (
    <LightTooltip title="Dashboard" aria-label="dashboard tooltip" onClick={onClick}>
      <IconButton aria-label="dashboard" className={classes.button}>
        <DashboardIcon />
      </IconButton>
    </LightTooltip>
  )
}

export function LogoutButton ({ onClick }) {
  const classes = useStyles();
  return (
    <LightTooltip title="Log Out" aria-label="logout tooltip" onClick={onClick}>
      <IconButton aria-label="logout" className={classes.button}>
        <ExitToAppIcon />
      </IconButton>
    </LightTooltip>
  )
}

export default function Nav () {
  const logout = async () => {
    await api.logout();
    localStorage.removeItem('token');
    api.token = '';
    window.location = '/login';
  };
  const joinGame = () => {
    window.location = '/join';
  }
  const directDashboard = () => {
    window.location = '/dashboard';
  }
  return (
    <AppBar position="sticky" className="appBar" color="transparent">
      <Toolbar className="toolBar">
        <Box display='flex' flexGrow={1}>
          <DashboardButton onClick={directDashboard} />
        </Box>
        <JoinGameButton onClick={joinGame}/>
        <LogoutButton onClick={logout}/>
      </Toolbar>
    </AppBar>
  );
}

JoinGameButton.propTypes = {
  onClick: PropTypes.func,
}

DashboardButton.propTypes = {
  onClick: PropTypes.func,
}

LogoutButton.propTypes = {
  onClick: PropTypes.func,
}
