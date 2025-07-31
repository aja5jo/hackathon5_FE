import { RouterProvider } from 'react-router-dom'
import './App.css'
import "./styles/font.css";
import { GlobalStyles } from './styles/GlobalStyles'
import router from './Router'

function App() {

  return (
    <>
    <GlobalStyles/>
    <RouterProvider router={router}/>
    </>
  )
}

export default App
