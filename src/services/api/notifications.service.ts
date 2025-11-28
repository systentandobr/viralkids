import { httpClient } from './httpClient';

export interface NotificationPayload {
  title: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  metadata?: Record<string, any>;
  userId?: string;
}

interface NotificationResponse {
  telegram: boolean;
  discord: boolean;
  email: boolean;
}

class NotificationService {
  /**
   * Envia notificação usando a API de notificações
   * @param payload Dados da notificação
   * @returns Resposta da API indicando quais canais receberam a notificação
   */
  async sendNotification(payload: NotificationPayload): Promise<{ success: boolean; data?: NotificationResponse; error?: string }> {
    try {
      const response = await httpClient.post<NotificationResponse>(
        '/notifications/send',
        payload
      );

      if (!response.success) {
        return {
          success: false,
          error: response.error || 'Erro ao enviar notificação',
        };
      }

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error sending notification:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido ao enviar notificação",
      };
    }
  }
}

export const notificationService = new NotificationService();
  