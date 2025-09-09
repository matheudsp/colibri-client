export const companyType = [
  { id: "mei", value: "MEI", label: "MEI" },
  { id: "limited", value: "LIMITED", label: "LIMITADA" },
  { id: "individual", value: "INDIVIDUAL", label: "INDIVIDUAL" },
  { id: "association", value: "ASSOCIATION", label: "ASSOCIAÇÃO" },
];

export const getCompanyTypeLabel = (value: string | null | undefined) => {
  if (!value) return "";
  const found = companyType.find((opt) => opt.value === value);
  return found ? found.label : value;
};
