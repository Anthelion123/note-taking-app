import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';

import MenuIcon from '@mui/icons-material/Menu';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import TimerIcon from '@mui/icons-material/Timer';
import TimerOffIcon from '@mui/icons-material/TimerOff';

const drawerWidth = 280;

const AppBar = styled(MuiAppBar, {shouldForwardProp: (prop) => prop !== 'open',})
    (({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }));

export default function DocAppBar ({open, toggleDrawer, pomoState, playPause, stopHandle}) {
  
    return (
      <AppBar position="absolute" open={open}>
        <Toolbar
          sx={{
            pr: '24px', // keep right padding when drawer closed
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: '36px',
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            Title
          </Typography>
          <IconButton
            color="inherit"
            aria-label="play pause"
            onClick={playPause}
          >
            {pomoState.timerRun ? <PauseCircleIcon /> : <PlayCircleIcon />}          
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="stop"
            onClick={stopHandle}
          >     
            <StopCircleIcon />
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="pomodoros"
          >
            <Badge badgeContent={pomoState.pomoCount} color="error">
              {pomoState.session === "Focus" ? <TimerIcon /> : <TimerOffIcon />}
            </Badge>     
          </IconButton>
        </Toolbar>
      </AppBar>
 
    );
  };