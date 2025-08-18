import { pdfType } from "../../constants";

export const getPdfLabel = (type: string): string => {
  return pdfType.find((item) => item.value === type)?.label || type;
};

export const formatWithCapitals = (value: string): string => {
  if (!value) return "";

  return value
    .split("_")
    .map((word, index) => {
      if (index === 0) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }

      return word.length > 3
        ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        : word.toLowerCase();
    })
    .join(" ");
};
