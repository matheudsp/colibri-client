import { cn } from "@/lib/utils";
import { NestedVariableData } from "@/types/editor";
import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { useVariablesContext } from "../../context/useVariablesContext";
import { Skeleton } from "@/components/ui/skeleton";
function getValueByPath(
  obj: NestedVariableData,
  path: string | null | undefined
): string | undefined {
  if (!path) {
    return undefined;
  }

  const keys = path.split(".");
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  let result: any = obj;

  for (const key of keys) {
    if (result === null || typeof result !== "object" || !(key in result)) {
      return undefined;
    }
    result = result[key];
  }

  return typeof result === "string" ? result : undefined;
}

export function Variable(props: NodeViewProps) {
  const { parseVariables, values } = useVariablesContext();
  const variableIdPath = props.node.attrs.id;
  const variableLabel = `{{${props.node.attrs.label || variableIdPath}}}`; // Fallback

  let foundValue: string | undefined;
  let isError = false;
  const isLoading = !values;

  if (values) {
    foundValue = getValueByPath(values, variableIdPath);
    isError = foundValue === undefined;
  }
  let displayText: string;
  if (parseVariables) {
    if (isLoading) {
    } else if (isError) {
      displayText = variableLabel;
    } else {
      displayText = foundValue!;
    }
  } else {
    displayText = variableLabel;
  }

  const showErrorStyle = !isLoading && isError;

  return (
    <NodeViewWrapper className="inline w-fit animate-rotate-x ">
      <span
        className={cn(
          "rounded bg-accent/20 border border-accent px-[2px] py-[1px] text-accent ",

          showErrorStyle &&
            "border border-red-600 text-destructive bg-destructive/20 animate-shake animate-once animate-duration-300 animate-delay-0 animate-ease-out"
        )}
      >
        {parseVariables && isLoading ? (
          <Skeleton className="inline-block w-24 h-5 align-middle" />
        ) : (
          displayText!
        )}
      </span>
    </NodeViewWrapper>
  );
}
