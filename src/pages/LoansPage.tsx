import { Plus, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";

function LoansPage() {
  const navigate = useNavigate();

  const loans = [
    {
      id: 1,
      person: "Carlos Ramírez",
      course: "5° A",
      object: "Laptop Lenovo",
      status: "Activo",
    },
    {
      id: 2,
      person: "María González",
      course: "3° B",
      object: "Proyector Epson",
      status: "Activo",
    },
  ];

  const returnObject = (person: string) => {
    alert(`Préstamo de ${person} marcado como devuelto.`);
  };

  return (
    <div style={{ padding: "35px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h1>Préstamos</h1>
          <p>Control de objetos prestados.</p>
        </div>

        <button
          onClick={() => navigate("/prestamos/nuevo")}
          style={{
            height: "45px",
            padding: "0 20px",
            border: "none",
            borderRadius: "10px",
            background: "#ffc83d",
            color: "#073776",
            fontWeight: "bold",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "7px",
          }}
        >
          <Plus size={18} />
          Nuevo préstamo
        </button>
      </div>

      <div
        style={{
          background: "white",
          marginTop: "30px",
          padding: "25px",
          borderRadius: "15px",
        }}
      >
        {loans.map((loan) => (
          <div
            key={loan.id}
            style={{
              padding: "18px",
              borderBottom: "1px solid #eee",
              display: "grid",
              gridTemplateColumns: "1fr 1fr 120px 150px",
              alignItems: "center",
            }}
          >
            <div>
              <strong>{loan.person}</strong>
              <div>{loan.course}</div>
            </div>

            <strong>{loan.object}</strong>

            <span>{loan.status}</span>

            <button
              onClick={() => returnObject(loan.person)}
              style={{
                border: "none",
                borderRadius: "8px",
                background: "#e5f8ee",
                color: "#198754",
                padding: "10px",
                cursor: "pointer",
              }}
            >
              <RotateCcw size={15} />
              Devolver
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LoansPage;