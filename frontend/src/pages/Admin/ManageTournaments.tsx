import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../services/api";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Plus,
  ShieldCheck,
  Swords,
  Trash2,
  Users,
} from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import { useSocket } from "../../hooks/useSocket";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

interface Registration {
  id: number;
  paymentStatus: string;
  user: { id: number; username: string; email: string };
  tournament: { id: number; tournamentName: string; tournamentStatus: string };
}

interface Match {
  id: number;
  player1Id: number;
  player2Id: number;
  winnerId: number | null;
  tournamentId: number;
  player1?: { username: string };
  player2?: { username: string };
}

export function ManageTournaments() {
  const { id } = useParams();
  const tournamentId = Number(id);

  const [activeTab, setActiveTab] = useState<"players" | "matches">("players");
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);

  const [tournamentName, setTournamentName] = useState("");
  const [tournamentStatus, setTournamentStatus] = useState("open");

  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [selectedP1, setSelectedP1] = useState<string>("");
  const [selectedP2, setSelectedP2] = useState<string>("");

  const { on } = useSocket();

  useEffect(() => {
    fetchData();
    on("match_status", (data: any) => {
      setMatches((prev) =>
        prev.map((m) =>
          m.id === data.matchId ? { ...m, winnerId: data.winnerId } : m
        )
      );
    });
  }, [tournamentId]);

  async function fetchData() {
    try {
      const regResponse = await api.get("/registrations");
      const filteredRegs = regResponse.data.filter(
        (r: any) => r.tournament.id === tournamentId
      );
      setRegistrations(filteredRegs);

      if (filteredRegs.length > 0) {
        setTournamentName(filteredRegs[0].tournament.tournamentName);
        setTournamentStatus(filteredRegs[0].tournament.tournamentStatus);

        if (filteredRegs[0].tournament.tournamentStatus === "started") {
          fetchMatches();
          setActiveTab("matches");
        }
      } else {
        const tResponse = await api.get(`/tournaments/${tournamentId}`);
        setTournamentName(tResponse.data.tournamentName);
        setTournamentStatus(tResponse.data.tournamentStatus);
      }
    } catch (error) {
      console.error("Erro ao buscar dados", error);
    }
  }

  async function fetchMatches() {
    try {
      const response = await api.get(`/matches`);
      const myMatches = response.data.filter(
        (m: any) => Number(m.tournamentId) === tournamentId
      );
      setMatches(myMatches);
    } catch (error) {
      console.error("Erro ao buscar partidas");
    }
  }

  async function handleCreateMatch() {
    if (!selectedP1 || !selectedP2) {
      toast.warning("Selecione dois jogadores diferentes");
      return;
    }
    if (selectedP1 === selectedP2) {
      toast.error("O jogador não pode jogar contra si mesmo");
      return;
    }

    try {
      const payload = {
        tournamentId: tournamentId,
        player1Id: Number(selectedP1),
        player2Id: Number(selectedP2),
        round: 1,
        tableId: 1,
      };

      await api.post("/matches", payload);

      toast.success("Partida criada!");
      setIsMatchModalOpen(false);
      setSelectedP1("");
      setSelectedP2("");
      fetchMatches();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar partida");
    }
  }

  async function handleStartTournament() {
    if (!confirm("Iniciar o torneio?")) return;
    try {
      await api.patch(`/tournaments/${tournamentId}`, {
        tournamentStatus: "started",
      });
      setTournamentStatus("started");
      toast.success("Torneio iniciado!");
      await fetchMatches();
      setActiveTab("matches");
    } catch {
      toast.error("Erro ao iniciar");
    }
  }

  async function handleSetWinner(matchId: number, winnerId: number) {
    try {
      await api.patch(`/matches/${matchId}`, { winnerId });
      setMatches((prev) =>
        prev.map((m) => (m.id === matchId ? { ...m, winnerId } : m))
      );
      toast.success("Vencedor definido!");
    } catch {
      toast.error("Erro ao salvar resultado");
    }
  }

  async function handleRemove(regId: number) {
    if (!confirm("Remover?")) return;
    try {
      await api.delete(`/registrations/${regId}`);
      setRegistrations((p) => p.filter((r) => r.id !== regId));
      toast.success("Removido");
    } catch {
      toast.error("Erro");
    }
  }
  async function handleApprove(regId: number) {
    try {
      await api.patch(`/registrations/${regId}`, { paymentStatus: "paid" });
      setRegistrations((p) =>
        p.map((r) => (r.id === regId ? { ...r, paymentStatus: "paid" } : r))
      );
      toast.success("Pago");
    } catch {
      toast.error("Erro");
    }
  }

  const getStatusBadge = (status: string) => {
    if (status?.toLowerCase().includes("approved") || status === "paid")
      return (
        <span className="text-green-500 flex items-center gap-1">
          <CheckCircle className="w-3 h-3" /> Pago
        </span>
      );
    return (
      <span className="text-yellow-500 flex items-center gap-1">
        <Clock className="w-3 h-3" /> Pendente
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <Link
          to="/admin/tournaments"
          className="text-slate-400 hover:text-white flex items-center gap-2 text-sm w-fit"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>

        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              {tournamentName}
            </h1>
            <span
              className={`text-xs border px-2 py-1 rounded uppercase mt-2 inline-block ${
                tournamentStatus === "started"
                  ? "text-blue-500 border-blue-500/30"
                  : "text-green-500 border-green-500/30"
              }`}
            >
              {tournamentStatus === "started"
                ? "Em Andamento"
                : "Inscrições Abertas"}
            </span>
          </div>
          {tournamentStatus === "open" && (
            <Button
              onClick={handleStartTournament}
              className="bg-green-600 hover:bg-green-700 font-bold"
            >
              <Swords className="mr-2 h-4 w-4" /> Iniciar Torneio
            </Button>
          )}
        </div>
      </div>

      <div className="flex gap-2 border-b border-slate-800 pb-1">
        <Button
          variant="ghost"
          onClick={() => setActiveTab("players")}
          className={`rounded-b-none border-b-2 ${
            activeTab === "players"
              ? "border-purple-500 text-purple-400"
              : "border-transparent text-slate-400"
          }`}
        >
          <Users className="w-4 h-4 mr-2" /> Inscritos ({registrations.length})
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            setActiveTab("matches");
            fetchMatches();
          }}
          className={`rounded-b-none border-b-2 ${
            activeTab === "matches"
              ? "border-purple-500 text-purple-400"
              : "border-transparent text-slate-400"
          }`}
        >
          <Swords className="w-4 h-4 mr-2" /> Partidas
        </Button>
      </div>

      {activeTab === "players" && (
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-0">
            <table className="w-full text-sm text-left text-slate-400">
              <thead className="bg-slate-950 text-slate-200 uppercase font-bold text-xs">
                <tr>
                  <th className="p-4">Jogador</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {registrations.map((reg) => (
                  <tr key={reg.id}>
                    <td className="p-4 text-white font-medium">
                      {reg.user?.username || "Jogador"}
                    </td>
                    <td className="p-4">{getStatusBadge(reg.paymentStatus)}</td>
                    <td className="p-4 text-right flex justify-end gap-2">
                      {!reg.paymentStatus.includes("paid") && (
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 text-green-500"
                          onClick={() => handleApprove(reg.id)}
                        >
                          <ShieldCheck className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-red-500"
                        onClick={() => handleRemove(reg.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {activeTab === "matches" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button
              onClick={() => setIsMatchModalOpen(true)}
              variant="outline"
              className="border-purple-700 bg-purple-600 hover:bg-purple-700 hover:text-white text-slate-300"
            >
              <Plus className="w-4 h-4 mr-2" /> Criar Partida
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {matches.length === 0 ? (
              <div className="text-center py-10 text-slate-500 border border-slate-800 rounded bg-slate-900">
                <Swords className="mx-auto w-10 h-10 mb-2 opacity-20" />
                <p>Nenhuma partida criada.</p>
              </div>
            ) : (
              matches.map((match) => (
                <Card key={match.id} className="bg-slate-900 border-slate-800">
                  <CardContent className="p-4 flex justify-between items-center">
                    <div
                      className={`flex-1 p-3 rounded border text-center ${
                        match.winnerId === match.player1Id
                          ? "border-green-500 bg-green-500/10 text-green-400"
                          : "border-slate-800"
                      }`}
                    >
                      <div className="font-bold text-lg">
                        {match.player1?.username || `ID ${match.player1Id}`}
                      </div>
                      {!match.winnerId && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="mt-2 text-xs h-7"
                          onClick={() =>
                            handleSetWinner(match.id, match.player1Id)
                          }
                        >
                          Vencedor
                        </Button>
                      )}
                    </div>
                    <div className="px-4 font-bold text-slate-600">VS</div>
                    <div
                      className={`flex-1 p-3 rounded border text-center ${
                        match.winnerId === match.player2Id
                          ? "border-green-500 bg-green-500/10 text-green-400"
                          : "border-slate-800"
                      }`}
                    >
                      <div className="font-bold text-lg">
                        {match.player2?.username || `ID ${match.player2Id}`}
                      </div>
                      {!match.winnerId && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="mt-2 text-xs h-7"
                          onClick={() =>
                            handleSetWinner(match.id, match.player2Id)
                          }
                        >
                          Vencedor
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {/* MODAL DE CRIAR PARTIDA */}
      <Dialog open={isMatchModalOpen} onOpenChange={setIsMatchModalOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white">
          <DialogHeader>
            <DialogTitle>Nova Partida</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Jogador 1</Label>
              <Select onValueChange={setSelectedP1} value={selectedP1}>
                <SelectTrigger className="bg-slate-950 border-slate-700 text-white">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 text-white">
                  {registrations.map((r) => (
                    <SelectItem key={r.user.id} value={String(r.user.id)}>
                      {r.user.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Jogador 2</Label>
              <Select onValueChange={setSelectedP2} value={selectedP2}>
                <SelectTrigger className="bg-slate-950 border-slate-700 text-white">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 text-white">
                  {registrations.map((r) => (
                    <SelectItem key={r.user.id} value={String(r.user.id)}>
                      {r.user.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsMatchModalOpen(false)} variant="ghost">
              Cancelar
            </Button>
            <Button
              onClick={handleCreateMatch}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
