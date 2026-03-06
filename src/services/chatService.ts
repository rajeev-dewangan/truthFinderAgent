export interface ChatResponse {
  response: string;
  user_id: string;
  status: string;
}

export interface ClearResponse {
  status: string;
  user_id: string;
  message: string;
}

// const API_BASE_URL = "https://smart-mutually-grubworm.ngrok-free.app";
const API_BASE_URL = "https://1w0rialcfb.execute-api.eu-north-1.amazonaws.com/dev"

export const chatService = {
  async sendMessage(message: string, userId: string): Promise<ChatResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
          // ngrok-skip-browser-warning is often needed for free ngrok tunnels
          // "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          message,
          user_id: userId,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API error response: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  },

  async clearChat(userId: string): Promise<ClearResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/clear`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
          // "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          user_id: userId,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error clearing chat:", error);
      throw error;
    }
  },
};
