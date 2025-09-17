import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade - Locaterra",
  description:
    "Entenda como a Locaterra coleta, usa, compartilha e protege os dados pessoais dos usuários, em conformidade com a LGPD.",
  openGraph: {
    title: "Política de Privacidade - Locaterra",
    description:
      "Saiba como seus dados são tratados e protegidos no sistema Locaterra.",
    url: "https://seu-dominio.com/politica-de-privacidade",
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
          Última atualização: 14/09/2025 às 22:46h
        </p>
      </div>

      <p className="text-justify">
        A Locaterra preza pela privacidade e segurança dos dados pessoais de
        seus usuários. Esta política descreve como coletamos, usamos,
        compartilhamos e protegemos as informações no sistema Locaterra. Estamos
        em conformidade com a Lei Geral de Proteção de Dados Pessoais (LGPD, Lei
        nº 13.709/2018), que protege os direitos fundamentais de liberdade e
        privacidade dos indivíduos. Atuamos exclusivamente no Brasil e seguimos
        as legislações locais de proteção de dados.
      </p>

      <nav className="not-prose bg-zinc-100 p-4 rounded-xl border border-zinc-200 mb-10">
        <h2 className="text-lg font-semibold mb-2 text-center">Índice</h2>
        <ul className="space-y-2 list-decimal pl-5 ">
          <li className="hover:text-secondary-hover underline">
            <a href="#dados-pessoais-coletados ">Dados Pessoais Coletados</a>
          </li>
          <li className="hover:text-secondary-hover underline">
            <a href="#finalidades-do-tratamento">Finalidades do Tratamento</a>
          </li>
          <li className="hover:text-secondary-hover underline">
            <a href="#cookies-e-tecnologias">
              Cookies e Tecnologias de Rastreamento
            </a>
          </li>
          <li className="hover:text-secondary-hover underline">
            <a href="#compartilhamento">
              Compartilhamento de Dados com Terceiros
            </a>
          </li>
          <li className="hover:text-secondary-hover underline">
            <a href="#direitos-dos-usuarios">Direitos dos Usuários</a>
          </li>
          <li className="hover:text-secondary-hover underline">
            <a href="#seguranca-e-retencao">Segurança e Retenção de Dados</a>
          </li>
          <li className="hover:text-secondary-hover underline">
            <a href="#contato">Contato</a>
          </li>
          <li className="hover:text-secondary-hover underline">
            <a href="#atualizacoes">Atualizações desta Política</a>
          </li>
        </ul>
      </nav>

      <section id="dados-pessoais-coletados">
        <h2 className="text-lg font-semibold text-start mb-4">
          1. Dados Pessoais Coletados
        </h2>
        <ul className="list-decimal pl-16 space-y-2 mb-5">
          <li>
            <strong>Dados cadastrais:</strong> nome completo, e-mail, telefone,
            CPF ou CNPJ, data de nascimento, tipo de empresa e outros dados de
            identificação.
          </li>
          <li>
            <strong>Endereço:</strong> CEP, rua, número, complemento, bairro,
            cidade, estado.
          </li>
          <li>
            <strong>Dados bancários:</strong> chave PIX (CPF, CNPJ, e-mail ou
            telefone) e tipo de conta para repasse de valores.
          </li>
          <li>
            <strong>Dados de contratos e transações:</strong> valores de
            aluguel, taxas, tipo de garantia, vigência e demais informações
            contratuais.
          </li>
          <li>
            <strong>Documentos pessoais:</strong> cópias de identidade, CPF,
            comprovante de renda e de endereço.
          </li>
          <li>
            <strong>Dados de uso do sistema:</strong> registros de acesso e
            ações realizadas (logs) para segurança, auditoria e melhoria da
            plataforma.
          </li>
        </ul>
        <p>
          Não tratamos dados pessoais sensíveis (como saúde, religião,
          orientação sexual, raça etc.). Os dados coletados são apenas os
          necessários para prestar nossos serviços.
        </p>
      </section>

      <section id="finalidades-do-tratamento">
        <h2 className="text-lg font-semibold text-start mb-4">
          2. Finalidades do Tratamento
        </h2>
        <ul className="list-decimal pl-16 space-y-2 mb-5">
          <li>Criação e gestão de conta de usuário.</li>
          <li>Processamento de contratos entre locador e locatário.</li>
          <li>Processamento de pagamentos, boletos e repasses financeiros.</li>
          <li>Envio de notificações e comunicações administrativas.</li>
          <li>Cumprimento de obrigações legais e fiscais.</li>
          <li>Segurança, prevenção a fraudes e melhorias da plataforma.</li>
        </ul>
        <p className="text-justify break-words">
          Os dados são usados apenas para as finalidades acima, de forma
          transparente e conforme a LGPD.
        </p>
      </section>

      <section id="cookies-e-tecnologias">
        <h2 className="text-lg font-semibold text-start mb-4">
          3. Cookies e Tecnologias de Rastreamento
        </h2>
        <p className="text-justify break-words">
          Utilizamos cookies e tokens de sessão para autenticação e segurança da
          conta, armazenando no navegador dados essenciais para funcionamento da
          plataforma. Esses cookies são estritamente necessários e não podem ser
          desativados sem prejudicar o funcionamento do sistema. Não usamos
          cookies de terceiros para publicidade ou rastreamento de navegação.
        </p>
      </section>

      <section id="compartilhamento">
        <h2 className="text-lg font-semibold text-start mb-4">
          4. Compartilhamento de Dados com Terceiros
        </h2>
        <p className="text-justify break-words">
          Compartilhamos dados pessoais apenas quando necessário para:
        </p>
        <ul className="list-decimal pl-16 space-y-2 my-5">
          <li>
            Prestadores de serviços financeiros (processamento de pagamentos e
            transferências).
          </li>
          <li>
            Serviços de assinatura digital (gestão de assinaturas eletrônicas de
            contratos).
          </li>
          <li>
            Órgãos legais e fiscais, quando exigido por lei ou decisão judicial.
          </li>
          <li>
            Fornecedores de hospedagem e suporte técnico, sob contrato de
            confidencialidade.
          </li>
        </ul>
        <p>
          Não vendemos dados pessoais e seguimos o princípio da minimização de
          dados.
        </p>
      </section>

      <section id="direitos-dos-usuarios">
        <h2 className="text-lg font-semibold text-start mb-4">
          5. Direitos dos Usuários
        </h2>
        <ul className="list-decimal pl-16 space-y-2 mb-5">
          <li>Confirmação e acesso aos dados pessoais.</li>
          <li>Correção de dados incompletos, inexatos ou desatualizados.</li>
          <li>
            Bloqueio ou exclusão de dados desnecessários ou tratados em
            desconformidade.
          </li>
          <li>Portabilidade para outro fornecedor, quando aplicável.</li>
          <li>Revogação do consentimento a qualquer momento.</li>
        </ul>
        <p className="text-justify break-words">
          Se sentir dificuldades para exercer seus direitos, entre em contato
          conosco pelo e-mail:{" "}
          <a
            href="mailto:atendimentoaocliente.valedosol@gmail.com"
            className="text-primary-hover underline break-all"
          >
            atendimentoaocliente.valedosol@gmail.com
          </a>
        </p>
      </section>

      <section id="seguranca-e-retencao">
        <h2 className="text-lg font-semibold text-start mb-4">
          6. Segurança e Retenção de Dados
        </h2>
        <p className="text-justify break-words">
          Adotamos medidas técnicas e administrativas para proteger seus dados,
          incluindo criptografia de senhas, SSL/TLS, controle de acesso,
          registros de auditoria e políticas de segurança de rede. Mantemos os
          dados apenas pelo tempo necessário para cumprir as finalidades
          informadas e as exigências legais. Após esse prazo, os dados são
          excluídos ou anonimizados de forma segura.
        </p>
      </section>

      <section id="contato">
        <h2 className="text-lg font-semibold text-start mb-4">7. Contato</h2>
        <p className="text-justify break-words">
          Em caso de dúvidas, sugestões ou solicitações sobre privacidade e
          proteção de dados, entre em contato com nosso suporte através do
          e-mail:{" "}
          <a
            href="mailto:atendimentoaocliente.valedosol@gmail.com"
            className="break-all text-primary-hover underline"
          >
            atendimentoaocliente.valedosol@gmail.com
          </a>
          .
        </p>
      </section>

      <section id="atualizacoes">
        <h2 className="text-lg font-semibold text-start mb-4">
          8. Atualizações desta Política
        </h2>
        <p className="text-justify break-words">
          Esta política pode sofrer atualizações. Em caso de alterações,
          publicaremos a nova versão nesta página.
        </p>
      </section>
    </main>
  );
}
