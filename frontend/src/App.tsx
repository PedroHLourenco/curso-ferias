import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Login } from "./pages/Auth/Login";
import { Register } from "./pages/Auth/Register";
import { Home } from "./pages/Public/Home";
import { Dashboard } from "./pages/Admin/Dashboard";
import { TournamentDetails } from "./pages/Public/TournamentDetails";

//rota para users logados
const privateRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="text-white">Carregando...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

const AdmRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="text-white">Carregando...</div>;
  }

  return user?.role === "admin" ? <Outlet /> : <Navigate to="/" />;
};

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
            <Route path="/tournament/:id" element={<TournamentDetails />}/>
            {/* rotas admin */}
            <Route element={<AdmRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
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
