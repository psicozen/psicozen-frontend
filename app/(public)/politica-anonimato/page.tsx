import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export default function AnonymityPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F6F2E8] py-20 px-6 font-sans">
      <div className="mx-auto max-w-4xl rounded-2xl border border-white/40 bg-white/60 p-8 shadow-xl backdrop-blur-md md:p-12">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para o início
        </Link>

        <div className="mb-10 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
            <Shield className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 md:text-4xl">
            Política de Anonimato do Emoflow
          </h1>
          <p className="mt-4 text-zinc-600">
            Última atualização: 07 de janeiro de 2026
          </p>
        </div>

        <div className="prose prose-zinc prose-indigo max-w-none text-zinc-700">
          <h3>1. Objetivo e Abrangência</h3>
          <p>
            Esta política estabelece regras e controles para proteger o
            anonimato de usuários que optam por enviar respostas, feedbacks,
            ideias, sugestões e comentários no Emoflow.
          </p>
          <p>
            Aplica-se a todos os recursos do Emoflow que coletam e processam
            conteúdo de usuários (pesquisas, enquetes, caixinhas de sugestões,
            feedbacks 1:1, comentários qualitativos e conversas originadas no
            app).
          </p>

          <h3>2. Princípios de Proteção (LGPD)</h3>
          <p>
            O Emoflow segue os princípios da LGPD, com foco especial em:
          </p>
          <ul>
            <li>
              <strong>Finalidade & Necessidade:</strong> coletar o mínimo
              necessário para operar a funcionalidade prevista, evitando dados
              identificáveis quando o usuário escolhe anonimato.
            </li>
            <li>
              <strong>Transparência:</strong> comunicar claramente quando e como
              o anonimato é aplicado e suas limitações.
            </li>
            <li>
              <strong>Segurança & Prevenção:</strong> adotar medidas técnicas e
              administrativas para mitigar riscos de reidentificação.
            </li>
            <li>
              <strong>Não discriminação:</strong> impedir usos que causem
              discriminação ou represálias.
            </li>
            <li>
              <strong>Responsabilização e Prestação de contas:</strong> manter
              registros internos de controles (não de identidades) e revisar
              continuamente a eficácia da política.
            </li>
          </ul>

          <h3>3. Definições</h3>
          <ul>
            <li>
              <strong>Envio Anônimo:</strong> conteúdo submetido de modo que
              nenhuma informação identificável (p. ex., nome, e-mail, ID
              interno, IP, dispositivo) seja associada ao conteúdo visível por
              administradores ou equipes.
            </li>
            <li>
              <strong>Pseudônimo:</strong> identificação por um rótulo não
              relacionado à identidade real (p. ex., “Participante #42”), sem
              ligação pública com o titular.
            </li>
            <li>
              <strong>Segmento:</strong> grupo de usuários (por área, turno,
              projeto, local, etc.) usado para relatórios agregados.
            </li>
            <li>
              <strong>Administrador (Admin):</strong> usuário com permissões de
              gestão no Emoflow (ex.: criar pesquisas, visualizar resultados).
            </li>
            <li>
              <strong>Titular de dados:</strong> pessoa a quem se referem os
              dados.
            </li>
          </ul>

          <h3>4. Opções de Envio (Controle pelo Usuário)</h3>
          <p>No momento do envio, o usuário escolhe:</p>
          <ol>
            <li>
              <strong>Anônimo (padrão recomendado):</strong> nenhuma
              identificação é exibida ou acessível a administradores.
            </li>
            <li>
              <strong>Pseudônimo:</strong> o admin vê apenas um rótulo técnico
              (ex.: “Participante #”), sem dados pessoais.
            </li>
            <li>
              <strong>Identificado:</strong> o conteúdo pode mostrar o nome
              (quando o usuário assim desejar).
            </li>
          </ol>
          <p>
            <strong>Importante:</strong> o administrador nunca consegue
            converter um envio anônimo em identificado.
          </p>

          <h3>5. Proteções Técnicas Exclusivas do Emoflow</h3>
          <p>
            Para tornar o anonimato robusto e confiável, o Emoflow adota:
          </p>
          <h4>5.1. Remoção de Metadados Identificáveis</h4>
          <p>
            IP, agente do navegador, ID de dispositivo, horário exato de
            submissão, geolocalização e outros metadados são suprimidos,
            generalizados ou aleatorizados em envios anônimos.
          </p>
          <h4>5.2. Janela de Privacidade (AntiTiming)</h4>
          <p>
            Envio anônimo passa por um atraso aleatório (ex.: 15–90 min) antes
            de qualquer notificação ou registro agregado, evitando correlação
            por tempo.
          </p>
          <h4>5.3. Misturador de Filas (Mixing Queue)</h4>
          <p>
            Múltiplos envios anônimos são processados em lotes misturados,
            reduzindo ainda mais riscos de reidentificação por sequência.
          </p>
          <h4>5.4. Limiar Mínimo (k-anonimato)</h4>
          <p>
            Relatórios só exibem resultados quando houver ≥ 5 respostas por
            grupo/segmento. Abaixo desse limiar, o resultado é agregado ao total
            (“Todos os respondentes”).
          </p>
          <h4>5.5. Sanitização de Text Livre</h4>
          <p>
            Detecção e redação automática de possíveis identificadores em texto
            (nomes próprios, emails, telefones, placas, etc.) quando o envio for
            anônimo.
          </p>
          <h4>5.6. Criptografia e Separação Lógica</h4>
          <p>
            Trânsito e repouso criptografados (TLS/HTTPS; AES256 at rest).
            Separação de chaves e de bases para conteúdos anônimos x
            identificados. Log de acessos sem metadados pessoais.
          </p>
          <h4>5.7. AntiFingerprinting</h4>
          <p>
            Bloqueio de técnicas de fingerprinting (canvas, fontes, resolução,
            etc.) nos fluxos anônimos.
          </p>
          <h4>5.8. Privacidade Diferencial (opcional por organização)</h4>
          <p>
            Adição de ruído estatístico controlado em dashboards anuais para
            impedir inferência de indivíduos em grupos pequenos.
          </p>

          <h3>6. Proteções Operacionais</h3>
          <ul>
            <li>
              <strong>Escopo de Acesso:</strong> Admins não veem quem respondeu
              ou não (apenas agregados, ex.: “47 de 62 responderam”). Nenhum
              colaborador tem acesso a identificadores de envios anônimos.
            </li>
            <li>
              <strong>Resposta a Mensagens Anônimas:</strong> Admins podem
              enviar respostas privadas a envios anônimos via canal cego. As
              notificações ao usuário são atrasadas e intermediadas pelo
              Emoflow; a identidade do usuário nunca é revelada.
            </li>
            <li>
              <strong>Segmentação Segura:</strong> Resultados por segmento só
              aparecem com ≥ 5 respostas. Segmentos recorrentes abaixo do limiar
              são incorporados ao grupo geral.
            </li>
            <li>
              <strong>Equipes Pequenas:</strong> Para organizações ou equipes
              com &lt; 5 usuários, o Emoflow exibe alerta de risco de anonimato;
              resultados só são mostrados quando todos responderem.
            </li>
            <li>
              <strong>Prevenção a Reidentificação:</strong> Treinamento e
              restrições de perfis internos. Revisões periódicas de queries
              (consultas) e exportações para evitar “join” com dados externos.
            </li>
          </ul>

          <h3>7. Conduta, Limites e Exceções Legais</h3>
          <p>
            O Emoflow protege o anonimato e prefere suspender funcionalidades a
            violá-lo. Contudo, o ambiente não pode ser usado para:
          </p>
          <ul>
            <li>ameaças (morte, bomba, terroristas), incitação à violência ou crimes,</li>
            <li>assédio, discriminação, intimidação, discurso de ódio,</li>
            <li>divulgação de dados pessoais de terceiros,</li>
            <li>conteúdos ilícitos ou abusivos.</li>
          </ul>
          <p>
            <strong>Moderação e Ação:</strong> Conteúdos suspeitos são
            bloqueados e removidos. A organização é notificada com indicadores
            agregados (sem identidades). Quebra de anonimato só é considerada em
            modo reversível (ver 8) e exclusivamente mediante ordem judicial
            válida e parecer do responsável por proteção de dados (DPO). No modo
            irreversível, o Emoflow não possui meios técnicos para reidentificar
            o titular.
          </p>

          <h3>8. Modos de Anonimato do Emoflow (Particularidade Exclusiva)</h3>
          <p>
            Para atender diferentes realidades e requisitos legais, o Emoflow
            oferece dois modos configuráveis por organização/projeto:
          </p>
          <h4>1. Modo UltraAnônimo (Irreversível) – Padrão recomendado</h4>
          <ul>
            <li>Estrutura técnica impede qualquer reidentificação posterior.</li>
            <li>
              Indicado para pesquisas culturais, clima organizacional e
              sugestões gerais.
            </li>
          </ul>
          <h4>
            2. Modo Protegido (Reversível apenas com ordem judicial + DPO)
          </h4>
          <ul>
            <li>
              Uma chave selada e segregada pode, excepcionalmente, permitir
              vincular um envio a um titular apenas para casos extremos
              (ameaças criminais graves).
            </li>
            <li>
              Requer: ordem judicial específica e válida, aprovação formal do
              DPO e da direção, registro de auditoria completo.
            </li>
            <li>
              Não pode ser usado para identificar autores de críticas, notas
              baixas ou feedbacks negativos legítimos.
            </li>
          </ul>
          <p>
            <strong>Transparência:</strong> o modo escolhido é informado aos
            usuários antes de cada envio.
          </p>

          <h3>9. Retenção e Descarte</h3>
          <ul>
            <li>
              <strong>Conteúdos anônimos (dados agregados):</strong> retenção
              padrão de 06 meses para relatórios históricos; após esse prazo,
              anonimização adicional e compactação estatística.
            </li>
            <li>
              <strong>Metadados técnicos anônimos:</strong> descartados em até 7
              dias.
            </li>
            <li>
              <strong>Envios identificados:</strong> seguem a política de
              privacidade e retenção da organização.
            </li>
          </ul>
          <p>
            <strong>Direito de exclusão (LGPD):</strong> Em envios anônimos
            irreversíveis, não é possível localizar o titular para exclusão
            individual. Em envios identificados/pseudônimos, o titular pode
            solicitar exclusão pelos canais oficiais.
          </p>

          <h3>10. Exportações e Integrações</h3>
          <ul>
            <li>
              Exportações (CSV/Excel/BI) de resultados anônimos são sempre
              agregadas, com suprimidos e limiares aplicados.
            </li>
            <li>
              Integrações (API) respeitam as mesmas regras, bloqueando endpoints
              que possam revelar identidades ou metadados.
            </li>
          </ul>

          <h3>11. Auditoria, Segurança e Incidentes</h3>
          <ul>
            <li>Revisão anual da eficácia dos controles de anonimato.</li>
            <li>
              Testes de reidentificação internos simulados (redteam privacy).
            </li>
            <li>
              Registro de auditoria sem dados pessoais de quem envia
              anonimamente.
            </li>
            <li>
              Resposta a incidentes: canal dedicado; mitigação e comunicação
              conforme severidade e exigências legais.
            </li>
          </ul>

          <h3>12. Atualizações da Política</h3>
          <p>
            Esta política pode ser atualizada para refletir melhorias,
            requisitos legais, mudanças tecnológicas ou feedback da comunidade.
            A versão e data de vigência serão sempre publicadas e comunicadas
            dentro do Emoflow.
          </p>

          <h3>13. Canais de Contato</h3>
          <p>
            Dúvidas, sugestões ou solicitações relacionadas ao anonimato:
            <br />
            <a href="mailto:suporte@emoflow.com" className="font-medium text-primary hover:underline">
              suporte@emoflow.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
