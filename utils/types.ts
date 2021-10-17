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
  connectionBlock = 'Conexão Bloqueada',
  connectionUnblock = 'Conexão Desbloqueada',
}
