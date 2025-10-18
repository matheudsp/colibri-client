interface ContractVariable {
  tag: string; // Ex: {{tenant.name}}
  label: string; // Ex: Nome do Inquilino
  category: "Locador" | "Inquilino" | "Imóvel" | "Valores" | "Datas e Prazos";
}

export const contractTemplateVariables: ContractVariable[] = [
  // Locador
  { tag: "{{landlord.name}}", label: "Nome do Locador", category: "Locador" },
  {
    tag: "{{landlord.cpfCnpj}}",
    label: "CPF/CNPJ do Locador",
    category: "Locador",
  },
  { tag: "{{landlord.street}}", label: "Rua do Locador", category: "Locador" },
  {
    tag: "{{landlord.number}}",
    label: "Número do Locador",
    category: "Locador",
  },
  {
    tag: "{{landlord.province}}",
    label: "Bairro do Locador",
    category: "Locador",
  },
  { tag: "{{landlord.city}}", label: "Cidade do Locador", category: "Locador" },
  {
    tag: "{{landlord.state}}",
    label: "Estado do Locador",
    category: "Locador",
  },

  // Inquilino
  { tag: "{{tenant.name}}", label: "Nome do Inquilino", category: "Inquilino" },
  {
    tag: "{{tenant.cpfCnpj}}",
    label: "CPF/CNPJ do Inquilino",
    category: "Inquilino",
  },
  {
    tag: "{{tenant.email}}",
    label: "Email do Inquilino",
    category: "Inquilino",
  },

  // Imóvel
  { tag: "{{property.title}}", label: "Título do Imóvel", category: "Imóvel" },
  { tag: "{{property.street}}", label: "Rua do Imóvel", category: "Imóvel" },
  { tag: "{{property.number}}", label: "Número do Imóvel", category: "Imóvel" },
  {
    tag: "{{property.complement}}",
    label: "Complemento do Imóvel",
    category: "Imóvel",
  },
  {
    tag: "{{property.district}}",
    label: "Bairro do Imóvel",
    category: "Imóvel",
  },
  { tag: "{{property.city}}", label: "Cidade do Imóvel", category: "Imóvel" },
  { tag: "{{property.state}}", label: "Estado do Imóvel", category: "Imóvel" },
  { tag: "{{property.cep}}", label: "CEP do Imóvel", category: "Imóvel" },
  {
    tag: "{{property.propertyType}}",
    label: "Tipo do Imóvel",
    category: "Imóvel",
  },

  // Valores
  { tag: "{{rentAmount}}", label: "Valor do Aluguel", category: "Valores" },
  { tag: "{{condoFee}}", label: "Taxa de Condomínio", category: "Valores" },
  { tag: "{{iptuFee}}", label: "Valor do IPTU", category: "Valores" },
  { tag: "{{securityDeposit}}", label: "Depósito Caução", category: "Valores" },

  // Datas e Prazos
  { tag: "{{startDate}}", label: "Data de Início", category: "Datas e Prazos" },
  { tag: "{{endDate}}", label: "Data de Término", category: "Datas e Prazos" },
  {
    tag: "{{durationInMonths}}",
    label: "Duração (meses)",
    category: "Datas e Prazos",
  },
];

// Helper para agrupar por categoria
export const groupVariables = (variables: ContractVariable[]) =>
  variables.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ContractVariable[]>);
