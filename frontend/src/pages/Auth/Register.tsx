import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Loader2, UserPlus } from "lucide-react";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { useAuth } from "../../contexts/AuthContext";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";

export function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //admin
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminKey, setAdminKey] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const SECRET_ADMIN_KEY = "admin2026";

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (isAdmin && adminKey !== SECRET_ADMIN_KEY) {
      setError("Chave de acesso da loja incorreta!");
      setLoading(false);
      return;
    }

    try {
      const role = isAdmin ? "admin" : "player";

      await api.post("/users", { username, email, password, role });

      const loginResponse = await api.post("/auth/login", { email, password });
      const { access_token } = loginResponse.data;

      login(access_token);

      const decoded: any = jwtDecode(access_token);

      if (decoded.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }

      toast.success("Conta criada com sucesso", {
        description: "Seja bem vindo à plataforma!",
      });
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || "Erro ao criar conta";

      toast.error("Erro no cadastro", {
        description: Array.isArray(msg) ? msg[0] : msg,
      });

      setError(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950 px-4">
      <Card className="w-full max-w-md bg-slate-900 border-slate-800 text-slate-100">
        <CardHeader className="flex justify-center mb-4">
          <div>
            <UserPlus className="w-12 h-12 text-purple-500"></UserPlus>
          </div>

          <CardTitle className="text-2xl font-bold text-center">
            Crie sua conta
          </CardTitle>

          <CardDescription className="text-center text-slate-400">
            Descubra e inscreva-se em torneios de TCG
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">Nome</Label>
              <Input
                id="username"
                type="text"
                placeholder="Qual seu nome?"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-slate-950 border-slate-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Informe seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-slate-950 border-slate-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-slate-950 border-slate-700"
              />
            </div>

            {/* campo para criar admin */}
            <div className="flex items-center space-x py-2">
              <Checkbox
                id="admin-mode"
                checked={isAdmin}
                onCheckedChange={(checked) => setIsAdmin(checked as boolean)}
                className="border-slate-600 data-[state=checked]:bg-red-600 data-[state=]:border-red-600 mr-1"
              />
              <Label
                htmlFor="admin-mode"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-400"
              >
                Sou funcionário da loja
              </Label>
            </div>

            {isAdmin && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                <Label htmlFor="adminKey" className="text-red-400">
                  Chave de acesso da loja
                </Label>

                <Input
                  id="adminKey"
                  type="password"
                  placeholder="Digite o código da loja"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  className="bg-red-950/20 border-red-900/50 text-red-200 placeholder:text-red-500/50 focus-visible:ring-red-900"
                />
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Criar conta"
              )}
            </Button>
            <div className="text-sm text-center text-slate-400">
              Já possui uma conta?{" "}
              <Link
                to="/"
                className="text-purple-400 hover:text-purple-300 hover:underline"
              >
                Fazer Login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
