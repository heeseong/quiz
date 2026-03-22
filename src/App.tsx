import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NicknamePage from './pages/NicknamePage';
import CategorySelectPage from './pages/CategorySelectPage';
import QuizPage from './pages/QuizPage';
import CategoryResultPage from './pages/CategoryResultPage';
import FinalResultPage from './pages/FinalResultPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/nickname" element={<NicknamePage />} />
            <Route path="/category" element={<CategorySelectPage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/result/category" element={<CategoryResultPage />} />
            <Route path="/result/final" element={<FinalResultPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
