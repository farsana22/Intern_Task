import './Todo.css'
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { FormEvent, useEffect, useState } from "react";
import TodoItem from '../TodoItem/TodoItem';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import FooterRow from '../Footer/Footer';
import { motion } from 'framer-motion'
import oops from '../../Assets/oops.png'

interface TodoProps {
  getMode: (data: string) => void;
}

const Todo: React.FC<TodoProps> = ({ getMode }) => {
  const [showPicker, setShowPicker] = useState(false)
  const [selectedEmoji, setSelectedEmoji] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [todos, setTodos] = useState([]);
  const [todosCount, setTodoscount] = useState(0);
  const [doneCount, setDonecount] = useState(0);
  const [todoLoading, setTodoLoading] = useState(false);

  function onClick(emojiData: EmojiClickData) {
    setSelectedEmoji(emojiData.unified);
    setInputValue((prevValue) => prevValue + emojiData.emoji);
  }

  console.log(selectedEmoji)

  const token = Cookies.get('todo_token');

  const changeMode = () => {
    getMode('login')
  }

  const handleLogout = () => {
    Cookies.remove('todo_token')
    changeMode()
    toast.success('logged out successful', {
      position: 'top-center',
      style: {
        border: '1px solid green'
      }
    })
  }

  useEffect(() => {
    if (!token) {
      changeMode()
    }
  }, [handleLogout])

  useEffect(() => {
    fetchData()
  }, []);

  const fetchData = async () => {
    if (token) {
      setTodoLoading(true)
      try {
        const response = await axios.get('https://love-todo-app.onrender.com/api/v1/user/getTodos', {
          headers: {
            Authorization: "Bearer " + token
          }
        });
        setDonecount(response?.data.doneCount)
        setTodoscount(response?.data.count)
        setTodos(response?.data.data)
        setTodoLoading(false)
      } catch (error: unknown) {
        setTodoLoading(false)
        if (axios.isAxiosError(error)) {
          if (error.response?.data.statusCode === 401) {
            handleLogout()
            toast.error('Token Expired.', {
              style: {
                border: '1px solid #713200',
                padding: '16px',
                color: '#713200',
              },
              iconTheme: {
                primary: '#713200',
                secondary: '#FFFAEE',
              },
            });
          }
        }
      }
    }
  };

  function handleTodoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;

    // Validate the todo input
    if (value.match(/[./\[\]{}<>]/)) {
      setError(true);
      toast.error('([./\[\]{}<>]/) etc... are not allowed.', {
        position: 'top-center',
        style: {
          border: '1px soild red'
        }
      })
    } else {
      setError(false);
    }

    setInputValue(value);
  }
  const handleSubmitTodo = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowPicker(false)
    if (error) {
      toast.error('Invalid task name', {
        position: 'top-center',
        style: {
          border: '1px solid red'
        }
      })
    }
    setLoading(true)
    try {
      const response = await axios.post('https://love-todo-app.onrender.com/api/v1/user/createTodo', { todoTitle: inputValue }, {
        headers: {
          Authorization: "Bearer " + token
        }
      });
      if (response) {
        toast.success('Todo Created.', {
          style: {
            border: '1px solid #713200',
            padding: '6px',
            color: '#713200',
          },
          iconTheme: {
            primary: '#713200',
            secondary: '#FFFAEE',
          },
        });
      }
      setLoading(false)
      setInputValue('')
      fetchData()
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setLoading(false)
        console.log(error.response?.data.status)
        if (error.response?.data.statusCode === 401) {
          handleLogout()
          toast.error('Token Expired.', {
            style: {
              border: '1px solid #713200',
              padding: '16px',
              color: '#713200',
            },
            iconTheme: {
              primary: '#713200',
              secondary: '#FFFAEE',
            }
          });
        } else if (error.response?.data.statusCode === 400) {
          toast.error(error.response?.data.error, {
            style: {
              border: '1px solid #713200',
              padding: '16px',
              color: '#713200',
            },
            iconTheme: {
              primary: '#713200',
              secondary: '#FFFAEE',
            }
          });
        } else {
          toast.error('Something went wrong !', {
            style: {
              border: '1px solid #713200',
              padding: '16px',
              color: '#713200',
            },
            iconTheme: {
              primary: '#713200',
              secondary: '#FFFAEE',
            }
          });
        }
      }
    }
  }


  const handledelete = async (todoId: string) => {
    if (token) {
      setTodoLoading(true)
      try {
        const response = await axios.delete('https://love-todo-app.onrender.com/api/v1/user/delete/' + todoId, {
          headers: {
            Authorization: "Bearer " + token
          }
        });
        if (response) {
          fetchData()
          setTodoLoading(false)
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
        }
      } catch (error: unknown) {
        setTodoLoading(false)
        if (axios.isAxiosError(error)) {
          if (error.response?.data.statusCode === 401) {
            handleLogout()
            toast.error('Token Expired.', {
              style: {
                border: '1px solid #713200',
                padding: '16px',
                color: '#713200',
              },
              iconTheme: {
                primary: '#713200',
                secondary: '#FFFAEE',
              },
            });
          }
        }
      }
    }
  };


  const handleComplete = async (todoId: string) => {
    if (token) {
      setTodoLoading(true)
      try {
        const response = await axios.put('https://love-todo-app.onrender.com/api/v1/user/completed', { todoId }, {
          headers: {
            Authorization: "Bearer " + token
          }
        });
        if (response) {

          fetchData()
          setDonecount(doneCount + 1)
          setTodoLoading(false)
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
        }
      } catch (error: unknown) {
        setTodoLoading(false)
        if (axios.isAxiosError(error)) {
          if (error.response?.data.statusCode === 401) {
            handleLogout()
            changeMode
            toast.error('Token Expired.', {
              style: {
                border: '1px solid #713200',
                padding: '16px',
                color: '#713200',
              },
              iconTheme: {
                primary: '#713200',
                secondary: '#FFFAEE',
              },
            });
          }
        }
      }
    }
  };

  const handlegetTodo = async (getValue: string) => {
    if (token) {
      setTodoLoading(true)
      try {
        const response = await axios.get(`https://love-todo-app.onrender.com/api/v1/user/getActiveTodo?isCompleted=` + getValue, {
          headers: {
            Authorization: "Bearer " + token
          }
        });
        setDonecount(response?.data.doneCount)
        setTodoscount(response?.data.count)
        setTodos(response?.data.data)
        setTodoLoading(false)
      } catch (error: unknown) {
        setTodoLoading(false)
        if (axios.isAxiosError(error)) {
          if (error.response?.data.statusCode === 401) {
            handleLogout()
            changeMode
            toast.error('Token Expired.', {
              style: {
                border: '1px solid #713200',
                padding: '16px',
                color: '#713200',
              },
              iconTheme: {
                primary: '#713200',
                secondary: '#FFFAEE',
              },
            });
          }
        }
      }
    }
  };

  const handleClearCompleted = async () => {
    if (token) {
      setTodoLoading(true)
      try {
        const response = await axios.delete(`https://love-todo-app.onrender.com/api/v1/user/deleteCompleted`, {
          headers: {
            Authorization: "Bearer " + token
          }
        });
        fetchData()
        toast.success(response?.data?.message, {
          style: {
            border: '1px solid #713200',
            padding: '16px',
            color: '#713200',
          },
          iconTheme: {
            primary: '#713200',
            secondary: '#FFFAEE',
          },
        });
        setTodoLoading(false)
      } catch (error: unknown) {
        setTodoLoading(false)
        if (axios.isAxiosError(error)) {
          if (error.response?.data.statusCode === 401) {
            handleLogout()
            changeMode
            toast.error('Token Expired.', {
              style: {
                border: '1px solid #713200',
                padding: '16px',
                color: '#713200',
              },
              iconTheme: {
                primary: '#713200',
                secondary: '#FFFAEE',
              },
            });
          }
        }
      }
    }
  };

  const handleClearAll = async () => {
    if (token) {
      try {
        const response = await axios.delete(`https://love-todo-app.onrender.com/api/v1/user/deleteAll`, {
          headers: {
            Authorization: "Bearer " + token
          }
        });
        fetchData()
        toast.success(response?.data?.message, {
          style: {
            border: '1px solid #713200',
            padding: '16px',
            color: '#713200',
          },
          iconTheme: {
            primary: '#713200',
            secondary: '#FFFAEE',
          },
        });
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          if (error.response?.data.statusCode === 401) {
            handleLogout()
            changeMode
            toast.error('Token Expired.', {
              style: {
                border: '1px solid #713200',
                padding: '16px',
                color: '#713200',
              },
              iconTheme: {
                primary: '#713200',
                secondary: '#FFFAEE',
              },
            });
          }
        }
      }
    }
  };


  return (
    // <motion.div
    //   initial={{ opacity: 0 }}
    //   animate={{ opacity: 1 }}
    //   transition={{ duration: 1 }}
    // >
    <div className='todo-list'>
      <div className="todo-list-container" >
        <div className="todo-title" onClick={() => setShowPicker(false)}>
          <div className="todo-left">
            <div className="todo-left-item">
              <span className="todo-title-name">TODO</span>
            </div>
          </div>
          <div className="todo-right">
            <div className="todo-right-item">
              <button className="logout" onClick={handleLogout}>LOGOUT</button>
            </div>
          </div>
        </div>

        <div className="todo-new-task">
          <form onSubmit={handleSubmitTodo}>
            <div className="new-task-row">
              <div className="new-task-left">
                <div className="emoji-left" onClick={() => setShowPicker(!showPicker)}>
                  <span className="material-symbols-outlined emoji-icon" onClick={() => setShowPicker(!showPicker)}>
                    mood
                  </span>
                </div>
              </div>
              <div className="new-task-center">
                <div className="new-task-input">
                  <input value={inputValue} onChange={handleTodoChange} type="text" className='todo-input' placeholder='Add a new task ! Eg: Coding, Hacking...' />
                </div>
              </div>
              <div className="new-task-right">
                <div className="new-task-send">
                  <button type='submit' className="send-button">
                    {loading ?
                      <CircularProgress size='1.5em' />
                      :
                      <span className="material-symbols-outlined emoji-icon">
                        send
                      </span>
                    }
                  </button>
                </div>
              </div>
            </div>
          </form>
          {showPicker && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="emoji-picker-container">
                <EmojiPicker height={400} width={285} onEmojiClick={onClick} />
              </div>
            </motion.div>
          )}
        </div>
        {/* <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          > */}
        <div className="added-todo-container">
          <div className="todo-info-row">
            <div className="todo-info-left">
              <div className="info-left">
                <span className="info">All Tasks: <button className="info-count-left">{todosCount}</button></span>
              </div>
            </div>
            <div className="todo-info-right">
              <div className="info-right">
                <span className="info">Completed Tasks: <button className="info-count">{doneCount} of {todosCount}</button></span>
              </div>
            </div>
          </div>
          {/* <hr className='hr-todo'/> */}
          {todosCount ?
            <>
              {todoLoading ?
                <div className="todo-item-row-loading">
                  <CircularProgress size='3em' color='success' />
                </div>
                :
                <div className="todo-item-row">
                  {todos && todos.map((todo, index) => (
                    <TodoItem onComplete={handleComplete} onDelete={handledelete} getMode={getMode} todo={todo} key={index} />
                  ))}
                </div>
              }
            </>
            :
            // <motion.div
            //   initial={{ opacity: 0.5 }}
            //   animate={{ opacity: 1 }}
            //   transition={{ duration: 0.1 }}
            // >
            <div className="todo-item-row-1">
              <div className="opps-row">
                <img src={oops} alt="" className="oops-img" />
              </div>
              <div className="oops-row">
                <span className="warn-text">NO TASKS!</span>
              </div>
            </div>
            // </motion.div>
          }
          <div className="todo-action-row">
            <div className="action-left">
              <span className="actions" onClick={handleClearAll}>CLEAR ALL</span>
            </div>
            <div className="action-center">
              <div className="action-center-item">
                <span className="actions" onClick={fetchData}>ALL TASKS</span>
              </div>
              <div className="action-center-item">
                <span className="actions" onClick={() => handlegetTodo('false')}>ACTIVE</span>
              </div>
              <div className="action-center-item">
                <span className="actions" onClick={() => handlegetTodo('true')}>COMPLETED</span>
              </div>
            </div>
            <div className="action-right">
              <span className="actions" onClick={handleClearCompleted}>CLEAR COMPLETED</span>
            </div>
          </div>
        </div>
        {/* </motion.div    > */}
      </div>
      <FooterRow />
    </div>
    // </motion.div >
  )
}

export default Todo