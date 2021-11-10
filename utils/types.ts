import { Request } from 'express';
import { ItineraryMember } from '../src/entities/itinerary-member.entity';

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

export interface PaymentWebhookPayloadResponse {
  action: string;
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
  card: {
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
  };
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
  refunds: [];
  shipping_amount: number;
  sponsor_id: any;
  statement_descriptor: string;
  status: string;
  status_detail: string;
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

export type PaymentWebhookNotificationTypes =
  | 'payment'
  | 'mp-connect'
  | 'plan'
  | 'subscription'
  | 'invoice';
