import './TodoLogin.css'
import login from '../../Assets/login.svg'
import TextField from '@mui/material/TextField';
import { CircularProgress, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import Cookies from 'js-cookie';
import { motion } from 'framer-motion'

interface TodoLoginProps {
    getMode: (data: string) => void;
}

const TodoLogin: React.FC<TodoLoginProps> = ({ getMode }) => {

    const [visible, setVisible] = useState(false)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const changeMode = () => {
        getMode('todo')
    }

    const token = Cookies.get('todo_token');

    useEffect(() => {
        if (token) {
            getMode('todo')
        }
    }, [])


    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true)
        try {
            const response = await axios.post('https://love-todo-app.onrender.com/api/v1/user/login', {
                username,
                password
            });
            if (response.data.statusCode === 200) {
                toast(response?.data?.message,
                    {
                        icon: '👏',
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        },
                    }
                );
                toast.success('Login successful', {
                    position: 'top-center',
                })
                Cookies.set('todo_token', response?.data?.accessToken)
                changeMode()
            }
            setLoading(false)
         } catch (error: unknown) {
            setLoading(false)
                if (axios.isAxiosError(error)) {
                toast.error(error?.response?.data?.message, {
                    position: 'top-center',
                    style: {
                        border: '1px solid red'
                    }
                })
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <div className="todo-login-component">
                <div className="todo-login-left">
                    <div className="todo-login">
                        <img src={login} alt="" className="todo-login-image" />
                    </div>
                </div>
                <hr className="vertical-hr " />
                <div className="todo-login-right">
                    <form action="" onSubmit={handleSubmit}>
                        <div className="login-col">
                            <div className="login-title">
                                <span className="login-title-name">LOGIN</span>
                            </div>
                            <div className="login-form">
                                <div className="login-input-row">
                                    <TextField
                                        onChange={handleEmailChange}
                                        InputProps={{
                                            sx: {
                                                borderRadius: '35px',
                                                padding: '2px 5px'
                                            },
                                        }}
                                        className='login-input'
                                        required
                                        label='Username'
                                        type='text' />
                                </div>
                                <div className="login-input-row">
                                    <TextField
                                        onChange={handlePasswordChange}
                                        className='login-input'
                                        required
                                        label='Password'
                                        type={!visible ? 'password' : 'text'} InputProps={{
                                            sx: {
                                                borderRadius: '35px',
                                                padding: '2px 5px'
                                            },
                                            endAdornment: (
                                                <InputAdornment position="start">
                                                    {visible ? <VisibilityOff className='eye-icon' onClick={() => setVisible(false)} />
                                                        :
                                                        <Visibility className='eye-icon' onClick={() => setVisible(true)} />
                                                    }
                                                </InputAdornment>
                                            ),
                                        }} />
                                </div>
                                {!loading ?
                                    <div className="login-input-row">
                                        <button type='submit' className="login">LOGIN</button>
                                    </div>
                                    :
                                    <div className="login-input-row">
                                        <button className="login-loading">Please wait... <CircularProgress size='1em' sx={{ color: 'red' }} /></button>
                                    </div>
                                }
                                <div className="login-input-row">
                                    <span className="sign-nav">New user ? <span className="sign-high" onClick={() => getMode('signup')}>SIGN-UP</span></span>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </motion.div>
    )
}

export default TodoLogin