import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Users, BarChart3, AlertCircle, ArrowRight } from "lucide-react";

export default function GestorDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Visão da Equipe</h1>
          <p className="text-gray-500 mt-1">Acompanhe o bem-estar do seu time.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline">Exportar Relatório</Button>
            <Button>Nova Análise</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card hoverEffect className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 mb-1">Engajamento Semanal</p>
              <h3 className="text-3xl font-bold text-gray-800">78%</h3>
            </div>
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-gray-500">
            <span className="text-green-600 font-medium flex items-center mr-2">
              ↑ 12%
            </span>
            vs semana anterior
          </div>
        </Card>

        <Card hoverEffect className="bg-gradient-to-br from-amber-50 to-white border-amber-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-amber-600 mb-1">Clima Médio</p>
              <h3 className="text-3xl font-bold text-gray-800">7.2</h3>
            </div>
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-gray-500">
            <span className="text-gray-400 font-medium flex items-center mr-2">
              - 0.1
            </span>
            estável
          </div>
        </Card>

        <Card hoverEffect className="bg-gradient-to-br from-red-50 to-white border-red-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-red-600 mb-1">Alertas de Burnout</p>
              <h3 className="text-3xl font-bold text-gray-800">1</h3>
            </div>
            <div className="p-2 bg-red-100 text-red-600 rounded-lg">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-gray-500">
            <Button variant="ghost" className="h-auto p-0 text-xs text-red-600 hover:text-red-700 hover:bg-transparent">
              Ver detalhes <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="min-h-[300px]">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Mapa de Calor Emocional</h3>
            <div className="flex items-center justify-center h-48 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <span className="text-gray-400 text-sm">Visualização de Mapa de Calor (Mock)</span>
            </div>
        </Card>

        <Card className="min-h-[300px]">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-800">Atividade Recente</h3>
                <Button variant="ghost" size="sm">Ver tudo</Button>
            </div>
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-500 font-bold text-sm">
                            {['A', 'B', 'C'][i-1]}
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">Equipe de Design</p>
                            <p className="text-xs text-gray-500">Taxa de resposta: 85%</p>
                        </div>
                        <span className="text-xs text-gray-400">2h atrás</span>
                    </div>
                ))}
            </div>
        </Card>
      </div>
    </div>
  );
}
