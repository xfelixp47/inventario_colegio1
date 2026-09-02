import { useMemo, useState } from "react";
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
} from "lucide-react";

import "./LoansPage.css";

type LoanStatus = "Activo" | "Devuelto" | "Vencido";

type Loan = {
  id: number;
  person: string;
  course: string;
  item: string;
  code: string;
  loanDate: string;
  returnDate: string;
  status: LoanStatus;
  initials: string;
};

function LoansPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");

  const [loans, setLoans] = useState<Loan[]>([
    {
      id: 1,
      person: "Carlos Ramírez",
      course: "5° A",
      item: "Laptop Lenovo IdeaPad",
      code: "DB-003",
      loanDate: "28/08/2026",
      returnDate: "05/09/2026",
      status: "Activo",
      initials: "CR",
    },
    {
      id: 2,
      person: "María González",
      course: "3° B",
      item: "Proyector Epson X49",
      code: "DB-001",
      loanDate: "30/08/2026",
      returnDate: "06/09/2026",
      status: "Activo",
      initials: "MG",
    },
    {
      id: 3,
      person: "Luis Sánchez",
      course: "4° A",
      item: "Micrófono inalámbrico",
      code: "DB-002",
      loanDate: "20/08/2026",
      returnDate: "27/08/2026",
      status: "Devuelto",
      initials: "LS",
    },
    {
      id: 4,
      person: "Ana Núñez",
      course: "6° B",
      item: "Balón de fútbol",
      code: "DB-004",
      loanDate: "21/08/2026",
      returnDate: "29/08/2026",
      status: "Vencido",
      initials: "AN",
    },
    {
      id: 5,
      person: "José Vargas",
      course: "2° C",
      item: "Microscopio escolar",
      code: "DB-006",
      loanDate: "31/08/2026",
      returnDate: "07/09/2026",
      status: "Activo",
      initials: "JV",
    },
  ]);

  const filteredLoans = useMemo(() => {
    return loans.filter((loan) => {
      const text = search.toLowerCase();

      const matchesSearch =
        loan.person.toLowerCase().includes(text) ||
        loan.item.toLowerCase().includes(text) ||
        loan.course.toLowerCase().includes(text) ||
        loan.code.toLowerCase().includes(text);

      const matchesStatus =
        statusFilter === "Todos" ||
        loan.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [loans, search, statusFilter]);

  const activeLoans = loans.filter(
    (loan) => loan.status === "Activo"
  ).length;

  const returnedLoans = loans.filter(
    (loan) => loan.status === "Devuelto"
  ).length;

  const expiredLoans = loans.filter(
    (loan) => loan.status === "Vencido"
  ).length;

  const markAsReturned = (loan: Loan) => {
    const confirmReturn = window.confirm(
      `¿Confirmas la devolución de "${loan.item}" por ${loan.person}?`
    );

    if (!confirmReturn) return;

    setLoans((currentLoans) =>
      currentLoans.map((currentLoan) =>
        currentLoan.id === loan.id
          ? {
              ...currentLoan,
              status: "Devuelto",
            }
          : currentLoan
      )
    );
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("Todos");
  };

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

      {/* HEADER */}

      <header className="loans-header">
        <div>
          <span className="loans-eyebrow">
            CONTROL DE MOVIMIENTOS
          </span>

          <h1>Préstamos</h1>

          <p>
            Controla los objetos prestados, las fechas de devolución
            y los materiales pendientes del Colegio Don Bosco.
          </p>
        </div>

        <button
          className="new-loan-button"
          onClick={() => navigate("/prestamos/nuevo")}
        >
          <Plus size={19} />
          Nuevo préstamo
        </button>
      </header>

      {/* ESTADÍSTICAS */}

      <section className="loans-stats">
        <div className="loan-stat-card">
          <div className="loan-stat-icon blue">
            <Handshake size={24} />
          </div>

          <div>
            <span>Total préstamos</span>
            <strong>{loans.length}</strong>
            <small>Registros realizados</small>
          </div>
        </div>

        <div className="loan-stat-card">
          <div className="loan-stat-icon orange">
            <Clock3 size={24} />
          </div>

          <div>
            <span>Activos</span>
            <strong>{activeLoans}</strong>
            <small>Pendientes de devolución</small>
          </div>
        </div>

        <div className="loan-stat-card">
          <div className="loan-stat-icon green">
            <CheckCircle2 size={24} />
          </div>

          <div>
            <span>Devueltos</span>
            <strong>{returnedLoans}</strong>
            <small>Préstamos completados</small>
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

      {/* PANEL */}

      <section className="loans-panel">
        <div className="loans-panel-header">
          <div>
            <h2>Registro de préstamos</h2>

            <p>
              {filteredLoans.length} préstamos encontrados
            </p>
          </div>
        </div>

        {/* BUSCADOR */}

        <div className="loans-toolbar">
          <div className="loans-search">
            <Search size={19} />

            <input
              type="text"
              placeholder="Buscar estudiante, objeto, curso o código..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="loans-filter">
            <Filter size={17} />

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
            >
              <option value="Todos">
                Todos los estados
              </option>

              <option value="Activo">
                Activos
              </option>

              <option value="Devuelto">
                Devueltos
              </option>

              <option value="Vencido">
                Vencidos
              </option>
            </select>

            <ChevronDown size={16} />
          </div>
        </div>

        {/* TABLA */}

        <div className="loans-table-wrapper">
          <table className="loans-table">
            <thead>
              <tr>
                <th>PERSONA</th>
                <th>OBJETO</th>
                <th>FECHA PRÉSTAMO</th>
                <th>DEVOLUCIÓN</th>
                <th>ESTADO</th>
                <th>ACCIÓN</th>
              </tr>
            </thead>

            <tbody>
              {filteredLoans.map((loan, index) => (
                <tr key={loan.id}>
                  {/* PERSONA */}

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

                  {/* OBJETO */}

                  <td>
                    <div className="loan-item">
                      <div className="loan-item-icon">
                        <Package size={17} />
                      </div>

                      <div>
                        <strong>{loan.item}</strong>
                        <span>{loan.code}</span>
                      </div>
                    </div>
                  </td>

                  {/* FECHA PRESTAMO */}

                  <td>
                    <div className="loan-date">
                      <CalendarDays size={14} />
                      {loan.loanDate}
                    </div>
                  </td>

                  {/* DEVOLUCIÓN */}

                  <td>
                    <div
                      className={`loan-date ${
                        loan.status === "Vencido"
                          ? "expired-date"
                          : ""
                      }`}
                    >
                      <CalendarDays size={14} />
                      {loan.returnDate}
                    </div>
                  </td>

                  {/* ESTADO */}

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

                  {/* ACCIÓN */}

                  <td>
                    {loan.status !== "Devuelto" ? (
                      <button
                        className="return-loan-button"
                        onClick={() =>
                          markAsReturned(loan)
                        }
                      >
                        <RotateCcw size={15} />
                        Devolver
                      </button>
                    ) : (
                      <span className="completed-label">
                        <CheckCircle2 size={15} />
                        Completado
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* SIN RESULTADOS */}

          {filteredLoans.length === 0 && (
            <div className="empty-loans">
              <div className="empty-loans-icon">
                <Handshake size={34} />
              </div>

              <h3>No encontramos préstamos</h3>

              <p>
                Prueba cambiando la búsqueda o los filtros.
              </p>

              <button onClick={clearFilters}>
                Limpiar filtros
              </button>
            </div>
          )}
        </div>

        {/* FOOTER */}

        {filteredLoans.length > 0 && (
          <div className="loans-panel-footer">
            <span>
              Mostrando {filteredLoans.length} de{" "}
              {loans.length} préstamos
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

export default LoansPage;