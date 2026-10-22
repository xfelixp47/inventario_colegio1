
import initialUsers from "../data/users.json";

import { storageService } from "../services/storageService";
import { userService } from "../services/userService";

import type {
  LoginCredentials,
  User,
  UserRecord,
} from "../types/auth";

const SESSION_KEY = "app_session";

const defaultUsers = initialUsers as UserRecord[];

export const authRepository = {
  async login(credentials: LoginCredentials): Promise<User | null> {
    const createdUser = await userService.verifyUser(
      credentials.carnet,
      credentials.password
    );

    if (createdUser) {
      storageService.set<User>(SESSION_KEY, createdUser);
      return createdUser;
    }

    // Cuentas originales del proyecto
    const foundUser = defaultUsers.find(
      (user) =>
        user.carnet === credentials.carnet &&
        user.password === credentials.password &&
        !userService
          .getUsers()
          .some((created) => created.carnet === user.carnet)
    );

    if (!foundUser) return null;

    const sessionUser: User = {
      id: foundUser.id,
      name: foundUser.name,
      carnet: foundUser.carnet,
      role: foundUser.role,
    };

    storageService.set<User>(SESSION_KEY, sessionUser);
    return sessionUser;
  },

  logout(): void {
    storageService.remove(SESSION_KEY);
  },

  getCurrentUser(): User | null {
    return storageService.get<User>(SESSION_KEY);
  },

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  },
};
