import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { Button } from "../../components/ui/button";
import { ArrowLeft, Calendar, Circle, ShieldCheck, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { PaymentModal } from "../../components/layout/PaymentModal";
import { toast } from "sonner";

interface Tournament {
  id: number;
  tournamentName: string;
  format: string;
  tournamentDate: string;
  entryFee: number;
  maxPlayers: number;
  tournamentStatus: string;
}

export function TournamentDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);

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

  useEffect(() => {
    async function fetchDetails() {
      try {
        const response = await api.get(`/tournaments/${id}`);
        setTournament(response.data);
      } catch (error) {
        console.error("Erro ao buscar detalhes:", error);

        toast.error("Erro ao carregar detalhes do torneio");
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [id]);

  function handleSubscribe() {
    if (!user) {
      toast.info("Faça login para continuar", {
        description: "Você precisa de uma conta para se inscrever em torneios.",
        duration: 4000,
      });

      navigate("/login"); // se não estiver logado, manda de volta pro login
      return;
    }

    setIsModalOpen(true);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100">
        <h2 className="text-2xl font-bold mb-4">Torneio não encontrado</h2>

        <Link to="/">
          <Button variant="outline">Voltar para a Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center text-slate-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para lista de torneios
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* coluna de informações */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 w-fit">
                  <Circle
                    className={`w-3 h-3 ${getStatusColor(
                      tournament.tournamentStatus
                    )}`}
                    fill="currentColor"
                  />

                  <span
                    className={`text-xs font-bold uppercase tracking-wider ${getStatusColor(
                      tournament.tournamentStatus
                    )}`}
                  >
                    {tournament.tournamentStatus}
                  </span>
                </div>

                <span className="text-sm font-medium text-slate-400 uppercase tracking-wider border border-slate-800 px-3 py-1 rounded-full bg-slate-900">
                  {tournament.format || "Standard"}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                {tournament.tournamentName}
              </h1>

              <div className="flex flex-wrap gap-6 text-slate-300 mt-6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-500" />

                  <span className="capitalize">
                    {formatDate(tournament.tournamentDate)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-6 space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-500" />
                Regras e Informações
              </h3>

              <p className="text-slate-400 leading-relaxed">
                Este é um evento oficial da loja. Os jogadores devem trazer os
                próprios decks de acordo com o formato{" "}
                <strong>{tournament.format}</strong>. Chegue com 30 minutos de
                antecedência para confirmar sua presença.
              </p>

              <ul className="list-disc list-inside text-slate-400 space-y-1 ml-2">
                <li>{tournament.format}</li>
                <li>Rodadas de 50 minutos</li>
                <li>Decklist Obrigatória</li>
              </ul>
            </div>
          </div>

          {/* coluna de inscrição */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-900 border-slate-800 sticky top-6 shadow-2-xl shadow-black/50">
              <CardHeader>
                <CardTitle className="text-slate-200">
                  Resumo da Inscrição
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-slate-800">
                  <span className="text-slate-400">Valor da Inscrição:</span>
                  <span className="text-2xl font-bold text-green-400">
                    {formatMoney(tournament.entryFee)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-slate-800">
                  <span className="text-slate-400">Vagas Totais</span>
                  <span className="text-white flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {tournament.maxPlayers}
                  </span>
                </div>

                <div className="bg-purple-500/10 p-3 rounded-lg border border-purple-500/20 text-sm text-purple-200 text-center">
                  Garanta sua vaga agora mesmo! O pagamento é via PIX
                  instantâneo
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  onClick={handleSubscribe}
                  className={`w-full py-6 text-lg font-bold transition-all ${
                    user
                      ? "bg-purple-600 hover:bg-purple-700 hover:scale-[1.02]"
                      : "bg-slate-700 hover:bg-slate-600"
                  }`}
                >
                  {user ? "Inscrever-se Agora" : "Faça Login para se inscrever"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      {/* renderização da modal da inscrição */}
      {tournament && (
        <PaymentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          tournamentId={tournament.id}
          tournamentName={tournament.tournamentName}
          price={tournament.entryFee}
        />
      )}
    </div>
  );
}
