import React from "react";

export const DNARail = ({ phase, navigateToPhase }) => {
  const steps = [
    { id: 1, name: "Launch Pad" },
    { id: 2, name: "Intel Gathering" },
    { id: 3, name: "Stack Selection" },
    { id: 4, name: "SRS Builder" },
    { id: 5, name: "Export Phase" }
  ];

  // Generate rungs (horizontal bar connecting coordinates) for the DNA helix
  const rungsCount = 20;
  const railHeight = 520;
  const waveAmplitude = 18;
  const frequency = 0.05; // adjusts wave count

  const rungs = Array.from({ length: rungsCount }).map((_, idx) => {
    const y = 30 + (idx * (railHeight - 60)) / (rungsCount - 1);
    const x1 = 40 + waveAmplitude * Math.sin(y * frequency);
    const x2 = 40 - waveAmplitude * Math.sin(y * frequency);
    
    // Determine which phase this rung belongs to (roughly mapped to vertical height)
    const progressRatio = y / railHeight;
    const associatedPhase = Math.min(5, Math.ceil(progressRatio * 5));
    
    let strokeColor = "#1E2340"; // --edge
    let glow = "";
    if (phase > associatedPhase) {
      strokeColor = "#00E5A0"; // --pulse
      glow = "drop-shadow(0 0 3px #00E5A0)";
    } else if (phase === associatedPhase) {
      strokeColor = "#6C63FF"; // --aurora
      glow = "drop-shadow(0 0 3px #6C63FF)";
    }

    return { y, x1, x2, strokeColor, glow };
  });

  return (
    <aside className="hidden lg:flex flex-col items-center w-28 bg-surface/50 border-r border-edge py-8 select-none">
      <div className="text-center mb-6">
        <span className="font-mono text-[10px] tracking-widest text-muted block uppercase">
          Project
        </span>
        <span className="font-display text-xs font-bold text-aurora tracking-widest block uppercase">
          DNA
        </span>
      </div>

      {/* SVG DNA Helix Container */}
      <div className="relative flex-grow w-full max-h-[550px]">
        <svg viewBox="0 0 80 520" className="w-full h-full">
          {/* Connecting base-pair rungs */}
          {rungs.map((rung, i) => (
            <line
              key={`rung-${i}`}
              x1={rung.x1}
              y1={rung.y1}
              x2={rung.x2}
              y2={rung.y1}
              stroke={rung.strokeColor}
              strokeWidth="2.5"
              style={{ filter: rung.glow }}
              opacity={phase >= 4 ? 0.9 : 0.6}
            />
          ))}

          {/* DNA Strand A (Left helix) */}
          <path
            d={Array.from({ length: 100 })
              .map((_, idx) => {
                const y = 30 + (idx * (railHeight - 60)) / 99;
                const x = 40 + waveAmplitude * Math.sin(y * frequency);
                return `${idx === 0 ? "M" : "L"} ${x} ${y}`;
              })
              .join(" ")}
            fill="none"
            stroke={phase >= 3 ? "#00E5A0" : "#6C63FF"}
            strokeWidth="3.5"
            style={{
              filter: phase >= 3 ? "drop-shadow(0 0 4px #00E5A0)" : "drop-shadow(0 0 4px #6C63FF)"
            }}
          />

          {/* DNA Strand B (Right helix) */}
          <path
            d={Array.from({ length: 100 })
              .map((_, idx) => {
                const y = 30 + (idx * (railHeight - 60)) / 99;
                const x = 40 - waveAmplitude * Math.sin(y * frequency);
                return `${idx === 0 ? "M" : "L"} ${x} ${y}`;
              })
              .join(" ")}
            fill="none"
            stroke={phase >= 4 ? "#00E5A0" : "#1E2340"}
            strokeWidth="2.5"
            opacity="0.8"
          />

          {/* Phase Nodes (Hexagons/Circles placed along the strand) */}
          {steps.map((step) => {
            // Position nodes at fixed vertical milestones
            const y = 50 + (step.id - 1) * 105;
            const x = 40 + waveAmplitude * Math.sin(y * frequency);
            const isCompleted = phase > step.id;
            const isActive = phase === step.id;

            return (
              <g
                key={`node-${step.id}`}
                className="cursor-pointer group"
                onClick={() => phase >= step.id && navigateToPhase(step.id)}
              >
                {/* Node Ring Outer Glow */}
                <circle
                  cx={x}
                  cy={y}
                  r={isActive ? "14" : "11"}
                  fill="none"
                  stroke={isCompleted ? "#00E5A0" : isActive ? "#6C63FF" : "#1E2340"}
                  strokeWidth={isActive ? "2" : "1.5"}
                  className={isActive ? "animate-dna-pulse" : ""}
                />
                
                {/* Node Center Fill */}
                <circle
                  cx={x}
                  cy={y}
                  r="8"
                  fill={isCompleted ? "#00E5A0" : isActive ? "#6C63FF" : "#0D0F1A"}
                  stroke={isActive ? "#00E5A0" : "#1E2340"}
                  strokeWidth="1"
                />

                {/* Node Text Label (Tooltips) */}
                <text
                  x={x > 40 ? x - 18 : x + 18}
                  y={y + 4}
                  fill={isActive ? "#6C63FF" : isCompleted ? "#00E5A0" : "#8B8FA8"}
                  fontFamily="Space Grotesk"
                  fontSize="9"
                  fontWeight="bold"
                  textAnchor={x > 40 ? "end" : "start"}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                >
                  {step.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-4 flex flex-col items-center">
        <span className="text-[10px] text-muted font-mono font-medium">Lvl {Math.min(5, phase)}</span>
        <span className="text-xs font-display font-bold text-pulse">
          {phase === 5 ? "ARCHITECT" : "SCOUT"}
        </span>
      </div>
    </aside>
  );
};
