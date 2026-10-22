
import { storageService } from "./storageService";

export type InventoryItem = {
  id: number;
  name: string;
  code: string;
  category: string;
  quantity: number;
  available: number;
  status: "Disponible" | "Prestado" | "Stock bajo";
  location: string;
  emoji: string;
};

export type LoanRecord = {
  id: number;
  person: string;
  course: string;
  item: string;
  code: string;
  quantity?: number;
  loanDate: string;
  returnDate: string;
  status:
    | "Pendiente"
    | "Activo"
    | "Devuelto"
    | "Vencido"
    | "Rechazado";
  initials: string;
  requesterId?: string;
};

const ITEMS_KEY = "donbosco_inventory_v2";
const LOANS_KEY = "donbosco_loans_v2";

const initialItems: InventoryItem[] = [
  {
    id: 1,
    name: "Proyector Epson X49",
    code: "DB-001",
    category: "Audiovisuales",
    quantity: 4,
    available: 4,
    status: "Disponible",
    location: "Sala audiovisual",
    emoji: "📽️",
  },
  {
    id: 2,
    name: "Micrófono inalámbrico",
    code: "DB-002",
    category: "Audio",
    quantity: 8,
    available: 8,
    status: "Disponible",
    location: "Depósito principal",
    emoji: "🎙️",
  },
  {
    id: 3,
    name: "Laptop Lenovo IdeaPad",
    code: "DB-003",
    category: "Computación",
    quantity: 10,
    available: 10,
    status: "Disponible",
    location: "Sala de computación",
    emoji: "💻",
  },
  {
    id: 4,
    name: "Balón de fútbol",
    code: "DB-004",
    category: "Deportes",
    quantity: 15,
    available: 15,
    status: "Disponible",
    location: "Depósito deportivo",
    emoji: "⚽",
  },
  {
    id: 5,
    name: "Sillas plásticas",
    code: "DB-005",
    category: "Mobiliario",
    quantity: 40,
    available: 40,
    status: "Disponible",
    location: "Almacén",
    emoji: "🪑",
  },
  {
    id: 6,
    name: "Microscopio escolar",
    code: "DB-006",
    category: "Laboratorio",
    quantity: 6,
    available: 6,
    status: "Disponible",
    location: "Laboratorio",
    emoji: "🔬",
  },
];

function updateStatus(item: InventoryItem): InventoryItem {
  const available = Math.max(
    0,
    Math.min(item.quantity, item.available)
  );

  return {
    ...item,
    available,
    status:
      available === 0
        ? "Prestado"
        : available <=
          Math.max(1, Math.floor(item.quantity * 0.2))
        ? "Stock bajo"
        : "Disponible",
  };
}

function notify() {
  window.dispatchEvent(new Event("donbosco:changed"));
}

function loanQuantity(loan: LoanRecord): number {
  return loan.quantity ?? 1;
}

export const inventoryStore = {
  getItems(): InventoryItem[] {
    const saved =
      storageService.get<InventoryItem[]>(ITEMS_KEY);

    return (saved ?? initialItems).map(updateStatus);
  },

  setItems(items: InventoryItem[]): void {
    storageService.set(
      ITEMS_KEY,
      items.map(updateStatus)
    );

    notify();
  },

  getLoans(): LoanRecord[] {
    return storageService.get<LoanRecord[]>(LOANS_KEY) ?? [];
  },

  setLoans(loans: LoanRecord[]): void {
    storageService.set(LOANS_KEY, loans);
    notify();
  },

  // ENVIAR SOLICITUD

  requestLoan(loan: LoanRecord): void {
    const quantity = loanQuantity(loan);

    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new Error("La cantidad solicitada no es válida.");
    }

    const item = this.getItems().find(
      (i) => i.code === loan.code
    );

    if (!item) {
      throw new Error("No se encontró el objeto.");
    }

    if (quantity > item.available) {
      throw new Error(
        `Solo hay ${item.available} unidades disponibles.`
      );
    }

    this.setLoans([
      ...this.getLoans(),
      {
        ...loan,
        quantity,
        status: "Pendiente",
      },
    ]);
  },

  // APROBAR SOLICITUD

  approveLoan(id: number): void {
    const loans = this.getLoans();

    const loan = loans.find(
      (item) => item.id === id
    );

    if (!loan || loan.status !== "Pendiente") return;

    const quantity = loanQuantity(loan);

    const items = this.getItems();

    const item = items.find(
      (i) => i.code === loan.code
    );

    if (!item || item.available < quantity) {
      throw new Error(
        "No hay suficientes unidades para aprobar este préstamo."
      );
    }

    this.setItems(
      items.map((i) =>
        i.code === loan.code
          ? {
              ...i,
              available: i.available - quantity,
            }
          : i
      )
    );

    this.setLoans(
      loans.map((l) =>
        l.id === id
          ? { ...l, status: "Activo" }
          : l
      )
    );
  },

  // RECHAZAR SOLICITUD

  rejectLoan(id: number): void {
    this.setLoans(
      this.getLoans().map((loan) =>
        loan.id === id && loan.status === "Pendiente"
          ? {
              ...loan,
              status: "Rechazado",
            }
          : loan
      )
    );
  },

  // REGISTRAR DEVOLUCIÓN

  returnLoan(id: number): void {
    const loans = this.getLoans();

    const loan = loans.find(
      (l) => l.id === id
    );

    if (
      !loan ||
      !["Activo", "Vencido"].includes(loan.status)
    ) {
      return;
    }

    const quantity = loanQuantity(loan);

    this.setItems(
      this.getItems().map((item) =>
        item.code === loan.code
          ? {
              ...item,
              available: Math.min(
                item.quantity,
                item.available + quantity
              ),
            }
          : item
      )
    );

    this.setLoans(
      loans.map((l) =>
        l.id === id
          ? { ...l, status: "Devuelto" }
          : l
      )
    );
  },
};
