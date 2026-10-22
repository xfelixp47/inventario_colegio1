
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Clock3,
  Handshake,
} from "lucide-react";

import { authRepository } from "../repositories/authRepository";

import {
  inventoryStore,
  type LoanRecord,
} from "../services/inventoryStore";

import "./LoansPage.css";

function LoansPage() {
  const navigate = useNavigate();

  const user = authRepository.getCurrentUser();
  const isAdmin = user?.role === "ADMIN";

  const [loans, setLoans] = useState<LoanRecord[]>(
    () => inventoryStore.getLoans()
  );

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");

  useEffect(() => {
    const reload = () => setLoans(inventoryStore.getLoans());

    window.addEventListener("storage", reload);
    window.addEventListener("donbosco:changed", reload);

    return () => {
      window.removeEventListener("storage", reload);
      window.removeEventListener("donbosco:changed", reload);
    };
  }, []);

  const visibleLoans = useMemo(() => {
    return loans.filter((loan) => {
      if (!isAdmin && loan.requesterId !== user?.id) {
        return false;
      }

      const text = search.toLowerCase();

      const matchesSearch =
        loan.person.toLowerCase().includes(text) ||
        loan.item.toLowerCase().includes(text) ||
        loan.code.toLowerCase().includes(text);

      const matchesStatus =
        statusFilter === "Todos" ||
        loan.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [loans, search, statusFilter, isAdmin, user?.id]);

  const ownLoans = loans.filter(
    (loan) => isAdmin || loan.requesterId === user?.id
  );

  const pending = ownLoans.filter(
    (loan) => loan.status === "Pendiente"
  ).length;

  const active = ownLoans.filter(
    (loan) => loan.status === "Activo"
  ).length;

  const returned = ownLoans.filter(
    (loan) => loan.status === "Devuelto"
  ).length;

  const approveLoan = (id: number) => {
    if (!isAdmin) return;

    try {
      inventoryStore.approveLoan(id);
      setLoans(inventoryStore.getLoans());
      alert("Solicitud aprobada correctamente.");
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "No se pudo aprobar."
      );
    }
  };

  const rejectLoan = (id: number) => {
    if (!isAdmin) return;

    if (!confirm("¿Seguro que deseas rechazar la solicitud?")) {
      return;
    }

    inventoryStore.rejectLoan(id);
    setLoans(inventoryStore.getLoans());
  };

  const returnLoan = (id: number) => {
    if (!isAdmin) return;

    if (!confirm("¿Confirmas la devolución del objeto?")) {
      return;
    }

    inventoryStore.returnLoan(id);
    setLoans(inventoryStore.getLoans());
  };

  return (
    <div className="loans-page">
      <button
        className="loans-back-button"
        onClick={() => navigate("/")}
      >
        <ArrowLeft size={18} />
        Volver al inicio
      </button>

      <header className="loans-header">
        <div>
          <span className="loans-eyebrow">
            CONTROL DE PRÉSTAMOS
          </span>

          <h1>
            {isAdmin ? "Administrar préstamos" : "Mis préstamos"}
          </h1>

          <p>
            {isAdmin
              ? "Revisa y administra las solicitudes del Colegio Don Bosco."
              : "Consulta el estado de tus solicitudes."}
          </p>
        </div>

        <button
          className="new-loan-button"
          onClick={() => navigate("/prestamos/nuevo")}
        >
          <Plus size={19} />
          {isAdmin ? "Nuevo préstamo" : "Solicitar objeto"}
        </button>
      </header>

      <section className="loans-stats">
        <div className="loan-stat-card">
          <div className="loan-stat-icon blue">
            <Handshake size={24} />
          </div>

          <div>
            <span>Total solicitudes</span>
            <strong>{ownLoans.length}</strong>
            <small>Solicitudes registradas</small>
          </div>
        </div>

        <div className="loan-stat-card">
          <div className="loan-stat-icon orange">
            <Clock3 size={24} />
          </div>

          <div>
            <span>Pendientes</span>
            <strong>{pending}</strong>
            <small>Esperando aprobación</small>
          </div>
        </div>

        <div className="loan-stat-card">
          <div className="loan-stat-icon green">
            <CheckCircle2 size={24} />
          </div>

          <div>
            <span>Activos</span>
            <strong>{active}</strong>
            <small>Objetos prestados</small>
          </div>
        </div>

        <div className="loan-stat-card">
          <div className="loan-stat-icon green">
            <RotateCcw size={24} />
          </div>

          <div>
            <span>Devueltos</span>
            <strong>{returned}</strong>
            <small>Préstamos finalizados</small>
          </div>
        </div>
      </section>

      <div
        style={{
          display: "flex",
          gap: 12,
          margin: "25px 0",
          flexWrap: "wrap",
        }}
      >
        <div style={{ position: "relative", flex: 1 }}>
          <Search
            size={18}
            style={{
              position: "absolute",
              top: 13,
              left: 12,
              color: "#64748b",
            }}
          />

          <input
            placeholder="Buscar solicitudes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "12px 12px 12px 40px",
              border: "1px solid #dbe2ea",
              borderRadius: 10,
            }}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: 12,
            borderRadius: 10,
            border: "1px solid #dbe2ea",
          }}
        >
          {[
            "Todos",
            "Pendiente",
            "Activo",
            "Devuelto",
            "Vencido",
            "Rechazado",
          ].map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
      </div>

      <div
        style={{
          background: "white",
          borderRadius: 18,
          padding: 20,
          overflowX: "auto",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
          }}
        >
          <thead>
            <tr>
              {[
                "Solicitante",
                "Objeto",
                "Fecha",
                "Devolución",
                "Estado",
                "Acciones",
              ].map((title) => (
                <th
                  key={title}
                  style={{
                    padding: 14,
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {title}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {visibleLoans.map((loan) => (
              <tr key={loan.id}>
                <td style={{ padding: 14 }}>
                  <strong>{loan.person}</strong>
                  <div style={{ color: "#64748b" }}>
                    {loan.course}
                  </div>
                </td>

                <td style={{ padding: 14 }}>
                  <strong>{loan.item}</strong>
                  <div style={{ color: "#64748b" }}>
                    {loan.code}
                  </div>
                </td>

                <td style={{ padding: 14 }}>{loan.loanDate}</td>
                <td style={{ padding: 14 }}>{loan.returnDate}</td>

                <td style={{ padding: 14 }}>
                  <span
                    style={{
                      padding: "7px 11px",
                      borderRadius: 20,
                      fontWeight: 600,
                      background:
                        loan.status === "Pendiente"
                          ? "#fef3c7"
                          : loan.status === "Activo"
                          ? "#dbeafe"
                          : loan.status === "Devuelto"
                          ? "#dcfce7"
                          : loan.status === "Rechazado"
                          ? "#fee2e2"
                          : "#fef3c7",
                    }}
                  >
                    {loan.status}
                  </span>
                </td>

                <td style={{ padding: 14 }}>
                  {isAdmin && loan.status === "Pendiente" && (
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => approveLoan(loan.id)}
                        title="Aprobar solicitud"
                        style={actionButton("#16a34a")}
                      >
                        <CheckCircle2 size={17} />
                        Aprobar
                      </button>

                      <button
                        onClick={() => rejectLoan(loan.id)}
                        title="Rechazar solicitud"
                        style={actionButton("#dc2626")}
                      >
                        <XCircle size={17} />
                        Rechazar
                      </button>
                    </div>
                  )}

                  {isAdmin &&
                    ["Activo", "Vencido"].includes(loan.status) && (
                      <button
                        onClick={() => returnLoan(loan.id)}
                        style={actionButton("#2563eb")}
                      >
                        <RotateCcw size={16} />
                        Devolver
                      </button>
                    )}

                  {!isAdmin && (
                    <span style={{ color: "#64748b" }}>
                      {loan.status === "Pendiente"
                        ? "Esperando respuesta"
                        : loan.status === "Activo"
                        ? "Solicitud aprobada"
                        : loan.status === "Rechazado"
                        ? "Solicitud rechazada"
                        : loan.status === "Devuelto"
                        ? "Finalizado"
                        : "Revisar devolución"}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {visibleLoans.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: 50,
              color: "#64748b",
            }}
          >
            <Handshake size={40} style={{ margin: "auto" }} />

            <h3>No hay solicitudes registradas</h3>

            <p>
              {isAdmin
                ? "Las solicitudes de profesores y estudiantes aparecerán aquí."
                : "Todavía no tienes solicitudes."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function actionButton(color: string): React.CSSProperties {
  return {
    background: color,
    color: "white",
    border: "none",
    borderRadius: 8,
    padding: "9px 12px",
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    cursor: "pointer",
    fontWeight: 600,
  };
}

export default LoansPage;
