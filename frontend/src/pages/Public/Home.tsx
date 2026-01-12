import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  ArrowRight,
  Calendar,
  Circle,
  DollarSign,
  Trophy,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";

interface Tournament {
  id: number;
  tournamentName: string;
  format: string;
  tournamentDate: string;
  entryFee: number;
  maxPlayers: number;
  tournamentStatus: string;
}

export function Home() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchTournaments() {
    try {
      const response = await api.get("/tournaments");

      setTournaments(response.data);
    } catch (error) {
      console.error("Erro ao buscar torneios:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
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

  const formatMoney = (value: number | string) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(value));
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
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Trophy className="text-purple-500" />
          Próximos torneios
        </h1>

        <p className="text-slate-400 mt-1">
          Inscreva-se e mostre suas habilidades em jogos TCG
        </p>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      )}

      {!loading && tournaments.length === 0 && (
        <div className="text-center py-20 bg-slate-900/50 rounded-xl border border-slate-800">
          <Trophy className="mx-auto h-16 w-16 text-slate-600 mb-4" />
          <h3 className="text-xl font-medium text-slate-300">
            Nenhum torneio encontrado
          </h3>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg-grid-cols-3 gap-6 max-w-6xl mx-auto">
        {tournaments.map((t) => (
          <Card
            key={t.id}
            className="bg-slate-900 border-slate-800 hover:border-purple-500/50 transition-all duration-300"
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <Circle
                  className={`w-6 h-6 ${getStatusColor(t.tournamentStatus)}`}
                  fill="currentColor"
                />

                <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                  {t.format || "Standard"}
                </span>
              </div>

              <CardTitle className="text-xl text-white mt-2">
                {t.tournamentName}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 text-slate-300">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-purple-400" />
                <span>{formatDate(t.tournamentDate)}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4 text-green-400" />
                <span>{formatMoney(t.entryFee)}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-blue-400" />
                <span>Vagas: {t.maxPlayers} jogadores</span>
              </div>
            </CardContent>

            <CardFooter>
              <Link to={`tournament/${t.id}`} className="w-full">
                <Button className="w-full bg-slate-800 hover:bg-purple-600 text-white transition-colors group">
                  Ver detalhes
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
