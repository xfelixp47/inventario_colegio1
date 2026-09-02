import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  BarChart3,
  Package,
  Handshake,
  CheckCircle2,
  Clock3,
  TrendingUp,
  Download,
  CalendarDays,
  PieChart,
  Trophy,
  Activity,
  ChevronDown,
} from "lucide-react";

import "./ReportsPage.css";

type Period = "7dias" | "30dias" | "3meses" | "anual";

function ReportsPage() {
  const navigate = useNavigate();

  const [period, setPeriod] = useState<Period>("30dias");

  const reportData = useMemo(() => {
    const reports = {
      "7dias": {
        objects: 128,
        available: 98,
        loans: 21,
        returned: 16,
        growth: 8,
        chart: [7, 12, 9, 18, 14, 21, 16],
        labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
      },

      "30dias": {
        objects: 248,
        available: 187,
        loans: 64,
        returned: 52,
        growth: 14,
        chart: [28, 42, 35, 58, 49, 64, 53],
        labels: [
          "Sem. 1",
          "Sem. 2",
          "Sem. 3",
          "Sem. 4",
          "Sem. 5",
          "Sem. 6",
          "Sem. 7",
        ],
      },

      "3meses": {
        objects: 412,
        available: 305,
        loans: 168,
        returned: 142,
        growth: 21,
        chart: [80, 110, 95, 138, 122, 168, 150],
        labels: [
          "Mar",
          "Abr",
          "May",
          "Jun",
          "Jul",
          "Ago",
          "Sep",
        ],
      },

      anual: {
        objects: 1248,
        available: 932,
        loans: 416,
        returned: 371,
        growth: 32,
        chart: [190, 245, 210, 320, 285, 416, 368],
        labels: [
          "Ene",
          "Mar",
          "May",
          "Jul",
          "Sep",
          "Nov",
          "Dic",
        ],
      },
    };

    return reports[period];
  }, [period]);

  const categories = [
    {
      name: "Mobiliario",
      value: 32,
      total: 78,
      icon: "🪑",
    },
    {
      name: "Deportes",
      value: 24,
      total: 59,
      icon: "⚽",
    },
    {
      name: "Computación",
      value: 18,
      total: 45,
      icon: "💻",
    },
    {
      name: "Laboratorio",
      value: 14,
      total: 35,
      icon: "🔬",
    },
    {
      name: "Audiovisuales",
      value: 12,
      total: 31,
      icon: "📽️",
    },
  ];

  const topObjects = [
    {
      position: 1,
      name: "Laptop Lenovo IdeaPad",
      category: "Computación",
      loans: 36,
      emoji: "💻",
    },
    {
      position: 2,
      name: "Proyector Epson X49",
      category: "Audiovisuales",
      loans: 28,
      emoji: "📽️",
    },
    {
      position: 3,
      name: "Balón de fútbol",
      category: "Deportes",
      loans: 24,
      emoji: "⚽",
    },
    {
      position: 4,
      name: "Micrófono inalámbrico",
      category: "Audio",
      loans: 19,
      emoji: "🎙️",
    },
  ];

  const activities = [
    {
      title: "Préstamo registrado",
      description: "Carlos Ramírez retiró una Laptop Lenovo.",
      time: "Hace 25 min",
      type: "loan",
    },
    {
      title: "Objeto devuelto",
      description: "María González devolvió un Proyector Epson.",
      time: "Hace 1 h",
      type: "return",
    },
    {
      title: "Nuevo objeto",
      description: "Se registraron 4 microscopios escolares.",
      time: "Hace 3 h",
      type: "object",
    },
    {
      title: "Inventario actualizado",
      description: "Se modificó el stock de material deportivo.",
      time: "Ayer",
      type: "update",
    },
  ];

  const maxChartValue = Math.max(...reportData.chart);

  const downloadReport = () => {
    const rows = [
      ["REPORTE INVENTARIO COLEGIO DON BOSCO"],
      [""],
      ["Periodo", period],
      ["Objetos registrados", reportData.objects],
      ["Objetos disponibles", reportData.available],
      ["Préstamos", reportData.loans],
      ["Objetos devueltos", reportData.returned],
      ["Crecimiento", `${reportData.growth}%`],
      [""],
      ["OBJETOS MÁS PRESTADOS"],
      ["Objeto", "Categoría", "Cantidad de préstamos"],
      ...topObjects.map((object) => [
        object.name,
        object.category,
        object.loans,
      ]),
    ];

    const csvContent = rows
      .map((row) =>
        row
          .map((cell) => `"${String(cell)}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "reporte_inventario_don_bosco.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <div className="reports-page">
      {/* VOLVER */}

      <button
        className="reports-back-button"
        onClick={() => navigate("/")}
      >
        <ArrowLeft size={18} />
        Volver al inicio
      </button>

      {/* HEADER */}

      <header className="reports-header">
        <div>
          <span className="reports-eyebrow">
            ANÁLISIS DEL INVENTARIO
          </span>

          <h1>Reportes</h1>

          <p>
            Analiza el movimiento de los recursos del Colegio
            Don Bosco y consulta el rendimiento general del
            inventario.
          </p>
        </div>

        <div className="reports-header-actions">
          <div className="period-select">
            <CalendarDays size={17} />

            <select
              value={period}
              onChange={(e) =>
                setPeriod(e.target.value as Period)
              }
            >
              <option value="7dias">
                Últimos 7 días
              </option>

              <option value="30dias">
                Últimos 30 días
              </option>

              <option value="3meses">
                Últimos 3 meses
              </option>

              <option value="anual">
                Este año
              </option>
            </select>

            <ChevronDown size={15} />
          </div>

          <button
            className="download-report-button"
            onClick={downloadReport}
          >
            <Download size={18} />
            Descargar reporte
          </button>
        </div>
      </header>

      {/* TARJETA DESTACADA */}

      <section className="report-highlight">
        <div className="report-highlight-content">
          <div className="highlight-icon">
            <TrendingUp size={26} />
          </div>

          <div>
            <span>RENDIMIENTO GENERAL</span>

            <h2>
              El inventario tuvo un crecimiento del{" "}
              <strong>{reportData.growth}%</strong>
            </h2>

            <p>
              Se registró mayor actividad en préstamos y
              devoluciones durante el período seleccionado.
            </p>
          </div>
        </div>

        <div className="highlight-decoration">
          <BarChart3 size={120} strokeWidth={0.8} />
        </div>
      </section>

      {/* ESTADÍSTICAS */}

      <section className="reports-stats">
        <div className="report-stat-card">
          <div className="report-stat-icon blue">
            <Package size={24} />
          </div>

          <div>
            <span>Objetos registrados</span>
            <strong>{reportData.objects}</strong>

            <small>
              Total del período
            </small>
          </div>
        </div>

        <div className="report-stat-card">
          <div className="report-stat-icon green">
            <CheckCircle2 size={24} />
          </div>

          <div>
            <span>Disponibles</span>
            <strong>{reportData.available}</strong>

            <small>
              Recursos disponibles
            </small>
          </div>
        </div>

        <div className="report-stat-card">
          <div className="report-stat-icon orange">
            <Handshake size={24} />
          </div>

          <div>
            <span>Préstamos</span>
            <strong>{reportData.loans}</strong>

            <small>
              Movimientos realizados
            </small>
          </div>
        </div>

        <div className="report-stat-card">
          <div className="report-stat-icon purple">
            <Clock3 size={24} />
          </div>

          <div>
            <span>Devueltos</span>
            <strong>{reportData.returned}</strong>

            <small>
              Préstamos finalizados
            </small>
          </div>
        </div>
      </section>

      {/* GRÁFICOS */}

      <section className="reports-main-grid">
        {/* GRÁFICO PRÉSTAMOS */}

        <article className="report-card loans-chart-card">
          <div className="report-card-header">
            <div>
              <span className="report-card-label">
                MOVIMIENTO
              </span>

              <h2>Actividad de préstamos</h2>

              <p>
                Cantidad de préstamos realizados durante el período.
              </p>
            </div>

            <div className="chart-indicator">
              <span></span>
              Préstamos
            </div>
          </div>

          <div className="chart-area">
            <div className="chart-lines">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>

            <div className="bars-container">
              {reportData.chart.map((value, index) => {
                const height =
                  (value / maxChartValue) * 100;

                return (
                  <div
                    className="chart-column"
                    key={index}
                  >
                    <div className="bar-wrapper">
                      <span className="bar-value">
                        {value}
                      </span>

                      <div
                        className="chart-bar"
                        style={{
                          height: `${Math.max(
                            height,
                            10
                          )}%`,
                        }}
                      ></div>
                    </div>

                    <span className="bar-label">
                      {reportData.labels[index]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </article>

        {/* CATEGORÍAS */}

        <article className="report-card category-report-card">
          <div className="report-card-header">
            <div>
              <span className="report-card-label">
                DISTRIBUCIÓN
              </span>

              <h2>Categorías</h2>

              <p>
                Distribución de objetos registrados.
              </p>
            </div>

            <div className="round-header-icon">
              <PieChart size={19} />
            </div>
          </div>

          <div className="category-report-list">
            {categories.map((category) => (
              <div
                className="category-report-row"
                key={category.name}
              >
                <div className="category-report-info">
                  <div className="category-report-emoji">
                    {category.icon}
                  </div>

                  <div>
                    <strong>
                      {category.name}
                    </strong>

                    <span>
                      {category.total} objetos
                    </span>
                  </div>
                </div>

                <div className="category-percentage">
                  <strong>
                    {category.value}%
                  </strong>

                  <div className="percentage-track">
                    <div
                      className="percentage-fill"
                      style={{
                        width: `${category.value}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            className="report-card-footer-button"
            onClick={() =>
              navigate("/categorias")
            }
          >
            Ver todas las categorías
          </button>
        </article>
      </section>

      {/* PARTE INFERIOR */}

      <section className="reports-bottom-grid">
        {/* MÁS PRESTADOS */}

        <article className="report-card top-items-card">
          <div className="report-card-header">
            <div>
              <span className="report-card-label">
                RANKING
              </span>

              <h2>Objetos más prestados</h2>

              <p>
                Recursos con mayor movimiento.
              </p>
            </div>

            <div className="round-header-icon gold">
              <Trophy size={19} />
            </div>
          </div>

          <div className="top-objects-list">
            {topObjects.map((object) => (
              <div
                className="top-object-row"
                key={object.position}
              >
                <div
                  className={`ranking-position position-${object.position}`}
                >
                  {object.position}
                </div>

                <div className="top-object-image">
                  {object.emoji}
                </div>

                <div className="top-object-info">
                  <strong>
                    {object.name}
                  </strong>

                  <span>
                    {object.category}
                  </span>
                </div>

                <div className="top-object-loans">
                  <strong>
                    {object.loans}
                  </strong>

                  <span>
                    préstamos
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            className="report-card-footer-button"
            onClick={() =>
              navigate("/inventario")
            }
          >
            Ver inventario completo
          </button>
        </article>

        {/* ACTIVIDAD */}

        <article className="report-card activity-report-card">
          <div className="report-card-header">
            <div>
              <span className="report-card-label">
                ACTIVIDAD
              </span>

              <h2>Movimientos recientes</h2>

              <p>
                Últimas acciones realizadas en el sistema.
              </p>
            </div>

            <div className="round-header-icon">
              <Activity size={19} />
            </div>
          </div>

          <div className="report-activity-list">
            {activities.map((activity, index) => (
              <div
                className="report-activity-row"
                key={index}
              >
                <div
                  className={`activity-timeline-icon ${activity.type}`}
                >
                  {activity.type === "loan" && (
                    <Handshake size={16} />
                  )}

                  {activity.type === "return" && (
                    <CheckCircle2 size={16} />
                  )}

                  {activity.type === "object" && (
                    <Package size={16} />
                  )}

                  {activity.type === "update" && (
                    <Activity size={16} />
                  )}
                </div>

                <div className="activity-content">
                  <strong>
                    {activity.title}
                  </strong>

                  <p>
                    {activity.description}
                  </p>
                </div>

                <span className="activity-time">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>

          <button
            className="report-card-footer-button"
            onClick={() =>
              navigate("/prestamos")
            }
          >
            Revisar préstamos
          </button>
        </article>
      </section>
    </div>
  );
}

export default ReportsPage;