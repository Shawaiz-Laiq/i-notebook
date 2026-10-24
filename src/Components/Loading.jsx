function Loading() {
  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "15px",
      }}
    >
      <div
        style={{
          width: "55px",
          height: "55px",
          border: "5px solid #e9d5ff",
          borderTop: "5px solid #7c3aed",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />

      <h5 style={{ color: "#7c3aed", margin: 0 }}>
        Loading...
      </h5>

      <p style={{ color: "#777", margin: 0 }}>
        Please wait a moment
      </p>

      <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

export default Loading;