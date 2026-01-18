import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { Button } from "../../components/ui/button";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { toast } from "sonner";

export function CreateTournament() {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    tournamentName: "",
    format: "Standard",
    tournamentDate: "",
    entryFee: "",
    maxPlayers: "32",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormatChange = (value: string) => {
    setFormData((prev) => ({ ...prev, format: value }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        tournamentName: formData.tournamentName,
        format: formData.format,
        tournamentDate: new Date(formData.tournamentDate).toISOString(),
        entryFee: Number(formData.entryFee),
        maxPlayers: Number(formData.maxPlayers),
      };

      await api.post("/tournaments", payload);

      toast.success("Torneio criado com sucesso!", {
        description: "As inscrições já estão abertas.",
      });
      navigate("/admin");
    } catch (error: any) {
      console.log(error);
      const message = error.response?.data?.message;
      const finalMessage = Array.isArray(message)
        ? message[0]
        : message || "Verifique os dados e tente novamente.";

      toast.error("Erro ao criar torneio", {
        description: finalMessage,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* voltar para a tela dashboard */}
      <Button
        variant="ghost"
        onClick={() => navigate("/admin")}
        className="text-slate-400 pl-1"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar ao Dashboard
      </Button>

      {/* card de criação dos torneios */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Novo Torneio</CardTitle>

          <CardDescription className="text-slate-400">
            Preencha as informações abaixo para criar um novo torneio
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* nome */}
            <div className="space-y-2">
              <Label htmlFor="tournamentName" className="text-slate-200">
                Nome do Evento
              </Label>

              <Input
                id="tournamentName"
                name="tournamentName"
                placeholder="Ex: Torneio TCG 2026"
                value={formData.tournamentName}
                onChange={handleChange}
                required
                className="bg-slate-950 border-slate-700 text-white focus-visible:ring-purple-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* formato */}
              <div className="space-y-2">
                <Label className="text-slate-200">Formato</Label>

                <Select
                  onValueChange={handleFormatChange}
                  defaultValue={formData.format}
                >
                  <SelectTrigger className="bg-slate-950 border-slate-700 text-white">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>

                  <SelectContent className="bg-slate-900 border-slate-700 text-white">
                    <SelectItem value="Standard">Standard</SelectItem>
                    <SelectItem value="Swiss">Swiss</SelectItem>
                    <SelectItem value="Elimination">Elimination</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* data e hora */}
              <div className="space-y-2">
                <Label htmlFor="tournamentDate" className="text-slate-200">
                  Data e Hora
                </Label>

                <Input
                  id="tournamentDate"
                  name="tournamentDate"
                  type="datetime-local"
                  value={formData.tournamentDate}
                  onChange={handleChange}
                  required
                  className="bg-slate-950 border-slate-700 text-white [color-scheme:dark]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* valor da inscrição */}
              <div className="space-y-2">
                <Label htmlFor="entryFee" className="text-slate-200">
                  Valor da Inscrição (R$)
                </Label>

                <Input
                  id="entryFee"
                  name="entryFee"
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  value={formData.entryFee}
                  onChange={handleChange}
                  required
                  className="bg-slate-950 border-slate-700 text-white"
                />
              </div>
              {/* máximo de jogadores */}
              <div className="space-y-2">
                <Label htmlFor="maxPlayers" className="text-slate-200">
                  Máximo de Jogadores
                </Label>

                <Input
                  id="maxPlayers"
                  name="maxPlayers"
                  type="number"
                  min="2"
                  value={formData.maxPlayers}
                  onChange={handleChange}
                  required
                  className="bg-slate-950 border-slate-700 text-white"
                />
              </div>
            </div>

            {/* salvar torneio */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold h-11"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Criar Torneio
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
