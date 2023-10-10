import './TodoSignUp.css'
import signup from '../../Assets/signup.svg'
import TextField from '@mui/material/TextField';
import { CircularProgress, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion'

interface TodoSignUpProps {
    getMode: (data: string) => void;
}
const TodoSignUp: React.FC<TodoSignUpProps> = ({ getMode }) => {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [visible, setVisible] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    console.log(passwordMatch)

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        setPasswordMatch(e.target.value === confirmPassword);
    };

    const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
        setPasswordMatch(e.target.value === password);
    };

    const changeMode = () => {
        getMode('login')
    }
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Password Missmatch !', {
                style: {
                    border: '1px solid red'
                },
                position: 'top-center',
            })
            setPasswordMatch(false);
            return;
        }

        setLoading(true)
        try {
            const response = await axios.post('https://love-todo-app.onrender.com/api/v1/user/signup', {
                username,
                password
            });
            if (response.data.statusCode === 201) {
                toast.success(response.data.message, {
                    position: 'top-center',
                })
                setLoading(false)
                changeMode()
            }
        } catch (error: unknown) {
            setLoading(false)
            console.log(error)
            if (axios.isAxiosError(error)) {
                toast.error(error?.response?.data?.error, {
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
            <div className="todo-signup-component">
                <div className="todo-signup-left">
                    <div className="todo-signup">
                        <img src={signup} alt="" className="todo-signup-image" />
                    </div>
                </div>
                <hr className="vertical-hr " />
                <div className="todo-signup-right">
                    <form onSubmit={handleSubmit}>
                        <div className="signup-col">
                            <div className="signup-title">
                                <span className="signup-title-name">SIGN-UP</span>
                            </div>
                            <div className="signup-form">
                                <div className="signup-input-row">
                                    <TextField
                                        value={username}
                                        onChange={handleEmailChange}
                                        InputProps={{
                                            sx: {
                                                borderRadius: '35px',
                                                padding: '2px 5px'
                                            },
                                        }}
                                        className='signup-input'
                                        required
                                        label='Username'
                                        type='text' />
                                </div>
                                <div className="signup-input-row">
                                    <TextField
                                        value={password}
                                        onChange={handlePasswordChange}
                                        className='signup-input'
                                        required
                                        label='Password'
                                        type={!visible ? 'password' : 'text'}
                                        InputProps={{
                                            sx: {
                                                borderRadius: '35px',
                                                padding: '2px 5px'
                                            },
                                            endAdornment: (
                                                <InputAdornment position="start">
                                                    {visible ?
                                                        <Visibility className='ey-icon' onClick={() => setVisible(false)} />
                                                        :
                                                        <VisibilityOff className='ey-icon' onClick={() => setVisible(true)} />
                                                    }
                                                </InputAdornment>
                                            ),
                                        }} />
                                </div>
                                <div className="signup-input-row">
                                    <TextField
                                        value={confirmPassword}
                                        onChange={handleConfirmPasswordChange}
                                        className='signup-input'
                                        required
                                        label='Confirm Password'
                                        type='password' InputProps={{
                                            sx: {
                                                borderRadius: '35px',
                                                padding: '2px 5px'
                                            },
                                            // endAdornment: (
                                            //     <InputAdornment position="start">
                                            //         <Visibility />
                                            //     </InputAdornment>
                                            // ),
                                        }} />
                                </div>
                                {!loading ?
                                    <div className="signup-input-row">
                                        <button type='submit' className="signup">SIGN-UP</button>
                                    </div>
                                    :
                                    <div className="signup-input-row">
                                        <button className="signup-loading">Please wait...  <CircularProgress size="1em" sx={{ color: 'red' }} /></button>
                                    </div>
                                }

                                <div className="signup-input-row">
                                    <span className="sign-nav">Already have an account ? <span className="sign-high" onClick={() => getMode('login')}>LOGIN</span></span>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </motion.div>
    )
}

export default TodoSignUp