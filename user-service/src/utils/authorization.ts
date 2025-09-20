export const hasAccess = (reqUser: { id: string; role: string }, targetId: string) => {
  return reqUser.role === 'admin' || reqUser.id === targetId;
};
