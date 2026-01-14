import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { ArrowLeft, Save, Loader2, AlertCircle } from "lucide-react";

export function EditTournament() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    tournamentName: "",
    format: "",
    tournamentDate: "",
    entryFee: "",
    maxPlayers: "",
    tournamentStatus: "open"
  });

  useEffect(() => {
    async function fetchTournament() {
      try {
        const response = await api.get(`/tournaments/${id}`);
        const t = response.data;
   
        const dateObj = new Date(t.tournamentDate);
        const dateString = dateObj.toISOString().slice(0, 16); 

        setFormData({
          tournamentName: t.tournamentName,
          format: t.format,
          tournamentDate: dateString,
          entryFee: t.entryFee,
          maxPlayers: t.maxPlayers,
          tournamentStatus: t.tournamentStatus
        });
      } catch (err) {
        console.error("Erro ao buscar torneio", err);
        setError("Erro ao carregar dados do torneio.");
      } finally {
        setFetching(false);
      }
    }
    fetchTournament();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        tournamentName: formData.tournamentName,
        format: formData.format,
        tournamentDate: new Date(formData.tournamentDate).toISOString(),
        entryFee: Number(formData.entryFee),
        maxPlayers: Number(formData.maxPlayers),
        tournamentStatus: formData.tournamentStatus
      };

      await api.patch(`/tournaments/${id}`, payload);

      alert("Torneio atualizado com sucesso!");
      navigate("/admin/tournaments");

    } catch (err: any) {
      console.error(err);
      setError("Erro ao atualizar torneio.");
    } finally {
      setLoading(false);
    }
  }

  if (fetching) return <div className="text-white p-8">Carregando dados...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => navigate("/admin/tournaments")} className="text-slate-400 hover:text-white pl-0">
        <ArrowLeft className="mr-2 h-4 w-4" /> Cancelar e Voltar
      </Button>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Editar Torneio #{id}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-2">
              <Label className="text-slate-200">Nome</Label>
              <Input name="tournamentName" value={formData.tournamentName} onChange={handleChange} className="bg-slate-950 border-slate-700 text-white" required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-slate-200">Formato</Label>
                <Select onValueChange={(v) => handleSelectChange('format', v)} value={formData.format}>
                  <SelectTrigger className="bg-slate-950 border-slate-700 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700 text-white">
                    <SelectItem value="Standard">Standard</SelectItem>
                    <SelectItem value="Modern">Modern</SelectItem>
                    <SelectItem value="Commander">Commander</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-200">Data</Label>
                <Input type="datetime-local" name="tournamentDate" value={formData.tournamentDate} onChange={handleChange} className="bg-slate-950 border-slate-700 text-white [color-scheme:dark]" required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-slate-200">Preço (R$)</Label>
                <Input type="number" name="entryFee" value={formData.entryFee} onChange={handleChange} className="bg-slate-950 border-slate-700 text-white" required />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-200">Status</Label>
                <Select onValueChange={(v) => handleSelectChange('tournamentStatus', v)} value={formData.tournamentStatus}>
                  <SelectTrigger className="bg-slate-950 border-slate-700 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700 text-white">
                    <SelectItem value="open">Aberto (Open)</SelectItem>
                    <SelectItem value="finished">Finalizado</SelectItem>
                    <SelectItem value="canceled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {error && <div className="text-red-400 text-sm flex gap-2"><AlertCircle className="w-4 h-4"/> {error}</div>}

            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={loading}>
              {loading ? <Loader2 className="animate-spin mr-2" /> : <><Save className="mr-2 h-4 w-4" /> Salvar Alterações</>}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}