import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Trophy, Users, DollarSign, Plus, Loader2 } from "lucide-react";

export function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeTournaments: 0,
    totalRegistrations: 0,
    monthlyRevenue: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const [tournamentsRes, registrationsRes] = await Promise.all([
          api.get("/tournaments"),
          api.get("/registrations"),
        ]);

        const tournaments = tournamentsRes.data;
        const registrations = registrationsRes.data;

        const activeCount = tournaments.filter((t: any) => 
          t.tournamentStatus === 'open' || new Date(t.tournamentDate) > new Date()
        ).length;

        const totalRegs = registrations.length;

        const tournamentPrices = new Map();
        tournaments.forEach((t: any) => tournamentPrices.set(t.id, Number(t.entryFee)));

        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const revenue = registrations.reduce((acc: number, reg: any) => {
          const regDate = new Date(reg.createdAt);
          const isThisMonth = regDate.getMonth() === currentMonth && regDate.getFullYear() === currentYear;
          
          const isPaid = reg.paymentStatus?.toLowerCase().includes('paid') || reg.paymentStatus === 'paid';

          if (isThisMonth && isPaid) {
            const price = tournamentPrices.get(reg.tournament.id) || 0;
            return acc + price;
          }
          return acc;
        }, 0);

        setStats({
          activeTournaments: activeCount,
          totalRegistrations: totalRegs,
          monthlyRevenue: revenue,
        });

      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const formatMoney = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Painel de Controle</h1>
          <p className="text-slate-400">Visão geral da sua loja</p>
        </div>
        
        <Link to="/admin/tournaments/new">
          <Button className="bg-purple-600 hover:bg-purple-700 h-12 px-6">
            <Plus className="w-5 h-5 mr-2" /> Novo Torneio
          </Button>
        </Link>
      </div>

      {/* Cards de Estatísticas Reais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Torneios */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Torneios Ativos
            </CardTitle>
            <Trophy className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : stats.activeTournaments}
            </div>
            <p className="text-xs text-slate-500">Agendados ou Abertos</p>
          </CardContent>
        </Card>

        {/* Inscrições */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Total de Inscritos
            </CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : stats.totalRegistrations}
            </div>
            <p className="text-xs text-slate-500">Em todos os eventos</p>
          </CardContent>
        </Card>

        {/* Faturamento */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Faturamento (Mês)
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : formatMoney(stats.monthlyRevenue)}
            </div>
            <p className="text-xs text-slate-500">Vendas confirmadas este mês</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Área de Bem-vindo */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-10 text-center border-dashed">
        <h3 className="text-xl font-medium text-slate-300 mb-2">Bem-vindo ao Gerenciador TCG</h3>
        <p className="text-slate-500 max-w-lg mx-auto mb-6">
          Use o menu lateral para gerenciar seus torneios e ver as inscrições. 
          Comece criando seu primeiro torneio oficial pela plataforma.
        </p>
        <Link to="/admin/tournaments/new">
          <Button variant="outline" className="border-slate-700 bg-transparent text-slate-300 hover:text-white hover:bg-slate-800">
            Criar Torneio Agora
          </Button>
        </Link>
      </div>
    </div>
  );
}