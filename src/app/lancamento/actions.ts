"use server";

interface FormState {
  success: boolean;
  message: string;
}

export async function submitEmail(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const email = formData.get("email") as string;

  if (!email || !email.includes("@")) {
    return { success: false, message: "Por favor, forneça um e-mail válido." };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}launch-notifications`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ email }),
      }
    );

    const { data } = await response.json();
    console.log(data);
    if (!response.ok) {
      return { success: false, message: data.message };
    }

    return { success: true, message: data.message };
  } catch (error) {
    console.error("Fetch error:", error);
    return {
      success: false,
      message: "Não foi possível conectar ao servidor. Tente novamente.",
    };
  }
}
