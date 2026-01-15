import Link from "next/link";
import { ArrowLeft, Check, CreditCard, HelpCircle } from "lucide-react";

const pricingData = [
  { collaborators: 10, monthly: 249.9, annual: 199.9 },
  { collaborators: 20, monthly: 399.9, annual: 319.9 },
  { collaborators: 30, monthly: 599.9, annual: 479.9 },
  { collaborators: 40, monthly: 698.9, annual: 559.9 },
  { collaborators: 50, monthly: 798.9, annual: 639.9 },
  { collaborators: 60, monthly: 898.9, annual: 719.9 },
  { collaborators: 70, monthly: 998.9, annual: 799.9 },
  { collaborators: 80, monthly: 1098.9, annual: 879.9 },
  { collaborators: 90, monthly: 1198.9, annual: 959.9 },
  { collaborators: 100, monthly: 1336.9, annual: 1050.9 },
  { collaborators: 200, monthly: 2333.9, annual: 1842.9 },
  { collaborators: 300, monthly: 3330.9, annual: 2634.9 },
  { collaborators: 400, monthly: 4326.9, annual: 3426.9 },
  { collaborators: 500, monthly: 5323.9, annual: 4218.9 },
  { collaborators: 600, monthly: 6319.9, annual: 5010.9 },
  { collaborators: 700, monthly: 7316.9, annual: 5802.9 },
  { collaborators: 800, monthly: 8313.9, annual: 6594.9 },
  { collaborators: 900, monthly: 9309.9, annual: 7386.9 },
  { collaborators: 1000, monthly: 10306.9, annual: 8178.9 },
  { collaborators: 1100, monthly: 11303.9, annual: 8970.9 },
  { collaborators: 1200, monthly: 12299.9, annual: 9762.9 },
  { collaborators: 1300, monthly: 13296.9, annual: 10554.9 },
  { collaborators: 1400, monthly: 14292.9, annual: 11346.9 },
  { collaborators: 1500, monthly: 15289.9, annual: 12138.9 },
  { collaborators: 1600, monthly: 16286.9, annual: 12930.9 },
  { collaborators: 1700, monthly: 17282.9, annual: 13722.9 },
  { collaborators: 1800, monthly: 18279.9, annual: 14514.9 },
  { collaborators: 1900, monthly: 19276.9, annual: 15306.9 },
  { collaborators: 2000, monthly: 20272.9, annual: 16098.9 },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export default function PlansPage() {
  return (
    <div className="min-h-screen bg-[#F6F2E8] py-20 px-6 font-sans">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para o início
        </Link>

        <div className="mb-16 text-center">
          <h1 className="text-3xl font-bold text-zinc-900 md:text-5xl">
            Escolha o plano ideal para sua equipe
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600">
            Transparência total. Sem custos ocultos. Selecione o tamanho da sua
            equipe e veja o investimento necessário para transformar a cultura
            da sua empresa.
          </p>
        </div>

        {/* Pricing Cards for key tiers */}
        <div className="mb-16 grid gap-8 md:grid-cols-3">
          {/* Small Team */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
            <h3 className="text-lg font-semibold text-zinc-900">
              Pequenos Times
            </h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-bold text-zinc-900">
                {formatCurrency(249.9)}
              </span>
              <span className="text-sm font-medium text-zinc-500">/mês</span>
            </div>
            <p className="mt-1 text-sm text-zinc-500">
              Para até 10 colaboradores
            </p>
            <ul className="mt-6 space-y-3">
              <li className="flex items-center gap-3 text-sm text-zinc-600">
                <Check className="h-4 w-4 text-green-500" />
                Emociograma diário
              </li>
              <li className="flex items-center gap-3 text-sm text-zinc-600">
                <Check className="h-4 w-4 text-green-500" />
                Relatórios básicos
              </li>
              <li className="flex items-center gap-3 text-sm text-zinc-600">
                <Check className="h-4 w-4 text-green-500" />
                Suporte por e-mail
              </li>
            </ul>
            <a
              href="mailto:contato@psicozen.com.br?subject=Interesse%20Plano%2010%20Colaboradores"
              className="mt-8 block rounded-full border border-zinc-200 bg-white px-4 py-2 text-center text-sm font-medium text-zinc-900 transition-colors hover:border-primary hover:text-primary"
            >
              Falar com Consultor
            </a>
          </div>

          {/* Medium Team */}
          <div className="relative rounded-2xl border border-primary bg-white p-8 shadow-xl">
            <div className="absolute top-0 right-0 -mr-2 -mt-2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white shadow-sm">
              Mais Popular
            </div>
            <h3 className="text-lg font-semibold text-primary">
              Média Empresa
            </h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-bold text-zinc-900">
                {formatCurrency(1336.9)}
              </span>
              <span className="text-sm font-medium text-zinc-500">/mês</span>
            </div>
            <p className="mt-1 text-sm text-zinc-500">
              Para até 100 colaboradores
            </p>
            <ul className="mt-6 space-y-3">
              <li className="flex items-center gap-3 text-sm text-zinc-600">
                <Check className="h-4 w-4 text-primary" />
                Tudo do plano anterior
              </li>
              <li className="flex items-center gap-3 text-sm text-zinc-600">
                <Check className="h-4 w-4 text-primary" />
                Dashboards avançados
              </li>
              <li className="flex items-center gap-3 text-sm text-zinc-600">
                <Check className="h-4 w-4 text-primary" />
                Gestão de acesso por nível
              </li>
            </ul>
            <a
              href="mailto:contato@psicozen.com.br?subject=Interesse%20Plano%20100%20Colaboradores"
              className="mt-8 block rounded-full bg-primary px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-primary/90"
            >
              Assinar Agora
            </a>
          </div>

          {/* Large Team */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
            <h3 className="text-lg font-semibold text-zinc-900">Corporativo</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-bold text-zinc-900">
                {formatCurrency(5323.9)}
              </span>
              <span className="text-sm font-medium text-zinc-500">/mês</span>
            </div>
            <p className="mt-1 text-sm text-zinc-500">
              Para até 500 colaboradores
            </p>
            <ul className="mt-6 space-y-3">
              <li className="flex items-center gap-3 text-sm text-zinc-600">
                <Check className="h-4 w-4 text-green-500" />
                Funcionalidades completas
              </li>
              <li className="flex items-center gap-3 text-sm text-zinc-600">
                <Check className="h-4 w-4 text-green-500" />
                API de integração
              </li>
              <li className="flex items-center gap-3 text-sm text-zinc-600">
                <Check className="h-4 w-4 text-green-500" />
                Suporte prioritário
              </li>
            </ul>
            <a
              href="mailto:contato@psicozen.com.br?subject=Interesse%20Plano%20Corporativo"
              className="mt-8 block rounded-full border border-zinc-200 bg-white px-4 py-2 text-center text-sm font-medium text-zinc-900 transition-colors hover:border-primary hover:text-primary"
            >
              Consultar Condições
            </a>
          </div>
        </div>

        {/* Detailed Table */}
        <div className="mx-auto mt-20 max-w-5xl overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-100 bg-zinc-50 px-6 py-4">
            <h3 className="text-lg font-semibold text-zinc-900">
              Tabela Completa de Preços
            </h3>
            <p className="text-sm text-zinc-500">
              Valores progressivos conforme o número de colaboradores.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-600">
              <thead className="bg-zinc-50 text-xs uppercase text-zinc-500">
                <tr>
                  <th className="px-6 py-3 font-semibold">Colaboradores</th>
                  <th className="px-6 py-3 font-semibold">Mensal</th>
                  <th className="px-6 py-3 font-semibold">Mensal/Colab.</th>
                  <th className="px-6 py-3 font-semibold">Anual (Total)</th>
                  <th className="px-6 py-3 font-semibold">Anual/Colab.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {pricingData.map((plan) => (
                  <tr
                    key={plan.collaborators}
                    className="hover:bg-zinc-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-zinc-900">
                      {plan.collaborators}
                    </td>
                    <td className="px-6 py-4">
                      {formatCurrency(plan.monthly)}
                    </td>
                    <td className="px-6 py-4">
                      {formatCurrency(plan.monthly / plan.collaborators)}
                    </td>
                    <td className="px-6 py-4">
                      {formatCurrency(plan.annual)}
                    </td>
                    <td className="px-6 py-4 text-green-600 font-medium">
                      {formatCurrency(plan.annual / plan.collaborators)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-zinc-600">
            Precisa de um plano personalizado para mais de 2.000 colaboradores?
          </p>
          <a
            href="mailto:contato@psicozen.com.br"
            className="mt-2 inline-flex items-center font-medium text-primary hover:underline"
          >
            Fale com nossa equipe de vendas
          </a>
        </div>
      </div>
    </div>
  );
}
