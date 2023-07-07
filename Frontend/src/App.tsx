import './App.css'
import Navbar from './components/Navbar/Navbar'
import Share from './components/Share/Share'
import { ThemeProvider } from '@material-tailwind/react'
function App() {
  
  return (
    <ThemeProvider>
      <Navbar />
      <Share />
    </ThemeProvider>
  )
}

export default App
