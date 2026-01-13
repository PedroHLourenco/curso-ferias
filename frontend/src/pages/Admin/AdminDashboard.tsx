import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { DollarSign, Plus, Trophy, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

export function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Painel de controle</h1>

          <p className="text-slate-400">Visão geral da sua loja</p>
        </div>

        {/* criar novo torneio */}
        <Link to="/admin/tournaments/new">
          <Button className="bg-purple-600 hover:bg-purple-700 h-12 px-6">
            <Plus className="w-5 h-5" /> Novo Torneio
          </Button>
        </Link>
      </div>

      {/* cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Torneios Ativos
            </CardTitle>

            <Trophy className="h-4 w-4 text-purple-500" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold text-white">--</div>
            <p className="text-xs text-slate-500">Agendados para este mês</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Total de Inscritos
            </CardTitle>

            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold text-white">--</div>
            <p className="text-xs text-slate-500">Em todos os eventos</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Faturamento mensal
            </CardTitle>

            <DollarSign className="h-4 w-4 text-purple-500" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold text-white">R$ --</div>
            <p className="text-xs text-slate-500">Vendas confirmadas</p>
          </CardContent>
        </Card>
      </div>

      {/* welcome */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-10 text-center border-dashed">
        <h3 className="text-xl font-medium text-slate-300 mb-2">
          Bem-vindo ao gerenciador de torneios TCG
        </h3>

        <p className="text-slate-500 max-w-lg mx-auto mb-6">
          Use o menu lateral para gerenciar torneios e ver as inscrições. Comece
          criando seu primeiro torneio oficial pela plataforma
        </p>

        <Link to="/admin/tournaments/new">
          <Button variant='outline' className="bg-purple-600 hover:bg-purple-700 border-purple-500">Criar torneio</Button>
        </Link>
      </div>
    </div>
  );
}
