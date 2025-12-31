export interface DevUser {
  uid: string;
  email: string;
  displayName?: string;
}

export interface AllowedUser {
  uid?: string;
  email: string;
  role: "admin" | "user";
  createdAt: Date;
}
