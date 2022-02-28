export const itineraryRelations = [
  'owner.profile.file',
  'photos.file',
  'activities.activity',
  'lodgings.lodging',
  'transports.transport',
  'members.user.profile.file',
  'questions.owner.profile.file',
];

export const EmailSubject = {
  'welcome-user': 'Bem vindo a Rotery',
  'user-recover-password': 'Recuperação de senha',
  'user-new-password': 'Senha atualizada',
  'user-request-help': 'Ajuda Solicitada 🖐',
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
  'itinerary-payment-updates':
    'Atualização do seu pagamento em " *itineraryName* "',
  'subscription-payment-updates': 'Atualizações de pagamento do seu plano',
};

export const EmailTypes = {
  welcome: 'welcome-user',
  recover: 'user-recover-password',
  password: 'user-new-password',
  'help-request': 'user-request-help',
};

export const EmailHelpRequestType = {
  'payment': 'problema com pagamento',
  'itinerary': 'problema com roteiro',
  'revenue': 'problema com faturamento',
  'other': 'problema no app',
}

export const Email = {};
