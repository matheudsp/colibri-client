import { io, Socket } from "socket.io-client";
// import { toast } from "sonner";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") ||
  "http://localhost:3000";

class SocketService {
  public socket: Socket | null = null;

  connect(): void {
    if (this.socket && this.socket.connected) {
      return;
    }

    this.socket = io(API_URL, {
      withCredentials: true,
    });

    this.socket.on("connect", () => {
      // console.log("✅ WebSocket Conectado com sucesso:", this.socket?.id);
    });
    /* eslint-disable  @typescript-eslint/no-unused-vars */
    this.socket.on("disconnect", (reason) => {
      // console.log(`❌ WebSocket Desconectado: ${reason}`);
    });
    /* eslint-disable  @typescript-eslint/no-unused-vars */
    this.socket.on("connect_error", (err) => {
      // console.error("❌ Falha na conexão com o WebSocket:", err.message);
      // toast.error("Erro de comunicação em tempo real.", {
      //   description: "Não foi possível conectar ao servidor de notificações.",
      // });
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();
