function SettingsPage() {
  return (
    <div style={{ padding: "35px" }}>
      <h1>Configuración</h1>

      <p>Configura las opciones del sistema.</p>

      <div
        style={{
          padding: "30px",
          marginTop: "30px",
          background: "white",
          borderRadius: "15px",
        }}
      >
        <h3>Configuración del sistema</h3>

        <label>
          <input type="checkbox" defaultChecked />
          {" "}Mostrar notificaciones
        </label>
      </div>
    </div>
  );
}

export default SettingsPage;