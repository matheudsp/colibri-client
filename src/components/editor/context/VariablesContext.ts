import { NestedVariableData, VariableOptionNode } from "@/types/editor";
import { createContext } from "react";

interface VariablesContextProps {
  values: NestedVariableData | undefined;
  parseVariables: boolean;
  variableOptions: VariableOptionNode[] | undefined;
}

export const VariablesContext = createContext<
  VariablesContextProps | undefined
>(undefined);
