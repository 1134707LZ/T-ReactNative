import React from "react";
import Svg, { Circle, Path } from "react-native-svg";

export type IconName =
  | "home" | "search" | "plus" | "cart" | "user" | "menu" | "back" | "close"
  | "check" | "trash" | "tag" | "box" | "truck" | "logout" | "image" | "minus";

export default function Icon({ name, size = 24, color = "#475569", strokeWidth = 1.8 }: {
  name: IconName; size?: number; color?: string; strokeWidth?: number;
}) {
  const p = { stroke: color, strokeWidth, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {name === "home" && (<>
        <Path d="M3 10.5L12 3l9 7.5" {...p} />
        <Path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v6h4a1 1 0 0 0 1-1V9.5" {...p} />
      </>)}
      {name === "search" && (<><Circle cx="11" cy="11" r="7" {...p} /><Path d="M21 21l-4.35-4.35" {...p} /></>)}
      {name === "plus" && (<><Circle cx="12" cy="12" r="8.5" {...p} /><Path d="M12 8.5v7M8.5 12h7" {...p} /></>)}
      {name === "minus" && <Path d="M6 12h12" {...p} />}
      {name === "cart" && (<>
        <Path d="M3 4h2l2.4 12.4a1.5 1.5 0 0 0 1.48 1.2h8.24a1.5 1.5 0 0 0 1.48-1.24L21 8H6" {...p} />
        <Circle cx="9.5" cy="20.5" r="1.3" {...p} /><Circle cx="17.5" cy="20.5" r="1.3" {...p} />
      </>)}
      {name === "user" && (<><Circle cx="12" cy="8" r="3.5" {...p} /><Path d="M4.5 20c1.2-3.8 4.4-6 7.5-6s6.3 2.2 7.5 6" {...p} /></>)}
      {name === "menu" && <Path d="M4 7h16M4 12h16M4 17h16" {...p} />}
      {name === "back" && <Path d="M15 5l-7 7 7 7" {...p} />}
      {name === "close" && <Path d="M6 6l12 12M18 6L6 18" {...p} />}
      {name === "check" && <Path d="M5 12.5l4.5 4.5L19 7.5" {...p} />}
      {name === "trash" && <Path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6" {...p} />}
      {name === "tag" && (<><Path d="M3 12V4h8l10 10-8 8L3 12z" {...p} /><Circle cx="7.5" cy="8.5" r="1.2" {...p} /></>)}
      {name === "box" && <Path d="M3 7.5L12 3l9 4.5v9L12 21l-9-4.5v-9zM3 7.5l9 4.5 9-4.5M12 12v9" {...p} />}
      {name === "truck" && (<><Path d="M2 6h12v10H2zM14 10h4l3 3v3h-7" {...p} /><Circle cx="6.5" cy="18" r="1.8" {...p} /><Circle cx="17.5" cy="18" r="1.8" {...p} /></>)}
      {name === "logout" && <Path d="M10 4H5v16h5M15 8l4 4-4 4M19 12H9" {...p} />}
      {name === "image" && (<><Path d="M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4" {...p} /><Circle cx="9" cy="9" r="1.3" {...p} /></>)}
    </Svg>
  );
}
