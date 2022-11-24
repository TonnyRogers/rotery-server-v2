import { stateRegionList } from './state-region';

export function formatChatName(userId: number, ownerId: number) {
  const idsArr = [userId, ownerId];
  const sortedArr = idsArr.sort();
  return `chat:${sortedArr[0]}and${sortedArr[1]}`;
}

export function formatDMName(userId: number, ownerId: number) {
  const idsArr = [userId, ownerId];
  const sortedArr = idsArr.sort();
  return `dm:${sortedArr[0]}and${sortedArr[1]}`;
}

export function findRegionByState(state: string) {
  if (!state) return 'unknow';
  return stateRegionList.find((item) => item.state === state).region;
}

export function validateCPF(cpf: string) {
  const exceptionArr = [
    '11111111111',
    '22222222222',
    '33333333333',
    '44444444444',
    '55555555555',
    '66666666666',
    '77777777777',
    '88888888888',
    '99999999999',
    '00000000000',
  ];

  if (exceptionArr.includes(cpf)) return false;

  const numberArr = cpf.match(/\d/g).map(Number);
  const firstValidatior = [10, 9, 8, 7, 6, 5, 4, 3, 2];
  const secondValidator = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2];
  let firstValidationValue = 0;
  let secondValidationValue = 0;

  numberArr.forEach((value, index) => {
    if (index < 9) {
      firstValidationValue += value * firstValidatior[index];
    }
  });

  firstValidationValue = (firstValidationValue * 10) % 11;
  const firstRest =
    firstValidationValue === 11 || firstValidationValue === 10
      ? 0
      : firstValidationValue;

  const firstValidationResult = firstRest === numberArr[9];

  if (!firstValidationResult) {
    return false;
  }

  numberArr.forEach((value, index) => {
    if (index < 10) {
      secondValidationValue += value * secondValidator[index];
    }
  });

  // ((secondValidationValue * 100) % 3) / 100 to decimal values (usefull)
  secondValidationValue = (secondValidationValue * 10) % 11;
  const secondRest =
    secondValidationValue === 11 || secondValidationValue === 10
      ? 0
      : secondValidationValue;

  const secondValidationResult = secondRest === numberArr[10];

  if (!secondValidationResult) {
    return false;
  }

  return true;
}
