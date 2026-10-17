/**
 * Extensible notification service supporting in-app alerts and WhatsApp deep links.
 */

export interface NotificationPayload {
  userId: string;
  title: string;
  message: string;
  link?: string;
}

export const notificationService = {
  createWhatsAppLink(phone: string, text: string): string {
    const sanitizedPhone = phone.replace(/\D/g, '');
    const formatted = sanitizedPhone.startsWith('91') ? sanitizedPhone : `91${sanitizedPhone}`;
    return `https://wa.me/${formatted}?text=${encodeURIComponent(text)}`;
  },

  async sendInAppNotification(payload: NotificationPayload): Promise<void> {
    const raw = localStorage.getItem('farmdirect_notifications') || '[]';
    const list = JSON.parse(raw);
    list.unshift({
      id: `notif-${Date.now()}`,
      ...payload,
      is_read: false,
      created_at: new Date().toISOString(),
    });
    localStorage.setItem('farmdirect_notifications', JSON.stringify(list));
  },
};
