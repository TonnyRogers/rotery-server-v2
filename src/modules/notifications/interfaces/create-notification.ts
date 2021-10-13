import { NotificationAlias } from '../../../entities/notification.entity';

export interface CreateNotificationPayload {
  alias: NotificationAlias;
  content: string;
  subject: string;
  jsonData: Record<string | number, unknown> | null;
}
