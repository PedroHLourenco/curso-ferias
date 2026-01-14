import { useEffect, useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Calendar, Eye, Plus, Users } from "lucide-react";

interface Tournament {
  id: number;
  tournamentName: string;
  format: string;
  tournamentDate: string;
  entryFee: number;
  maxPlayers: number;
  tournamentStatus: string;
}

export function TournamentsList() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTournaments() {
      try {
        const response = await api.get("/tournaments");
        setTournaments(response.data);
      } catch (error) {
        console.error("Erro ao buscar torneios", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTournaments();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) {
      return "Data não definida";
    }

    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    const normalizedStatus = status?.toLowerCase();

    switch (normalizedStatus) {
      case "open":
        return "text-green-500";
      case "started":
        return "text-blue-500";
      case "finished":
        return "text-slate-500";
      case "canceled":
        return "text-red-500";
      default:
        return "text-yellow-500";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Gerenciar Torneios</h1>

        <Link to="/admin/tournaments/new">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="h-4 w-4" /> Novo Torneio
          </Button>
        </Link>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <table className="w-full text-left text-sm text-slate-400">
          <thead className="bg-slate-950 text-slate-200 uppercase font-bold text-xs">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Evento</th>
              <th className="p-4">Data</th>
              <th className="p-4">Capacidade</th>
              <th className="p-4">Status</th>
              <th className="p-4">Ações</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800">
            {loading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center">
                  Carregando...
                </td>
              </tr>
            ) : tournaments.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  Nenhum torneio encontrado
                </td>
              </tr>
            ) : (
              tournaments.map((t) => (
                <tr
                  key={t.id}
                  className="hover:bg-slate-800/50 transition-colors"
                >
                  <td className="p-4 font-mono text-slate-500">#{t.id}</td>

                  {/* evento */}
                  <td className="p-4">
                    <div className="font-medium text-white">
                      {t.tournamentName}
                    </div>
                    <div className="text-xs text-slate-500">{t.format}</div>
                  </td>

                  {/* formato */}
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-500" />
                      {formatDate(t.tournamentDate)}
                    </div>
                  </td>

                  {/* vagas */}
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Users className="w-4 h-4" />
                      {t.maxPlayers} Vagas
                    </div>
                  </td>

                  {/* status */}
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold border ${getStatusColor(
                        t.tournamentStatus
                      )} uppercase`}
                    >
                      {t.tournamentStatus}
                    </span>
                  </td>

                  {/* ações */}
                  <td className="p-4 text-right">
                    <Link to={`/admin/tournaments/${t.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-slate-700 bg-purple-500 hover:bg-purple-700 text-slate-300 hover:text-white"
                      >
                        <Eye className="w-4 h-4" /> Gerenciar
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
