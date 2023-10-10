import TodoList from "./Pages/TodoList/TodoList"
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { green, red } from '@mui/material/colors';
import { Toaster } from "react-hot-toast";

const theme = createTheme({
  palette: {
    primary: {
      main: red[500],
    },
    secondary: {
      main: green[500],
    },
  },
});

function App() {


  return (
    <>
      <ThemeProvider theme={theme}>
        <TodoList />
        <Toaster />
      </ThemeProvider>
    </>
  )
}

export default App
