export interface UserPayload {
  id: string;
  email: string;
  role: string;
}

export interface RequestWithUser extends Express.Request {
  user?: UserPayload;
}
