import { BEHAVIOR_COLORS } from "constants";

export const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          border: "1px solid rgb(204, 204, 204)",
          padding: "10px",
          backgroundColor: "white",
        }}
      >
        <p className="label">{`${label}`}</p>
        {payload.map((pld, index) => (
          <div key={`pld-${index}`}>
            {pld.dataKey === "goalValue" ? (
              <div
                id={`goal-${index}`}
                style={{ color: BEHAVIOR_COLORS.LIGHT_BLUE }}
              >
                My Goal Value: {pld.value}
              </div>
            ) : (
              <div
                id={`behavior-${index}`}
                style={{ color: BEHAVIOR_COLORS.PURPLE }}
              >
                My Behavior Value: {Math.round(pld.value * 100) / 100}
              </div>
            )}
          </div>
        ))}
        {payload.map((pld, index) =>
          index === 0 ? (
            <div key={`pld-${index}`} style={{ color: "green" }}>
              Recommended Value: {pld.payload.recommendedValue}
            </div>
          ) : null
        )}
      </div>
    );
  }
  return null;
};
