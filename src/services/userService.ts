
import type { User, UserRole } from "../types/auth";

export interface CreatedUser extends User {
  passwordHash: string;
  salt: string;
}

const KEY = "donbosco_created_users_v1";

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function fromHex(hex: string): Uint8Array<ArrayBuffer> {
  const values = (hex.match(/.{2}/g) ?? []).map(
    (part) => parseInt(part, 16)
  );

  return new Uint8Array(values);
}

async function hashPassword(
  password: string,
  salt: string
): Promise<string> {
  const encoder = new TextEncoder();

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const result = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: fromHex(salt),
      iterations: 210000,
      hash: "SHA-256",
    },
    key,
    256
  );

  return toHex(new Uint8Array(result));
}

export const userService = {
  getUsers(): CreatedUser[] {
    try {
      const data = localStorage.getItem(KEY);

      return data
        ? (JSON.parse(data) as CreatedUser[])
        : [];
    } catch {
      return [];
    }
  },

  saveUsers(users: CreatedUser[]): void {
    localStorage.setItem(KEY, JSON.stringify(users));

    window.dispatchEvent(
      new Event("donbosco:users-changed")
    );
  },

  async createUser(data: {
    name: string;
    carnet: string;
    password: string;
    role: UserRole;
  }): Promise<CreatedUser> {
    const name = data.name.trim();
    const carnet = data.carnet.trim();

    if (!name || !carnet || !data.password) {
      throw new Error("Completa todos los campos.");
    }

    if (data.password.length < 8) {
      throw new Error(
        "La contraseña debe tener al menos 8 caracteres."
      );
    }

    if (
      this.getUsers().some(
        (user) => user.carnet === carnet
      )
    ) {
      throw new Error(
        "Ya existe un usuario con ese carnet."
      );
    }

    const salt = toHex(
      crypto.getRandomValues(new Uint8Array(16))
    );

    const passwordHash = await hashPassword(
      data.password,
      salt
    );

    const newUser: CreatedUser = {
      id: crypto.randomUUID(),
      name,
      carnet,
      role: data.role,
      passwordHash,
      salt,
    };

    this.saveUsers([...this.getUsers(), newUser]);

    return newUser;
  },

  async verifyUser(
    carnet: string,
    password: string
  ): Promise<User | null> {
    const user = this.getUsers().find(
      (item) => item.carnet === carnet.trim()
    );

    if (!user) return null;

    const hash = await hashPassword(
      password,
      user.salt
    );

    if (hash !== user.passwordHash) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      carnet: user.carnet,
      role: user.role,
    };
  },

  updateUser(
    id: string,
    data: {
      name: string;
      role: UserRole;
    }
  ): void {
    if (!data.name.trim()) {
      throw new Error("El nombre no puede estar vacío.");
    }

    const users = this.getUsers();

    if (!users.some((user) => user.id === id)) {
      throw new Error("No se encontró el usuario.");
    }

    this.saveUsers(
      users.map((user) =>
        user.id === id
          ? {
              ...user,
              name: data.name.trim(),
              role: data.role,
            }
          : user
      )
    );
  },

  async changePassword(
    id: string,
    newPassword: string
  ): Promise<void> {
    if (newPassword.length < 8) {
      throw new Error(
        "La contraseña debe tener al menos 8 caracteres."
      );
    }

    const users = this.getUsers();

    if (!users.some((user) => user.id === id)) {
      throw new Error("No se encontró el usuario.");
    }

    const salt = toHex(
      crypto.getRandomValues(new Uint8Array(16))
    );

    const passwordHash = await hashPassword(
      newPassword,
      salt
    );

    this.saveUsers(
      users.map((user) =>
        user.id === id
          ? { ...user, salt, passwordHash }
          : user
      )
    );
  },

  deleteUser(id: string): void {
    this.saveUsers(
      this.getUsers().filter(
        (user) => user.id !== id
      )
    );
  },
};
