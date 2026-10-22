
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Plus,
  Search,
  Handshake,
  Clock3,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  CalendarDays,
  UserRound,
  Package,
  ChevronDown,
  Filter,
  MessageSquareText,
} from "lucide-react";

import {
  inventoryStore,
  type LoanRecord,
} from "../services/inventoryStore";

import { authRepository } from "../repositories/authRepository";

import "./LoansPage.css";

export default function LoansPage() {
  const navigate = useNavigate();
  const user = authRepository.getCurrentUser();
  const isAdmin = user?.role === "ADMIN";

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");

  const [loans, setLoans] = useState<LoanRecord[]>(
    () => inventoryStore.getLoans()
  );

  useEffect(() => {
    const reload = () => setLoans(inventoryStore.getLoans());

    window.addEventListener("storage", reload);
    window.addEventListener("donbosco:changed", reload);

    return () => {
      window.removeEventListener("storage", reload);
      window.removeEventListener("donbosco:changed", reload);
    };
  }, []);

  const visibleLoans = useMemo(
    () =>
      isAdmin
        ? loans
        : loans.filter((loan) => loan.requesterId === user?.id),
    [loans, isAdmin, user?.id]
  );

  const filteredLoans = useMemo(() => {
    return visibleLoans.filter((loan) => {
      const text = search.toLowerCase();

      const matchesSearch =
        loan.person.toLowerCase().includes(text) ||
        loan.item.toLowerCase().includes(text) ||
        loan.course.toLowerCase().includes(text) ||
        loan.code.toLowerCase().includes(text) ||
        (loan.reason ?? "").toLowerCase().includes(text);

      const matchesStatus =
        statusFilter === "Todos" ||
        loan.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [visibleLoans, search, statusFilter]);

  const activeLoans = visibleLoans.filter(
    (loan) => loan.status === "Activo"
  ).length;

  const returnedLoans = visibleLoans.filter(
    (loan) => loan.status === "Devuelto"
  ).length;

  const pendingLoans = visibleLoans.filter(
    (loan) => loan.status === "Pendiente"
  ).length;

  const expiredLoans = visibleLoans.filter(
    (loan) => loan.status === "Vencido"
  ).length;

  const approve = (id: number) => {
    try {
      inventoryStore.approveLoan(id);
      setLoans(inventoryStore.getLoans());
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "No se pudo aprobar."
      );
    }
  };

  const reject = (id: number) => {
    if (!window.confirm("¿Rechazar esta solicitud?")) return;

    inventoryStore.rejectLoan(id);
    setLoans(inventoryStore.getLoans());
  };

  const markAsReturned = (loan: LoanRecord) => {
    if (
      !window.confirm(
        `¿Confirmas la devolución de "${loan.item}" por ${loan.person}?`
      )
    ) {
      return;
    }

    inventoryStore.returnLoan(loan.id);
    setLoans(inventoryStore.getLoans());
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("Todos");
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
            CONTROL DE MOVIMIENTOS
          </span>

          <h1>Préstamos</h1>

          <p>
            Gestiona las solicitudes, los objetos prestados
            y las devoluciones del Colegio Don Bosco.
          </p>
        </div>

        <button
          className="new-loan-button"
          onClick={() => navigate("/prestamos/nuevo")}
        >
          <Plus size={19} />
          {isAdmin ? "Nuevo préstamo" : "Solicitar préstamo"}
        </button>
      </header>

      <section className="loans-stats">
        <div className="loan-stat-card">
          <div className="loan-stat-icon blue">
            <Handshake size={24} />
          </div>
          <div>
            <span>Total préstamos</span>
            <strong>{visibleLoans.length}</strong>
            <small>Registros realizados</small>
          </div>
        </div>

        <div className="loan-stat-card">
          <div className="loan-stat-icon orange">
            <Clock3 size={24} />
          </div>
          <div>
            <span>Pendientes</span>
            <strong>{pendingLoans}</strong>
            <small>Esperando aprobación</small>
          </div>
        </div>

        <div className="loan-stat-card">
          <div className="loan-stat-icon green">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <span>Activos</span>
            <strong>{activeLoans}</strong>
            <small>Objetos prestados</small>
          </div>
        </div>

        <div className="loan-stat-card">
          <div className="loan-stat-icon red">
            <AlertTriangle size={24} />
          </div>
          <div>
            <span>Vencidos</span>
            <strong>{expiredLoans}</strong>
            <small>Requieren atención</small>
          </div>
        </div>
      </section>

      <section className="loans-panel">
        <div className="loans-panel-header">
          <div>
            <h2>
              {isAdmin
                ? "Registro y solicitudes de préstamos"
                : "Mis solicitudes"}
            </h2>

            <p>{filteredLoans.length} registros encontrados</p>
          </div>
        </div>

        <div className="loans-toolbar">
          <div className="loans-search">
            <Search size={19} />

            <input
              type="text"
              placeholder="Buscar persona, objeto o motivo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="loans-filter">
            <Filter size={17} />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="Todos">Todos los estados</option>
              <option value="Pendiente">Pendientes</option>
              <option value="Activo">Activos</option>
              <option value="Devuelto">Devueltos</option>
              <option value="Vencido">Vencidos</option>
              <option value="Rechazado">Rechazados</option>
            </select>

            <ChevronDown size={16} />
          </div>
        </div>

        <div className="loans-table-wrapper">
          <table className="loans-table">
            <thead>
              <tr>
                <th>PERSONA</th>
                <th>OBJETO</th>
                <th>FECHA</th>
                <th>DEVOLUCIÓN</th>
                <th>ESTADO</th>
                <th>ACCIÓN</th>
              </tr>
            </thead>

            <tbody>
              {filteredLoans.map((loan, index) => (
                <tr key={loan.id}>
                  <td>
                    <div className="loan-user">
                      <div
                        className={`loan-user-avatar avatar-${
                          (index % 4) + 1
                        }`}
                      >
                        {loan.initials}
                      </div>

                      <div>
                        <strong>{loan.person}</strong>
                        <span>
                          <UserRound size={11} />
                          {loan.course}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="loan-item">
                      <div className="loan-item-icon">
                        <Package size={17} />
                      </div>

                      <div>
                        <strong>{loan.item}</strong>
                        <span>{loan.code}</span>
                        <span>
                          Cantidad: {loan.quantity ?? 1}
                        </span>
                      </div>
                    </div>

                    {isAdmin && (
                      <div
                        style={{
                          background: "#eff6ff",
                          borderLeft: "3px solid #2563eb",
                          borderRadius: "8px",
                          padding: "11px",
                          marginTop: "12px",
                          maxWidth: "330px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "7px",
                            color: "#1d4ed8",
                            fontSize: "12px",
                            fontWeight: 700,
                            marginBottom: "6px",
                          }}
                        >
                          <MessageSquareText size={15} />
                          MOTIVO DE LA SOLICITUD
                        </div>

                        <p
                          style={{
                            margin: 0,
                            color: "#334155",
                            fontSize: "13px",
                            lineHeight: 1.6,
                            whiteSpace: "pre-wrap",
                            overflowWrap: "anywhere",
                          }}
                        >
                          {loan.reason?.trim() ||
                            "Motivo no registrado (solicitud anterior)."}
                        </p>
                      </div>
                    )}
                  </td>

                  <td>
                    <div className="loan-date">
                      <CalendarDays size={14} />
                      {loan.loanDate}
                    </div>
                  </td>

                  <td>
                    <div className="loan-date">
                      <CalendarDays size={14} />
                      {loan.returnDate}
                    </div>
                  </td>

                  <td>
                    <span
                      className={`loan-status ${
                        loan.status === "Activo"
                          ? "active"
                          : loan.status === "Devuelto"
                          ? "returned"
                          : "expired"
                      }`}
                    >
                      <span className="loan-status-dot"></span>
                      {loan.status}
                    </span>
                  </td>

                  <td>
                    {isAdmin && loan.status === "Pendiente" ? (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <button
                          className="return-loan-button"
                          onClick={() => approve(loan.id)}
                        >
                          <CheckCircle2 size={15} />
                          Aprobar
                        </button>

                        <button
                          className="return-loan-button"
                          onClick={() => reject(loan.id)}
                        >
                          Rechazar
                        </button>
                      </div>
                    ) : isAdmin &&
                      ["Activo", "Vencido"].includes(loan.status) ? (
                      <button
                        className="return-loan-button"
                        onClick={() => markAsReturned(loan)}
                      >
                        <RotateCcw size={15} />
                        Devolver
                      </button>
                    ) : loan.status === "Devuelto" ? (
                      <span className="completed-label">
                        <CheckCircle2 size={15} />
                        Completado
                      </span>
                    ) : (
                      <span>{loan.status}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredLoans.length === 0 && (
            <div className="empty-loans">
              <div className="empty-loans-icon">
                <Handshake size={34} />
              </div>

              <h3>No encontramos préstamos</h3>
              <p>Prueba cambiando los filtros.</p>

              <button onClick={clearFilters}>
                Limpiar filtros
              </button>
            </div>
          )}
        </div>

        {filteredLoans.length > 0 && (
          <div className="loans-panel-footer">
            <span>
              Mostrando {filteredLoans.length} de{" "}
              {visibleLoans.length} préstamos
            </span>

            <div className="loans-summary">
              <span>
                <i className="loan-summary-dot orange"></i>
                {activeLoans} activos
              </span>

              <span>
                <i className="loan-summary-dot red"></i>
                {expiredLoans} vencidos
              </span>

              <span>
                <i className="loan-summary-dot green"></i>
                {returnedLoans} devueltos
              </span>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
