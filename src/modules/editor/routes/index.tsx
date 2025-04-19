
import { Navigate, Route, Routes } from 'react-router-dom'
import GraficadoraPrincipal from '../components/GraficadoraPrincipal'

const EditorRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<GraficadoraPrincipal/>}/>
        <Route path="*" element={<Navigate to="/editor" replace />}/>
    </Routes>
  )
}

export default EditorRoutes