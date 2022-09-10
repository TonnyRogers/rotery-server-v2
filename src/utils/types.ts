import { Request } from 'express';

import {
  ItineraryMember,
  PaymentStatus,
} from '@/entities/itinerary-member.entity';
import { User } from '@/entities/user.entity';

import { AppRoutes, WelcomeStepListType } from './enums';

export interface RequestUser extends Request {
  user: { userId: number };
}

export interface ParamId {
  id: number;
}

export type PageMeta = {
  currentPage: number;
  itemCount: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
};
export interface PaginatedResponse<T> {
  items: T[];
  meta: PageMeta;
}

type ItineraryMemberInterface = typeof ItineraryMember;

export type FullMemberResponse = ItineraryMemberInterface;

export interface CustomMemberResponse
  extends Omit<FullMemberResponse, 'itinerary'> {
  itinerary: number;
}

export enum NotificationSubject {
  newMessage = 'Nova Mensagem',
  newChat = 'Mensagem no Chat',
  locationRate = 'Avaliar Chat',
  itineraryUpdated = 'Roteiro Atualizado',
  itineraryDeleted = 'Roteiro Removido',
  memberRequest = 'Novo Membro',
  memberAccept = 'Solicitação Aprovada',
  memberReject = 'Solicitação Negada',
  memberPromoted = 'Promovido Como Admin',
  memberDemoted = 'Removido Como Admin',
  itineraryQuestion = 'Nova Pergunta',
  itineraryAnswer = 'Pergunta Respondida',
  newConnection = 'Nova Solicitação',
  newConnectionAccepted = 'Nova Conexão',
  itineraryRate = 'Avaliar Roteiro',
  connectionBlock = 'Conexão Bloqueada',
  connectionUnblock = 'Conexão Desbloqueada',
}

export type PaymentWebHookActionTypes = 'payment.updated' | 'payment.created';
export interface PaymentWebhookPayloadResponse {
  action: PaymentWebHookActionTypes;
  api_version: string;
  data: {
    id: string;
  };
  date_created: string;
  id: number;
  live_mode: boolean;
  type: PaymentWebhookNotificationTypes;
  user_id: string;
}

export interface CustomerCard {
  cardholder: {
    identification: {
      number: string;
      type: string;
    };
    name: string;
  };
  date_created: string;
  date_last_updated: string;
  expiration_month: number;
  expiration_year: number;
  first_six_digits: string;
  id: number;
  last_four_digits: string;
}

export interface CustomerAddress {
  id: string;
  zip_code: string;
  street_name: string;
  street_number: string;
}

export type PaymentDetailStatus =
  | 'approved'
  | 'in_process'
  | 'rejected'
  | 'refunded'
  | 'cancelled';
export interface PaymentDetailsReponse {
  acquirer_reconciliation: [];
  additional_info: {
    authentication_code?: any;
    available_balance?: any;
    nsu_processadora?: any;
  };
  authorization_code: number;
  binary_mode: boolean;
  brand_id: number;
  call_for_authorize_id: number;
  captured: boolean;
  card: CustomerCard;
  charges_details: [];
  collector_id: number;
  corporation_id: number;
  counter_currency: number;
  coupon_amount: number;
  currency_id: string;
  date_approved: string;
  date_created: string;
  date_last_updated: string;
  date_of_expiration: any;
  deduction_schema: any;
  description: string;
  differential_pricing_id: any;
  external_reference: string;
  fee_details: [
    {
      amount: number;
      fee_payer: string;
      type: string;
    },
  ];
  id: number;
  installments: number;
  integrator_id: number;
  issuer_id: string;
  live_mode: boolean;
  marketplace_owner: any;
  merchant_account_id: any;
  merchant_number: any;
  metadata: Record<string, unknown>;
  money_release_date: string;
  money_release_schema: any;
  notification_url: string;
  operation_type: string;
  order: Record<string, unknown>;
  payer: {
    first_name: any;
    last_name: any;
    email: string;
    identification: {
      number: string;
      type: string;
    };
    phone: {
      area_code: any;
      number: any;
      extension: any;
    };
    type: any;
    entity_type: any;
    id: string;
  };
  payment_method_id: string;
  payment_type_id: string;
  platform_id: any;
  point_of_interaction: {
    business_info: {
      sub_unit: string;
      unit: string;
    };
    type: string;
  };
  pos_id: any;
  processing_mode: string;
  refunds: RefundPaymentPayload[];
  shipping_amount: number;
  sponsor_id: any;
  statement_descriptor: string;
  status: PaymentDetailStatus;
  status_detail:
    | ApprovedPaymentStatusDetail
    | InProcessPaymentStatusDetail
    | RejectedPaymentStatusDetail;
  store_id: any;
  taxes_amount: number;
  transaction_amount: number;
  transaction_amount_refunded: number;
  transaction_details: {
    acquirer_reference: any;
    external_resource_url: any;
    financial_institution: any;
    installment_amount: number;
    net_received_amount: number;
    overpaid_amount: number;
    payable_deferral_period: any;
    payment_method_reference_id: any;
    total_paid_amount: number;
  };
}

export type ApprovedPaymentStatusDetail =
  | 'accredited'
  | 'refunded'
  | 'partially_refunded';

export type InProcessPaymentStatusDetail =
  | 'pending_contingency'
  | 'pending_review_manual';

export type RejectedPaymentStatusDetail =
  | 'cc_rejected_bad_filled_card_number'
  | 'cc_rejected_bad_filled_other'
  | 'cc_rejected_bad_filled_security_code'
  | 'cc_rejected_blacklist'
  | 'cc_rejected_call_for_authorize'
  | 'cc_rejected_card_disabled'
  | 'cc_rejected_card_error'
  | 'cc_rejected_duplicated_payment'
  | 'cc_rejected_high_risk'
  | 'cc_rejected_insufficient_amount'
  | 'cc_rejected_invalid_installments'
  | 'cc_rejected_max_attempts'
  | 'cc_rejected_other_reason'
  | 'cc_rejected_bad_filled_date';

export enum ProcessPaymentType {
  ITINERARY = 'itinerary',
  SUBSCRIPTION = 'subscription',
  TIP = 'tip',
}

export type PaymentWebhookNotificationTypes =
  | 'payment'
  | 'mp-connect'
  | 'plan'
  | 'subscription_preapproval' // subscription
  | 'subscription_preapproval_plan' // plan subscription
  | 'subscription_authorized_payment'; // recurrent payment

export interface RefundPaymentPayload {
  adjustment_amount: number;
  amount: number;
  date_created: string;
  external_refund_id: null;
  funder: null;
  id: number;
  labels: [];
  metadata: Record<string, unknown>;
  partition_details: [];
  payment_id: number;
  reason: null;
  refund_mode: string;
  source: {
    id: string;
    name: string;
    type: string;
  };
  status: string;
  unique_sequence_number: null;
}

export interface CreateCustomerResponse {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: {
    area_code: string;
    number: string;
  };
  identification: {
    type: string;
    number: string;
  };
  address: CustomerAddress;
  date_registered: string;
  description: string;
  date_created: string;
  date_last_updated: string;
  metadata: {
    source_sync: string;
  };
  default_card: string;
  default_address: string;
  cards: CustomerCard[];
  addresses: CustomerAddress[];
  live_mode: boolean;
  user_id: number;
  merchant_id: number;
  client_id: number;
  status: string;
}

export interface PaymentRefundResponse {
  id: number;
  payment_id: number;
  amount: number;
  metadata: Record<string, unknown>;
  source: {
    id: number;
    name: string;
    type: string;
  };
  date_created: string;
  unique_sequence_number: string;
  refund_mode: string;
  adjustment_amount: number;
  status: string;
  reason: string;
  labels: string[];
  partition_details: string[];
}

export interface ItineraryMemberProps {
  id: string;
  isAdmin: boolean;
  isAccepted: boolean;
  itinerary: number;
  user: User;
  paymentId?: string | null;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface MemberWithPaymentResponse extends ItineraryMemberProps {
  payment: PaymentDetailsReponse;
}
export interface Revenue {
  id: string;
  member: {
    username: string;
    avatar: string;
  };
  itinerary: {
    id: number;
    name: string;
    begin: Date;
  };
  paymentStatus: PaymentStatus;
  amount: number;
  createdAt: Date;
}
export interface FindAllMemberRevenuesResponse {
  revenues: Revenue[];
  total: number;
}

export type EmailHelpRequestTypeTypes =
  | 'payment'
  | 'itinerary'
  | 'revenue'
  | 'other';

export interface CreatePlanPayload {
  back_url?: string;
  reason: string;
  auto_recurring: {
    frequency: string;
    frequency_type: 'months' | 'days';
    transaction_amount: number;
    currency_id: 'BRL';
    repetitions: number;
    free_trial?: {
      frequency_type: 'months' | 'days';
      frequency: string;
    };
  };
}

export interface CreatePlanResponse {
  id: string;
  back_url: string;
  collector_id: number;
  application_id: number;
  reason: string;
  status: string;
  date_created: string;
  last_modified: string;
  init_point: string;
  sandbox_init_point: string;
  auto_recurring: {
    frequency: number;
    frequency_type: 'months' | 'days';
    transaction_amount: number;
    currency_id: 'BRL';
    repetitions: number;
    free_trial: {
      frequency: number;
      frequency_type: 'months' | 'days';
    };
  };
}

export interface CreateSubscriptionResponse {
  id: string;
  payer_id: number;
  payer_email: string;
  back_url: string;
  collector_id: number;
  application_id: number;
  status: 'pending' | 'authorized';
  reason: string;
  date_created: string;
  last_modified: string;
  init_point: string;
  sandbox_init_point: string;
  preapproval_plan_id: string;
  auto_recurring: {
    frequency: number;
    frequency_type: 'months' | 'days';
    transaction_amount: number;
    currency_id: string;
    start_date: string;
    end_date: string;
  };
  payment_method_id: string;
  card_id: string;
}

export interface SearchSubscriptionResult {
  id: string;
  status: 'authorized' | 'paused' | 'pending' | 'cancelled';
  reason: string;
  summarized: {
    quotas: number;
    semaphore: string;
    charged_quantity: number;
    pending_charge_quantity: number;
    charged_amount: number;
    pending_charge_amount: number;
    last_charged_date: string;
    last_charged_amount: number;
  };
  payer_id: number;
  back_url: string;
  collector_id: number;
  application_id: number;
  date_created: string;
  last_modified: string;
  init_point: string;
  sandbox_init_point: string;
  preapproval_plan_id: string;
  auto_recurring: {
    frequency: number;
    frequency_type: 'months' | 'days';
    transaction_amount: number;
    currency_id: 'BRL';
    start_date: string;
    end_date: string;
  };
  next_payment_date: string;
  payment_method_id: 'master' | 'visa' | 'amex';
  payer_first_name: string;
  payer_last_name: string;
}

export interface MLPaginatedResponse<T> {
  paging: {
    offset: number;
    limit: number;
    total: number;
  };
  results: T[];
}

export type MLPaymentMethods = 'visa' | 'master' | 'hipercard' | 'amex' | 'elo';

export type WelcomeStepItem = {
  type: WelcomeStepListType;
  title: string;
  text: string;
  appNavigationTarget: AppRoutes;
  done: boolean;
};
