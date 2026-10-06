import { http } from "../../../api/axios";
import type { Credentials, User } from "../auth.types";

export const authApi = {
  register: (c: Credentials) =>
    http.post<User>("/auth/register", c).then((r) => r.data),
  login: (c: Credentials) =>
    http.post<{ user: User }>("/auth/login", c).then((r) => r.data.user),
  me: () => http.get<{ user: User }>("/auth/me").then((r) => r.data.user),
  logout: () => http.post("/auth/logout").then(() => undefined),
};
