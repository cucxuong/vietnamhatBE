import { Request } from 'express';

export const getTokenFromaReqHeaders = (req: Request): string => {
  return (
    req
      .get('Authorization')
      ?.replace('Bearer', '')
      ?.replace('bearer', '')
      .trim() ?? ''
  );
};
