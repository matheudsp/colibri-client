import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso - Colibri",
  description:
    "Termos e condições de uso da plataforma Colibri para locadores e locatários.",
  openGraph: {
    title: "Termos de Uso - Colibri",
    description:
      "Termos e condições de uso da plataforma Colibri para locadores e locatários.",
    url: "https://colibri.app/termos-de-uso",
    siteName: "Colibri",
    locale: "pt_BR",
    type: "website",
  },
};

export default function TermosDeUsoPage() {
  return (
    <main className="max-w-3xl mx-auto py-32 px-4 prose prose-zinc space-y-5">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-start">Termos de Uso</h1>

        <p className="text-sm text-zinc-600">
          Última atualização: 14/09/2025 às 22:46h
        </p>
      </div>

      <nav className="not-prose bg-zinc-100 p-4 rounded-md border mb-6">
        <h2 className="text-lg font-semibold text-center mb-4">Índice</h2>
        <ul className="list-disc pl-5 mt-2 space-y-2 text-sm">
          <li className="hover:text-secondary-hover underline">
            <a href="#aceitacao">1. Aceitação dos Termos</a>
          </li>
          <li className="hover:text-secondary-hover underline">
            <a href="#definicoes">2. Definições</a>
          </li>
          <li className="hover:text-secondary-hover underline">
            <a href="#servicos">3. Serviços</a>
          </li>
          <li className="hover:text-secondary-hover underline">
            <a href="#obrigacoes">4. Obrigações do Usuário</a>
          </li>
          <li className="hover:text-secondary-hover underline">
            <a href="#conta">5. Conta e Segurança</a>
          </li>
          <li className="hover:text-secondary-hover underline">
            <a href="#pagamentos">6. Pagamentos e Cobranças</a>
          </li>
          <li className="hover:text-secondary-hover underline">
            <a href="#contratos">7. Contratos e Assinaturas</a>
          </li>
          <li className="hover:text-secondary-hover underline">
            <a href="#propriedade">8. Propriedade Intelectual</a>
          </li>
          <li className="hover:text-secondary-hover underline">
            <a href="#dados">9. Proteção de Dados e Privacidade</a>
          </li>
          <li className="hover:text-secondary-hover underline">
            <a href="#terceiros">10. Serviços de Terceiros</a>
          </li>
          <li className="hover:text-secondary-hover underline">
            <a href="#resolucao">11. Limitação de Responsabilidade</a>
          </li>
          <li className="hover:text-secondary-hover underline">
            <a href="#rescisao">12. Suspensão e Rescisão</a>
          </li>
          <li className="hover:text-secondary-hover underline">
            <a href="#alteracoes">13. Alterações aos Termos</a>
          </li>
          <li className="hover:text-secondary-hover underline">
            <a href="#legislacao">14. Legislação e Foro</a>
          </li>
          <li className="underline hover: ">
            <a href="#contato">15. Contato</a>
          </li>
        </ul>
      </nav>

      <section id="aceitacao">
        <h2 className="text-lg font-semibold text-start mb-4">
          1. Aceitação dos Termos
        </h2>
        <p className="text-justify break-words">
          Ao acessar ou utilizar a plataforma Colibri, você concorda com estes
          Termos de Uso e com as demais políticas a que eles se remetem, em
          especial a Política de Privacidade. Caso não concorde com qualquer
          disposição destes Termos, não utilize a Plataforma.
        </p>
      </section>

      <section id="definicoes">
        <h2 className="text-lg font-semibold text-start mb-4">2. Definições</h2>
        <p className="text-justify break-words">
          Para fins destes Termos, aplicam-se as seguintes definições:
        </p>
        <ul className="list-decimal pl-16 space-y-2 my-5">
          <li>
            <strong>Usuário:</strong> toda pessoa física ou jurídica que acessa
            ou utiliza a Plataforma.
          </li>
          <li>
            <strong>Locador:</strong> usuário que anuncia ou disponibiliza um
            imóvel para locação ou venda.
          </li>
          <li>
            <strong>Locatário:</strong> usuário interessado em alugar ou
            adquirir um imóvel anunciado na Plataforma.
          </li>
          <li>
            <strong>Serviços:</strong> funcionalidades oferecidas pela
            Plataforma, incluindo listagem de imóveis, gestão de contratos e
            meios de pagamento integrados.
          </li>
        </ul>
      </section>

      <section id="servicos">
        <h2 className="text-lg font-semibold text-start mb-4">3. Serviços</h2>
        <p className="text-justify break-words">
          A Plataforma oferece meios para divulgação de imóveis, comunicação
          entre partes, gestão de contratos eletrônicos e facilitação de
          cobranças e repasses financeiros. A Colibri atua como provedor
          tecnológico da Plataforma, conectando locadores, locatários e
          provedores de serviços essenciais — não sendo parte diretamente nas
          obrigações contratuais firmadas entre locador e locatário, salvo
          quando expressamente informado.
        </p>
      </section>

      <section id="obrigacoes">
        <h2 className="text-lg font-semibold text-start mb-4">
          4. Obrigações do Usuário
        </h2>
        <p className="text-justify break-words">O Usuário concorda em:</p>
        <ul className="list-decimal pl-16 space-y-2 my-5">
          <li>
            Fornecer informações verdadeiras, atuais e completas durante o
            cadastro;
          </li>
          <li>Manter seus dados cadastrais e documentos atualizados;</li>
          <li>
            Não utilizar a Plataforma para fins ilícitos ou que violem estes
            Termos;
          </li>
          <li>
            Responsabilizar-se pelo conteúdo que publicar e pelas interações com
            outros usuários;
          </li>
          <li>Respeitar a legislação aplicável e os direitos de terceiros.</li>
        </ul>
      </section>

      <section id="conta">
        <h2 className="text-lg font-semibold text-start mb-4">
          5. Conta e Segurança
        </h2>
        <p className="text-justify break-words">
          Para utilizar partes da Plataforma, é necessário criar uma conta. Você
          é responsável por manter a confidencialidade de suas credenciais e por
          todas as atividades realizadas em sua conta. Deve notificar
          imediatamente a equipe de suporte em caso de uso não autorizado.
        </p>
      </section>

      <section id="pagamentos">
        <h2 className="text-lg font-semibold text-start mb-4">
          6. Pagamentos e Cobranças
        </h2>
        <p className="text-justify break-words">
          A Plataforma pode oferecer meios integrados para emissão de cobranças,
          geração de boletos, PIX e repasses a titulares de contas. Os
          pagamentos são processados por provedores de serviços financeiros
          terceiros e quaisquer dúvidas, estornos ou reclamações relativas a
          cobranças devem ser tratadas conforme as instruções e canais indicados
          na Plataforma.
        </p>
      </section>

      <section id="contratos">
        <h2 className="text-lg font-semibold text-start mb-4">
          7. Contratos e Assinaturas
        </h2>
        <p className="text-justify break-words">
          Contratos celebrados entre locador e locatário por meio da Plataforma
          são acordos privados entre as partes. A Plataforma facilita a geração
          e a assinatura eletrônica desses documentos; a validade, eficácia e
          cumprimento dos contratos seguem as leis aplicáveis. A Colibri não
          substitui o aconselhamento jurídico das partes quando necessário.
        </p>
      </section>

      <section id="propriedade">
        <h2 className="text-lg font-semibold text-start mb-4">
          8. Propriedade Intelectual
        </h2>
        <p className="text-justify break-words">
          Todo o conteúdo da Plataforma, incluindo textos, imagens, logotipos,
          código-fonte e design, é protegido por direitos autorais e outros
          direitos de propriedade intelectual. O Usuário reconhece que não
          adquire qualquer direito de propriedade sobre tais conteúdos, salvo
          mediante licença expressa.
        </p>
      </section>

      <section id="dados">
        <h2 className="text-lg font-semibold text-start mb-4">
          9. Proteção de Dados e Privacidade
        </h2>
        <p className="text-justify break-words">
          O tratamento de dados pessoais realizado pela Colibri está descrito na
          Política de Privacidade, que integra estes Termos por referência.
          Atuamos em conformidade com a LGPD, adotando medidas técnicas e
          administrativas para proteger os dados pessoais dos Usuários.
        </p>
      </section>

      <section id="terceiros">
        <h2 className="text-lg font-semibold text-start mb-4">
          10. Serviços de Terceiros
        </h2>
        <p className="text-justify break-words">
          A Plataforma pode integrar-se a serviços de terceiros para
          disponibilizar funcionalidades (por exemplo, serviços de pagamento e
          assinatura eletrônica). O uso desses serviços está sujeito aos termos
          e políticas dos respectivos fornecedores, e a Colibri não se
          responsabiliza por práticas de privacidade ou segurança adotadas por
          terceiros.
        </p>
      </section>

      <section id="resolucao">
        <h2 className="text-lg font-semibold text-start mb-4">
          11. Limitação de Responsabilidade
        </h2>
        <p className="text-justify break-words">
          Na máxima extensão permitida pela lei, a Colibri não será responsável
          por danos indiretos, especiais, exemplares, incidentais ou
          consequenciais decorrentes do uso da Plataforma ou de contratos
          firmados entre usuários. Nossa responsabilidade total em relação a
          qualquer reclamação será limitada ao montante efetivamente pago por
          você à Plataforma nos últimos 12 meses, quando aplicável.
        </p>
      </section>

      <section id="rescisao">
        <h2 className="text-lg font-semibold text-start mb-4">
          12. Suspensão e Rescisão
        </h2>
        <p className="text-justify break-words">
          A Colibri pode suspender, limitar ou encerrar o acesso de qualquer
          Usuário que viole estes Termos ou que pratique condutas vedadas pela
          Plataforma, mediante notificação quando possível. Usuários também
          podem encerrar suas contas conforme as opções disponíveis na
          Plataforma, sem prejuízo das obrigações pendentes.
        </p>
      </section>

      <section id="alteracoes">
        <h2 className="text-lg font-semibold text-start mb-4">
          13. Alterações aos Termos
        </h2>
        <p className="text-justify break-words">
          Reservamo-nos o direito de alterar estes Termos a qualquer momento.
          Alterações substanciais serão comunicadas aos Usuários por e-mail ou
          aviso na Plataforma. O uso continuado da Plataforma após a publicação
          de alterações implica na aceitação das mudanças.
        </p>
      </section>

      <section id="legislacao">
        <h2 className="text-lg font-semibold text-start mb-4">
          14. Legislação e Foro
        </h2>
        <p className="text-justify break-words">
          Estes Termos são regidos pela legislação brasileira. Para dirimir
          quaisquer controvérsias decorrentes deste instrumento, fica eleito o
          foro da comarca indicada no cadastro do Usuário, quando aplicável, ou,
          na falta desta, o foro da cidade sede da empresa responsável pela
          Plataforma, salvo disposição legal em contrário.
        </p>
      </section>

      <section id="contato">
        <h2 className="text-lg font-semibold text-start mb-4">15. Contato</h2>
        <p className="text-justify break-words">
          Em caso de dúvidas, solicitações ou comunicações relacionadas a estes
          Termos, entre em contato conosco pelo e-mail:{" "}
          <a
            href="mailto:atendimentoaocliente.valedosol@gmail.com"
            className="break-all text-primary-hover underline"
          >
            atendimentoaocliente.valedosol@gmail.com
          </a>
          .
        </p>
      </section>
    </main>
  );
}
