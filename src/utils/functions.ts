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
