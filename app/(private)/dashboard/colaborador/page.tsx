import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Heart, Calendar, Sun, ArrowRight } from "lucide-react";

export default function ColaboradorDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Olá, Douglas</h1>
        <p className="text-gray-500 mt-1">Como você está se sentindo hoje?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Daily Mood Check-in Card (Featured) */}
        <Card className="md:col-span-2 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
             
             <div className="relative z-10 flex flex-col items-start gap-4">
                <div className="p-3 bg-white/50 backdrop-blur rounded-xl inline-flex text-primary mb-2">
                    <Sun className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-primary max-w-md">
                    Hora do seu momento Zen diário
                </h2>
                <p className="text-gray-600 max-w-lg">
                    Registrar suas emoções ajuda a manter o equilíbrio e autoconhecimento. Leva menos de 1 minuto.
                </p>
                <Button className="mt-2 glass hover:bg-primary hover:text-white transition-colors text-primary border-primary/20">
                    Registrar Emociograma
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
             </div>
        </Card>

        {/* Quick Stats or Streak */}
        <Card className="flex flex-col justify-center items-center text-center p-8">
             <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 mb-4">
                <Heart className="w-8 h-8 fill-orange-500 text-orange-500" />
             </div>
             <div className="text-4xl font-bold text-gray-800 mb-1">12</div>
             <p className="text-sm text-gray-500 font-medium">Dias seguidos de registros</p>
             <p className="text-xs text-gray-400 mt-2">Continue assim! 🎉</p>
        </Card>
      </div>

      <h2 className="text-xl font-bold text-gray-800 mt-8">Sua Jornada</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
            <Card key={i} hoverEffect className="group">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                        {14 + i} Jan
                    </span>
                    <Heart className="w-4 h-4 text-gray-300 group-hover:text-red-400 transition-colors" />
                </div>
                <div className="h-20 flex items-center justify-center">
                    <span className="text-4xl">
                        {['😊', '😌', '🤔', '😎'][i-1]}
                    </span>
                </div>
                <p className="text-center text-sm font-medium text-gray-600">
                    {['Produtivo', 'Tranquilo', 'Reflexivo', 'Focado'][i-1]}
                </p>
            </Card>
        ))}
      </div>
    </div>
  );
}
