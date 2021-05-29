import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';

export const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}))(Tooltip);

export const FabButton = withStyles((theme) => ({
  root: {
    color: theme.palette.common.white,
    background: 'rgba( 255, 255, 255, 0.25 )',
    boxShadow: '0 8px 32px 0 rgba( 31, 38, 135, 0.37 )',
    backdropFilter: 'blur( 4px )',
    margin: '20px 20px 5px 20px'
  },
}))(Fab);

export const LightFabButton = withStyles((theme) => ({
  root: {
    background: 'rgba(255,255,255,0.2)',
    border: '1px solid rgba(255,255,255,0.2)',
    color: 'white',
    margin: '20px'
  },
}))(Fab);
