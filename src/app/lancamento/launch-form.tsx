"use client";

import { useFormStatus } from "react-dom";
import { Bell } from "lucide-react";
import { useActionState, useEffect, useRef } from "react";
import { submitEmail } from "./actions";

const initialState = {
  success: false,
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-2 justify-center rounded-lg px-5 py-3 bg-primary text-white font-semibold shadow hover:bg-primary-hover transition w-full sm:w-auto disabled:bg-opacity-70 disabled:cursor-not-allowed"
    >
      {pending ? (
        "Enviando..."
      ) : (
        <>
          <Bell size={16} /> Avise‑me
        </>
      )}
    </button>
  );
}

export function LaunchForm() {
  const [state, formAction] = useActionState(submitEmail, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    // Limpa o formulário após o sucesso
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  if (state.success) {
    return (
      <div className="p-4 rounded-lg bg-green-100 text-green-800 border border-green-200 text-center font-medium">
        {state.message}
      </div>
    );
  }

  return (
    <>
      <form
        ref={formRef}
        action={formAction}
        className="flex flex-col sm:flex-row gap-3 sm:items-center max-w-xl"
      >
        <label htmlFor="email" className="sr-only">
          Seu melhor e-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Digite seu melhor e‑mail"
          required
          className="flex-1 rounded-lg px-4 py-3 border border-input-border bg-input-bg text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <SubmitButton />
      </form>
      {state.message && !state.success && (
        <p className="text-sm text-red-500 mt-2">{state.message}</p>
      )}
    </>
  );
}
