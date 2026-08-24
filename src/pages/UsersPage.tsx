import initialUsers from "../data/users.json";

function UsersPage() {
  return (
    <div style={{ padding: "35px" }}>
      <h1>Usuarios</h1>

      <p>Usuarios que tienen acceso al sistema.</p>

      <div
        style={{
          background: "white",
          borderRadius: "15px",
          padding: "25px",
          marginTop: "30px",
        }}
      >
        {initialUsers.map((user) => (
          <div
            key={user.id}
            style={{
              padding: "15px",
              borderBottom: "1px solid #eee",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>
              <strong>{user.name}</strong>

              <div style={{ color: "#888" }}>
                Carnet: {user.carnet}
              </div>
            </div>

            <strong>{user.role}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UsersPage;