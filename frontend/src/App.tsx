import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Login } from "./pages/Auth/Login";
import { Register } from "./pages/Auth/Register";
import { Home } from "./pages/Public/Home";
import { AdminDashboard } from "./pages/Admin/AdminDashboard";
import { TournamentDetails } from "./pages/Public/TournamentDetails";
import { AdminLayout } from "./components/layout/AdminLayout";
import { CreateTournament } from "./pages/Admin/CreateTournament";
import { TournamentsList } from "./pages/Admin/TournamentsList";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-950 text-slate-100">
          <Routes>
            {/* rotas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home />} />
            <Route path="/tournament/:id" element={<TournamentDetails />} />
            {/* rotas admin */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="tournaments/new" element={<CreateTournament />} />
              <Route path="tournaments" element={<TournamentsList />} />
            </Route>
            {/* redireciona pra home se der 404*/}
            <Route path="*" element={<Navigate to="/" />} />{" "}
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
