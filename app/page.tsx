import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Lock,
  MessageCircle,
  ShieldCheck,
  Smile,
  Users,
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F6F2E8]">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-primary/10 bg-[#F6F2E8]/80 px-6 backdrop-blur-md md:px-10">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Image
              src="/logo-psicozen.png"
              alt="PsicoZen Logo"
              width={200}
              height={200}
              className="h-8 w-auto object-contain"
              priority
            />
          </Link>
        </div>
        <nav className="hidden md:block">
          <ul className="flex items-center gap-8 text-sm font-medium text-zinc-600">
            <li>
              <a
                href="#emociograma"
                className="transition-colors hover:text-primary"
              >
                Emociograma
              </a>
            </li>
            <li>
              <a
                href="#features"
                className="transition-colors hover:text-primary"
              >
                Funcionalidades
              </a>
            </li>
            <li>
              <a
                href="#benefits"
                className="transition-colors hover:text-primary"
              >
                Benefícios
              </a>
            </li>
            <li>
              <Link
                href="/login"
                className="transition-colors hover:text-primary"
              >
                Área do Cliente
              </Link>
            </li>
            <li>
              <Link
                href="/planos"
                className="transition-colors hover:text-primary"
              >
                Planos
              </Link>
            </li>
          </ul>
        </nav>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="hidden text-sm font-medium text-zinc-600 transition-colors hover:text-primary sm:block"
          >
            Acesso Restrito
          </Link>
          <a
            href="#contact"
            className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-white transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
          >
            Fale com Consultor
          </a>
        </div>
      </header>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative flex min-h-[85vh] flex-col items-center justify-center px-4 pt-10 text-center sm:pt-20">
          <div className="absolute top-1/4 -left-10 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-1/4 -right-10 -z-10 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />

          <div className="mx-auto max-w-4xl">
            <span className="mb-6 inline-block rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              Saúde Mental Corporativa
            </span>
            <h1 className="mx-auto text-5xl font-bold tracking-tight text-zinc-900 sm:text-7xl">
              Equilíbrio emocional para <br />
              <span className="text-primary">times de alta performance</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600 sm:text-xl">
              Gestão de clima, diagnósticos emocionais e suporte humanizado em uma
              única plataforma. Transforme dados em cuidado real.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="#contact"
                className="group flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-8 text-base font-semibold text-white transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/25"
              >
                Agendar Demonstração
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#emociograma"
                className="flex h-12 items-center justify-center rounded-full border border-zinc-200 bg-white/50 px-8 text-base font-medium text-zinc-700 backdrop-blur-sm transition-all hover:bg-white/80 hover:text-primary"
              >
                Conheça o Sistema
              </a>
            </div>

            <div className="mt-16 w-full max-w-5xl rounded-2xl border border-white/20 bg-white/40 p-2 shadow-2xl backdrop-blur-md sm:mt-24">
              <div className="overflow-hidden rounded-xl bg-gray-50/50">
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/dashboard-mockup.png"
                  alt="PsicoZen Dashboard Interface"
                  className="w-full h-auto object-cover opacity-90 transition-opacity hover:opacity-100"
                  width={1200}
                  height={800}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Emociograma Section */}
        <section id="emociograma" className="py-24 bg-white/40">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
                  O Emociograma
                </h2>
                <p className="mt-6 text-lg text-zinc-600">
                  Uma ferramenta diária e intuitiva onde colaboradores registram
                  seu estado emocional, permitindo que a empresa identifique padrões e
                  aja preventivamente.
                </p>
                <ul className="mt-8 space-y-4">
                  {[
                    "Registro rápido via emojis (😄 a 😞)",
                    "Mapeamento de 10 níveis de emoção",
                    "Detecção de padrões e alertas automáticos",
                    "Totalmente anônimo e seguro",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary/20 text-secondary-foreground">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-zinc-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative rounded-2xl border border-white/50 bg-white/30 p-8 shadow-xl backdrop-blur-sm">
                <div className="flex flex-col gap-6">
                  <div className="flex justify-between gap-2 text-4xl">
                    <span>😄</span>
                    <span>🙂</span>
                    <span>😐</span>
                    <span>😕</span>
                    <span>😫</span>
                    <span>😞</span>
                  </div>
                  <div className="rounded-xl bg-white p-4 shadow-sm">
                    <p className="text-sm font-medium text-zinc-500">
                      Feedback do dia
                    </p>
                    <p className="mt-1 text-zinc-900">
                      &quot;Hoje me sinto produtivo e focado nos objetivos.&quot;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
                Funcionalidades Completas
              </h2>
              <p className="mt-6 text-lg leading-8 text-zinc-600">
                Do diagnóstico à ação, oferecemos todos os recursos para um RH
                estratégico e humanizado.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <div className="grid grid-cols-1 gap-x-8 gap-y-8 lg:grid-cols-3">
                {features.map((feature) => (
                  <div
                    key={feature.name}
                    className="glass glass-hover flex flex-col rounded-3xl p-8"
                  >
                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <feature.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <dt className="flex items-center gap-x-3 text-xl font-semibold leading-7 text-zinc-900">
                      {feature.name}
                    </dt>
                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-zinc-600">
                      <p className="flex-auto">{feature.description}</p>
                    </dd>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Audience & Benefits */}
        <section id="benefits" className="py-24 bg-primary/5">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
              <div className="flex flex-col gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/20 text-primary">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900">Para o RH</h3>
                <p className="text-zinc-600">
                  Reduza o turnover e tenha visibilidade real do clima. Tome
                  decisões baseadas em dados, não em suposições.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/20 text-primary">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900">
                  Para Gestores
                </h3>
                <p className="text-zinc-600">
                  Acompanhe a motivação do time e identifique riscos de burnout
                  antes que afetem a produtividade.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/20 text-primary">
                  <Smile className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900">
                  Para Colaboradores
                </h3>
                <p className="text-zinc-600">
                  Um espaço seguro e anônimo para ser ouvido, garantindo que seu
                  bem-estar seja prioridade.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy & LGPD */}
        <section className="py-24">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-700">
              <Lock className="h-8 w-8" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
              Privacidade em Primeiro Lugar
            </h2>
            <p className="mt-4 text-lg text-zinc-600">
              Seguimos rigorosamente a LGPD. Os dados emocionais são tratados com
              criptografia e anonimização, garantindo que a confiança seja a base da
              nossa plataforma.
            </p>
          </div>
        </section>

        {/* Contact / CTA */}
        <section id="contact" className="py-24 bg-primary text-white">
          <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Pronto para transformar sua empresa?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg opacity-90">
              Entre em contato conosco para agendar uma demonstração personalizada e
              entender como o PsicoZen pode apoiar sua equipe.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="mailto:contato@psicozen.com.br"
                className="rounded-full bg-white px-8 py-3.5 text-base font-semibold text-primary shadow-sm hover:bg-zinc-100"
              >
                Fale com um Especialista
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200 bg-white/50 py-16 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2">
                <Image
                  src="/logo-psicozen.png"
                  alt="PsicoZen Logo"
                  width={140}
                  height={40}
                  className="h-9 w-auto object-contain"
                />
              </div>
              <p className="mt-4 text-sm leading-relaxed text-zinc-500">
                Transformando a gestão emocional corporativa. Cuidado,
                transparência e resultados reais para sua empresa.
              </p>
            </div>

            {/* Produto */}
            <div>
              <h3 className="text-sm font-semibold text-zinc-900">Produto</h3>
              <ul className="mt-4 space-y-3 text-sm text-zinc-600">
                <li>
                  <a
                    href="#emociograma"
                    className="transition-colors hover:text-primary"
                  >
                    Emociograma
                  </a>
                </li>
                <li>
                  <a
                    href="#features"
                    className="transition-colors hover:text-primary"
                  >
                    Funcionalidades
                  </a>
                </li>
                <li>
                  <Link
                    href="/planos"
                    className="transition-colors hover:text-primary"
                  >
                    Planos e Preços
                  </Link>
                </li>
                <li>
                  <a
                    href="#benefits"
                    className="transition-colors hover:text-primary"
                  >
                    Benefícios
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-sm font-semibold text-zinc-900">Legal</h3>
              <ul className="mt-4 space-y-3 text-sm text-zinc-600">
                <li>
                  <Link
                    href="/termos-uso"
                    className="transition-colors hover:text-primary"
                  >
                    Termos de Uso
                  </Link>
                </li>
                <li>
                  <Link
                    href="/politica-privacidade"
                    className="transition-colors hover:text-primary"
                  >
                    Política de Privacidade
                  </Link>
                </li>
                <li>
                  <Link
                    href="/politica-anonimato"
                    className="transition-colors hover:text-primary"
                  >
                    Política de Anonimato
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contato */}
            <div>
              <h3 className="text-sm font-semibold text-zinc-900">Contato</h3>
              <ul className="mt-4 space-y-3 text-sm text-zinc-600">
                <li>
                  <a
                    href="mailto:contato@psicozen.com.br"
                    className="transition-colors hover:text-primary"
                  >
                    contato@psicozen.com.br
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:suporte@psicozen.com.br"
                    className="transition-colors hover:text-primary"
                  >
                    suporte@psicozen.com.br
                  </a>
                </li>
                <li className="text-zinc-500">
                  São Luís – Maranhão – Brasil
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-zinc-200 pt-8 text-center sm:text-left">
            <p className="text-sm text-zinc-500">
              © {new Date().getFullYear()} PsicoZen. Todos os direitos
              reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    name: "Dashboards Gerenciais",
    description:
      "Visualização clara de indicadores de clima, engajamento e riscos por setor ou equipe.",
    icon: BarChart3,
  },
  {
    name: "Comunicação Interna",
    description:
      "Mural de avisos, enquetes rápidas e chat corporativo para manter todos alinhados.",
    icon: MessageCircle,
  },
  {
    name: "Suporte e Segurança",
    description:
      "Acesso a profissionais de saúde e conformidade total com normas de segurança do trabalho.",
    icon: ShieldCheck,
  },
];

