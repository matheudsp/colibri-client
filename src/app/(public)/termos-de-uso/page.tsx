import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso - Locaterra",
  description:
    "Termos e condições de uso da plataforma Locaterra para locadores e locatários.",
  openGraph: {
    title: "Termos de Uso - Locaterra",
    description:
      "Termos e condições de uso da plataforma Locaterra para locadores e locatários.",
    url: "https://www.locaterra.com.br/termos-de-uso",
    siteName: "Locaterra",
    locale: "pt_BR",
    type: "website",
  },
};

export default function TermosDeUsoPage() {
  return (
    <main className="max-w-3xl mx-auto py-32 px-4 prose prose-zinc space-y-5">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-start">
          Termos de Uso e Condições Gerais da Plataforma Locaterra
        </h1>

        <p className="text-sm text-zinc-600">
          Última atualização: 6 de outubro de 2025
        </p>
      </div>

      <nav className="not-prose bg-zinc-100 p-4 rounded-md border border-border mb-6">
        <h2 className="text-lg font-semibold text-center mb-4">Índice</h2>
        <ul className="list-disc pl-5 mt-2 space-y-2 text-sm">
          <li className="hover:text-secondary-hover underline">
            <a href="#aceitacao">1. Aceitação dos Termos</a>
          </li>
          <li className="hover:text-secondary-hover underline">
            <a href="#definicoes">2. Definições</a>
          </li>
          <li className="hover:text-secondary-hover underline">
            <a href="#objeto">3. Objeto e Papel da Locaterra</a>
          </li>
          <li className="hover:text-secondary-hover underline">
            <a href="#cadastro">4. Cadastro, Elegibilidade e Verificação</a>
          </li>
          <li className="hover:text-secondary-hover underline">
            <a href="#pagamentos">5. Estrutura Financeira e Pagamentos</a>
          </li>
          <li className="hover:text-secondary-hover underline">
            <a href="#lgpd">6. Proteção de Dados Pessoais (LGPD)</a>
          </li>
          <li className="hover:text-secondary-hover underline">
            <a href="#responsabilidades">
              7. Responsabilidades e Conduta dos Usuários
            </a>
          </li>
          <li className="hover:text-secondary-hover underline">
            <a href="#limitacao">
              8. Limitação de Responsabilidade e Marco Civil da Internet
            </a>
          </li>
          <li className="hover:text-secondary-hover underline">
            <a href="#propriedade">9. Propriedade Intelectual</a>
          </li>
          <li className="hover:text-secondary-hover underline">
            <a href="#disputas">
              10. Resolução de Disputas, Foro e Legislação Aplicável
            </a>
          </li>
          <li className="hover:text-secondary-hover underline">
            <a href="#disposicoes">11. Disposições Gerais</a>
          </li>
          <li className="hover:text-secondary-hover underline">
            <a href="#contato">12. Contato</a>
          </li>
        </ul>
      </nav>

      <section id="aceitacao">
        <h2 className="text-lg font-semibold text-start mb-4">
          1. Aceitação dos Termos
        </h2>
        <p className="text-justify break-words">
          Bem-vindo à Locaterra! Estes Termos de Uso (&quot;Termos&quot;) regem
          o seu acesso e uso da plataforma, site, serviços e aplicações
          (&quot;Plataforma&quot;) disponibilizados pela Locaterra Tecnologia
          Ltda. A leitura e compreensão integral deste documento são
          indispensáveis para a utilização dos nossos serviços.
        </p>
        <p className="text-justify break-words">
          Ao selecionar a caixa de verificação e clicar no botão &quot;Aceito e
          concordo com os Termos de Uso&quot;, você declara ter lido, entendido
          e concordado com todas as cláusulas aqui dispostas, celebrando um
          contrato juridicamente válido e vinculante com a Locaterra. Este ato
          constitui seu aceite digital, uma manifestação de concordância
          eletrônica com força legal, nos termos da legislação brasileira,
          incluindo a Medida Provisória nº 2.200-2/2001.
        </p>
        <p className="text-justify break-words">
          Caso não concorde com qualquer disposição destes Termos, você não
          deverá utilizar a Plataforma.
        </p>
      </section>

      <section id="definicoes">
        <h2 className="text-lg font-semibold text-start mb-4">2. Definições</h2>
        <p className="text-justify break-words">
          Para os fins destes Termos, as seguintes palavras e expressões terão
          os significados abaixo definidos:
        </p>
        <ul className="list-disc pl-8 space-y-2 my-5">
          <li>
            <strong>Plataforma:</strong> Refere-se ao software, site e
            aplicações de propriedade da Locaterra, que oferece um espaço
            digital para a intermediação de locações imobiliárias.
          </li>
          <li>
            <strong>Usuário:</strong> Toda pessoa física ou jurídica que acessa
            ou utiliza a Plataforma, podendo ser classificada como Locador,
            Locatário ou Administrador.
          </li>
          <li>
            <strong>Locador:</strong> Usuário proprietário ou possuidor legal de
            um imóvel que o cadastra na Plataforma com o objetivo de alugá-lo a
            terceiros.
          </li>
          <li>
            <strong>Locatário (Inquilino):</strong> Usuário que busca e utiliza
            a Plataforma para alugar um imóvel listado por um Locador.
          </li>
          <li>
            <strong>Administrador:</strong> Perfil de usuário com permissões
            para supervisionar as operações gerais da Plataforma.
          </li>
          <li>
            <strong>Conteúdo de Usuário:</strong> Todas as informações, textos,
            fotos, vídeos e outros materiais publicados, enviados ou
            compartilhados pelos Usuários na Plataforma.
          </li>
        </ul>
      </section>

      <section id="objeto">
        <h2 className="text-lg font-semibold text-start mb-4">
          3. Objeto e Papel da Locaterra
        </h2>
        <p className="text-justify break-words">
          A Locaterra é uma <strong>provedora de aplicação de internet</strong>,
          nos termos da Lei nº 12.965/2014 (Marco Civil da Internet), que
          oferece uma infraestrutura tecnológica para conectar Locadores e
          Locatários, facilitando a negociação, celebração e gestão de contratos
          de locação de imóveis.
        </p>
        <p className="text-justify break-words">
          <strong>
            A Locaterra NÃO é uma imobiliária, prestadora de serviços de
            consultoria imobiliária, parte no contrato de locação, proprietária
            ou possuidora dos imóveis listados.
          </strong>{" "}
          A relação contratual de locação é estabelecida exclusivamente entre o
          Locador e o Locatário, que são os únicos responsáveis pelo cumprimento
          das obrigações decorrentes, regidas pela Lei nº 8.245/91 (Lei do
          Inquilinato) e demais legislações aplicáveis.
        </p>
        <p className="text-justify break-words">
          A atuação da Locaterra limita-se a:
        </p>
        <ul className="list-disc pl-8 space-y-2 my-5">
          <li>
            Disponibilizar um espaço online para que Locadores anunciem seus
            imóveis.
          </li>
          <li>
            Fornecer ferramentas para facilitar a comunicação e negociação entre
            os Usuários.
          </li>
          <li>
            Integrar com gateways de pagamento para processar as transações
            financeiras relativas aos aluguéis.
          </li>
          <li>
            Integrar com serviços de terceiros para assinatura eletrônica de
            documentos.
          </li>
        </ul>
      </section>

      <section id="cadastro">
        <h2 className="text-lg font-semibold text-start mb-4">
          4. Cadastro, Elegibilidade e Verificação
        </h2>
        <p className="text-justify break-words">
          Para utilizar os serviços da Plataforma, o Usuário deve ter no mínimo
          18 (dezoito) anos de idade e possuir plena capacidade civil.
        </p>
        <p className="text-justify break-words">
          O Usuário é o único responsável pela veracidade, exatidão e
          atualização das informações fornecidas durante o cadastro, isentando a
          Locaterra de qualquer responsabilidade por dados incorretos.
        </p>
        <p className="text-justify break-words">
          A Locaterra se reserva o direito de utilizar todos os meios válidos e
          possíveis para identificar seus Usuários, bem como de solicitar dados
          adicionais e documentos que estime serem pertinentes a fim de conferir
          os dados pessoais informados. Este tratamento de dados será realizado
          em conformidade com a nossa Política de Privacidade e a Lei Geral de
          Proteção de Dados (LGPD).
        </p>
      </section>

      <section id="pagamentos">
        <h2 className="text-lg font-semibold text-start mb-4">
          5. Estrutura Financeira e Pagamentos
        </h2>
        <p className="text-justify break-words">
          <strong>Gateway de Pagamento e Split:</strong> Os pagamentos de
          aluguel e demais encargos são processados por meio de um gateway de
          pagamento terceirizado e regulamentado. A Locaterra utiliza um sistema
          de <strong>split de pagamento</strong>, no qual o valor pago pelo
          Locatário é automaticamente dividido no momento da transação. A
          parcela correspondente ao aluguel é direcionada diretamente à conta do
          Locador, e a taxa de serviço da Locaterra é direcionada à conta da
          Plataforma.
        </p>
        <p className="text-justify break-words">
          <strong>Isenção de Responsabilidade Financeira:</strong> Em razão do
          modelo de split de pagamento, a Locaterra{" "}
          <strong>não retém nem gerencia fundos de terceiros</strong>, atuando
          apenas como facilitadora tecnológica da transação. A Locaterra não se
          responsabiliza por quaisquer obrigações tributárias decorrentes das
          transações realizadas entre Locador e Locatário.
        </p>
        <p className="text-justify break-words">
          <strong>Taxas de Serviço:</strong> Pelos serviços de intermediação, a
          Locaterra cobrará do Locador uma taxa de serviço
          (&quot;Comissão&quot;), cujo percentual ou valor será claramente
          informado no momento da criação do contrato. A Comissão será
          automaticamente deduzida do valor a ser repassado ao Locador via split
          de pagamento.
        </p>
        <p className="text-justify break-words">
          <strong>Inadimplência e Multas:</strong> Em caso de atraso no
          pagamento pelo Locatário, poderão incidir multas e juros de mora,
          conforme estipulado no contrato de locação entre as partes e nos
          limites da legislação aplicável. A Locaterra poderá fornecer
          ferramentas para a cobrança automatizada, mas a responsabilidade por
          medidas legais, como a ação de despejo, é exclusiva do Locador.
        </p>
      </section>

      <section id="lgpd">
        <h2 className="text-lg font-semibold text-start mb-4">
          6. Proteção de Dados Pessoais (LGPD)
        </h2>
        <p className="text-justify break-words">
          A Locaterra, na qualidade de <strong>Controladora</strong> dos dados
          pessoais coletados em sua Plataforma, compromete-se a tratar tais
          informações em estrita conformidade com a Lei nº 13.709/2018 (Lei
          Geral de Proteção de Dados Pessoais - LGPD) e outras regulamentações
          aplicáveis.
        </p>
        <p className="text-justify break-words">
          Todas as informações sobre como coletamos, usamos, armazenamos e
          protegemos seus dados pessoais estão detalhadas em nossa{" "}
          <strong>Política de Privacidade</strong>, que é um documento anexo e
          indissociável destes Termos. O aceite destes Termos implica também no
          aceite da Política de Privacidade.
        </p>
        <p className="text-justify break-words">
          A Plataforma garante canais de atendimento para que os Usuários possam
          exercer seus direitos como titulares de dados, conforme previsto na
          LGPD.
        </p>
      </section>

      <section id="responsabilidades">
        <h2 className="text-lg font-semibold text-start mb-4">
          7. Responsabilidades e Conduta dos Usuários
        </h2>
        <p className="text-justify break-words">
          Os Usuários se comprometem a não utilizar a Plataforma para fins
          ilícitos, fraudulentos ou que violem os direitos de terceiros, devendo
          respeitar a legislação brasileira.
        </p>
        <ul className="list-disc pl-8 space-y-2 my-5">
          <li>
            O <strong>Locador</strong> é o único e exclusivo responsável pela
            veracidade, legalidade, qualidade e exatidão das informações e
            imagens dos imóveis anunciados, bem como por possuir todos os
            direitos e autorizações necessárias para alugá-los.
          </li>
          <li>
            O <strong>Locatário</strong> é responsável por zelar pelo imóvel e
            cumprir todas as obrigações estipuladas no contrato de locação
            firmado com o Locador.
          </li>
          <li>
            É vedado aos Usuários utilizar a Plataforma para contornar o sistema
            de pagamentos, negociar diretamente fora da plataforma para evitar o
            pagamento da Comissão, ou publicar conteúdo que seja difamatório,
            discriminatório, ofensivo ou que viole a propriedade intelectual de
            terceiros.
          </li>
        </ul>
      </section>

      <section id="limitacao">
        <h2 className="text-lg font-semibold text-start mb-4">
          8. Limitação de Responsabilidade e Marco Civil da Internet
        </h2>
        <p className="text-justify break-words">
          <strong>Conteúdo de Terceiros:</strong> Em conformidade com o Art. 19
          da Lei nº 12.965/2014 (Marco Civil da Internet), a Locaterra{" "}
          <strong>
            não será responsabilizada civilmente por danos decorrentes de
            conteúdo gerado por seus Usuários
          </strong>
          , a menos que, após ordem judicial específica, não tome as
          providências para tornar o conteúdo indisponível.
        </p>
        <p className="text-justify break-words">
          <strong>Isenção de Responsabilidade Geral:</strong> A Locaterra, como
          intermediária de tecnologia, não se responsabiliza por:
        </p>
        <ul className="list-disc pl-8 space-y-2 my-5">
          <li>
            Disputas, desacordos ou danos de qualquer natureza que surjam da
            relação direta entre Locador e Locatário.
          </li>
          <li>
            Pela qualidade, segurança, condição ou legalidade dos imóveis
            anunciados.
          </li>
          <li>
            Pelo cumprimento das obrigações contratuais assumidas entre os
            Usuários.
          </li>
          <li>
            Por falhas, interrupções ou indisponibilidade da Plataforma
            decorrentes de eventos de terceiros, como ataques de hackers, falhas
            de conexão à internet ou casos de força maior.
          </li>
        </ul>
      </section>

      <section id="propriedade">
        <h2 className="text-lg font-semibold text-start mb-4">
          9. Propriedade Intelectual
        </h2>
        <p className="text-justify break-words">
          Todo o conteúdo da Plataforma, incluindo, mas não se limitando a,
          marcas, logotipos, software, layout, textos e gráficos, é de
          propriedade exclusiva da Locaterra e protegido pelas leis de
          propriedade intelectual.
        </p>
        <p className="text-justify break-words">
          Ao publicar Conteúdo de Usuário na Plataforma, você concede à
          Locaterra uma licença não exclusiva, mundial, isenta de royalties e
          transferível para usar, reproduzir, distribuir e exibir tal conteúdo,
          com o único propósito de operar e promover os serviços da Plataforma.
        </p>
      </section>

      <section id="disputas">
        <h2 className="text-lg font-semibold text-start mb-4">
          10. Resolução de Disputas, Foro e Legislação Aplicável
        </h2>
        <p className="text-justify break-words">
          <strong>Resolução Escalonada:</strong> Em caso de qualquer conflito ou
          disputa decorrente destes Termos entre um Usuário e a Locaterra, as
          partes se comprometem a buscar uma solução amigável. Caso não seja
          possível, a disputa será submetida à <strong>mediação</strong> como
          etapa prévia e obrigatória, antes de recorrer à{" "}
          <strong>arbitragem</strong>, que resolverá a questão de forma
          definitiva.
        </p>
        <p className="text-justify break-words">
          <strong>Foro:</strong> Fica eleito o foro da Comarca da sede da
          Locaterra para dirimir quaisquer controvérsias judiciais
          remanescentes. Contudo, ressalva-se que, em relações de consumo, o
          Usuário poderá optar por ajuizar a ação no foro de seu domicílio, em
          observância ao Código de Defesa do Consumidor e à jurisprudência
          consolidada.
        </p>
        <p className="text-justify break-words">
          <strong>Legislação Aplicável:</strong> Estes Termos serão regidos e
          interpretados de acordo com as leis da República Federativa do Brasil.
        </p>
      </section>

      <section id="disposicoes">
        <h2 className="text-lg font-semibold text-start mb-4">
          11. Disposições Gerais
        </h2>
        <p className="text-justify break-words">
          <strong>Modificações:</strong> A Locaterra poderá alterar estes Termos
          a qualquer momento. As alterações serão comunicadas aos Usuários com
          antecedência. A continuidade do uso da Plataforma após a comunicação
          implicará no aceite das novas condições.
        </p>
        <p className="text-justify break-words">
          <strong>Independência das Cláusulas:</strong> Se qualquer disposição
          destes Termos for considerada nula ou inexequível, as demais
          disposições permanecerão em pleno vigor e efeito.
        </p>
      </section>

      <section id="contato">
        <h2 className="text-lg font-semibold text-start mb-4">12. Contato</h2>
        <p className="text-justify break-words">
          Em caso de dúvidas, solicitações ou comunicações relacionadas a estes
          Termos, entre em contato conosco pelo e-mail:{" "}
          <a
            href="mailto:atendimentoaocliente.locaterra@gmail.com"
            className="break-all text-primary-hover underline"
          >
            atendimentoaocliente.locaterra@gmail.com
          </a>
          .
        </p>
      </section>
    </main>
  );
}
