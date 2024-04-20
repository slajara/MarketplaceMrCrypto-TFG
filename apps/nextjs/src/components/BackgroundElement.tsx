const gradientId = "gradient";

function BackgroundElement({
  shape = "circle",
  position = "left",
  marginTop = "0px",
}) {
  let svgPath = "";

  if (shape === "circle") {
    svgPath =
      "M59.5,-37.4C71,-14.5,69.9,12.6,57.9,35.9C45.9,59.2,22.9,78.6,2.1,77.4C-18.8,76.2,-37.6,54.4,-51,30.4C-64.3,6.3,-72.2,-20,-62.8,-41.6C-53.4,-63.3,-26.7,-80.4,-1.3,-79.7C24,-78.9,48,-60.2,59.5,-37.4Z";
  } else if (shape === "square") {
    svgPath =
      "M48.3,-70.5C57.7,-59.6,57.2,-39,63.1,-20.6C69,-2.1,81.3,14.1,81.6,30.6C81.8,47.1,70.1,63.7,54.5,73.6C38.9,83.5,19.5,86.5,2.7,82.8C-14,79,-28,68.4,-43.8,58.6C-59.5,48.8,-77,39.8,-85,25.2C-93,10.7,-91.5,-9.2,-83.6,-25.2C-75.7,-41.1,-61.4,-53,-46.4,-62.1C-31.4,-71.2,-15.7,-77.6,1.8,-80.1C19.4,-82.7,38.8,-81.4,48.3,-70.5Z";
  } else if (shape === "triangle") {
    svgPath =
      "M47.7,-49.3C60.2,-35.3,67.3,-17.7,68.1,0.8C69,19.3,63.5,38.7,51.1,46.4C38.7,54.2,19.3,50.3,0,50.3C-19.3,50.3,-38.6,54.1,-50,46.4C-61.4,38.6,-64.9,19.3,-60.9,4C-56.9,-11.3,-45.4,-22.6,-34,-36.6C-22.6,-50.5,-11.3,-67.1,3.2,-70.3C17.7,-73.4,35.3,-63.2,47.7,-49.3Z";
  }

  const containerStyles = {
    marginTop: marginTop,
  };

  const containerClasses = `relative z-10 blur-3xl h-[150vh] w-[150vh] ${
    position === "left" ? "-translate-x-[60vw]" : "translate-x-[60vw]"
  }`;

  return (
    <div className="w-screen">
      <div className="fixed -z-10 flex w-full justify-center overflow-hidden">
        <div className={containerClasses} style={containerStyles}>
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient
                id={gradientId}
                cx="50%"
                cy="50%"
                r="50%"
                fx="50%"
                fy="50%"
              >
                <stop
                  offset="0%"
                  style={{ stopColor: "rgba(236,192,111,0.3)", stopOpacity: 1 }}
                />
                <stop
                  offset="100%"
                  style={{ stopColor: "rgba(236,192,111,0.1)", stopOpacity: 1 }}
                />
              </radialGradient>
            </defs>
            <path
              fill={`url(#${gradientId})`}
              d={svgPath}
              transform="translate(100 100)"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default BackgroundElement;
