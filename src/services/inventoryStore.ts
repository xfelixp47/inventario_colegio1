
import { storageService } from "./storageService";

export interface InventoryItem {
  id: number;
  name: string;
  code: string;
  category: string;
  quantity: number;
  available: number;
  status: "Disponible" | "Prestado" | "Stock bajo";
  location: string;
  emoji: string;
}

export interface LoanRecord {
  id: number;
  person: string;
  course: string;
  item: string;
  code: string;
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
}

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
  return {
    ...item,
    status:
      item.available === 0
        ? "Prestado"
        : item.available <= Math.max(1, Math.floor(item.quantity * 0.2))
        ? "Stock bajo"
        : "Disponible",
  };
}

function notify() {
  window.dispatchEvent(new Event("donbosco:changed"));
}

export const inventoryStore = {
  getItems(): InventoryItem[] {
    return storageService.get<InventoryItem[]>(ITEMS_KEY) ?? initialItems;
  },

  setItems(items: InventoryItem[]) {
    storageService.set(ITEMS_KEY, items.map(updateStatus));
    notify();
  },

  getLoans(): LoanRecord[] {
    return storageService.get<LoanRecord[]>(LOANS_KEY) ?? [];
  },

  setLoans(loans: LoanRecord[]) {
    storageService.set(LOANS_KEY, loans);
    notify();
  },

  requestLoan(loan: LoanRecord) {
    const item = this.getItems().find((i) => i.code === loan.code);

    if (!item || item.available < 1) {
      throw new Error("No hay unidades disponibles.");
    }

    this.setLoans([...this.getLoans(), loan]);
  },

  approveLoan(id: number) {
    const loan = this.getLoans().find((l) => l.id === id);

    if (!loan || loan.status !== "Pendiente") return;

    const items = this.getItems();
    const item = items.find((i) => i.code === loan.code);

    if (!item || item.available < 1) {
      throw new Error("No hay unidades disponibles.");
    }

    this.setItems(
      items.map((i) =>
        i.code === loan.code
          ? { ...i, available: i.available - 1 }
          : i
      )
    );

    this.setLoans(
      this.getLoans().map((l) =>
        l.id === id ? { ...l, status: "Activo" } : l
      )
    );
  },

  rejectLoan(id: number) {
    this.setLoans(
      this.getLoans().map((l) =>
        l.id === id && l.status === "Pendiente"
          ? { ...l, status: "Rechazado" }
          : l
      )
    );
  },

  returnLoan(id: number) {
    const loan = this.getLoans().find((l) => l.id === id);

    if (!loan || !["Activo", "Vencido"].includes(loan.status)) return;

    this.setItems(
      this.getItems().map((i) =>
        i.code === loan.code
          ? {
              ...i,
              available: Math.min(i.quantity, i.available + 1),
            }
          : i
      )
    );

    this.setLoans(
      this.getLoans().map((l) =>
        l.id === id ? { ...l, status: "Devuelto" } : l
      )
    );
  },
};
