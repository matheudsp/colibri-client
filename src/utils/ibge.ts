export const fetchCitiesByState = async (stateUf: string) => {
  if (!stateUf || stateUf.length !== 2) {
    return [];
  }

  try {
    const response = await fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${stateUf}/municipios`
    );

    if (!response.ok) {
      throw new Error("Falha ao buscar cidades");
    }

    const data: { id: number; nome: string }[] = await response.json();

    const cityOptions = data.map((city) => ({
      id: city.id.toString(),
      value: city.nome,
      label: city.nome,
    }));

    return cityOptions;
  } catch (error) {
    console.error("Erro ao carregar cidades do IBGE:", error);
    return [];
  }
};
