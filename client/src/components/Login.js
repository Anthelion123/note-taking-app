import { useState, useContext } from 'react'
import axios from 'axios';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import SignIn from './login/SignIn';
import SignUp from './login/SignUp';
import { ThemeContext } from '../App'

function Copyright(props) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        <Link color="inherit" href="https://mui.com/">
          www.pomodoc.com
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
}

export default function Login({setIsLogin}) {

    const [user, setUser] = useState({
        username: '',
        email: '',
        password: '',
    })
    const [err, setErr] = useState('')
    const [onLogin, setOnLogin] = useState(true)

    const onChangeInput = e =>{
        const {name, value} = e.target;
        setUser({...user, [name]:value})
        setErr('')
    }

    const loginSubmit = async e =>{
        e.preventDefault()
        try {
            const res = await axios.post('/users/login',{
                email: user.email,
                password: user.password
            })
            setUser({username: '', email: '', password: ''})
            localStorage.setItem('tokenStore', res.data.token)
            setIsLogin(true)
        } catch (err) {
            err.response.data.msg && setErr(err.response.data.msg)
        }
    }

    const registerSubmit = async e =>{
        e.preventDefault()
        try {
            const res = await axios.post('/users/register',{
                username: user.username,
                email: user.email,
                password: user.password
            })
            setUser({username: '', email: '', password: ''})
            setErr(res.data.msg)
        } catch (err) {
            err.response.data.msg && setErr(err.response.data.msg)
        }
    }

    return (
        <Container component="main" maxWidth="xs">
          <CssBaseline />    
            {onLogin 
            ? <SignIn
                user={user}
                loginSubmit={loginSubmit}
                onChangeInput={onChangeInput}
                setOnLogin={setOnLogin}
              /> 
            : <SignUp
                user={user}
                registerSubmit={registerSubmit}
                onChangeInput={onChangeInput}
                setOnLogin={setOnLogin}
              />
            }
          <Copyright sx={{ mt: 5 }} />
        </Container>
    )
}