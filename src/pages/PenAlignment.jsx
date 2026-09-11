import { useState, useRef, useEffect } from "react";
import CameraFeed from "../components/CameraFeed";

export default function PenAlignment() {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [targetPosition, setTargetPosition] = useState(null);
  const [alignmentStatus, setAlignmentStatus] = useState("idle"); // idle, positioning, success, failed
  const [distance, setDistance] = useState(null);
  const [progress, setProgress] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const videoRef = useRef(null);

  const generateRandomTarget = () => {
    const x = Math.random() * 600;
    const y = Math.random() * 450;
    setTargetPosition({ x, y });
    setAlignmentStatus("positioning");
    setDistance(null);
    setProgress(0);
  };

  const handleCameraStart = () => {
    setIsCameraActive(true);
    setTimeout(() => {
      generateRandomTarget();
    }, 1000);
  };

  const handleConfirmPosition = () => {
    setAttempts(attempts + 1);
    // Simulate distance calculation (in real app, this would come from pen detection)
    const simulatedDistance = Math.random() * 150;
    setDistance(simulatedDistance);

    if (simulatedDistance < 30) {
      // Success threshold: within 30 pixels
      setAlignmentStatus("success");
      setProgress(100);
    } else {
      setProgress((30 - simulatedDistance) / 30 * 100);
      if (simulatedDistance < 80) {
        setAlignmentStatus("close");
      } else {
        setAlignmentStatus("far");
      }
    }
  };

  const handleNextTarget = () => {
    generateRandomTarget();
  };

  const handleReset = () => {
    setIsCameraActive(false);
    setTargetPosition(null);
    setAlignmentStatus("idle");
    setDistance(null);
    setProgress(0);
    setAttempts(0);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        padding: "2rem",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1
          style={{
            fontSize: "3rem",
            color: "#fff",
            marginBottom: "0.5rem",
            textShadow: "0 8px 32px rgba(76, 175, 80, 0.3)",
          }}
        >
          🖊️ Pen Positioning System
        </h1>
        <p style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "1.1rem" }}>
          Position your pen at the target location shown in the camera
        </p>
      </div>

      {/* Main Content */}
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "2rem",
          background: "rgba(255, 255, 255, 0.05)",
          borderRadius: "20px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
        }}
      >
        {/* Idle State - Start Button */}
        {alignmentStatus === "idle" && !isCameraActive && (
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontSize: "1.2rem",
                color: "rgba(255, 255, 255, 0.8)",
                marginBottom: "2rem",
              }}
            >
              📷 Ready to start pen positioning?
            </p>
            <button
              onClick={handleCameraStart}
              style={{
                padding: "16px 50px",
                fontSize: "18px",
                fontWeight: "600",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                boxShadow: "0 8px 25px rgba(76, 175, 80, 0.3)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-4px)";
                e.target.style.boxShadow = "0 12px 35px rgba(76, 175, 80, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 8px 25px rgba(76, 175, 80, 0.3)";
              }}
            >
              🎥 Open Camera
            </button>
          </div>
        )}

        {/* Camera Active State */}
        {isCameraActive && targetPosition && (
          <div>
            {/* Camera Feed with Target Overlay */}
            <div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "640px",
                height: "480px",
                backgroundColor: "#000",
                borderRadius: "16px",
                overflow: "hidden",
                margin: "0 auto 2rem",
                boxShadow: "0 10px 40px rgba(0, 0, 0, 0.5)",
              }}
            >
              <CameraFeed targetPosition={targetPosition} />

              {/* Target Crosshair */}
              <svg
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  pointerEvents: "none",
                }}
              >
                {/* Outer Circle */}
                <circle
                  cx={`${(targetPosition.x / 600) * 100}%`}
                  cy={`${(targetPosition.y / 450) * 100}%`}
                  r="40"
                  fill="none"
                  stroke="#4CAF50"
                  strokeWidth="2"
                  opacity="0.8"
                />

                {/* Inner Circle */}
                <circle
                  cx={`${(targetPosition.x / 600) * 100}%`}
                  cy={`${(targetPosition.y / 450) * 100}%`}
                  r="25"
                  fill="none"
                  stroke="#00BCD4"
                  strokeWidth="2"
                  opacity="0.6"
                />

                {/* Crosshair Lines */}
                <line
                  x1={`${(targetPosition.x / 600) * 100}%`}
                  y1={`calc(${(targetPosition.y / 450) * 100}% - 50px)`}
                  x2={`${(targetPosition.x / 600) * 100}%`}
                  y2={`calc(${(targetPosition.y / 450) * 100}% - 25px)`}
                  stroke="#4CAF50"
                  strokeWidth="2"
                />
                <line
                  x1={`${(targetPosition.x / 600) * 100}%`}
                  y1={`calc(${(targetPosition.y / 450) * 100}% + 50px)`}
                  x2={`${(targetPosition.x / 600) * 100}%`}
                  y2={`calc(${(targetPosition.y / 450) * 100}% + 25px)`}
                  stroke="#4CAF50"
                  strokeWidth="2"
                />
                <line
                  x1={`calc(${(targetPosition.x / 600) * 100}% - 50px)`}
                  y1={`${(targetPosition.y / 450) * 100}%`}
                  x2={`calc(${(targetPosition.x / 600) * 100}% - 25px)`}
                  y2={`${(targetPosition.y / 450) * 100}%`}
                  stroke="#4CAF50"
                  strokeWidth="2"
                />
                <line
                  x1={`calc(${(targetPosition.x / 600) * 100}% + 50px)`}
                  y1={`${(targetPosition.y / 450) * 100}%`}
                  x2={`calc(${(targetPosition.x / 600) * 100}% + 25px)`}
                  y2={`${(targetPosition.y / 450) * 100}%`}
                  stroke="#4CAF50"
                  strokeWidth="2"
                />

                {/* Center Dot */}
                <circle
                  cx={`${(targetPosition.x / 600) * 100}%`}
                  cy={`${(targetPosition.y / 450) * 100}%`}
                  r="6"
                  fill="#4CAF50"
                  opacity="0.9"
                />
              </svg>

              {/* Target Info Overlay */}
              <div
                style={{
                  position: "absolute",
                  top: "20px",
                  left: "20px",
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                  padding: "12px 20px",
                  borderRadius: "8px",
                  border: "1px solid rgba(76, 175, 80, 0.5)",
                  color: "#4CAF50",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                📍 Target: ({Math.round(targetPosition.x)}, {Math.round(targetPosition.y)})
              </div>
            </div>

            {/* Instructions */}
            <div
              style={{
                backgroundColor: "rgba(76, 175, 80, 0.1)",
                border: "1px solid rgba(76, 175, 80, 0.3)",
                borderRadius: "12px",
                padding: "1rem",
                marginBottom: "1.5rem",
                color: "#00BCD4",
              }}
            >
              <p style={{ margin: "0.5rem 0", fontSize: "0.95rem" }}>
                ✓ Position your pen at the green crosshair target
              </p>
              <p style={{ margin: "0.5rem 0", fontSize: "0.95rem" }}>
                ✓ Ensure proper lighting for accurate detection
              </p>
              <p style={{ margin: "0.5rem 0", fontSize: "0.95rem" }}>
                ✓ Click "Confirm Position" when ready
              </p>
            </div>

            {/* Confirmation Buttons */}
            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={handleConfirmPosition}
                style={{
                  padding: "12px 40px",
                  fontSize: "16px",
                  fontWeight: "600",
                  backgroundColor: "#00BCD4",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  cursor: "pointer",
                  boxShadow: "0 6px 20px rgba(0, 188, 212, 0.3)",
                }}
              >
                ✓ Confirm Position
              </button>
              <button
                onClick={handleReset}
                style={{
                  padding: "12px 40px",
                  fontSize: "16px",
                  fontWeight: "600",
                  backgroundColor: "#FF6B6B",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  cursor: "pointer",
                  boxShadow: "0 6px 20px rgba(255, 107, 107, 0.3)",
                }}
              >
                ✕ Cancel
              </button>
            </div>
          </div>
        )}

        {/* Results State */}
        {(alignmentStatus === "success" || alignmentStatus === "close" || alignmentStatus === "far") && (
          <div>
            {/* Status Indicator */}
            <div
              style={{
                padding: "2rem",
                borderRadius: "16px",
                textAlign: "center",
                marginBottom: "2rem",
                background:
                  alignmentStatus === "success"
                    ? "rgba(76, 175, 80, 0.15)"
                    : alignmentStatus === "close"
                      ? "rgba(255, 193, 7, 0.15)"
                      : "rgba(255, 107, 107, 0.15)",
                border:
                  alignmentStatus === "success"
                    ? "2px solid #4CAF50"
                    : alignmentStatus === "close"
                      ? "2px solid #FFC107"
                      : "2px solid #FF6B6B",
              }}
            >
              <h2
                style={{
                  fontSize: "2.5rem",
                  margin: "0 0 1rem 0",
                  color:
                    alignmentStatus === "success"
                      ? "#4CAF50"
                      : alignmentStatus === "close"
                        ? "#FFC107"
                        : "#FF6B6B",
                }}
              >
                {alignmentStatus === "success"
                  ? "✓ Perfect Alignment!"
                  : alignmentStatus === "close"
                    ? "⚠ Close, But Adjust"
                    : "✗ Too Far Away"}
              </h2>

              {distance !== null && (
                <div style={{ marginBottom: "1.5rem" }}>
                  <p style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "1.1rem", margin: "0.5rem 0" }}>
                    Distance from target: <strong>{Math.round(distance)} pixels</strong>
                  </p>

                  {/* Progress Bar */}
                  <div
                    style={{
                      width: "100%",
                      height: "16px",
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      borderRadius: "8px",
                      overflow: "hidden",
                      marginTop: "1rem",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${Math.max(0, progress)}%`,
                        background:
                          progress > 80
                            ? "linear-gradient(90deg, #4CAF50, #00BCD4)"
                            : progress > 40
                              ? "linear-gradient(90deg, #FFC107, #FF9800)"
                              : "linear-gradient(90deg, #FF6B6B, #FF4081)",
                        transition: "width 0.3s ease",
                      }}
                    />
                  </div>
                  <p style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.9rem", marginTop: "0.5rem" }}>
                    Accuracy: {Math.round(Math.max(0, progress))}%
                  </p>
                </div>
              )}

              <p style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "0.95rem", margin: "1rem 0 0 0" }}>
                Attempts: {attempts}
              </p>
            </div>

            {/* Action Buttons */}
            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {alignmentStatus === "success" ? (
                <button
                  onClick={handleNextTarget}
                  style={{
                    padding: "12px 40px",
                    fontSize: "16px",
                    fontWeight: "600",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    cursor: "pointer",
                    boxShadow: "0 6px 20px rgba(76, 175, 80, 0.3)",
                  }}
                >
                  🎯 Next Target
                </button>
              ) : (
                <button
                  onClick={handleNextTarget}
                  style={{
                    padding: "12px 40px",
                    fontSize: "16px",
                    fontWeight: "600",
                    backgroundColor: "#FFC107",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    cursor: "pointer",
                    boxShadow: "0 6px 20px rgba(255, 193, 7, 0.3)",
                  }}
                >
                  🔄 Try Again
                </button>
              )}

              <button
                onClick={handleReset}
                style={{
                  padding: "12px 40px",
                  fontSize: "16px",
                  fontWeight: "600",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  cursor: "pointer",
                  boxShadow: "0 6px 20px rgba(108, 117, 125, 0.3)",
                }}
              >
                🏠 Back to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
