'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/shared/ui/button';
import { X, ChevronRight, Check } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import Image from 'next/image';

// Emojis based on sistema.md 10-point scale
const EMOTION_SCALE = [
  { level: 1, emoji: '😄', label: 'Muito Feliz', description: 'Sentindo-se ótimo, motivado e positivo.' },
  { level: 2, emoji: '🙂', label: 'Feliz', description: 'Bem-estar geral, tranquilo e produtivo.' },
  { level: 3, emoji: '😌', label: 'Satisfeito', description: 'Em paz, confortável com o dia.' },
  { level: 4, emoji: '😐', label: 'Neutro', description: 'Sem grandes emoções, apenas ok.' },
  { level: 5, emoji: '😕', label: 'Levemente Irritado', description: 'Pequeno desconforto ou frustração.' },
  { level: 6, emoji: '😫', label: 'Cansado', description: 'Fadiga física ou mental.' },
  { level: 7, emoji: '😢', label: 'Triste', description: 'Sentindo-se para baixo ou desanimado.' },
  { level: 8, emoji: '😣', label: 'Estressado', description: 'Pressionado, sobrecarregado.' },
  { level: 9, emoji: '😟', label: 'Ansioso', description: 'Preocupado, inquieto.' },
  { level: 10, emoji: '😞', label: 'Deprimido', description: 'Em sofrimento emocional ou desmotivado.' },
];

export default function EmoflowPage() {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelect = (level: number) => {
    setSelectedLevel(level);
  };

  const handleSubmit = async () => {
    if (!selectedLevel) return;
    
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Emoflow registrado com sucesso!');
    router.push('/dashboard');
  };

  const close = () => router.push('/dashboard');

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#E6D4F4] to-[#FDECD0] flex flex-col relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-white/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-300/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="p-6 flex w-full h-18 justify-between items-center z-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 mt-4 ml-1 w-48"
        >
                    <Image  
                      src="/logo-psicozen.png" 
                      alt="PsicoZen Logo" 
                      width={500}
                      height={500}
                    />
        </motion.div>

        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={close}
          className="w-10 h-10 rounded-full bg-white/40 backdrop-blur-md flex items-center justify-center text-gray-700 hover:bg-white/60 transition-colors shadow-sm"
        >
          <X className="w-5 h-5" />
        </motion.button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 z-10 max-w-5xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">Como está sua energia hoje?</h1>
          <p className="text-lg text-gray-600 max-w-lg mx-auto">
            O Emoflow ajuda você a rastrear seu bem-estar emocional ao longo do tempo.
          </p>
        </motion.div>

        {/* Emotion Scale Grid */}
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 w-full"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.05
              }
            }
          }}
        >
          {EMOTION_SCALE.map((item) => (
            <motion.button
              key={item.level}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(item.level)}
              className={cn(
                "relative flex flex-col items-center p-6 rounded-3xl transition-all duration-300 border-2",
                selectedLevel === item.level
                  ? "bg-white border-primary shadow-xl"
                  : "bg-white/40 border-transparent hover:bg-white/60 hover:shadow-lg backdrop-blur-sm"
              )}
            >
              <span className="text-5xl mb-4 filter drop-shadow-sm">{item.emoji}</span>
              <span className="font-bold text-gray-800 mb-1">{item.label}</span>
              <span className="text-xs text-center text-gray-600 leading-tight">{item.description}</span>
              
              {selectedLevel === item.level && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shadow-md"
                >
                  <Check className="w-3.5 h-3.5" />
                </motion.div>
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Action Bar */}
        <AnimatePresence>
          {selectedLevel && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-8 left-0 right-0 flex justify-center px-4"
            >
              <div className="bg-white/80 backdrop-blur-xl p-4 rounded-3xl shadow-2xl flex items-center gap-4 max-w-md w-full border border-white/50">
                <div className="flex-1 pl-2">
                   <p className="text-sm font-medium text-gray-500">Selecionado</p>
                   <p className="font-bold text-gray-800 text-lg">
                     {EMOTION_SCALE.find(e => e.level === selectedLevel)?.label}
                   </p>
                </div>
                <Button 
                  size="lg" 
                  onClick={handleSubmit} 
                  isLoading={isSubmitting}
                  className="rounded-xl px-8 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-white"
                >
                  Confirmar
                  <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
