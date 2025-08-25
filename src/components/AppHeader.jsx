const AppHeader = () => {
  return (
    <header
      style={{
        height: "72px",
        width: "100%",
        backgroundColor: "black",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        color: "#fff",
        fontWeight: "bold",
      }}
    >
      My App Header
    </header>
  );
};

export default AppHeader;
