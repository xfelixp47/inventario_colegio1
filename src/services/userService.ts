
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

function fromHex(hex: string): Uint8Array {
  const values = hex.match(/.{2}/g) ?? [];
  return new Uint8Array(values.map((value) => parseInt(value, 16)));
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

  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: fromHex(salt) as BufferSource,
      iterations: 210000,
      hash: "SHA-256",
    },
    key,
    256
  );

  return toHex(new Uint8Array(bits));
}

export const userService = {
  getUsers(): CreatedUser[] {
    try {
      const data = localStorage.getItem(KEY);
      return data ? (JSON.parse(data) as CreatedUser[]) : [];
    } catch {
      return [];
    }
  },

  saveUsers(users: CreatedUser[]) {
    localStorage.setItem(KEY, JSON.stringify(users));
    window.dispatchEvent(new Event("donbosco:users-changed"));
  },

  async createUser(data: {
    name: string;
    carnet: string;
    password: string;
    role: UserRole;
  }): Promise<CreatedUser> {
    if (!data.name.trim() || !data.carnet.trim()) {
      throw new Error("Completa el nombre y el carnet.");
    }

    if (data.password.length < 8) {
      throw new Error("La contraseña debe tener al menos 8 caracteres.");
    }

    if (
      this.getUsers().some(
        (user) => user.carnet === data.carnet.trim()
      )
    ) {
      throw new Error("Ya existe un usuario con ese carnet.");
    }

    const salt = toHex(crypto.getRandomValues(new Uint8Array(16)));
    const passwordHash = await hashPassword(data.password, salt);

    const newUser: CreatedUser = {
      id: crypto.randomUUID(),
      name: data.name.trim(),
      carnet: data.carnet.trim(),
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
      (item) => item.carnet === carnet
    );

    if (!user) return null;

    const candidateHash = await hashPassword(
      password,
      user.salt
    );

    if (candidateHash !== user.passwordHash) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      carnet: user.carnet,
      role: user.role,
    };
  },

  deleteUser(id: string) {
    this.saveUsers(this.getUsers().filter((user) => user.id !== id));
  },
};
