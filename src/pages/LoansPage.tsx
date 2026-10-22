
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
  Package,
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
    const reload = () => {
      setLoans(inventoryStore.getLoans());
    };

    window.addEventListener("storage", reload);
    window.addEventListener("donbosco:changed", reload);

    return () => {
      window.removeEventListener("storage", reload);
      window.removeEventListener("donbosco:changed", reload);
    };
  }, []);

  // FILTRAR PRÉSTAMOS

  const visibleLoans = useMemo(() => {
    return loans.filter((loan) => {
      if (!isAdmin && loan.requesterId !== user?.id) {
        return false;
      }

      const text = search.toLowerCase();

      const matchesSearch =
        loan.person.toLowerCase().includes(text) ||
        loan.item.toLowerCase().includes(text) ||
        loan.code.toLowerCase().includes(text) ||
        loan.course.toLowerCase().includes(text);

      const matchesStatus =
        statusFilter === "Todos" ||
        loan.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [loans, search, statusFilter, isAdmin, user?.id]);

  const ownLoans = loans.filter(
    (loan) => isAdmin || loan.requesterId === user?.id
  );

  // ESTADÍSTICAS

  const pending = ownLoans.filter(
    (loan) => loan.status === "Pendiente"
  ).length;

  const active = ownLoans.filter(
    (loan) => loan.status === "Activo"
  ).length;

  const returned = ownLoans.filter(
    (loan) => loan.status === "Devuelto"
  ).length;

  // APROBAR PRÉSTAMO

  const approveLoan = (id: number) => {
    if (!isAdmin) return;

    try {
      inventoryStore.approveLoan(id);

      setLoans(inventoryStore.getLoans());

      alert(
        "Solicitud aprobada correctamente. El inventario fue actualizado."
      );
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "No se pudo aprobar la solicitud."
      );
    }
  };

  // RECHAZAR PRÉSTAMO

  const rejectLoan = (id: number) => {
    if (!isAdmin) return;

    const confirmReject = window.confirm(
      "¿Seguro que deseas rechazar esta solicitud?"
    );

    if (!confirmReject) return;

    inventoryStore.rejectLoan(id);

    setLoans(inventoryStore.getLoans());
  };

  // REGISTRAR DEVOLUCIÓN

  const returnLoan = (id: number) => {
    if (!isAdmin) return;

    const confirmReturn = window.confirm(
      "¿Confirmas que se devolvieron todas las unidades de este préstamo?"
    );

    if (!confirmReturn) return;

    inventoryStore.returnLoan(id);

    setLoans(inventoryStore.getLoans());

    alert("Devolución registrada correctamente.");
  };

  // ESTILO DE BOTONES

  const actionButton = (
    color: string
  ): React.CSSProperties => ({
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
  });

  return (
    <div className="loans-page">
      {/* BOTÓN VOLVER */}

      <button
        className="loans-back-button"
        onClick={() => navigate("/")}
      >
        <ArrowLeft size={18} />
        Volver al inicio
      </button>

      {/* ENCABEZADO */}

      <header className="loans-header">
        <div>
          <span className="loans-eyebrow">
            CONTROL DE PRÉSTAMOS
          </span>

          <h1>
            {isAdmin
              ? "Administrar préstamos"
              : "Mis préstamos"}
          </h1>

          <p>
            {isAdmin
              ? "Revisa, aprueba y administra las solicitudes del Colegio Don Bosco."
              : "Consulta tus solicitudes y el estado de los materiales."}
          </p>
        </div>

        <button
          className="new-loan-button"
          onClick={() => navigate("/prestamos/nuevo")}
        >
          <Plus size={19} />

          {isAdmin
            ? "Nuevo préstamo"
            : "Solicitar objeto"}
        </button>
      </header>

      {/* ESTADÍSTICAS */}

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

      {/* BUSCADOR Y FILTROS */}

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
          <option value="Todos">Todos los estados</option>
          <option value="Pendiente">Pendientes</option>
          <option value="Activo">Activos</option>
          <option value="Devuelto">Devueltos</option>
          <option value="Vencido">Vencidos</option>
          <option value="Rechazado">Rechazados</option>
        </select>
      </div>

      {/* TABLA DE PRÉSTAMOS */}

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
                "Objeto y cantidad",
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
                    whiteSpace: "nowrap",
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
                {/* SOLICITANTE */}

                <td style={{ padding: 14 }}>
                  <strong>{loan.person}</strong>

                  <div style={{ color: "#64748b", marginTop: 5 }}>
                    {loan.course}
                  </div>
                </td>

                {/* OBJETO Y CANTIDAD */}

                <td style={{ padding: 14 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <div
                      style={{
                        width: 39,
                        height: 39,
                        borderRadius: 10,
                        background: "#eaf2ff",
                        color: "#1769df",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Package size={19} />
                    </div>

                    <div>
                      <strong>{loan.item}</strong>

                      <div
                        style={{
                          color: "#64748b",
                          fontSize: 12,
                          marginTop: 4,
                        }}
                      >
                        {loan.code}
                      </div>

                      <div
                        style={{
                          color: "#1769df",
                          fontSize: 13,
                          fontWeight: 700,
                          marginTop: 6,
                        }}
                      >
                        Cantidad: {loan.quantity ?? 1} unidad(es)
                      </div>
                    </div>
                  </div>
                </td>

                {/* FECHA */}

                <td
                  style={{
                    padding: 14,
                    whiteSpace: "nowrap",
                  }}
                >
                  {loan.loanDate}
                </td>

                {/* DEVOLUCIÓN */}

                <td
                  style={{
                    padding: 14,
                    whiteSpace: "nowrap",
                  }}
                >
                  {loan.returnDate}
                </td>

                {/* ESTADO */}

                <td style={{ padding: 14 }}>
                  <span
                    style={{
                      padding: "7px 11px",
                      borderRadius: 20,
                      fontWeight: 600,
                      fontSize: 12,
                      whiteSpace: "nowrap",
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
                      color:
                        loan.status === "Pendiente"
                          ? "#92400e"
                          : loan.status === "Activo"
                          ? "#1d4ed8"
                          : loan.status === "Devuelto"
                          ? "#15803d"
                          : loan.status === "Rechazado"
                          ? "#b91c1c"
                          : "#92400e",
                    }}
                  >
                    {loan.status}
                  </span>
                </td>

                {/* ACCIONES */}

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
                    ["Activo", "Vencido"].includes(
                      loan.status
                    ) && (
                      <button
                        onClick={() => returnLoan(loan.id)}
                        style={actionButton("#2563eb")}
                      >
                        <RotateCcw size={16} />
                        Devolver
                      </button>
                    )}

                  {isAdmin &&
                    ["Devuelto", "Rechazado"].includes(
                      loan.status
                    ) && (
                      <span style={{ color: "#64748b" }}>
                        Finalizado
                      </span>
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

        {/* SIN SOLICITUDES */}

        {visibleLoans.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: 50,
              color: "#64748b",
            }}
          >
            <Handshake
              size={40}
              style={{ margin: "auto" }}
            />

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

export default LoansPage;
