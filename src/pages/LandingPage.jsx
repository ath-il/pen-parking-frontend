import { useState, useRef, useEffect } from "react";
import "./LandingPage.css";

export default function LandingPage() {
  const [cameraActive, setCameraActive] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const startCamera = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 720 },
          height: { ideal: 720 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err) {
      if (err.name === "NotAllowedError") {
        setError("Camera access is required to park your pen.");
      } else if (err.name === "NotFoundError") {
        setError("No camera device found. Please check your hardware.");
      } else {
        setError("Unable to access camera. Please try again.");
      }
      setCameraActive(false);
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    setCameraActive(false);
    setError(null);
  };

  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="landing-page">
      {/* Animated background */}
      <div className="background-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      {!cameraActive ? (
        // Initial State - Landing Screen
        <div className="landing-container">
          <div className="content-wrapper">
            {/* Logo */}
            <div className="logo-section">
              <div className="logo-wrapper">
                <div className="logo-bg"></div>
                <div className="logo-inner">
                  <svg className="logo-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    {/* Outer circle */}
                    <circle cx="50" cy="50" r="48" fill="none" stroke="url(#logoGradient)" strokeWidth="2"/>
                    
                    {/* P shape - top circle */}
                    <circle cx="50" cy="35" r="18" fill="none" stroke="url(#logoGradient2)" strokeWidth="2.5"/>
                    
                    {/* P shape - vertical line */}
                    <line x1="50" y1="35" x2="50" y2="75" stroke="url(#logoGradient)" strokeWidth="2.5" strokeLinecap="round"/>
                    
                    {/* Bottom accent line */}
                    <line x1="32" y1="75" x2="68" y2="75" stroke="url(#logoGradient2)" strokeWidth="2" strokeLinecap="round"/>
                    
                    {/* Corner accent dots */}
                    <circle cx="28" cy="28" r="2.5" fill="url(#logoGradient2)"/>
                    <circle cx="72" cy="28" r="2.5" fill="url(#logoGradient2)"/>
                    <circle cx="28" cy="72" r="2.5" fill="url(#logoGradient2)"/>
                    <circle cx="72" cy="72" r="2.5" fill="url(#logoGradient2)"/>
                    
                    {/* Gradients */}
                    <defs>
                      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#4CAF50" stopOpacity="1"/>
                        <stop offset="100%" stopColor="#00BCD4" stopOpacity="1"/>
                      </linearGradient>
                      <linearGradient id="logoGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00BCD4" stopOpacity="1"/>
                        <stop offset="100%" stopColor="#4CAF50" stopOpacity="1"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div className="logo-glow"></div>
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="main-title">PARK YOUR PEN.</h1>

            {/* Malayalam Tagline */}
            <div className="malayalam-tagline">
              <p className="tagline-question">പേന എവിടെ വെക്കണം എന്നറിയാതെ വിഷമിക്കുന്നുണ്ടോ?</p>
              <p className="tagline-response">ഞങ്ങളുണ്ട്. 😌</p>
            </div>

            {/* Error State */}
            {error && (
              <div className="error-message">
                <span>⚠️</span>
                <p>{error}</p>
              </div>
            )}

            {/* Start Button */}
            <button
              className="btn-primary"
              onClick={startCamera}
              disabled={isLoading}
            >
              <span className="btn-icon">📷</span>
              <span className="btn-text">{isLoading ? "Loading..." : "Start Camera"}</span>
            </button>

            {/* Retry button if error */}
            {error && (
              <button className="btn-secondary" onClick={startCamera}>
                Try Again
              </button>
            )}
          </div>

          {/* Floating text */}
          <div className="floating-text">Park your pen with precision</div>
        </div>
      ) : (
        // Camera Active State
        <div className="camera-container" ref={containerRef}>
          {/* Header */}
          <div className="camera-header">
            <div className="logo-small">🅿️ PenPark</div>
            <div className="status-indicator">
              <span className="status-dot"></span>
              CAMERA ACTIVE
            </div>
          </div>

          {/* Camera Frame with Futuristic Design */}
          <div className="camera-frame-wrapper">
            <div className="camera-frame">
              {/* Corner brackets */}
              <div className="corner-bracket corner-tl"></div>
              <div className="corner-bracket corner-tr"></div>
              <div className="corner-bracket corner-bl"></div>
              <div className="corner-bracket corner-br"></div>

              {/* Scanning line animation */}
              <div className="scanning-line"></div>

              {/* Camera video */}
              <video
                ref={videoRef}
                className="camera-video"
                playsInline
                muted
              />

              {/* Parking Zone Overlay */}
              <div className="parking-zone-overlay">
                {/* Parking zone border */}
                <svg className="parking-zone-svg" viewBox="0 0 200 200">
                  {/* Outer square */}
                  <rect
                    x="20"
                    y="20"
                    width="160"
                    height="160"
                    fill="none"
                    stroke="url(#gradientGreen)"
                    strokeWidth="2"
                  />
                  {/* Inner square */}
                  <rect
                    x="40"
                    y="40"
                    width="120"
                    height="120"
                    fill="none"
                    stroke="url(#gradientCyan)"
                    strokeWidth="1"
                    opacity="0.6"
                  />
                  {/* Corner markers */}
                  <circle cx="35" cy="35" r="3" fill="url(#gradientGreen)" />
                  <circle cx="165" cy="35" r="3" fill="url(#gradientGreen)" />
                  <circle cx="35" cy="165" r="3" fill="url(#gradientGreen)" />
                  <circle cx="165" cy="165" r="3" fill="url(#gradientGreen)" />

                  <defs>
                    <linearGradient id="gradientGreen" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: "#4CAF50", stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: "#00BCD4", stopOpacity: 1 }} />
                    </linearGradient>
                    <linearGradient id="gradientCyan" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: "#00BCD4", stopOpacity: 0.8 }} />
                      <stop offset="100%" style={{ stopColor: "#4CAF50", stopOpacity: 0.8 }} />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Parking zone label */}
                <div className="parking-zone-label">PARKING ZONE</div>

                {/* Pen icon/illustration */}
                <div className="pen-icon">✏️</div>

                {/* Pulse effect */}
                <div className="parking-zone-pulse"></div>
              </div>

              {/* Grid overlay */}
              <div className="grid-overlay"></div>
            </div>
          </div>

          {/* Instructions */}
          <div className="camera-instructions">
            <p>Place your pen inside the parking zone.</p>
          </div>

          {/* Stop Button */}
          <button className="btn-stop" onClick={stopCamera}>
            Stop Camera
          </button>
        </div>
      )}
    </div>
  );
}
