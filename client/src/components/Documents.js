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
  });
  const history = useHistory();
  React.useEffect(() =>{
    const getNote = async () =>{
        const token = localStorage.getItem('tokenStore')
        if(token){
            const res = await axios.get(`/api/notes/${match.params.id}`, {
                headers: {Authorization: token}
            })
            setNote({
                title: res.data.title,
                content: res.data.content,
                pdfLink: res.data.pdfLink,
                pomoLeft: res.data.pomoLeft,
                id: res.data._id
            })
            setPomoState({ pomoCount: res.data.pomoLeft })
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
            const {title, content, pomoLeft, id} = note;
            const newNote = {
                title, 
                content, 
                pomoLeft: pomoState.pomoCount
            }

            await axios.put(`/api/notes/${id}`, newNote, {
                headers: {Authorization: token}
            })
            
            return history.push('/')
        }
    } catch (err) {
        window.location.href = "/";
    }
  }

  const focusDuration = 5;
  const breakDuration = 5;

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
            timeRemaining: focusDuration * 60,
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
            timeRemaining: breakDuration * 60,
            pomoCount: prevState.pomoCount--,
          }
        } else {
          return {
            ...prevState,
            session: 'Focus',
            timeRemaining: focusDuration * 60,
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
            focusDuration={focusDuration}
            breakDuration={breakDuration}
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
