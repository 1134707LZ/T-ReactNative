import React from "react";
import Svg, { Path, Text as SvgText } from "react-native-svg";

type Modelo = "Gola redonda" | "Gola V" | "Polo";

/** Pré-visualização da camisa (RF03: cor, modelo, nome e número) */
export default function ShirtPreview({ cor, modelo, nome, numero, size = 220 }: {
  cor: string; modelo: Modelo | string; nome?: string; numero?: string; size?: number;
}) {
  const light = ["#FFFFFF", "#F59E0B"].includes(cor.toUpperCase());
  const ink = light ? "#0F172A" : "#FFFFFF";
  const stroke = "#CBD5E1";
  const collar =
    modelo === "Gola V" ? "M80 20 L100 52 L120 20" :
    modelo === "Polo" ? "M80 20 L100 36 L120 20 M100 36 L100 56" :
    "M78 20 Q100 52 122 20";
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      <Path
        d="M60 20 L20 45 L38 80 L55 72 L55 180 L145 180 L145 72 L162 80 L180 45 L140 20 Q100 44 60 20 Z"
        fill={cor} stroke={stroke} strokeWidth={2} strokeLinejoin="round"
      />
      <Path d={collar} fill="none" stroke={ink} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" opacity={0.85} />
      {nome ? (
        <SvgText x="100" y="80" fontSize="13" fontWeight="bold" fill={ink} textAnchor="middle">{nome.toUpperCase().slice(0, 12)}</SvgText>
      ) : null}
      {numero ? (
        <SvgText x="100" y="135" fontSize="52" fontWeight="bold" fill={ink} textAnchor="middle">{numero.slice(0, 2)}</SvgText>
      ) : null}
    </Svg>
  );
}
