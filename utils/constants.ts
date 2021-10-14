export const itineraryRelations = [
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
};

export const EmailSectionTitle = {
  'welcome-user': 'Bem-vindo(a) a mais nova comunidade de viajantes!',
  'user-recover-password': 'Seu código é " *code* "',
  'user-new-password': 'Sua senha foi alterada',
};

export const EmailTypes = {
  welcome: 'welcome-user',
  recover: 'user-recover-password',
  password: 'user-new-password',
};
