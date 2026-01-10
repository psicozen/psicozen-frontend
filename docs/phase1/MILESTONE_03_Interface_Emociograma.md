# Marco 3: Interface do Emociograma (Submissão)

**Cronograma:** Semana 2-3
**Dependências:** Marco 1 (Organization Context), Marco 2 (Roles System)
**Status:** 🔴 Não Iniciado

---

## Visão Geral

Criar interface completa para submissão diária de estado emocional: seletor de emoji (escala 1-10), seleção de categoria, campo de comentário opcional e controle de anonimato. Interface deve ser intuitiva, rápida e acessível.

**Entregável Principal:** Colaboradores conseguem registrar emoções diárias com experiência fluida e privacidade garantida.

---

## Detalhamento de Tarefas

### Tarefa 3.1: Criar Types - Emociograma

**Prioridade:** 🔴 Crítica
**Tempo Estimado:** 2 horas
**Responsável:** Frontend Developer

**Subtarefas:**
- [ ] Criar arquivo: `src/types/emociograma.types.ts`
- [ ] Definir interface `EmociogramaSubmission`
- [ ] Definir interface `EmociogramaCategory`
- [ ] Definir type `EmotionLevel` (1-10)
- [ ] Criar constantes de emoji mapping

**Types Code:**
```typescript
// src/types/emociograma.types.ts

export type EmotionLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface EmociogramaCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  displayOrder: number;
  isActive: boolean;
}

export interface EmociogramaSubmission {
  id: string;
  emotionLevel: EmotionLevel;
  emotionEmoji: string;
  categoryId: string;
  isAnonymous: boolean;
  comment?: string;
  submittedAt: Date;
  department?: string;
  team?: string;
}

export interface SubmitEmociogramaData {
  emotionLevel: EmotionLevel;
  categoryId: string;
  isAnonymous: boolean;
  comment?: string;
}

export const EMOTION_EMOJI_MAP: Record<EmotionLevel, { emoji: string; label: string; description: string }> = {
  1: { emoji: '😄', label: 'Muito feliz', description: 'Sentindo-se ótimo, motivado e positivo' },
  2: { emoji: '🙂', label: 'Feliz', description: 'Bem-estar geral, tranquilo e produtivo' },
  3: { emoji: '😌', label: 'Satisfeito', description: 'Em paz, confortável com o dia' },
  4: { emoji: '😐', label: 'Neutro', description: 'Sem grandes emoções, apenas ok' },
  5: { emoji: '😕', label: 'Levemente irritado', description: 'Pequeno desconforto ou frustração' },
  6: { emoji: '😫', label: 'Cansado', description: 'Fadiga física ou mental' },
  7: { emoji: '😢', label: 'Triste', description: 'Sentindo-se para baixo ou desanimado' },
  8: { emoji: '😣', label: 'Estressado', description: 'Pressionado, sobrecarregado' },
  9: { emoji: '😟', label: 'Ansioso', description: 'Preocupado, inquieto' },
  10: { emoji: '😞', label: 'Muito triste', description: 'Em sofrimento emocional ou desmotivado' },
};
```

**Critérios de Aceite:**
- ✅ Types correspondem ao backend
- ✅ Emoji mapping completo (1-10)
- ✅ Tipos fortemente tipados

---

### Tarefa 3.2: Criar Emociograma Service

**Prioridade:** 🔴 Crítica
**Tempo Estimado:** 3 horas
**Responsável:** Frontend Developer

**Subtarefas:**
- [ ] Criar diretório: `src/features/emociograma/services/`
- [ ] Criar `emociograma.service.ts`
- [ ] Implementar métodos:
  - [ ] `submitEmociograma()` - Enviar submissão
  - [ ] `getMySubmissions()` - Listar próprias submissões
  - [ ] `getCategories()` - Listar categorias
  - [ ] `getSubmissionById()` - Detalhes de submissão
- [ ] Criar `emociograma.service.test.ts`

**Service Code:**
```typescript
// src/features/emociograma/services/emociograma.service.ts

import { httpClient } from '@/lib/http/client';
import {
  EmociogramaSubmission,
  EmociogramaCategory,
  SubmitEmociogramaData,
} from '@/types/emociograma.types';
import { PaginatedResult } from '@/types/api.types';

export class EmociogramaService {
  private baseUrl = '/emociograma';

  /**
   * Submeter estado emocional diário
   */
  async submitEmociograma(data: SubmitEmociogramaData): Promise<EmociogramaSubmission> {
    const response = await httpClient.post<EmociogramaSubmission>(this.baseUrl, data);

    if (!response.success) {
      throw new Error(response.message || 'Erro ao submeter emociograma');
    }

    return response.data;
  }

  /**
   * Obter próprias submissões com paginação
   */
  async getMySubmissions(page: number = 1, limit: number = 10): Promise<PaginatedResult<EmociogramaSubmission>> {
    const response = await httpClient.get<PaginatedResult<EmociogramaSubmission>>(
      `${this.baseUrl}/my-submissions`,
      { params: { page, limit } },
    );

    if (!response.success) {
      throw new Error('Erro ao buscar submissões');
    }

    return response.data;
  }

  /**
   * Obter categorias disponíveis
   */
  async getCategories(): Promise<EmociogramaCategory[]> {
    const response = await httpClient.get<EmociogramaCategory[]>(`${this.baseUrl}/categories`);

    if (!response.success) {
      throw new Error('Erro ao buscar categorias');
    }

    return response.data;
  }

  /**
   * Obter submissão por ID
   */
  async getSubmissionById(id: string): Promise<EmociogramaSubmission> {
    const response = await httpClient.get<EmociogramaSubmission>(`${this.baseUrl}/submission/${id}`);

    if (!response.success) {
      throw new Error('Submissão não encontrada');
    }

    return response.data;
  }
}

export const emociogramaService = new EmociogramaService();
```

**Service Test:**
```typescript
// src/features/emociograma/services/emociograma.service.test.ts

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { emociogramaService } from './emociograma.service';

describe('EmociogramaService', () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  describe('submitEmociograma', () => {
    it('deve submeter emociograma com sucesso', async () => {
      const mockSubmission = {
        id: 'sub-123',
        emotionLevel: 7,
        emotionEmoji: '😢',
        categoryId: 'cat-456',
        isAnonymous: false,
        submittedAt: new Date(),
      };

      mock.onPost('/emociograma').reply(201, {
        success: true,
        data: mockSubmission,
      });

      const result = await emociogramaService.submitEmociograma({
        emotionLevel: 7,
        categoryId: 'cat-456',
        isAnonymous: false,
      });

      expect(result.emotionLevel).toBe(7);
    });
  });
});
```

**Critérios de Aceite:**
- ✅ Service criado com métodos de API
- ✅ Tratamento de erros adequado
- ✅ Testes com ≥80% cobertura

---

### Tarefa 3.3: Criar Component - EmotionSelector

**Prioridade:** 🔴 Crítica
**Tempo Estimado:** 5 horas
**Responsável:** Frontend Developer

**Subtarefas:**
- [ ] Criar arquivo: `src/features/emociograma/components/emotion-selector.tsx`
- [ ] Renderizar 10 emojis em grid responsivo
- [ ] Seleção visual clara (emoji selecionado destacado)
- [ ] Hover mostra label e descrição
- [ ] Suportar navegação por teclado (acessibilidade)
- [ ] Criar `emotion-selector.test.tsx`

**Component Code:**
```typescript
// src/features/emociograma/components/emotion-selector.tsx

'use client';

import { useState } from 'react';
import { EmotionLevel, EMOTION_EMOJI_MAP } from '@/types/emociograma.types';

interface EmotionSelectorProps {
  value: EmotionLevel | null;
  onChange: (level: EmotionLevel) => void;
  error?: string;
}

export function EmotionSelector({ value, onChange, error }: EmotionSelectorProps) {
  const [hoveredLevel, setHoveredLevel] = useState<EmotionLevel | null>(null);

  const emotionLevels: EmotionLevel[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Como você está se sentindo hoje?
      </label>

      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
        {emotionLevels.map((level) => {
          const emotion = EMOTION_EMOJI_MAP[level];
          const isSelected = value === level;
          const isHovered = hoveredLevel === level;
          const isNegative = level >= 6; // Emoções negativas (alertas)

          return (
            <button
              key={level}
              type="button"
              onClick={() => onChange(level)}
              onMouseEnter={() => setHoveredLevel(level)}
              onMouseLeave={() => setHoveredLevel(null)}
              className={`
                relative p-4 rounded-lg border-2 transition-all
                hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500
                ${isSelected ? 'border-blue-500 bg-blue-50 scale-110' : 'border-gray-200 bg-white'}
                ${isNegative ? 'hover:border-red-300' : 'hover:border-blue-300'}
              `}
              aria-label={`${emotion.label} (nível ${level})`}
              aria-pressed={isSelected}
            >
              <span className="text-4xl" role="img" aria-label={emotion.label}>
                {emotion.emoji}
              </span>

              {isSelected && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Label do emoji selecionado ou hover */}
      {(value || hoveredLevel) && (
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-700">
            {EMOTION_EMOJI_MAP[hoveredLevel || value!].label}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {EMOTION_EMOJI_MAP[hoveredLevel || value!].description}
          </p>
        </div>
      )}

      {/* Erro */}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
```

**Component Test:**
```typescript
// src/features/emociograma/components/emotion-selector.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import { EmotionSelector } from './emotion-selector';

describe('EmotionSelector', () => {
  it('deve renderizar 10 emojis', () => {
    render(<EmotionSelector value={null} onChange={jest.fn()} />);

    // Verificar se todos os 10 emojis estão presentes
    expect(screen.getByLabelText(/Muito feliz/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Muito triste/)).toBeInTheDocument();
  });

  it('deve chamar onChange ao clicar em emoji', () => {
    const handleChange = jest.fn();
    render(<EmotionSelector value={null} onChange={handleChange} />);

    const happyButton = screen.getByLabelText(/Muito feliz/);
    fireEvent.click(happyButton);

    expect(handleChange).toHaveBeenCalledWith(1);
  });

  it('deve destacar emoji selecionado', () => {
    render(<EmotionSelector value={5} onChange={jest.fn()} />);

    const selectedButton = screen.getByLabelText(/Levemente irritado/);
    expect(selectedButton).toHaveClass('border-blue-500');
  });

  it('deve mostrar descrição ao hover', () => {
    render(<EmotionSelector value={null} onChange={jest.fn()} />);

    const sadButton = screen.getByLabelText(/Triste/);
    fireEvent.mouseEnter(sadButton);

    expect(screen.getByText('Sentindo-se para baixo ou desanimado')).toBeInTheDocument();
  });
});
```

**Critérios de Aceite:**
- ✅ 10 emojis renderizados
- ✅ Seleção funciona corretamente
- ✅ Hover mostra descrição
- ✅ Acessível via teclado
- ✅ Testes com ≥80% cobertura

---

### Tarefa 3.4: Criar Component - CategorySelector

**Prioridade:** 🔴 Crítica
**Tempo Estimado:** 3 horas
**Responsável:** Frontend Developer

**Subtarefas:**
- [ ] Criar arquivo: `src/features/emociograma/components/category-selector.tsx`
- [ ] Buscar categorias da API
- [ ] Renderizar como radio buttons ou cards
- [ ] Mostrar nome e ícone de cada categoria
- [ ] Validação de seleção obrigatória
- [ ] Criar teste

**Component Code:**
```typescript
// src/features/emociograma/components/category-selector.tsx

'use client';

import { useEffect, useState } from 'react';
import { emociogramaService } from '../services/emociograma.service';
import { EmociogramaCategory } from '@/types/emociograma.types';
import { Loader2 } from 'lucide-react';

interface CategorySelectorProps {
  value: string | null;
  onChange: (categoryId: string) => void;
  error?: string;
}

export function CategorySelector({ value, onChange, error }: CategorySelectorProps) {
  const [categories, setCategories] = useState<EmociogramaCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await emociogramaService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Qual área da sua vida está afetando sua emoção?
      </label>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {categories.map((category) => {
          const isSelected = value === category.id;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onChange(category.id)}
              className={`
                p-4 rounded-lg border-2 transition-all text-center
                hover:border-blue-300 hover:bg-blue-50
                focus:outline-none focus:ring-2 focus:ring-blue-500
                ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}
              `}
              aria-pressed={isSelected}
            >
              {category.icon && (
                <span className="text-2xl mb-2 block">{category.icon}</span>
              )}
              <span className="text-sm font-medium text-gray-900">{category.name}</span>
            </button>
          );
        })}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
```

**Critérios de Aceite:**
- ✅ Categorias carregadas da API
- ✅ Seleção funciona
- ✅ Design responsivo
- ✅ Testes com ≥80% cobertura

---

### Tarefa 3.5: Criar Form - Submit Emociograma

**Prioridade:** 🔴 Crítica
**Tempo Estimado:** 6 horas
**Responsável:** Frontend Developer

**Subtarefas:**
- [ ] Criar arquivo: `src/features/emociograma/components/submit-emociograma-form.tsx`
- [ ] Usar React Hook Form + Zod para validação
- [ ] Integrar `<EmotionSelector>` e `<CategorySelector>`
- [ ] Campo de comentário opcional (max 1000 chars)
- [ ] Toggle de anonimato com explicação clara
- [ ] Botão submit com loading state
- [ ] Toast de sucesso/erro
- [ ] Criar teste

**Form Code:**
```typescript
// src/features/emociograma/components/submit-emociograma-form.tsx

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { EmotionSelector } from './emotion-selector';
import { CategorySelector } from './category-selector';
import { Button } from '@/shared/ui/button';
import { Textarea } from '@/shared/ui/textarea';
import { emociogramaService } from '../services/emociograma.service';
import { EmotionLevel } from '@/types/emociograma.types';
import { useRouter } from 'next/navigation';

const schema = z.object({
  emotionLevel: z.number().min(1).max(10).nullable().refine(val => val !== null, {
    message: 'Por favor, selecione como você está se sentindo',
  }),
  categoryId: z.string().uuid({ message: 'Por favor, selecione uma categoria' }),
  isAnonymous: z.boolean(),
  comment: z.string().max(1000, 'Comentário não pode exceder 1000 caracteres').optional(),
});

type FormData = z.infer<typeof schema>;

export function SubmitEmociogramaForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      emotionLevel: null,
      categoryId: '',
      isAnonymous: false,
      comment: '',
    },
  });

  const emotionLevel = watch('emotionLevel');
  const categoryId = watch('categoryId');
  const isAnonymous = watch('isAnonymous');

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      await emociogramaService.submitEmociograma({
        emotionLevel: data.emotionLevel as EmotionLevel,
        categoryId: data.categoryId,
        isAnonymous: data.isAnonymous,
        comment: data.comment || undefined,
      });

      toast.success('Emociograma registrado com sucesso!');

      // Redirecionar para histórico
      router.push('/dashboard/emociograma');
    } catch (error) {
      toast.error('Erro ao registrar emociograma. Tente novamente.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Emotion Selector */}
      <EmotionSelector
        value={emotionLevel}
        onChange={(level) => setValue('emotionLevel', level)}
        error={errors.emotionLevel?.message}
      />

      {/* Category Selector */}
      <CategorySelector
        value={categoryId}
        onChange={(id) => setValue('categoryId', id)}
        error={errors.categoryId?.message}
      />

      {/* Comentário Opcional */}
      <div className="space-y-2">
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
          Comentário (opcional)
        </label>
        <Textarea
          id="comment"
          placeholder="Deseja adicionar algum comentário sobre como está se sentindo?"
          maxLength={1000}
          rows={4}
          value={watch('comment')}
          onChange={(e) => setValue('comment', e.target.value)}
          className="w-full"
        />
        <p className="text-xs text-gray-500">
          {watch('comment')?.length || 0}/1000 caracteres
        </p>
        {errors.comment && (
          <p className="text-sm text-red-600">{errors.comment.message}</p>
        )}
      </div>

      {/* Toggle Anonimato */}
      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
        <input
          type="checkbox"
          id="isAnonymous"
          checked={isAnonymous}
          onChange={(e) => setValue('isAnonymous', e.target.checked)}
          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <div className="flex-1">
          <label htmlFor="isAnonymous" className="text-sm font-medium text-gray-900 cursor-pointer">
            Registrar anonimamente
          </label>
          <p className="text-xs text-gray-600 mt-1">
            Sua identidade não será revelada para gestores. Apenas dados agregados serão visíveis.
            Admins ainda poderão ver submissões identificadas para fins de suporte.
          </p>
        </div>
      </div>

      {/* Aviso de Alerta */}
      {emotionLevel && emotionLevel >= 6 && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Atenção:</strong> Seu registro indica um estado emocional que requer atenção.
            Seu gestor será notificado para que possa oferecer suporte.
          </p>
        </div>
      )}

      {/* Botão Submit */}
      <Button type="submit" variant="primary" className="w-full" isLoading={isSubmitting}>
        {isSubmitting ? 'Registrando...' : 'Registrar Emociograma'}
      </Button>
    </form>
  );
}
```

**Critérios de Aceite:**
- ✅ Form valida todos os campos
- ✅ Submissão envia para API
- ✅ Loading state durante submissão
- ✅ Toast de feedback
- ✅ Redireciona após sucesso
- ✅ Testes com ≥80% cobertura

---

### Tarefa 3.6: Criar Página - Novo Emociograma

**Prioridade:** 🔴 Crítica
**Tempo Estimado:** 3 horas
**Responsável:** Frontend Developer

**Subtarefas:**
- [ ] Criar arquivo: `app/dashboard/emociograma/novo/page.tsx`
- [ ] Renderizar `<SubmitEmociogramaForm>`
- [ ] Layout responsivo
- [ ] Breadcrumbs de navegação
- [ ] Proteger com role COLABORADOR (todos podem submeter)

**Page Code:**
```typescript
// app/dashboard/emociograma/novo/page.tsx

import { SubmitEmociogramaForm } from '@/features/emociograma/components/submit-emociograma-form';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function NovoEmociogramaPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Link href="/dashboard" className="hover:text-blue-600">
          Dashboard
        </Link>
        <span>/</span>
        <Link href="/dashboard/emociograma" className="hover:text-blue-600">
          Emociograma
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Novo Registro</span>
      </nav>

      {/* Cabeçalho */}
      <div className="mb-8">
        <Link
          href="/dashboard/emociograma"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 mb-4"
        >
          <ChevronLeft className="h-4 w-4" />
          Voltar ao histórico
        </Link>

        <h1 className="text-3xl font-bold text-gray-900">Registrar Emociograma</h1>
        <p className="mt-2 text-gray-600">
          Reserve um momento para refletir sobre como você está se sentindo hoje.
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <SubmitEmociogramaForm />
      </div>
    </div>
  );
}
```

**Critérios de Aceite:**
- ✅ Página renderiza form
- ✅ Breadcrumbs funcionam
- ✅ Design responsivo

---

### Tarefa 3.7: Criar Component - EmociogramaHistory

**Prioridade:** 🟡 Alta
**Tempo Estimado:** 5 horas
**Responsável:** Frontend Developer

**Subtarefas:**
- [ ] Criar arquivo: `src/features/emociograma/components/emociograma-history.tsx`
- [ ] Listar submissões do usuário com paginação
- [ ] Mostrar emoji, categoria, data, comentário
- [ ] Indicador visual de anonimato
- [ ] Paginação funcional
- [ ] Empty state se sem submissões
- [ ] Criar teste

**Component Code:**
```typescript
// src/features/emociograma/components/emociograma-history.tsx

'use client';

import { useEffect, useState } from 'react';
import { emociogramaService } from '../services/emociograma.service';
import { EmociogramaSubmission } from '@/types/emociograma.types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Eye, EyeOff, MessageCircle } from 'lucide-react';
import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';

export function EmociogramaHistory() {
  const [submissions, setSubmissions] = useState<EmociogramaSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchSubmissions() {
      setIsLoading(true);

      try {
        const result = await emociogramaService.getMySubmissions(page, 10);
        setSubmissions(result.data);
        setTotalPages(Math.ceil(result.total / result.limit));
      } catch (error) {
        console.error('Erro ao buscar histórico:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSubmissions();
  }, [page]);

  if (isLoading) {
    return <div className="text-center py-12">Carregando histórico...</div>;
  }

  if (submissions.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-gray-600">Você ainda não registrou nenhum emociograma.</p>
        <Button variant="primary" className="mt-4" href="/dashboard/emociograma/novo">
          Registrar Agora
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {submissions.map((submission) => (
        <Card key={submission.id} className="p-6">
          <div className="flex items-start gap-4">
            {/* Emoji */}
            <div className="flex-shrink-0">
              <span className="text-5xl" role="img" aria-label="Emoção">
                {submission.emotionEmoji}
              </span>
            </div>

            {/* Detalhes */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-medium text-gray-900">
                  {format(new Date(submission.submittedAt), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </span>
                <span className="text-sm text-gray-500">
                  {format(new Date(submission.submittedAt), 'HH:mm')}
                </span>

                {submission.isAnonymous ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                    <EyeOff className="h-3 w-3" />
                    Anônimo
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                    <Eye className="h-3 w-3" />
                    Identificado
                  </span>
                )}
              </div>

              {submission.comment && (
                <div className="mt-3 p-3 bg-gray-50 rounded-md">
                  <div className="flex items-start gap-2">
                    <MessageCircle className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{submission.comment}</p>
                  </div>
                </div>
              )}

              {submission.department && (
                <p className="text-xs text-gray-500 mt-2">
                  Departamento: {submission.department}
                  {submission.team && ` • Equipe: ${submission.team}`}
                </p>
              )}
            </div>
          </div>
        </Card>
      ))}

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Anterior
          </Button>

          <span className="text-sm text-gray-600">
            Página {page} de {totalPages}
          </span>

          <Button
            variant="outline"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Próxima
          </Button>
        </div>
      )}
    </div>
  );
}
```

**Critérios de Aceite:**
- ✅ Lista histórico do usuário
- ✅ Paginação funcional
- ✅ Mostra anonimato
- ✅ Empty state
- ✅ Testes com ≥80% cobertura

---

### Tarefa 3.8: Criar Página - Emociograma Dashboard

**Prioridade:** 🟡 Alta
**Tempo Estimado:** 3 horas
**Responsável:** Frontend Developer

**Subtarefas:**
- [ ] Criar arquivo: `app/dashboard/emociograma/page.tsx`
- [ ] Mostrar botão "Registrar Novo"
- [ ] Renderizar `<EmociogramaHistory>`
- [ ] Estatísticas pessoais (média, streak, etc.)
- [ ] Gráfico de evolução (linha do tempo)

**Page Code:**
```typescript
// app/dashboard/emociograma/page.tsx

import { EmociogramaHistory } from '@/features/emociograma/components/emociograma-history';
import Link from 'next/link';
import { Button } from '@/shared/ui/button';
import { Plus } from 'lucide-react';

export default function EmociogramaPage() {
  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meu Emociograma</h1>
          <p className="mt-2 text-gray-600">Acompanhe sua evolução emocional ao longo do tempo</p>
        </div>

        <Link href="/dashboard/emociograma/novo">
          <Button variant="primary" className="inline-flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Registrar Hoje
          </Button>
        </Link>
      </div>

      {/* Histórico */}
      <EmociogramaHistory />
    </div>
  );
}
```

**Critérios de Aceite:**
- ✅ Página lista histórico
- ✅ Botão de novo registro
- ✅ Design responsivo

---

## Definição de Pronto

Marco 3 está completo quando:

- ✅ **Types:** Types de emociograma criados
- ✅ **Service:** EmociogramaService implementado
- ✅ **Components:** EmotionSelector, CategorySelector, Form criados
- ✅ **Pages:** Páginas de submissão e histórico funcionais
- ✅ **Validation:** Validação com Zod implementada
- ✅ **Tests:** Cobertura ≥80% (unit tests)
- ✅ **Integration:** Integrado com backend API

---

## Dependências para Próximos Marcos

- **Marco 4 (Relatórios):** Requer categorias e submissions para exibir
- **Marco 5 (Alertas):** Requer submissions com emotion_level >= 6

---

## Integração com Backend

**Endpoints Utilizados:**
- `POST /emociograma` - Submeter emoção
- `GET /emociograma/my-submissions` - Listar próprias submissões
- `GET /emociograma/categories` - Listar categorias

**Dados Enviados:**
```json
{
  "emotionLevel": 7,
  "categoryId": "uuid",
  "isAnonymous": false,
  "comment": "Sentindo-me estressado com prazos"
}
```

**Headers:**
- `Authorization: Bearer <token>`
- `x-organization-id: <uuid>`

---

## Recursos

- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)
- [date-fns](https://date-fns.org/)
- [Lucide Icons](https://lucide.dev/)
