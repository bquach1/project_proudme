export const CustomLegend = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        backgroundColor: "#D3D3D3",
        marginTop: "3%",
        width: "40%",
        margin: "0 auto",
        padding: 10,
        border: "1px solid black",
      }}
    >
      <h2 style={{ width: "20%" }}>Legend</h2>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex" }}>
          <div
            style={{
              backgroundColor: "green",
              width: 20,
              height: 20,
              marginRight: 10,
            }}
          />
          Recommended Goal Value
        </div>
        <div style={{ display: "flex" }}>
          <div
            style={{
              backgroundColor: "#A7C7E7",
              width: 20,
              height: 20,
              marginRight: 10,
            }}
          />
          My Goal Value
        </div>
        <div style={{ display: "flex" }}>
          <div
            style={{
              backgroundColor: "#8884d8",
              width: 20,
              height: 20,
              marginRight: 10,
            }}
          />
          My Behavior Value (Met Goal)
        </div>
        <div style={{ display: "flex" }}>
          <div
            style={{
              backgroundColor: "#77DD77",
              width: 20,
              height: 20,
              marginRight: 10,
            }}
          />
          My Behavior Value (Exceeds Goal)
        </div>
        <div style={{ display: "flex" }}>
          <div
            style={{
              backgroundColor: "#FF6961",
              width: 20,
              height: 20,
              marginRight: 10,
            }}
          />
          My Behavior Value (Needs Improvement)
        </div>
        <div style={{ display: "flex" }}>
          <div
            style={{
              backgroundColor: "#FFC000",
              width: 20,
              height: 20,
              marginRight: 10,
            }}
          />
          My Behavior Value (Close to Goal)
        </div>
      </div>
    </div>
  );
};
