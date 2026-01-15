import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export default function TermsOfUsePage() {
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
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10 text-secondary">
            <FileText className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 md:text-4xl">
            Termos de Uso – Emoflow
          </h1>
          <p className="mt-4 text-zinc-600">
            Última atualização: 07 de janeiro de 2026
          </p>
        </div>

        <div className="prose prose-zinc prose-yellow max-w-none text-zinc-700">
          <h3>1. Apresentação e aceite</h3>
          <p>
            Estes Termos regulam a relação entre você (usuário pessoa física ou
            jurídica – “LICENCIADO”) e Emoflow [Razão Social], CNPJ [●], com
            sede em [Endereço completo] (“LICENCIANTE”), para uso do software e
            dos serviços do Emoflow (“SOFTWARE”), disponibilizados por meio do
            site emoflow.com e aplicativos oficiais.
          </p>
          <p>
            Ao acessar ou utilizar o SOFTWARE (mesmo em testes), você manifesta
            seu aceite integral a este instrumento, incluindo o consentimento ao
            acesso, coleta, uso, armazenamento e tratamento de dados pessoais
            necessários à prestação dos serviços, conforme nossa Política de
            Privacidade.
          </p>
          <div className="my-4 rounded-lg bg-yellow-50 p-4 border-l-4 border-yellow-400 text-yellow-800">
            <strong>Resumo prático:</strong> ao usar o Emoflow, você concorda
            com estes Termos e com a Política de Privacidade. Sem concordar,
            você deve interromper o uso.
          </div>

          <h3>2. Propriedade intelectual</h3>
          <p>
            O LICENCIADO não adquire qualquer direito de propriedade intelectual
            sobre o SOFTWARE, suas marcas, códigos, designs, conteúdos,
            documentação, manuais, imagens e materiais correlatos, além dos
            direitos expressamente previstos neste Termo.
          </p>
          <p>
            É vedado copiar, reproduzir, adaptar, traduzir, exibir, publicar,
            distribuir ou criar obras derivadas sem autorização da LICENCIANTE.
          </p>
          <div className="my-4 rounded-lg bg-yellow-50 p-4 border-l-4 border-yellow-400 text-yellow-800">
            <strong>Resumo prático:</strong> o Emoflow é de propriedade da
            LICENCIANTE. Você recebe licença de uso, não compra o software.
          </div>

          <h3>3. Declarações do LICENCIADO</h3>
          <p>O LICENCIADO declara que:</p>
          <ul>
            <li>
              Leu, compreendeu e aceitou estes Termos e a Política de
              Privacidade;
            </li>
            <li>
              Está ciente de que o aceite, alterações e eventuais rescisões são
              registrados (com data e hora) e podem ser utilizados como prova;
            </li>
            <li>
              Cumprirá a legislação aplicável (tributária, fiscal, trabalhista,
              previdenciária e de proteção de dados), reconhecendo que o
              SOFTWARE é condição de meio, dependendo do correto lançamento de
              informações e parametrizações;
            </li>
            <li>
              Pode conectar Aplicativos de Terceiros via APIs, compartilhando
              informações conforme suas configurações; o uso por terceiros é
              regido pelas políticas dos respectivos provedores;
            </li>
            <li>
              Autoriza o uso de Processadores Terceirizados (infraestrutura
              técnica, e-mail, atendimento, autenticação, pagamentos, nuvem,
              prevenção a fraudes etc.), sob contratos que exigem segurança e
              uso limitado às finalidades instruídas pela LICENCIANTE;
            </li>
            <li>
              Entende que alguns Processadores podem operar fora do Brasil, com
              garantias contratuais adequadas de proteção;
            </li>
            <li>
              Pode revogar autorizações dependentes de consentimento, ciente de
              que isso pode limitar recursos que exigem tais dados. Pedidos:{" "}
              <a href="mailto:suporte@emoflow.com">suporte@emoflow.com</a>.
            </li>
          </ul>
          <div className="my-4 rounded-lg bg-yellow-50 p-4 border-l-4 border-yellow-400 text-yellow-800">
            <strong>Resumo prático:</strong> você é responsável por inserir
            dados corretos; integrações e terceirizados são usados para entregar
            o serviço com segurança; você pode revogar consentimentos, mas
            alguns recursos podem parar de funcionar.
          </div>

          <h3>4. Licença de uso</h3>
          <p>
            A LICENCIANTE concede ao LICENCIADO uma licença revogável, não
            exclusiva e intransferível para uso do SOFTWARE, limitada às
            finalidades contratadas e ao processamento das suas informações. O
            código-fonte não é disponibilizado.
          </p>
          <div className="my-4 rounded-lg bg-yellow-50 p-4 border-l-4 border-yellow-400 text-yellow-800">
            <strong>Resumo prático:</strong> licença de uso, sem acesso ao
            código e sem direito de transferir/ceder a terceiros.
          </div>

          <h3>5. Restrições</h3>
          <p>É proibido ao LICENCIADO:</p>
          <ul>
            <li>
              Copiar, ceder, sublicenciar, vender, locar, doar, alienar,
              transferir, total ou parcialmente, o SOFTWARE, seus módulos,
              manuais ou informações correlatas;
            </li>
            <li>Retirar/alterar avisos de direitos autorais;</li>
            <li>
              Realizar engenharia reversa, descompilação ou desmontagem;
            </li>
            <li>Burlar limitações técnicas ou mecanismos de segurança.</li>
          </ul>
          <div className="my-4 rounded-lg bg-yellow-50 p-4 border-l-4 border-yellow-400 text-yellow-800">
            <strong>Resumo prático:</strong> nada de copiar, revender, alterar
            marcações ou tentar “quebrar” o Emoflow.
          </div>

          <h3>6. Prazo</h3>
          <p>
            Este Termo vigora desde o aceite e pelo prazo do plano contratado,
            sendo renovado automaticamente por períodos iguais, salvo
            manifestação em contrário do LICENCIADO. A rescisão segue as regras
            abaixo.
          </p>
          <div className="my-4 rounded-lg bg-yellow-50 p-4 border-l-4 border-yellow-400 text-yellow-800">
            <strong>Resumo prático:</strong> renova automaticamente; avise se
            não quiser renovar.
          </div>

          <h3>7. Remuneração e pagamento</h3>
          <p>
            O LICENCIADO pagará o valor do plano selecionado, conforme
            periodicidade escolhida. Alterações de plano:
          </p>
          <ul>
            <li>
              <strong>Upgrade:</strong> cobrança ajustada imediatamente;
              créditos gerados serão usados em renovações futuras (sem
              devolução).
            </li>
            <li>
              <strong>Downgrade:</strong> passa a valer a partir da próxima
              renovação; créditos seguem a mesma regra.
            </li>
            <li>
              <strong>Inadimplência:</strong> não rescinde automaticamente, mas
              suspende o acesso até regularização (identificação em até 2 dias
              úteis após pagamento). Persistindo a pendência por 10 dias após o
              vencimento, a LICENCIANTE pode rescindir este Termo.
            </li>
            <li>
              Após 90 dias do vencimento não pago, a LICENCIANTE pode apagar
              definitivamente todas as informações do LICENCIADO.
            </li>
          </ul>
          <p>
            Reajustes: valores podem ser atualizados anualmente ou por tabela
            vigente; aviso com mínimo de 7 dias de antecedência da renovação em
            que incidir o reajuste. Descontos promocionais têm prazo definido e
            podem não ser renovados.
          </p>
          <div className="my-4 rounded-lg bg-yellow-50 p-4 border-l-4 border-yellow-400 text-yellow-800">
            <strong>Resumo prático:</strong> atrasos suspendem acesso; 10 dias
            podem levar à rescisão; após 90 dias, exclusão definitiva; reajustes
            com aviso prévio.
          </div>

          <h3>8. Restituição e retenção de informações</h3>
          <p>
            Com o acesso suspenso, a LICENCIANTE manterá as informações por 90
            dias, disponibilizando exportação em .csv. Após esse prazo, exclui
            definitivamente os dados do LICENCIADO.
          </p>
          <p>
            Logs de acesso (data, hora e IP) podem ser mantidos por no mínimo 6
            meses por força legal, podendo ser estendidos por ordem judicial.
          </p>
          <div className="my-4 rounded-lg bg-yellow-50 p-4 border-l-4 border-yellow-400 text-yellow-800">
            <strong>Resumo prático:</strong> você tem 90 dias para exportar;
            depois, exclusão definitiva. Logs de acesso ficam guardados por
            período mínimo legal.
          </div>

          <h3>9. Obrigações do LICENCIADO</h3>
          <ul>
            <li>
              manter equipe apta a operar o SOFTWARE e fornecer informações para
              diagnóstico de problemas;
            </li>
            <li>
              manter, às suas expensas, os recursos de telecomunicação e TI
              necessários;
            </li>
            <li>
              responder pelas informações inseridas, permissões, senhas e modo
              de uso; realizar backup quando necessário;
            </li>
            <li>
              garantir base legal e regularidade dos dados pessoais inseridos;
            </li>
            <li>
              não usar o SOFTWARE de forma ilícita, violando direitos ou
              causando danos;
            </li>
            <li>não transmitir malwares (vírus, worms, trojans etc.);</li>
            <li>informar alterações relevantes de dados;</li>
            <li>
              proteger login e senha e notificar a LICENCIANTE em caso de
              suspeita de comprometimento.
            </li>
          </ul>
          <div className="my-4 rounded-lg bg-yellow-50 p-4 border-l-4 border-yellow-400 text-yellow-800">
            <strong>Resumo prático:</strong> você é responsável pelo conteúdo
            que insere e pela segurança do seu acesso.
          </div>

          <h3>10. Obrigações da LICENCIANTE</h3>
          <ul>
            <li>
              envidar esforços para correção de falhas de programação (bugs) e
              disponibilizar melhorias;
            </li>
            <li>
              fornecer acesso ao SOFTWARE após o aceite e conforme plano
              contratado;
            </li>
            <li>
              suspender acesso em caso de violação destes Termos ou da lei;
            </li>
            <li>evoluir o produto conforme plano de produtos da LICENCIANTE;</li>
            <li>
              oferecer suporte gratuito via e-mail (segunda a sexta, 08:30–12:00
              e 13:30–18:00 – horário de Brasília):{" "}
              <a href="mailto:suporte@emoflow.com">suporte@emoflow.com</a> e
              página de ajuda (24h×7d); suporte premium é opcional e pago;
            </li>
            <li>
              manter confidencialidade e segurança sobre informações de conta e
              dados pessoais, nos termos da legislação aplicável.
            </li>
          </ul>
          <div className="my-4 rounded-lg bg-yellow-50 p-4 border-l-4 border-yellow-400 text-yellow-800">
            <strong>Resumo prático:</strong> corrigimos bugs, evoluímos o
            produto, oferecemos suporte e protegemos seus dados conforme a lei.
          </div>

          <h3>11. Nível de Serviço (SLA)</h3>
          <p>
            A LICENCIANTE buscará disponibilidade mínima de 99,7% em cada Ano de
            Serviço (365 dias anteriores à reivindicação). Descumprido o SLA por
            culpa exclusiva da LICENCIANTE, o LICENCIADO terá direito a crédito
            de 1 mês (mensal), 1/3 (trimestral) ou 1/12 (anual).
          </p>
          <p>
            Exclusões do SLA: falta de energia até 2h ou entre 00:00-06:00,
            força maior, Internet do LICENCIADO, atos/omissões do LICENCIADO ou
            terceiros, problemas em Aplicativos de Terceiros,
            equipamentos/softwares do LICENCIADO e práticas de gerenciamento de
            rede.
          </p>
          <div className="my-4 rounded-lg bg-yellow-50 p-4 border-l-4 border-yellow-400 text-yellow-800">
            <strong>Resumo prático:</strong> se a indisponibilidade for nossa e
            superar o limite anual, há crédito. Terceiros e fatores externos não
            contam.
          </div>

          <h3>12. Isenções de responsabilidade</h3>
          <p>A LICENCIANTE não se responsabiliza por:</p>
          <ul>
            <li>
              falhas causadas por operação inadequada ou por pessoas não
              autorizadas;
            </li>
            <li>
              decisões administrativas/comerciais tomadas com base nas
              informações do SOFTWARE;
            </li>
            <li>caso fortuito ou força maior;</li>
            <li>atos de terceiros que afetem o serviço;</li>
            <li>conteúdo gerado pelo LICENCIADO;</li>
            <li>
              indisponibilidade ou lentidão de Aplicativos de Terceiros
              conectados por API;
            </li>
            <li>
              infrações legais do LICENCIADO (fiscal, tributária, trabalhista,
              previdenciária, criminal etc.).
            </li>
          </ul>
          <p>
            Medidas de segurança compatíveis com o mercado são adotadas, mas
            nenhum sistema é absolutamente imune a ataques. O LICENCIADO
            reconhece que exclusões/obtenções/uso/divulgação não autorizada
            decorrentes de ataques inevitáveis podem ocorrer, sem
            responsabilização da LICENCIANTE além do que a lei exigir.
          </p>
          <div className="my-4 rounded-lg bg-yellow-50 p-4 border-l-4 border-yellow-400 text-yellow-800">
            <strong>Resumo prático:</strong> não respondemos por mau uso,
            conteúdo do usuário, terceiros e força maior. Aplicamos segurança
            robusta, mas ataques podem ocorrer.
          </div>

          <h3>13. Retomada e rescisão</h3>
          <p>
            A LICENCIANTE pode cancelar imediatamente o acesso em caso de uso em
            desacordo com estes Termos ou com a lei, tentativa de fraude,
            violação de segurança, ou inadimplência conforme a Cláusula 7.
          </p>
          <p>
            O LICENCIADO pode rescindir a qualquer tempo, observando a forma de
            cancelamento prevista no plano e eventuais obrigações pendentes.
          </p>
          <div className="my-4 rounded-lg bg-yellow-50 p-4 border-l-4 border-yellow-400 text-yellow-800">
            <strong>Resumo prático:</strong> uso indevido ou inadimplência podem
            levar a cancelamento imediato. Você pode cancelar, respeitando
            condições do plano.
          </div>

          <h3>14. Privacidade e DPO</h3>
          <p>
            <strong>Nome:</strong> Expedito Junio da Silva Sousa
            <br />
            <strong>E-mail:</strong>{" "}
            <a href="mailto:dpo@emoflow.com">dpo@emoflow.com</a>
          </p>
          <p>
            O tratamento de dados pessoais segue a Política de Privacidade do
            Emoflow.
          </p>
          <div className="my-4 rounded-lg bg-yellow-50 p-4 border-l-4 border-yellow-400 text-yellow-800">
            <strong>Resumo prático:</strong> seus direitos de privacidade podem
            ser exercidos por esses canais.
          </div>

          <h3>15. Alterações destes Termos</h3>
          <p>
            Podemos atualizar estes Termos para refletir mudanças legais,
            técnicas ou de negócio. Alterações relevantes serão comunicadas com
            antecedência razoável nos canais oficiais. O uso contínuo após a
            atualização implica aceite.
          </p>

          <h3>16. Lei aplicável e foro</h3>
          <p>
            Estes Termos são regidos pelas leis da República Federativa do
            Brasil. Fica eleito o Foro da Comarca de São Luís – MA, com renúncia
            a qualquer outro, salvo previsão específica em contrato com clientes
            corporativos.
          </p>

          <h3>17. Contato</h3>
          <p>
            Dúvidas ou solicitações:{" "}
            <a href="mailto:suporte@emoflow.com">suporte@emoflow.com</a>
          </p>

          <h3>18. Do Anonimato</h3>
          <p>
            Dentro da plataforma Emoflow, os colaboradores do LICENCIADO podem
            registrar opiniões, sentimentos e sugestões de forma anônima,
            conforme a Política de Anonimato disponibilizada e amplamente
            divulgada pela LICENCIANTE em seu site oficial.
          </p>
          <p>
            O Emoflow não revela a identidade de usuários que optem pelo
            anonimato, mesmo que solicitado pelo LICENCIADO, salvo nos casos
            expressamente previstos em lei ou em situações de uso indevido, tais
            como práticas de assédio, ameaças, discriminação, discurso de ódio
            ou qualquer conduta que viole a legislação ou os Termos de Uso.
          </p>
          <p>
            O LICENCIADO declara-se ciente e concorda integralmente com todas as
            condições previstas na Política de Anonimato e reconhece que não
            poderá rescindir o contrato com base na recusa da LICENCIANTE em
            quebrar o anonimato quando tal quebra contrariar a política adotada
            ou a legislação aplicável.
          </p>
          <div className="my-4 rounded-lg bg-yellow-50 p-4 border-l-4 border-yellow-400 text-yellow-800">
            <strong>Basicamente:</strong> A plataforma Emoflow protege o
            anonimato dos colaboradores. A identidade só será revelada se houver
            abuso, ameaças ou uso ilícito da plataforma. Fora isso, o anonimato
            é garantido, mesmo que solicitado pela empresa.
          </div>

          <h3>19. Das Customizações</h3>
          <p>
            O Emoflow é uma plataforma única, utilizada igualmente por todos os
            LICENCIADOS, não havendo versões exclusivas ou customizadas
            individualmente.
          </p>
          <p>
            Caso o LICENCIADO deseje novas funcionalidades, módulos ou melhorias
            específicas, deverá formalizar a solicitação pelo e-mail
            suporte@emoflow.com. A LICENCIANTE analisará a viabilidade técnica e
            comercial do pedido.
          </p>
          <p>
            Sendo possível e aprovado pela LICENCIANTE, será elaborado um
            projeto técnico contendo previsão de horas, prazo de desenvolvimento
            e orçamento, que deverá ser aprovado e pago pelo LICENCIADO para
            início da implementação.
          </p>
          <p>
            Toda e qualquer funcionalidade desenvolvida, mesmo mediante
            pagamento pelo LICENCIADO, passará a integrar definitivamente a
            plataforma Emoflow, sendo considerada propriedade exclusiva da
            LICENCIANTE, sem gerar ao LICENCIADO qualquer direito de propriedade
            intelectual, royalties ou restrição de uso por outros clientes.
          </p>
          <div className="my-4 rounded-lg bg-yellow-50 p-4 border-l-4 border-yellow-400 text-yellow-800">
            <strong>Basicamente:</strong> Se você precisar de uma customização,
            analisaremos a viabilidade e enviaremos um orçamento. Se aprovada e
            paga, será desenvolvida. Mas tudo que for criado passa a fazer parte
            do Emoflow como um todo — não é exclusivo e não gera direitos ao
            cliente que solicitou.
          </div>

          <h3>20. Das Disposições Legais</h3>
          <ul>
            <li>
              O LICENCIADO não poderá utilizar o SOFTWARE para prestar serviços
              a terceiros sem autorização prévia e expressa da LICENCIANTE.
            </li>
            <li>
              A licença de uso é vinculada ao CNPJ matriz e ao número de
              colaboradores contratados.
            </li>
            <li>
              Caso o LICENCIADO desenvolva qualquer módulo, funcionalidade,
              interface ou solução que caracterize cópia total ou parcial de
              estruturas, dados, funcionalidades, organização lógica, dicionário
              de dados ou qualquer componente do Emoflow, tal desenvolvimento
              será considerado parte integrante do SOFTWARE, passando
              automaticamente à propriedade da LICENCIANTE, sem gerar
              compensações financeiras ao LICENCIADO.
            </li>
            <li>
              Este Termo obriga as partes e seus sucessores. A licença concedida
              ao LICENCIADO é pessoal e intransferível, sendo vedada a cessão
              dos direitos e obrigações aqui previstos. A LICENCIANTE,
              entretanto, poderá ceder seus direitos e obrigações a terceiros a
              qualquer tempo.
            </li>
            <li>
              A tolerância do descumprimento de qualquer cláusula não implica
              renúncia de direitos, podendo a parte lesada exigir a execução a
              qualquer momento.
            </li>
            <li>
              Não constitui causa de rescisão o descumprimento decorrente de
              caso fortuito ou força maior, nos termos do art. 393 do Código
              Civil.
            </li>
            <li>
              Se qualquer disposição deste Termo for considerada inválida, as
              demais permanecerão plenamente vigentes.
            </li>
            <li>
              O LICENCIADO autoriza a LICENCIANTE a divulgar publicamente sua
              marca e seu nome como cliente, podendo utilizar depoimentos
              escritos ou verbais para fins comerciais (sites, catálogos,
              campanhas, apresentações etc.).
            </li>
            <li>
              O LICENCIADO autoriza ainda a utilização, pela LICENCIANTE, de
              dados técnicos e operacionais gerados na utilização do SOFTWARE
              para fins de estatísticas, estudos, melhorias e evolução do
              Emoflow.
            </li>
            <li>
              A LICENCIANTE poderá, a qualquer tempo e a seu exclusivo critério:
              <ul>
                <li>a) suspender, alterar ou encerrar total ou parcialmente o acesso ao SOFTWARE em caso de violação destes Termos;</li>
                <li>b) excluir informações inseridas em desacordo com este Termo;</li>
                <li>c) modificar, acrescentar ou remover conteúdo da plataforma;</li>
                <li>d) alterar estes Termos mediante comunicação ao LICENCIADO.</li>
              </ul>
            </li>
            <li>
              A LICENCIANTE poderá suspender, modificar ou encerrar
              definitivamente as atividades do SOFTWARE, mediante aviso prévio
              de 15 (quinze) dias, garantindo meios de exportação dos dados,
              salvo em caso de força maior.
            </li>
            <li>
              A LICENCIANTE poderá definir preços para funcionalidades
              inicialmente gratuitas, sendo o uso posterior à notificação
              considerado aceite automático pelo LICENCIADO.
            </li>
            <li>
              Somente o administrador da conta designado pelo LICENCIADO poderá
              solicitar exclusão permanente dos dados armazenados. O LICENCIADO
              declara ciência de que dados excluídos não podem ser recuperados,
              sendo a LICENCIANTE isenta de responsabilidade por eventuais
              perdas.
            </li>
          </ul>
          <div className="my-4 rounded-lg bg-yellow-50 p-4 border-l-4 border-yellow-400 text-yellow-800">
            <strong>Basicamente:</strong> Você não pode revender o Emoflow ou
            usá-lo para prestar serviços a terceiros sem autorização. Melhorias
            feitas por você que sejam cópias do sistema passam a fazer parte do
            Emoflow. Podemos divulgar que você é nosso cliente. Podemos alterar
            conteúdos, funcionalidades e este documento. Quem decide sobre
            exclusão de dados é sempre o administrador da conta — e depois de
            apagados, não há volta.
          </div>
        </div>
      </div>
    </div>
  );
}
