import axios from 'axios'
import { Toaster } from 'react-hot-toast'

axios.defaults.baseURL = 'http://localhost:5000/api/'

const token = JSON.parse(localStorage.getItem('user'))?.token
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

function App() {
  return (
    <>
      <Toaster />
    </>
  )
}

export default App
