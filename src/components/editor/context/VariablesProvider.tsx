import { VariablesContext } from "./VariablesContext";

import { VariableOptionNode, NestedVariableData } from "@/types/editor";

export function VariablesContextProvider({
  children,
  parseVariables,
  variableOptions,
  values,
}: {
  children: React.ReactNode;
  parseVariables: boolean;
  variableOptions: VariableOptionNode[] | undefined;
  values: NestedVariableData | undefined;
}) {
  return (
    <VariablesContext.Provider
      value={{ values, parseVariables, variableOptions }}
    >
      {children}
    </VariablesContext.Provider>
  );
}
