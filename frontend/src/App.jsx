import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/public/Login'
import Register from './pages/public/Register'
import Home from './pages/public/Home'
import Films from './pages/public/Films'
import Dashboard from './pages/admin/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/films" element={<Films />} />
        <Route path="/admin" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App