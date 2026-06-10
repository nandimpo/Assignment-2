import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: "#0a1210", padding: 24,
      }}>
        <div style={{
          maxWidth: 440, textAlign: "center", padding: "36px 32px",
          background: "linear-gradient(145deg, #0c1110, #111817)",
          border: "1px solid rgba(132, 167, 148, 0.2)", borderRadius: 22,
        }}>
          <h2 style={{ color: "#f4f6fc", margin: "0 0 10px" }}>Something went wrong</h2>
          <p style={{ color: "#8a9a96", fontSize: "0.88rem", lineHeight: 1.6, margin: "0 0 20px" }}>
            An unexpected error occurred. Your saved data is safe — reload the page to continue where you left off.
          </p>
          <button
            onClick={this.handleReload}
            style={{
              padding: "10px 24px", borderRadius: 20, border: "none", cursor: "pointer",
              background: "linear-gradient(135deg, #d6a85a, #84a794)", color: "#0a1210", fontWeight: 700,
            }}
          >
            Reload app
          </button>
        </div>
      </div>
    );
  }
}
