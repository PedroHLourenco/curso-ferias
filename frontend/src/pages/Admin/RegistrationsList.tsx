import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { CheckCircle, Clock, AlertTriangle, User, Search } from "lucide-react";
import { Input } from "../../components/ui/input";

interface Registration {
  id: number;
  paymentStatus: string;
  createdAt: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
  tournament: {
    id: number;
    tournamentName: string;
  };
}

export function RegistrationsList() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get("/registrations");
        setRegistrations(response.data);
      } catch (error) {
        console.error("Erro ao buscar inscrições", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredRegistrations = registrations.filter(
    (reg) =>
      reg.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("approved") || s === "paid") {
      return (
        <span className="text-green-500 flex items-center gap-1">
          <CheckCircle className="w-3 h-3" /> Pago
        </span>
      );
    }
    if (s.includes("pending")) {
      return (
        <span className="text-yellow-500 flex items-center gap-1">
          <Clock className="w-3 h-3" /> Pendente
        </span>
      );
    }
    return (
      <span className="text-red-500 flex items-center gap-1">
        <AlertTriangle className="w-3 h-3" /> {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Todas as Inscrições</h1>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Buscar jogador..."
            className="pl-8 bg-slate-900 border-slate-800 text-slate-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">
            Histórico Geral ({filteredRegistrations.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto w-full">
              <table className="w-full min-w-[1000px] text-sm text-left text-slate-400">
                <thead className="bg-slate-950 text-slate-200 uppercase font-bold text-xs">
                  <tr>
                    <th className="p-4">ID</th>
                    <th className="p-4">Jogador</th>
                    <th className="p-4">Torneio</th>
                    <th className="p-4">Data</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-900">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center">
                        Carregando...
                      </td>
                    </tr>
                  ) : filteredRegistrations.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="p-8 text-center text-slate-500"
                      >
                        Nenhuma inscrição encontrada.
                      </td>
                    </tr>
                  ) : (
                    filteredRegistrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-slate-800/50">
                        <td className="p-4 font-mono text-xs">#{reg.id}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-purple-500" />
                            <div>
                              <div className="text-white font-medium">
                                {reg.user.username}
                              </div>
                              <div className="text-xs text-slate-500">
                                {reg.user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-white">
                          {reg.tournament.tournamentName}
                        </td>
                        <td className="p-4">
                          {new Date(reg.createdAt).toLocaleDateString("pt-BR")}
                        </td>
                        <td className="p-4">
                          {getStatusBadge(reg.paymentStatus)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
