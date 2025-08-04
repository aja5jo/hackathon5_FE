import { RouterProvider } from 'react-router-dom'
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
