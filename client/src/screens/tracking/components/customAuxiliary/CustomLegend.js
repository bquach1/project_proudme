import { BEHAVIOR_COLORS } from "constants";

export const CustomLegend = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        backgroundColor: BEHAVIOR_COLORS.BACKGROUND_GRAY,
        width: "90%",
        textAlign: "left",
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
              backgroundColor: BEHAVIOR_COLORS.LIGHT_BLUE,
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
              backgroundColor: BEHAVIOR_COLORS.PURPLE,
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
              backgroundColor: BEHAVIOR_COLORS.GREEN,
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
              backgroundColor: BEHAVIOR_COLORS.RED,
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
              backgroundColor: BEHAVIOR_COLORS.YELLOW,
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
