import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';

import AddIcon from '@mui/icons-material/Add';
import DatePicker from '@mui/lab/DatePicker';

import axios from 'axios';
import { useHistory, Link } from 'react-router-dom';
import { Document, pdfjs } from 'react-pdf';

const corsurl = "https://cors-anywhere.herokuapp.com/"
const readingSpeed = 2
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function Creat({updateNotes}) {
  const [open, setOpen] = React.useState(false);
  // const [value, setValue] = React.useState(null);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [note, setNote] = React.useState({
    title: '',
    date: '',
    pdfLink: '',
    pageCount: 0,
    pomoLeft: 0,
})
const history = useHistory()

function onDocumentLoadSuccess({ numPages }) {
    setNote({...note, 
      ["pageCount"]: numPages, 
      ["pomoLeft"]: Math.ceil(numPages/readingSpeed)
    });
}

const onChangeInput = e => {
    const {name, value} = e.target;
    setNote({...note, [name]:value})
}


const createNote = async e => {
    e.preventDefault()
    handleClose()
    try {
        const token = localStorage.getItem('tokenStore')
        if(token){
            const {title, date, pdfLink, pageCount, pomoLeft} = note;
            const newNote = {
                title, date, pdfLink, pageCount, pomoLeft
            }

            await axios.post('/api/notes', newNote, {
                headers: {Authorization: token}
            })
            updateNotes()
            return history.push('/')
        }
    } catch (err) {
        window.location.href = "/";
    }
    
}

  return (
    <div style={{height: '100%'}}>
      <Card sx={{ height: '100%', display: 'flex' }} >
        <CardActionArea onClick={handleOpen}>
          <CardContent sx={{display: 'flex', justifyContent: 'center', }}>
            <AddIcon fontSize="large" />
          </CardContent>
        </CardActionArea>
      </Card>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography variant="h6" gutterBottom>
                Import Document
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  id="title"
                  name="title"
                  value={note.title}
                  onChange={onChangeInput}
                  label="Title"
                  fullWidth
                  autoComplete="title"
                  variant="standard"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  id="pdfLink"
                  name="pdfLink"
                  value={note.pdfLink}
                  onChange={onChangeInput}
                  label="PDF Location"
                  fullWidth
                  autoComplete="pdfLink"
                  variant="standard"
                />
              </Grid>
              <Grid item xs={12} sx={{ mt: 2 }}>
                <DatePicker
                  label="Due Date"
                  value={note.date}
                  onChange={(newDate) => {
                    setNote((prevState) => {
                      return {
                        ...prevState,
                        date: newDate,
                      };
                    })}}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Grid>
              <div className="Transparent" style={{ display: "none" }}>
                <Document file={corsurl+note.pdfLink} onLoadSuccess={onDocumentLoadSuccess}>
                </Document>
              </div>
            </Grid>
            <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                sx={{ mt: 5, ml: 1 }}
                onClick={createNote}
              >
                Sumbit
              </Button>
              {/* <Link 
                to={`/`} 
                variant="contained"
                sx={{ mt: 5, ml: 1 }}
                onClick={createNote}
              >
                Submit
              </Link> */}
            </Box>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
