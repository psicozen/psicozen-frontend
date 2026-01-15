import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";

export default function PrivacyPolicyPage() {
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
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-700">
            <Lock className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 md:text-4xl">
            Política de Privacidade – Emoflow
          </h1>
          <p className="mt-4 text-zinc-600">
            Última atualização: 07 de janeiro de 2026
          </p>
        </div>

        <div className="prose prose-zinc prose-green max-w-none text-zinc-700">
          <h3>1. Quem somos e compromisso com a privacidade</h3>
          <p>
            O Emoflow é uma solução que ajuda empresas a melhorar a comunicação,
            engajamento e desenvolvimento de pessoas por meio de funcionalidades
            como, avaliações, comunicação (chat), integrações, relatórios e
            entendimento emocional (análise de sentimentos).
          </p>
          <p>
            A privacidade é parte essencial do nosso produto: adotamos práticas
            de <strong>privacy by design</strong> que integra a proteção da
            privacidade em relação todas as etapas do desenvolvimento de
            produtos e serviços, segurança da informação e transparência em
            todas as etapas de tratamento de dados pessoais.
          </p>

          <h3>2. Abrangência</h3>
          <p>
            Esta Política se aplica a sites, aplicativos, APIs, integrações e
            quaisquer canais oficiais do Emoflow (“Serviços”), incluindo
            usuários finais, clientes corporativos, visitantes do site e
            parceiros.
          </p>

          <h3>3. Quais dados nós tratamos</h3>
          <p>
            Inclui dados de cadastro, pagamentos, uso do produto, logs, suporte,
            marketing, dados de terceiros inseridos pelo cliente, dados
            fornecidos pelo cliente e dados usados para análise de sentimentos.
          </p>

          <h3>4. Cookies e tecnologias similares</h3>
          <p>
            Utilizamos cookies essenciais, analíticos, funcionais e de
            publicidade. O usuário pode configurar preferências no navegador.
          </p>
          <p>
            Poderemos ainda utilizar tecnologias para armazenar informações
            temporárias de navegação com a finalidade de aprimorar e melhorar
            sua experiência na utilização de nosso produto. As principais
            ferramentas tecnológicas que fazem isso são os “cookies”, também
            sendo utilizadas tecnologias similares.
          </p>
          <p>
            Com isso poderemos saber, por exemplo, quais sites que você visitou,
            seu Protocolo de Internet (IP), a versão de seu navegador etc.
          </p>
          <p>
            Porém você poderá configurar seu dispositivo para administrar o uso
            de cookies ou para alertá-lo quando estão ativos. Alguns cookies
            podem ser necessários para a navegação e sua desativação pode
            prejudicar algumas funcionalidades de nosso Serviço.
          </p>

          <h4>4.1 Análises estatísticas, melhorias dos Serviços e produtos</h4>
          <p>
            Os dados (inclusive aqueles coletados pelos cookies) também poderão
            ser utilizados para finalidades estatísticas, para que possamos
            entender melhor o perfil de nossos clientes, aprimorar continuamente
            nosso produto e para fins de direcionamento de conteúdo específico.
            Nesse caso você não será identificado, sendo que seus dados irão
            apenas compor estatísticas sobre o uso de nosso produto, como por
            exemplo, quantos por cento de nossos clientes se encontram em
            determinada região, preferências do Usuário etc.
          </p>
          <p>
            Os próprios dados e os resultados estatísticos também poderão ser
            utilizados para direcionar questões administrativas, comerciais e
            financeiras da Emoflow, inclusive mediante direcionamento de
            campanhas de marketing.
          </p>

          <h4>4.2. Divulgação de campanhas, promoções e similares</h4>
          <p>
            Os dados poderão ser utilizados pela Emoflow ou terceiros por ela
            contratados para o envio de informações, campanhas publicitárias,
            questionários, convites para eventos, pesquisas de satisfação etc.
          </p>
          <p>
            A qualquer momento você poderá cancelar o recebimento dessas
            informações por meio de links contidos nas próprias mensagens
            (unfollow) ou enviando uma solicitação para suporte@emoflow.com.
          </p>

          <h4>4.3. Para fins legais e obrigatórios</h4>
          <p>
            A Emoflow poderá tratar dados de Usuários e dados de terceiros,
            inseridos por Usuários, para o cumprimento de obrigações legais ou
            regulatórias, compartilhando dados pessoais com autoridades
            públicas. Alguns exemplos, não exaustivos, desse tipo de tratamento
            são:
          </p>
          <ul>
            <li>
              Emissão de nossas Notas Fiscais, compartilhamento com a Receita
              Federal: Nome, CPF, CNPJ, endereço, telefone, e-mail, razão
              social, inscrição municipal/estadual;
            </li>
            <li>
              Credenciamento junto à Receita Federal – nome e CPF do sócio;
            </li>
          </ul>
          <p>
            Além disso, eventualmente os dados pessoais poderão ser tratados:
          </p>
          <ul>
            <li>
              Para auditorias internas e externas, para validações de questões
              de segurança da informação, buscando-se na medida do possível o
              sigilo e anonimização desses dados;
            </li>
            <li>Para atender solicitações legais de autoridades públicas;</li>
          </ul>

          <h3>5. Bases legais</h3>
          <p>
            Tratamento baseado em execução de contrato, obrigação legal,
            legítimo interesse e consentimento quando aplicável.
          </p>

          <h3>6. Finalidades de uso</h3>
          <p>
            Para disponibilizar funcionalidades do Emoflow, segurança, suporte,
            comunicações, melhorias de produto, estatísticas agregadas, backups
            e cumprimento legal.
          </p>

          <h3>7. Compartilhamento</h3>
          <p>
            Com prestadores de serviço, autoridades públicas, integrações via
            APIs e parceiros de mídia social, observando requisitos legais e
            contratuais.
          </p>

          <h3>8. Segurança da informação</h3>
          <p>
            Emoflow adota medidas técnicas e administrativas para a proteção da
            privacidade dos dados dos clientes, utilizando todos os esforços
            para manter a estrita confidencialidade, integridade e
            disponibilidade restrita às pessoas autorizadas.
          </p>
          <p>
            Tanto nosso site, por meio do qual você acessa o produto Emoflow,
            quanto o backup de nossos dados, estão na Web Services, o maior e
            mais confiável datacenter do mundo.
          </p>
          <p>
            Aplicamos criptografia, gestão de acessos, monitoramento, resposta a
            incidentes e treinamentos.
          </p>

          <h3>9. Retenção e descarte</h3>
          <p>
            Dados são mantidos conforme obrigação legal, execução contratual ou
            legítimo interesse. Após isso, são eliminados ou anonimizados.
          </p>

          <h3>10. Direitos dos titulares</h3>
          <p>
            Incluem acesso, correção, eliminação, portabilidade, informações
            sobre compartilhamento, revogação de consentimento e oposição. O
            titular pode solicitar a qualquer tempo o acesso a dados mantidos
            sob o controle da Emoflow, desde que não ultrapasse o período de 6
            meses, pois posterior a esse tempo eles podem ter sido eliminados.
          </p>
          <p>
            Canais:{" "}
            <a
              href="mailto:privacidade@emoflow.com"
              className="font-medium text-primary hover:underline"
            >
              privacidade@emoflow.com
            </a>{" "}
            ou{" "}
            <a
              href="mailto:suporte@emoflow.com"
              className="font-medium text-primary hover:underline"
            >
              suporte@emoflow.com
            </a>
            .
          </p>

          <h3>11. Crianças e adolescentes</h3>
          <p>
            O Emoflow não é direcionado a menores. Se houver tratamento, ocorre
            sob responsabilidade do Controlador (cliente).
          </p>

          <h3>12. Responsabilidade dos Usuários</h3>
          <p>
            Sem prejuízo às demais obrigações previstas nesta Política ou no
            Termo de Uso, para a adequada utilização do produto Emoflow, ao
            utilizar nosso produto é preciso que você se comprometa a:
          </p>
          <ul>
            <li>
              Ser o único responsável pela guarda e confidencialidade do login e
              senha, não podendo fornecê-los a terceiros;
            </li>
            <li>
              Fornecer informações de cartão de crédito, senhas de qualquer
              natureza utilizando os recursos existentes em nossa aplicação.
            </li>
            <li>
              Nos comunicar sobre toda e qualquer suspeita ou constatação de
              violação aos Termos de Uso ou à Política de Privacidade, inclusive
              acessos não autorizados à sua conta, movimentações suspeitas,
              boletos que você desconhece etc.
            </li>
            <li>
              Nos consultar, via site ou canais de contato, sempre que receber
              informações ou comunicados sobre promoções, campanhas e pesquisas
              recebidas por e-mail, para verificação de sua veracidade;
            </li>
            <li>
              Prestar informações verídicas, honestas e completas,
              responsabilizando-se por toda e qualquer informação incorreta ou
              falsa;
            </li>
            <li>
              Responsabilizar-se por todos os dados de terceiros (ex. dados
              pessoais de seus colaboradores);
            </li>
            <li>
              Nos comunicar sobre toda e qualquer alteração de seus dados, de
              modo que para todos os fins legais os últimos dados fornecidos
              serão considerados como corretos, autênticos e suficientes para o
              cumprimento desta Política e do Termo de Uso e Condições Gerais;
            </li>
          </ul>
          <p>
            Por questões de segurança, nos reservamos no direito de suspender ou
            cancelar a conta do Usuário em caso de suspeita ou descumprimento
            dos Termos e Condições Gerais ou da Política de Privacidade, sem
            prejuízo de demais medidas judiciais e administrativas.
          </p>

          <h3>13. Direitos dos Usuários (Titulares de Dados)</h3>
          <p>
            Os Usuários do Emoflow possuem diversos direitos assegurados pela
            Lei Geral de Proteção de Dados (LGPD), que podem ser exercidos a
            qualquer momento mediante solicitação.
          </p>
          <p>
            O Emoflow poderá realizar o tratamento de dados pessoais:
          </p>
          <ol>
            <li>
              para cumprimento de obrigação legal ou regulatória, durante o
              prazo estabelecido pela legislação aplicável;
            </li>
            <li>
              para execução de contrato, enquanto for necessário ao atendimento
              das finalidades contratuais; e com base em legítimo interesse,
              sempre após análise de impacto e dentro dos limites da finalidade
              que o justifica, até que tal interesse deixe de existir.
            </li>
          </ol>
          <p>Dentro desses parâmetros, os Usuários podem solicitar:</p>
          <ol>
            <li>
              Exclusão de seus dados pessoais, salvo quando houver impedimento
              legal ou necessidade de retenção conforme a LGPD.
            </li>
            <li>
              Alteração, atualização ou correção de dados incompletos, inexatos
              ou desatualizados.
            </li>
            <li>
              Informações claras sobre o uso e o compartilhamento de seus dados
              pessoais.
            </li>
            <li>
              Restrição do tratamento, na medida do possível, incluindo
              preferência sobre o recebimento de comunicações, campanhas e uso
              de Cookies.
            </li>
            <li>
              Acesso e obtenção de cópia de seus dados pessoais em formato
              estruturado e interoperável, quando tecnicamente viável.
            </li>
            <li>
              Revogação do consentimento, quando esta for a base legal utilizada
              para o tratamento, sendo informado sobre eventuais impactos
              decorrentes da revogação.
            </li>
            <li>
              Interrupção do uso de dados para fins de marketing, mediante
              solicitação enviada para:{" "}
              <a href="mailto:suporte@emoflow.com">suporte@emoflow.com</a>
            </li>
          </ol>
          <p>
            O Emoflow empregará seus melhores esforços para atender às
            solicitações dos Usuários dentro de prazo razoável. No entanto,
            alguns pedidos podem não ser integralmente atendidos, seja por
            exigência legal, segurança da informação, direitos de terceiros ou
            outras previsões da LGPD. Nesses casos, o Emoflow prestará todos os
            esclarecimentos e justificativas necessárias.
          </p>

          <h3>
            14. Encarregado (DPO) - Segurança e proteção dos dados pessoais
          </h3>
          <p>
            <strong>Nome:</strong> Expedito Junio da Silva Sousa
            <br />
            <strong>E-mail:</strong>{" "}
            <a href="mailto:dpo@emoflow.com">dpo@emoflow.com</a>
          </p>
          <p>
            As principais atribuições do Encarregado envolvem, sem prejuízo de
            demais atividades estabelecidas em políticas e procedimentos
            específicos que compõem o Programa de Privacidade:
          </p>
          <ul>
            <li>a) Gestão do Programa de Privacidade;</li>
            <li>
              b) Desenvolvimento, manutenção, e propositura de revisão de
              procedimentos e políticas de privacidade da Organização, inclusive
              desta Política;
            </li>
            <li>
              c) Fiscalização do cumprimento de procedimentos e políticas do
              Programa de Privacidade;
            </li>
            <li>
              d) Monitoramento do nível de conformidade da Organização, por meio
              de análises de diagnóstico recorrentes, com a definição de planos
              de ação para melhorar o treinamento e a clareza dos documentos que
              integram o Programa de Privacidade;
            </li>
            <li>
              e) Atuação como ponto de contato para a ANPD e os Titulares;
            </li>
            <li>f) Recebimento de requisições dos Titulares, e</li>
            <li>
              g) Preparo dos Relatórios de Impacto à Proteção de Dados Pessoais,
              com apuração e revisão dos riscos das atividades.
            </li>
          </ul>
          <p>
            Por fim, o Encarregado deve auxiliar os colaboradores do Emoflow e
            esclarecer-lhes qualquer dúvida sobre o Programa de Privacidade e a
            forma correta de Tratamento de Dados Pessoais a ser adotada durante
            a execução de suas atividades.
          </p>

          <h3>15. Atualizações da política</h3>
          <p>
            A política pode ser atualizada e o usuário será informado. Versão
            1.0 – 07/01/2026.
          </p>

          <h3>16. Foro</h3>
          <p>Fica eleito o Foro da Comarca de São Luís – Maranhão.</p>
        </div>
      </div>
    </div>
  );
}
