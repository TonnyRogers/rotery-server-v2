export type EmailType =
  | 'welcome-user'
  | 'user-recover-password'
  | 'user-request-help'
  | 'itinerary-payment-updates'
  | 'itinerary-finish'
  | 'welcome-user-subscription'
  | 'subscription-payment-updates'
  | 'user-new-password';

export interface EmailParams {
  mailHeader?: string;
  sectionTitle?: string;
  name: string;
  resetcode?: number;
  activationCode?: number;
  type?: string;
  message?: string;
  data?: Record<string, any>;
  userEmail?: string;
  paymentStatusColor?: string;
  paymentStatus?: string;
  itineraryName?: string;
  itineraryDescription?: string;
  cardBrandImage?: string;
  cardBrand?: string;
  cardLastNumbers?: string;
}

export interface SendEmailParams {
  content: EmailParams;
  to: string;
  type: EmailType;
}
export interface ToQueueParams<T> {
  to: string;
  type: EmailType;
  payload: T;
}

export interface EmailsServiceInterface {
  send(sendProps: SendEmailParams): Promise<any>;
  queue<T>(params: ToQueueParams<T>): Promise<void>;
}
