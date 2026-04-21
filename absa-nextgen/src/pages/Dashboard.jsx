import AppNav from "../components/AppNav";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="dashboard">
      <AppNav />

      <div className="container">
        <h1>Welcome back, {user?.name}</h1>

        <h2>Your Current Strategy</h2>
        <p>{user?.strategy || "Not selected"}</p>

        <h2>Available Tracks</h2>
        <ul>
          <li>Property</li>
          <li>Balanced</li>
          <li>Catch-Up</li>
        </ul>

        <h2>Simulations Run</h2>
        {user?.simulations?.length > 0 ? (
          user.simulations.map((sim, i) => <p key={i}>{sim}</p>)
        ) : (
          <p>No simulations yet</p>
        )}
      </div>
    </div>
  );
}
