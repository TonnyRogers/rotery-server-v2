import { PaymentStatus } from '@/entities/itinerary-member.entity';
import { LocationDetailingType } from '@/entities/location-detailing.entity';

export const itineraryRelations: any = [
  'owner.ratings',
  'owner.profile.file',
  'photos.file',
  'activities.activity',
  'lodgings.lodging',
  'transports.transport',
  'members.user.profile.file',
  'questions.owner.profile.file',
];

export const EmailSubject = {
  'welcome-user': 'Bem vindo a Mochilee',
  'user-recover-password': 'Recuperação de senha',
  'user-new-password': 'Senha atualizada',
  'user-request-help': 'Ajuda Solicitada 🖐',
  'itinerary-payment-updates': 'Atualização de pagamento do roteiro.',
  'itinerary-finish': 'Oba! Roteiro Finalizado 📌.',
  'welcome-user-subscription': '👏 Bem-vindo(a) a assinatura ✨',
  'subscription-payment-updates': 'Atualização de pagamento da assinatura ✨',
  accredited: 'Muito bem, pagamento foi aprovado!',
  partially_refunded: 'Fizemos a devolução parcial do seu pagamento.',
  refunded: 'Fizemos a devolução do seu pagamento.',
  pending_contingency: 'Pagamento em processamento',
  pending_review_manual: 'Pagamento em processamento',
  cc_rejected_bad_filled_card_number:
    'Erro no pagamento: Revise o número do cartão.',
  cc_rejected_bad_filled_other: 'Erro no pagamento: Revise os dados.',
  cc_rejected_bad_filled_security_code:
    'Erro no pagamento: Revise o código de segurança.',
  cc_rejected_blacklist:
    'Erro no pagamento: Não pudemos processar seu pagamento.',
  cc_rejected_call_for_authorize: 'Erro no pagamento: ',
  cc_rejected_card_disabled: 'Erro no pagamento: ',
  cc_rejected_card_error:
    'Erro no pagamento: Não conseguimos processar seu pagamento',
  cc_rejected_duplicated_payment: 'Erro no pagamento: ',
  cc_rejected_high_risk: 'Erro no pagamento: ',
  cc_rejected_insufficient_amount: 'Erro no pagamento: Saldo insuficiente.',
  cc_rejected_invalid_installments:
    'Erro no pagamento: Limite de tentativas permitido.',
  cc_rejected_max_attempts: 'Erro no pagamento: Escolha outro cartão.',
  cc_rejected_other_reason: 'Erro no pagamento: ',
  cc_rejected_bad_filled_date: 'Erro no pagamento: Pagamento não processado.',
};

export const EmailSectionTitle = {
  'welcome-user': 'Bem-vindo(a) a mais nova comunidade de viajantes!',
  'user-recover-password': 'Seu código é " *code* "',
  'user-new-password': 'Sua senha foi alterada',
  'user-request-help': 'Alguém precisa de ajuda',
  'itinerary-finish': 'Roteiro Finalizado',
  'itinerary-payment-updates': 'Atualização do seu pagamento',
  'welcome-user-subscription': 'Bem-vindo(a) assinante',
  'subscription-payment-updates': 'Atualizações de pagamento do seu plano',
};

export const EmailTypes = {
  welcome: 'welcome-user',
  recover: 'user-recover-password',
  password: 'user-new-password',
  'help-request': 'user-request-help',
  'itinerary-payment': 'itinerary-payment-updates',
  'itinerary-finish': 'itinerary-finish',
  'welcome-subscription': 'welcome-user-subscription',
  'subscription-payment': 'subscription-payment-updates',
};

export const EmailHelpRequestType = {
  payment: 'problema com pagamento',
  itinerary: 'problema com roteiro',
  revenue: 'problema com faturamento',
  guideActivation: 'ativação de guias',
  other: 'problema no app',
};

export const Email = {};

export const AppColors = {
  white: '#FFF',
  appBackground: '#f9f9f9',
  appBackgroundDarker: '#ebebeb',
  green: '#3dc77b',
  greenTransparent: 'rgba(61, 199, 123, 0.2)',
  blue: '#4885fd',
  blueTransparent: 'rgba(72, 133, 253, 0.2)',
  blueDark: '#3e44c7',
  red: '#f57373',
  orange: '#f5ca73',
  yellow: '#f5df73',
  disabled: '#ECECEC',
  primaryText: '#262626',
  secondaryText: '#7a7a7a',
  disabledText: '#BEBEBE',
  darketText: '#0D0D0D',
  borderBottom: '#cfcfcf',
  transparent: 'transparent',
};

export const paymentStatusColor = {
  [PaymentStatus.PAID]: AppColors.green,
  [PaymentStatus.PENDING]: AppColors.orange,
  [PaymentStatus.REFUNDED]: AppColors.blue,
  [PaymentStatus.REFUSED]: AppColors.red,
};

export const paymentStatusRole = {
  [PaymentStatus.PAID]: 'Processado',
  [PaymentStatus.PENDING]: 'Em andamento',
  [PaymentStatus.REFUNDED]: 'Estornado',
  [PaymentStatus.REFUSED]: 'Recusado',
};

export const detailingText = {
  [LocationDetailingType.ANIMAL_PRESENCE]: '*V* animais por perto',
  [LocationDetailingType.CHILDREN_ACCESS]: '*V* crianças',
  [LocationDetailingType.DURATION]: 'Aproximadamente *Q**M* de caminhada',
  [LocationDetailingType.FOOD_PROXIMITY]: '*V* local para refeição (*Q**M*)',
  [LocationDetailingType.GUIDE_REQUESTED]: 'Guia *V*',
  [LocationDetailingType.MOBILE_SIGNAL]: '*V* sinal de celular por perto',
  [LocationDetailingType.MOBILITY_ACCESS]:
    '*V* acesso para mobilidade reduzida',
  [LocationDetailingType.WEEKLY_PRESENCE]: 'Maior movimento durante *M*',
};

export const formatDetailingValidation = {
  [LocationDetailingType.ANIMAL_PRESENCE]: 'Possui|Não Possui'.split('|'),
  [LocationDetailingType.CHILDREN_ACCESS]: 'Permitido|Não permitido'.split('|'),
  [LocationDetailingType.DURATION]: '',
  [LocationDetailingType.FOOD_PROXIMITY]: 'Possui|Não Possui'.split('|'),
  [LocationDetailingType.GUIDE_REQUESTED]: 'obrigatório|não obrigatório'.split(
    '|',
  ),
  [LocationDetailingType.MOBILE_SIGNAL]: 'Com|Sem'.split('|'),
  [LocationDetailingType.MOBILITY_ACCESS]: 'Possui|Não Possui'.split('|'),
  [LocationDetailingType.WEEKLY_PRESENCE]: '',
};
