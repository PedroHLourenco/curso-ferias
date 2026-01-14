import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../services/api";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  Clock,
  FileText,
  ShieldCheck,
  Trash2,
  User,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";

interface Registration {
  id: number;
  paymentStatus: string;
  decklist: string | null;
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

export function ManageTournaments() {
  const { id } = useParams();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [tournamentName, setTournamentName] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get("/registrations");

        const allRegistrations: Registration[] = response.data;
        const filtered = allRegistrations.filter(
          (r) => r.tournament.id === Number(id)
        );

        setRegistrations(filtered);

        if (filtered.length > 0) {
          setTournamentName(filtered[0].tournament.tournamentName);
        } else {
          const tResponse = await api.get(`/tournaments/${id}`);
          setTournamentName(tResponse.data.tournamentName);
        }
      } catch (error) {
        console.error("Erro ao buscar dados");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  async function handleRemove(regId: number) {
    if (!confirm("Remover esta inscrição?")) return;
    try {
      await api.delete(`/registrations/${regId}`);
      setRegistrations((prev) => prev.filter((r) => r.id !== regId));
    } catch (e) {
      alert("Erro ao remover");
    }
  }

  async function handleApprove(regId: number) {
    if (!confirm("Confirmar pagamento manualmente?")) return;
    try {
      await api.patch(`/registrations/${regId}`, { paymentStatus: "paid" });

      setRegistrations((prev) =>
        prev.map((r) => (r.id === regId ? { ...r, paymentStatus: "paid" } : r))
      );
      alert("Pagamento confirmado!");
    } catch (e) {
      console.error(e);
      alert("Erro ao atualizar status. Verifique se a rota PATCH existe.");
    }
  }

  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase() || "";

    if (s.includes("approved") || s === "paid") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
          <CheckCircle className="h-3 w-3" /> Pago
        </span>
      );
    }

    if (s.includes("pending") || s === "payment pending") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
          <Clock className="w-3 h-3 mr-1" /> Pendente
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20">
        <AlertTriangle className="w-3 h-3 mr-1" /> {status}
      </span>
    );
  };

  async function handleRemoveRegistration(regId: number) {
    const confirmDelete = window.confirm(
      "Tem certeza que deseja remover essa inscrição? Uma vaga será liberada"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(`/registrations/${regId}`);

      setRegistrations((prev) => prev.filter((reg) => reg.id !== regId));
      alert("Inscrição removida com sucesso");
    } catch (error) {
      console.error("Erro ao remover:", error);
      alert("Erro ao remover inscrição");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <Link
          to="/admin/tournaments"
          className="text-slate-400 hover:text-white flex items-center gap-2 text-sm w-fit"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar para lista
        </Link>

        <h1 className="text-3xl font-bold text-white">
          Gestão:{" "}
          <span className="text-purple-400">
            {tournamentName || "Carregando..."}
          </span>
        </h1>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">
              Jogadores Inscritos ({registrations.length})
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="rounded-md border border-slate-800 overflow-hidden">
              <table className="w-full text-sm text-left text-slate-400">
                <thead className="bg-slate-950 text-slate-200 uppercase font-bold text-xs">
                  <tr>
                    <th className="p-4">Jogador</th>
                    <th className="p-4">Data Inscrição</th>
                    <th className="p-4">Decklist</th>
                    <th className="p-4">Status Pagamento</th>
                    <th className="p-4 text-right"> Ações</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800 bg-slate-900">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center">
                        Carregando...
                      </td>
                    </tr>
                  ) : registrations.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="p-8 text-center text-slate-500"
                      >
                        Nenhum jogador inscrito
                      </td>
                    </tr>
                  ) : (
                    registrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-slate-800/50">
                        {/* jogador */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-purple-500">
                              <User className="h-4 w-4" />
                            </div>

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

                        {/* Data */}
                        <td className="p-4">
                          {new Date(reg.createdAt).toLocaleDateString("pt-BR")}
                        </td>

                        {/* Decklist */}
                        <td className="p-4">
                          {reg.decklist ? (
                            <a
                              href={
                                reg.decklist.startsWith("http")
                                  ? reg.decklist
                                  : "#"
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 text-blue-400 hover:text-blue-300 hover:underline"
                              onClick={(e) => {
                                if (!reg.decklist?.startsWith("http")) {
                                  e.preventDefault();
                                  alert(`Decklist (Texto):\n\n${reg.decklist}`);
                                }
                              }}
                            >
                              <FileText className="w-3 h-3" /> Ver deck
                            </a>
                          ) : (
                            <span className="text-slate-600 italic text-xs">
                              Não enviada
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="p-4">
                          {getStatusBadge(reg.paymentStatus)}
                        </td>

                        {/* Ações */}
                        <td className="p-4 text-right flex justify-end gap-2">
                          {!reg.paymentStatus.includes("approved") && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-green-800 text-green-500 hover:bg-green-900/30"
                              onClick={() => handleApprove(reg.id)}
                              title="Confirmar Pagamento Manualmente"
                            >
                              <ShieldCheck className="w-4 h-4" />
                            </Button>
                          )}

                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-400 hover:bg-red-900/20"
                            onClick={() => handleRemove(reg.id)}
                            title="Remover Inscrição"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
