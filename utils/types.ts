import { Request } from 'express';

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
}

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
