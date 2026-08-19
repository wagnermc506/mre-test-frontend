import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { Layout } from './components/Layout/Layout';
import { CepSearchForm } from './components/CepSearchForm/CepSearchForm';
import { NoticiaPage } from './components/Noticias/NoticiaPage';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/cep" replace />} />
        <Route path="cep" element={<CepSearchForm />} />
        <Route path="noticias" element={<NoticiaPage />} />
        <Route path="*" element={<Navigate to="/cep" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
