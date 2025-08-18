import { RouterProvider } from 'react-router-dom'
import "./styles/font.css";
import { GlobalStyles } from './styles/GlobalStyles'
import { AuthProvider } from './contexts/AuthContext'
import router from './Router'

function App() {

  return (
    <>
    <GlobalStyles/>
    <AuthProvider>
      <RouterProvider router={router}/>
    </AuthProvider>
    </>
  )
}

export default App
