import * as React from 'react';
import {Link} from 'react-router-dom'
// import {format} from 'timeago.js'
import axios from 'axios'

import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import Header from './projects/Header';
import Cards from './projects/Cards';
import Footer from './projects/Footer';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

const theme = createTheme();

export default function Projects() {
  const [notes, setNotes] = React.useState([])
  const [token, setToken] = React.useState('')

  const getNotes = async (token) =>{
    const res = await axios.get(`api/notes`, {
        headers:{Authorization: token}
    })
    setNotes(res.data)
  }

  React.useEffect(() =>{
      const token = localStorage.getItem('tokenStore')
      setToken(token)
      if(token){
          getNotes(token)
      }
  }, [])

  const deleteNote = async (id) =>{
      try {
          if(token){
              await axios.delete(`api/notes/${id}`, {
                  headers: {Authorization: token}
              })
              getNotes(token)
          }
      } catch (error) {
          window.location.href = "/";
      }
  }


  // const getNotes = async () =>{
  //   const res = await axios.get('api/notes')
  //   setNotes(res.data)
  // }

  // React.useEffect(() =>{
  //         getNotes()
  // }, [])

  // const deleteNote = async (id) =>{
  //     try {
  //           await axios.delete(`api/notes/${id}`)
  //           getNotes()
  //     } catch (error) {
  //         window.location.href = "/";
  //     }
  // }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* <Header setIsLogin={setIsLogin} /> */}
        <main>
          <Cards
            notes={notes}
            deleteNote={deleteNote}
          />
        </main>
        <Footer/>
      </ThemeProvider>
    </LocalizationProvider>
  );
}
