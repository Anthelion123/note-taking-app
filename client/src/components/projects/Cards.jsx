import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';

import {Link} from 'react-router-dom'

import Create from './Create';

function Cards({notes, deleteNote, updateNotes}) {
  
  return (
    <Container sx={{ py: 8 }} maxWidth="md">
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={4} sx={{alignItems: 'stretch'}}>
          <Create updateNotes={updateNotes} />
        </Grid>
        {notes.map((note) => (
          <Grid item key={note} xs={12} sm={6} md={4}>
            <Card
              sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {note.title}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ pl: 0.2 }}>
                  {note.date}
                </Typography>
              </CardContent>
              <CardActions>
                {/* <Button size="small" to={`edit/${note._id}`}>View</Button> */}
                <Link to={`edit/${note._id}`} >View</Link>
                <Button size="small" onClick={() => deleteNote(note._id)}>Delete</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default Cards