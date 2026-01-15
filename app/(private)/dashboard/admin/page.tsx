import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Users, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Visão Geral</h1>
          <p className="text-gray-500 mt-1">Bem-vindo ao painel administrativo do PsicoZen.</p>
        </div>
        <Button>Gerar Relatório Geral</Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card hoverEffect className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Total Usuários</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-3xl font-bold text-gray-800">1,248</span>
            <span className="text-xs text-green-600 ml-2 font-medium">+12% este mês</span>
          </div>
        </Card>

        <Card hoverEffect className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Adesão Emociograma</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-3xl font-bold text-gray-800">85%</span>
            <span className="text-xs text-green-600 ml-2 font-medium">+5% vs média</span>
          </div>
        </Card>

        <Card hoverEffect className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Alertas Ativos</span>
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-3xl font-bold text-gray-800">3</span>
            <span className="text-xs text-gray-500 ml-2">Requer atenção</span>
          </div>
        </Card>

        <Card hoverEffect className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Satisfação Média</span>
            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-3xl font-bold text-gray-800">4.2</span>
            <span className="text-xs text-gray-500 ml-2">Escala 1-5</span>
          </div>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Tendência de Clima Organizacional</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
            <p className="text-gray-400 text-sm">Gráfico de tendências (Placeholder)</p>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Ações Recentes</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-600 font-medium">
                  JD
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">João D. enviou emociograma</p>
                  <p className="text-xs text-gray-400">Há 5 minutos</p>
                </div>
              </div>
            ))}
          </div>
          <Button variant="ghost" className="w-full mt-4 text-xs">Ver todas as atividades</Button>
        </Card>
      </div>
    </div>
  );
}
