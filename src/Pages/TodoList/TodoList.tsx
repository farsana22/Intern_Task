import './TodoList.css'
import TodoLogin from '../../Components/TodoLogin/TodoLogin'
import TodoSignUp from '../../Components/TodoSignUp/TodoSignUp'
import Todo from '../../Components/Todo/Todo'
import {  useState } from 'react'
import FooterRow from '../../Components/Footer/Footer'
import image from '../../Assets/bgimage.png'

const TodoList = () => {
  const [mode, setMode] = useState<string>("login")

  const getMode = (data: string) => {
    setMode(data)
  }

  return (

    <div className='todo'>
      <div className="bg-container">
        <img src={image} alt="" className="bg-image" />
      </div>
      {mode === 'login' && <TodoLogin getMode={getMode} />}
      {mode === 'signup' && <TodoSignUp getMode={getMode} />}
      {mode === 'todo' && <Todo getMode={getMode} />}
      {mode === 'todo' && <FooterRow />}
    </div>
  )
}

export default TodoList