import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import {useHistory} from 'react-router-dom'
import axios from 'axios';

import DocAppBar from './documents/DocAppBar';
import DocDrawer from './documents/DocDrawer';
import DocProgress from './documents/DocProgress';
import DocPdf from './documents/DocPdf';

import useInterval from "../utils/useInterval";
import { red } from '@mui/material/colors';

const mdTheme = createTheme();
export default function Documents({match}) {

  const [open, setOpen] = React.useState(false);
  const [note, setNote] = React.useState({
    title: '',
    content: '',
    pdfLink: '',
    pomoLeft: 0,
    id: ''
  });
  const [pomoState, setPomoState] = React.useState({
    timerRun: false,
    session: null,
    timeRemaining: null,
    pomoCount: 0,
    focusDuration: 0,
    breakDuration: 0
  });
  const history = useHistory();

  // React.useEffect(() => {
  //   setPomoState((prevState) => {
  //     return{
  //       ...prevState,
  //       pomoCount: note.pomoLeft,
  //     };
  //   })
  // }, [note.pomoLeft])

  React.useEffect(() => {
    const getNote = async () =>{
        const token = localStorage.getItem('tokenStore')
        if(token){
            const res = await axios.get(`/api/notes/${match.params.id}`, {
              headers: {Authorization: token}
            })
            setNote({
              title: res.data.note.title,
              content: res.data.note.content,
              pdfLink: res.data.note.pdfLink,
              pomoLeft: res.data.note.pomoLeft,
              id: res.data.note._id
            }) 
            setPomoState({...pomoState,
              pomoCount: res.data.pomo.pomoCount,
              focusDuration: res.data.pomo.focusDuration,
              breakDuration: res.data.pomo.breakDuration
            })
            
        }
    }
    getNote()
  },[match.params.id])

  const onChangeInput = e => {
    const {name, value} = e.target;
    setNote({...note, [name]:value})
  }
  const editNote = async e => {
    e.preventDefault()
    try {
        const token = localStorage.getItem('tokenStore')
        if(token){
            const {title, content, id} = note;
            const newNote = {
                title, 
                content, 
                // pomoLeft: pomoState.pomoCount
            }
            const {pomoCount} = pomoState;
            const newPomoState = {
              pomoCount,
            }
            await axios.put(`/api/notes/${id}`, {"note": newNote, "pomo": newPomoState}, {
                headers: {Authorization: token}
            })
            
            return history.push('/')
        }
    } catch (err) {
        window.location.href = "/";
    }
  }

  function toggleDrawer() {
    setOpen(!open);
  };

  function playPause() {
    setPomoState((prevState) => {
      const nextTimerRun = !(prevState.timerRun);
      if (nextTimerRun) {
        if (prevState.session === null) {
          return {
            ...prevState,
            timerRun: nextTimerRun,
            session: 'Focus',
            timeRemaining: prevState.focusDuration * 60,
          };
        }
      }
      return {
        ...prevState,
        timerRun: nextTimerRun,
      };
    });
  }

  function stopHandle () {
    setPomoState((prevState) => {
      return{
        ...prevState,
        timerRun: false,
        session: null,
        timeRemaining: null,
      }
    })
  }

  useInterval(() => {
    if (pomoState.timeRemaining === 0) {
      new Audio("https://bigsoundbank.com/UPLOAD/mp3/1482.mp3").play();
      return setPomoState((prevState) => {
        if (prevState.session === 'Focus') {
          return {
            ...prevState,
            session: 'Break',
            timeRemaining: prevState.breakDuration * 60,
            pomoCount: prevState.pomoCount--,
          }
        } else {
          return {
            ...prevState,
            session: 'Focus',
            timeRemaining: prevState.focusDuration * 60,
          }
        }
      });
    } else {
      return setPomoState((prevState) => {
        const timeRemaining = Math.max(0, prevState.timeRemaining - 1);
        return {
          ...prevState,
          timeRemaining
        }
      })
    };
  },
    pomoState.timerRun ? 100 : null
  );

  

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <DocAppBar 
          open={open} 
          toggleDrawer={toggleDrawer}
          playPause={playPause}
          pomoState={pomoState}
          stopHandle={stopHandle}
          title={note.title}   
        />
        <DocDrawer 
          open={open} 
          toggleDrawer={toggleDrawer}
          editNote={editNote}
        />
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <DocProgress 
            pomoState={pomoState}
            // focusDuration={pomoState.focusDuration}
            // breakDuration={pomoState.breakDuration}
          />
          <DocPdf 
            title={note.title}
            content={note.content}
            pdfLink={note.pdfLink}
            onChangeInput={onChangeInput}
          />
        </Box>    
      </Box>
    </ThemeProvider>
  );
}
