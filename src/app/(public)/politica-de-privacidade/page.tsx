import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade - Locaterra",
  description:
    "Entenda como a Locaterra coleta, usa, compartilha e protege os dados pessoais dos usuários, em conformidade com a LGPD.",
  openGraph: {
    title: "Política de Privacidade - Locaterra",
    description:
      "Saiba como seus dados são tratados e protegidos no sistema Locaterra.",
    url: "https://www.locaterra.com.br/politica-de-privacidade",
    siteName: "Locaterra",
    locale: "pt_BR",
    type: "website",
  },
};

export default function PoliticaDePrivacidadePage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-32 prose prose-zinc space-y-10">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-start">
          Política de Privacidade
        </h1>
        <p className="text-sm text-zinc-600">
          Última atualização: 06/10/2025 às 10:00h
        </p>
      </div>

      <p className="text-justify">
        A Locaterra valoriza a privacidade e a proteção dos dados pessoais de
        seus usuários. Esta Política de Privacidade descreve de forma clara e
        transparente como coletamos, utilizamos, compartilhamos e protegemos as
        informações no sistema Locaterra, em conformidade com a Lei Geral de
        Proteção de Dados Pessoais (LGPD - Lei nº 13.709/2018). A Locaterra atua
        exclusivamente no Brasil e segue as legislações locais aplicáveis à
        proteção de dados e privacidade.
      </p>

      <section>
        <h2 className="text-lg font-semibold text-start mb-4">
          1. Controlador de Dados
        </h2>
        <p className="text-justify">
          O controlador dos dados pessoais é a{" "}
          <strong>Locaterra Tecnologia e Serviços Digitais</strong>, responsável
          por definir as finalidades e os meios de tratamento dos dados. Para
          qualquer solicitação relacionada à privacidade, o contato deve ser
          pelo e-mail:{" "}
          <a
            href="mailto:atendimentoaocliente@locaterra.com.br"
            className="text-primary-hover underline break-all"
          >
            atendimentoaocliente@locaterra.com.br
          </a>
          .
        </p>
      </section>

      <section id="dados-pessoais-coletados">
        <h2 className="text-lg font-semibold text-start mb-4">
          2. Dados Pessoais Coletados
        </h2>
        <p>
          Coletamos apenas os dados estritamente necessários para prestação dos
          serviços:
        </p>
        <ul className="list-decimal pl-16 space-y-2 mb-5">
          <li>
            <strong>Dados cadastrais:</strong> nome completo, e-mail, telefone,
            CPF ou CNPJ, data de nascimento e tipo de perfil (locador, locatário
            ou imobiliária).
          </li>
          <li>
            <strong>Endereço:</strong> CEP, rua, número, complemento, bairro,
            cidade e estado.
          </li>
          <li>
            <strong>Dados bancários:</strong> chave PIX e informações de conta
            para repasses financeiros.
          </li>
          <li>
            <strong>Dados contratuais e transacionais:</strong> valores, taxas,
            tipo de garantia, vigência e histórico de transações.
          </li>
          <li>
            <strong>Documentos pessoais:</strong> cópias de identidade,
            comprovante de renda e de endereço, quando necessários à
            formalização contratual.
          </li>
          <li>
            <strong>Dados técnicos e de uso:</strong> endereço IP, logs de
            acesso, cookies de sessão, data e hora de atividades na plataforma.
          </li>
        </ul>
        <p>
          Não tratamos dados sensíveis, exceto se forem indispensáveis para o
          cumprimento de obrigação legal ou exercício de direito contratual.
        </p>
      </section>

      <section id="bases-legais">
        <h2 className="text-lg font-semibold text-start mb-4">
          3. Bases Legais para o Tratamento
        </h2>
        <ul className="list-decimal pl-16 space-y-2">
          <li>
            <strong>Execução de contrato:</strong> para cadastro, geração e
            assinatura de contratos de locação.
          </li>
          <li>
            <strong>Cumprimento de obrigação legal:</strong> guarda de
            documentos fiscais, registros e comunicações obrigatórias.
          </li>
          <li>
            <strong>Interesse legítimo:</strong> prevenção a fraudes,
            auditorias, segurança da informação e melhoria da experiência do
            usuário.
          </li>
          <li>
            <strong>Consentimento:</strong> para comunicações opcionais, como
            newsletters ou atualizações de produtos.
          </li>
        </ul>
      </section>

      <section id="finalidades-do-tratamento">
        <h2 className="text-lg font-semibold text-start mb-4">
          4. Finalidades do Tratamento
        </h2>
        <ul className="list-decimal pl-16 space-y-2 mb-5">
          <li>Criação, autenticação e gestão de contas de usuário.</li>
          <li>Geração, assinatura e gestão de contratos de locação.</li>
          <li>Processamento de pagamentos, repasses e emissão de boletos.</li>
          <li>
            Envio de notificações operacionais e comunicações sobre o uso da
            plataforma.
          </li>
          <li>Cumprimento de obrigações legais, fiscais e de segurança.</li>
          <li>Prevenção de fraudes e auditorias técnicas.</li>
        </ul>
      </section>

      <section id="cookies-e-tecnologias">
        <h2 className="text-lg font-semibold text-start mb-4">
          5. Cookies e Tecnologias de Rastreamento
        </h2>
        <p className="text-justify">
          Utilizamos cookies e tokens de sessão apenas para autenticação,
          segurança e funcionamento do sistema. Não utilizamos cookies de
          terceiros para fins publicitários. O usuário pode configurar seu
          navegador para bloqueá-los, mas isso pode comprometer algumas
          funcionalidades.
        </p>
      </section>

      <section id="compartilhamento">
        <h2 className="text-lg font-semibold text-start mb-4">
          6. Compartilhamento de Dados com Terceiros
        </h2>
        <p>
          Seus dados podem ser compartilhados apenas com parceiros essenciais:
        </p>
        <ul className="list-decimal pl-16 space-y-2 mb-5">
          <li>
            <strong>Gateway de Pagamento:</strong> para processamento de
            pagamentos, emissão de boletos e PIX.
          </li>
          <li>
            <strong>Serviço de assinatura digital:</strong> para gestão e
            assinatura eletrônica de contratos.
          </li>
          <li>
            <strong>Armazenamento de mídias:</strong> para hospedagem segura e
            armazenamento de dados.
          </li>
          <li>
            <strong>Órgãos públicos:</strong> quando necessário para cumprimento
            de obrigação legal.
          </li>
        </ul>
        <p>
          Todos os parceiros estão sujeitos a contratos de confidencialidade e
          conformidade com a LGPD. Nenhum dado é vendido ou compartilhado para
          fins comerciais.
        </p>
      </section>

      <section id="direitos-dos-usuarios">
        <h2 className="text-lg font-semibold text-start mb-4">
          8. Direitos dos Usuários
        </h2>
        <p>De acordo com a LGPD, você tem direito a:</p>
        <ul className="list-decimal pl-16 space-y-2 mb-5">
          <li>
            Confirmar a existência de tratamento e acessar seus dados pessoais.
          </li>
          <li>Corrigir dados incompletos, inexatos ou desatualizados.</li>
          <li>
            Solicitar anonimização, bloqueio ou exclusão de dados desnecessários
            ou excessivos.
          </li>
          <li>
            Solicitar portabilidade para outro fornecedor, quando aplicável.
          </li>
          <li>Revogar consentimento a qualquer momento.</li>
          <li>
            Solicitar informações sobre o compartilhamento de seus dados com
            terceiros.
          </li>
          <li>
            Opor-se ao tratamento de dados realizado com base em interesse
            legítimo.
          </li>
        </ul>
        <p>
          As solicitações podem ser feitas pelo e-mail:{" "}
          <a
            href="mailto:atendimentoaocliente@locaterra.com.br"
            className="text-primary-hover underline break-all"
          >
            atendimentoaocliente@locaterra.com.br
          </a>
          . Todos os pedidos serão analisados e respondidos em até 15 dias.
        </p>
      </section>

      <section id="seguranca-e-retencao">
        <h2 className="text-lg font-semibold text-start mb-4">
          9. Segurança e Retenção de Dados
        </h2>
        <p>
          Adotamos medidas técnicas e administrativas para proteger seus dados,
          incluindo criptografia (SSL/TLS), controle de acesso, logs de
          auditoria, backups seguros e políticas internas de segurança. Os dados
          são armazenados apenas pelo tempo necessário para as finalidades
          descritas ou conforme exigido por lei (ex: dados fiscais por até 5
          anos). Após esse período, os dados são anonimizados ou excluídos de
          forma segura.
        </p>
      </section>

      <section id="atualizacoes">
        <h2 className="text-lg font-semibold text-start mb-4">
          10. Atualizações desta Política
        </h2>
        <p>
          Esta Política pode ser atualizada periodicamente para refletir
          alterações legais ou melhorias na plataforma. Quando houver mudanças
          relevantes, os usuários serão notificados e a nova versão será
          publicada neste endereço.
        </p>
      </section>
    </main>
  );
}
