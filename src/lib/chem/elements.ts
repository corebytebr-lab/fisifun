// Tabela periódica completa (1-118) com massas atômicas, configurações,
// eletronegatividades, raios e blocos. Fonte: IUPAC / dados padrão de
// química geral (Brown/LeMay).

export type Block = "s" | "p" | "d" | "f";
export type Category =
  | "alkali"
  | "alkaline"
  | "transition"
  | "post-transition"
  | "metalloid"
  | "nonmetal"
  | "halogen"
  | "noble"
  | "lanthanide"
  | "actinide";

export interface Element {
  z: number;
  symbol: string;
  name: string;
  mass: number;
  group?: number;
  period: number;
  block: Block;
  category: Category;
  config: string; // electron configuration (short)
  electronegativity?: number;
  radiusPm?: number; // covalent radius
  flameColor?: string; // for flame test minigame
}

export const ELEMENTS: Element[] = [
  { z: 1, symbol: "H", name: "Hidrogênio", mass: 1.008, group: 1, period: 1, block: "s", category: "nonmetal", config: "1s¹", electronegativity: 2.20, radiusPm: 31 },
  { z: 2, symbol: "He", name: "Hélio", mass: 4.0026, group: 18, period: 1, block: "s", category: "noble", config: "1s²", radiusPm: 28 },
  { z: 3, symbol: "Li", name: "Lítio", mass: 6.94, group: 1, period: 2, block: "s", category: "alkali", config: "[He] 2s¹", electronegativity: 0.98, radiusPm: 128, flameColor: "Vermelho carmim" },
  { z: 4, symbol: "Be", name: "Berílio", mass: 9.0122, group: 2, period: 2, block: "s", category: "alkaline", config: "[He] 2s²", electronegativity: 1.57, radiusPm: 96 },
  { z: 5, symbol: "B", name: "Boro", mass: 10.81, group: 13, period: 2, block: "p", category: "metalloid", config: "[He] 2s² 2p¹", electronegativity: 2.04, radiusPm: 84 },
  { z: 6, symbol: "C", name: "Carbono", mass: 12.011, group: 14, period: 2, block: "p", category: "nonmetal", config: "[He] 2s² 2p²", electronegativity: 2.55, radiusPm: 76 },
  { z: 7, symbol: "N", name: "Nitrogênio", mass: 14.007, group: 15, period: 2, block: "p", category: "nonmetal", config: "[He] 2s² 2p³", electronegativity: 3.04, radiusPm: 71 },
  { z: 8, symbol: "O", name: "Oxigênio", mass: 15.999, group: 16, period: 2, block: "p", category: "nonmetal", config: "[He] 2s² 2p⁴", electronegativity: 3.44, radiusPm: 66 },
  { z: 9, symbol: "F", name: "Flúor", mass: 18.998, group: 17, period: 2, block: "p", category: "halogen", config: "[He] 2s² 2p⁵", electronegativity: 3.98, radiusPm: 57 },
  { z: 10, symbol: "Ne", name: "Neônio", mass: 20.180, group: 18, period: 2, block: "p", category: "noble", config: "[He] 2s² 2p⁶", radiusPm: 58 },
  { z: 11, symbol: "Na", name: "Sódio", mass: 22.990, group: 1, period: 3, block: "s", category: "alkali", config: "[Ne] 3s¹", electronegativity: 0.93, radiusPm: 166, flameColor: "Amarelo-laranja" },
  { z: 12, symbol: "Mg", name: "Magnésio", mass: 24.305, group: 2, period: 3, block: "s", category: "alkaline", config: "[Ne] 3s²", electronegativity: 1.31, radiusPm: 141, flameColor: "Branco brilhante" },
  { z: 13, symbol: "Al", name: "Alumínio", mass: 26.982, group: 13, period: 3, block: "p", category: "post-transition", config: "[Ne] 3s² 3p¹", electronegativity: 1.61, radiusPm: 121 },
  { z: 14, symbol: "Si", name: "Silício", mass: 28.085, group: 14, period: 3, block: "p", category: "metalloid", config: "[Ne] 3s² 3p²", electronegativity: 1.90, radiusPm: 111 },
  { z: 15, symbol: "P", name: "Fósforo", mass: 30.974, group: 15, period: 3, block: "p", category: "nonmetal", config: "[Ne] 3s² 3p³", electronegativity: 2.19, radiusPm: 107 },
  { z: 16, symbol: "S", name: "Enxofre", mass: 32.06, group: 16, period: 3, block: "p", category: "nonmetal", config: "[Ne] 3s² 3p⁴", electronegativity: 2.58, radiusPm: 105 },
  { z: 17, symbol: "Cl", name: "Cloro", mass: 35.45, group: 17, period: 3, block: "p", category: "halogen", config: "[Ne] 3s² 3p⁵", electronegativity: 3.16, radiusPm: 102 },
  { z: 18, symbol: "Ar", name: "Argônio", mass: 39.948, group: 18, period: 3, block: "p", category: "noble", config: "[Ne] 3s² 3p⁶", radiusPm: 106 },
  { z: 19, symbol: "K", name: "Potássio", mass: 39.098, group: 1, period: 4, block: "s", category: "alkali", config: "[Ar] 4s¹", electronegativity: 0.82, radiusPm: 203, flameColor: "Violeta" },
  { z: 20, symbol: "Ca", name: "Cálcio", mass: 40.078, group: 2, period: 4, block: "s", category: "alkaline", config: "[Ar] 4s²", electronegativity: 1.00, radiusPm: 176, flameColor: "Vermelho-tijolo" },
  { z: 21, symbol: "Sc", name: "Escândio", mass: 44.956, group: 3, period: 4, block: "d", category: "transition", config: "[Ar] 3d¹ 4s²", electronegativity: 1.36, radiusPm: 170 },
  { z: 22, symbol: "Ti", name: "Titânio", mass: 47.867, group: 4, period: 4, block: "d", category: "transition", config: "[Ar] 3d² 4s²", electronegativity: 1.54, radiusPm: 160 },
  { z: 23, symbol: "V", name: "Vanádio", mass: 50.942, group: 5, period: 4, block: "d", category: "transition", config: "[Ar] 3d³ 4s²", electronegativity: 1.63, radiusPm: 153 },
  { z: 24, symbol: "Cr", name: "Cromo", mass: 51.996, group: 6, period: 4, block: "d", category: "transition", config: "[Ar] 3d⁵ 4s¹", electronegativity: 1.66, radiusPm: 139 },
  { z: 25, symbol: "Mn", name: "Manganês", mass: 54.938, group: 7, period: 4, block: "d", category: "transition", config: "[Ar] 3d⁵ 4s²", electronegativity: 1.55, radiusPm: 139 },
  { z: 26, symbol: "Fe", name: "Ferro", mass: 55.845, group: 8, period: 4, block: "d", category: "transition", config: "[Ar] 3d⁶ 4s²", electronegativity: 1.83, radiusPm: 132 },
  { z: 27, symbol: "Co", name: "Cobalto", mass: 58.933, group: 9, period: 4, block: "d", category: "transition", config: "[Ar] 3d⁷ 4s²", electronegativity: 1.88, radiusPm: 126 },
  { z: 28, symbol: "Ni", name: "Níquel", mass: 58.693, group: 10, period: 4, block: "d", category: "transition", config: "[Ar] 3d⁸ 4s²", electronegativity: 1.91, radiusPm: 124 },
  { z: 29, symbol: "Cu", name: "Cobre", mass: 63.546, group: 11, period: 4, block: "d", category: "transition", config: "[Ar] 3d¹⁰ 4s¹", electronegativity: 1.90, radiusPm: 132, flameColor: "Verde-azulado" },
  { z: 30, symbol: "Zn", name: "Zinco", mass: 65.38, group: 12, period: 4, block: "d", category: "transition", config: "[Ar] 3d¹⁰ 4s²", electronegativity: 1.65, radiusPm: 122 },
  { z: 31, symbol: "Ga", name: "Gálio", mass: 69.723, group: 13, period: 4, block: "p", category: "post-transition", config: "[Ar] 3d¹⁰ 4s² 4p¹", electronegativity: 1.81, radiusPm: 122 },
  { z: 32, symbol: "Ge", name: "Germânio", mass: 72.630, group: 14, period: 4, block: "p", category: "metalloid", config: "[Ar] 3d¹⁰ 4s² 4p²", electronegativity: 2.01, radiusPm: 120 },
  { z: 33, symbol: "As", name: "Arsênio", mass: 74.922, group: 15, period: 4, block: "p", category: "metalloid", config: "[Ar] 3d¹⁰ 4s² 4p³", electronegativity: 2.18, radiusPm: 119 },
  { z: 34, symbol: "Se", name: "Selênio", mass: 78.971, group: 16, period: 4, block: "p", category: "nonmetal", config: "[Ar] 3d¹⁰ 4s² 4p⁴", electronegativity: 2.55, radiusPm: 120 },
  { z: 35, symbol: "Br", name: "Bromo", mass: 79.904, group: 17, period: 4, block: "p", category: "halogen", config: "[Ar] 3d¹⁰ 4s² 4p⁵", electronegativity: 2.96, radiusPm: 120 },
  { z: 36, symbol: "Kr", name: "Criptônio", mass: 83.798, group: 18, period: 4, block: "p", category: "noble", config: "[Ar] 3d¹⁰ 4s² 4p⁶", electronegativity: 3.00, radiusPm: 116 },
  { z: 37, symbol: "Rb", name: "Rubídio", mass: 85.468, group: 1, period: 5, block: "s", category: "alkali", config: "[Kr] 5s¹", electronegativity: 0.82, radiusPm: 220, flameColor: "Violeta-avermelhado" },
  { z: 38, symbol: "Sr", name: "Estrôncio", mass: 87.62, group: 2, period: 5, block: "s", category: "alkaline", config: "[Kr] 5s²", electronegativity: 0.95, radiusPm: 195, flameColor: "Vermelho carmesim" },
  { z: 39, symbol: "Y", name: "Ítrio", mass: 88.906, group: 3, period: 5, block: "d", category: "transition", config: "[Kr] 4d¹ 5s²", electronegativity: 1.22, radiusPm: 190 },
  { z: 40, symbol: "Zr", name: "Zircônio", mass: 91.224, group: 4, period: 5, block: "d", category: "transition", config: "[Kr] 4d² 5s²", electronegativity: 1.33, radiusPm: 175 },
  { z: 41, symbol: "Nb", name: "Nióbio", mass: 92.906, group: 5, period: 5, block: "d", category: "transition", config: "[Kr] 4d⁴ 5s¹", electronegativity: 1.6, radiusPm: 164 },
  { z: 42, symbol: "Mo", name: "Molibdênio", mass: 95.95, group: 6, period: 5, block: "d", category: "transition", config: "[Kr] 4d⁵ 5s¹", electronegativity: 2.16, radiusPm: 154 },
  { z: 43, symbol: "Tc", name: "Tecnécio", mass: 98, group: 7, period: 5, block: "d", category: "transition", config: "[Kr] 4d⁵ 5s²", electronegativity: 1.9, radiusPm: 147 },
  { z: 44, symbol: "Ru", name: "Rutênio", mass: 101.07, group: 8, period: 5, block: "d", category: "transition", config: "[Kr] 4d⁷ 5s¹", electronegativity: 2.2, radiusPm: 146 },
  { z: 45, symbol: "Rh", name: "Ródio", mass: 102.91, group: 9, period: 5, block: "d", category: "transition", config: "[Kr] 4d⁸ 5s¹", electronegativity: 2.28, radiusPm: 142 },
  { z: 46, symbol: "Pd", name: "Paládio", mass: 106.42, group: 10, period: 5, block: "d", category: "transition", config: "[Kr] 4d¹⁰", electronegativity: 2.20, radiusPm: 139 },
  { z: 47, symbol: "Ag", name: "Prata", mass: 107.87, group: 11, period: 5, block: "d", category: "transition", config: "[Kr] 4d¹⁰ 5s¹", electronegativity: 1.93, radiusPm: 145 },
  { z: 48, symbol: "Cd", name: "Cádmio", mass: 112.41, group: 12, period: 5, block: "d", category: "transition", config: "[Kr] 4d¹⁰ 5s²", electronegativity: 1.69, radiusPm: 144 },
  { z: 49, symbol: "In", name: "Índio", mass: 114.82, group: 13, period: 5, block: "p", category: "post-transition", config: "[Kr] 4d¹⁰ 5s² 5p¹", electronegativity: 1.78, radiusPm: 142 },
  { z: 50, symbol: "Sn", name: "Estanho", mass: 118.71, group: 14, period: 5, block: "p", category: "post-transition", config: "[Kr] 4d¹⁰ 5s² 5p²", electronegativity: 1.96, radiusPm: 139 },
  { z: 51, symbol: "Sb", name: "Antimônio", mass: 121.76, group: 15, period: 5, block: "p", category: "metalloid", config: "[Kr] 4d¹⁰ 5s² 5p³", electronegativity: 2.05, radiusPm: 139 },
  { z: 52, symbol: "Te", name: "Telúrio", mass: 127.60, group: 16, period: 5, block: "p", category: "metalloid", config: "[Kr] 4d¹⁰ 5s² 5p⁴", electronegativity: 2.1, radiusPm: 138 },
  { z: 53, symbol: "I", name: "Iodo", mass: 126.90, group: 17, period: 5, block: "p", category: "halogen", config: "[Kr] 4d¹⁰ 5s² 5p⁵", electronegativity: 2.66, radiusPm: 139 },
  { z: 54, symbol: "Xe", name: "Xenônio", mass: 131.29, group: 18, period: 5, block: "p", category: "noble", config: "[Kr] 4d¹⁰ 5s² 5p⁶", electronegativity: 2.6, radiusPm: 140 },
  { z: 55, symbol: "Cs", name: "Césio", mass: 132.91, group: 1, period: 6, block: "s", category: "alkali", config: "[Xe] 6s¹", electronegativity: 0.79, radiusPm: 244, flameColor: "Azul-violeta" },
  { z: 56, symbol: "Ba", name: "Bário", mass: 137.33, group: 2, period: 6, block: "s", category: "alkaline", config: "[Xe] 6s²", electronegativity: 0.89, radiusPm: 215, flameColor: "Verde-amarelado" },
  { z: 57, symbol: "La", name: "Lantânio", mass: 138.91, period: 6, block: "f", category: "lanthanide", config: "[Xe] 5d¹ 6s²", electronegativity: 1.10, radiusPm: 207 },
  { z: 58, symbol: "Ce", name: "Cério", mass: 140.12, period: 6, block: "f", category: "lanthanide", config: "[Xe] 4f¹ 5d¹ 6s²", electronegativity: 1.12, radiusPm: 204 },
  { z: 59, symbol: "Pr", name: "Praseodímio", mass: 140.91, period: 6, block: "f", category: "lanthanide", config: "[Xe] 4f³ 6s²", electronegativity: 1.13, radiusPm: 203 },
  { z: 60, symbol: "Nd", name: "Neodímio", mass: 144.24, period: 6, block: "f", category: "lanthanide", config: "[Xe] 4f⁴ 6s²", electronegativity: 1.14, radiusPm: 201 },
  { z: 61, symbol: "Pm", name: "Promécio", mass: 145, period: 6, block: "f", category: "lanthanide", config: "[Xe] 4f⁵ 6s²", radiusPm: 199 },
  { z: 62, symbol: "Sm", name: "Samário", mass: 150.36, period: 6, block: "f", category: "lanthanide", config: "[Xe] 4f⁶ 6s²", electronegativity: 1.17, radiusPm: 198 },
  { z: 63, symbol: "Eu", name: "Európio", mass: 151.96, period: 6, block: "f", category: "lanthanide", config: "[Xe] 4f⁷ 6s²", radiusPm: 198 },
  { z: 64, symbol: "Gd", name: "Gadolínio", mass: 157.25, period: 6, block: "f", category: "lanthanide", config: "[Xe] 4f⁷ 5d¹ 6s²", electronegativity: 1.20, radiusPm: 196 },
  { z: 65, symbol: "Tb", name: "Térbio", mass: 158.93, period: 6, block: "f", category: "lanthanide", config: "[Xe] 4f⁹ 6s²", radiusPm: 194 },
  { z: 66, symbol: "Dy", name: "Disprósio", mass: 162.50, period: 6, block: "f", category: "lanthanide", config: "[Xe] 4f¹⁰ 6s²", electronegativity: 1.22, radiusPm: 192 },
  { z: 67, symbol: "Ho", name: "Hólmio", mass: 164.93, period: 6, block: "f", category: "lanthanide", config: "[Xe] 4f¹¹ 6s²", electronegativity: 1.23, radiusPm: 192 },
  { z: 68, symbol: "Er", name: "Érbio", mass: 167.26, period: 6, block: "f", category: "lanthanide", config: "[Xe] 4f¹² 6s²", electronegativity: 1.24, radiusPm: 189 },
  { z: 69, symbol: "Tm", name: "Túlio", mass: 168.93, period: 6, block: "f", category: "lanthanide", config: "[Xe] 4f¹³ 6s²", electronegativity: 1.25, radiusPm: 190 },
  { z: 70, symbol: "Yb", name: "Itérbio", mass: 173.05, period: 6, block: "f", category: "lanthanide", config: "[Xe] 4f¹⁴ 6s²", radiusPm: 187 },
  { z: 71, symbol: "Lu", name: "Lutécio", mass: 174.97, period: 6, block: "d", category: "lanthanide", config: "[Xe] 4f¹⁴ 5d¹ 6s²", electronegativity: 1.27, radiusPm: 187 },
  { z: 72, symbol: "Hf", name: "Háfnio", mass: 178.49, group: 4, period: 6, block: "d", category: "transition", config: "[Xe] 4f¹⁴ 5d² 6s²", electronegativity: 1.3, radiusPm: 175 },
  { z: 73, symbol: "Ta", name: "Tântalo", mass: 180.95, group: 5, period: 6, block: "d", category: "transition", config: "[Xe] 4f¹⁴ 5d³ 6s²", electronegativity: 1.5, radiusPm: 170 },
  { z: 74, symbol: "W", name: "Tungstênio", mass: 183.84, group: 6, period: 6, block: "d", category: "transition", config: "[Xe] 4f¹⁴ 5d⁴ 6s²", electronegativity: 2.36, radiusPm: 162 },
  { z: 75, symbol: "Re", name: "Rênio", mass: 186.21, group: 7, period: 6, block: "d", category: "transition", config: "[Xe] 4f¹⁴ 5d⁵ 6s²", electronegativity: 1.9, radiusPm: 151 },
  { z: 76, symbol: "Os", name: "Ósmio", mass: 190.23, group: 8, period: 6, block: "d", category: "transition", config: "[Xe] 4f¹⁴ 5d⁶ 6s²", electronegativity: 2.2, radiusPm: 144 },
  { z: 77, symbol: "Ir", name: "Irídio", mass: 192.22, group: 9, period: 6, block: "d", category: "transition", config: "[Xe] 4f¹⁴ 5d⁷ 6s²", electronegativity: 2.20, radiusPm: 141 },
  { z: 78, symbol: "Pt", name: "Platina", mass: 195.08, group: 10, period: 6, block: "d", category: "transition", config: "[Xe] 4f¹⁴ 5d⁹ 6s¹", electronegativity: 2.28, radiusPm: 136 },
  { z: 79, symbol: "Au", name: "Ouro", mass: 196.97, group: 11, period: 6, block: "d", category: "transition", config: "[Xe] 4f¹⁴ 5d¹⁰ 6s¹", electronegativity: 2.54, radiusPm: 136 },
  { z: 80, symbol: "Hg", name: "Mercúrio", mass: 200.59, group: 12, period: 6, block: "d", category: "transition", config: "[Xe] 4f¹⁴ 5d¹⁰ 6s²", electronegativity: 2.00, radiusPm: 132 },
  { z: 81, symbol: "Tl", name: "Tálio", mass: 204.38, group: 13, period: 6, block: "p", category: "post-transition", config: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p¹", electronegativity: 1.62, radiusPm: 145 },
  { z: 82, symbol: "Pb", name: "Chumbo", mass: 207.2, group: 14, period: 6, block: "p", category: "post-transition", config: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²", electronegativity: 2.33, radiusPm: 146 },
  { z: 83, symbol: "Bi", name: "Bismuto", mass: 208.98, group: 15, period: 6, block: "p", category: "post-transition", config: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p³", electronegativity: 2.02, radiusPm: 148 },
  { z: 84, symbol: "Po", name: "Polônio", mass: 209, group: 16, period: 6, block: "p", category: "metalloid", config: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁴", electronegativity: 2.0, radiusPm: 140 },
  { z: 85, symbol: "At", name: "Astato", mass: 210, group: 17, period: 6, block: "p", category: "halogen", config: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁵", electronegativity: 2.2, radiusPm: 150 },
  { z: 86, symbol: "Rn", name: "Radônio", mass: 222, group: 18, period: 6, block: "p", category: "noble", config: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁶", electronegativity: 2.2, radiusPm: 150 },
  { z: 87, symbol: "Fr", name: "Frâncio", mass: 223, group: 1, period: 7, block: "s", category: "alkali", config: "[Rn] 7s¹", electronegativity: 0.7, radiusPm: 260 },
  { z: 88, symbol: "Ra", name: "Rádio", mass: 226, group: 2, period: 7, block: "s", category: "alkaline", config: "[Rn] 7s²", electronegativity: 0.9, radiusPm: 221 },
  { z: 89, symbol: "Ac", name: "Actínio", mass: 227, period: 7, block: "f", category: "actinide", config: "[Rn] 6d¹ 7s²", electronegativity: 1.1, radiusPm: 215 },
  { z: 90, symbol: "Th", name: "Tório", mass: 232.04, period: 7, block: "f", category: "actinide", config: "[Rn] 6d² 7s²", electronegativity: 1.3, radiusPm: 206 },
  { z: 91, symbol: "Pa", name: "Protactínio", mass: 231.04, period: 7, block: "f", category: "actinide", config: "[Rn] 5f² 6d¹ 7s²", electronegativity: 1.5, radiusPm: 200 },
  { z: 92, symbol: "U", name: "Urânio", mass: 238.03, period: 7, block: "f", category: "actinide", config: "[Rn] 5f³ 6d¹ 7s²", electronegativity: 1.38, radiusPm: 196 },
  { z: 93, symbol: "Np", name: "Neptúnio", mass: 237, period: 7, block: "f", category: "actinide", config: "[Rn] 5f⁴ 6d¹ 7s²", electronegativity: 1.36, radiusPm: 190 },
  { z: 94, symbol: "Pu", name: "Plutônio", mass: 244, period: 7, block: "f", category: "actinide", config: "[Rn] 5f⁶ 7s²", electronegativity: 1.28, radiusPm: 187 },
  { z: 95, symbol: "Am", name: "Amerício", mass: 243, period: 7, block: "f", category: "actinide", config: "[Rn] 5f⁷ 7s²", electronegativity: 1.13, radiusPm: 180 },
  { z: 96, symbol: "Cm", name: "Cúrio", mass: 247, period: 7, block: "f", category: "actinide", config: "[Rn] 5f⁷ 6d¹ 7s²", electronegativity: 1.28, radiusPm: 169 },
  { z: 97, symbol: "Bk", name: "Berquélio", mass: 247, period: 7, block: "f", category: "actinide", config: "[Rn] 5f⁹ 7s²", electronegativity: 1.3 },
  { z: 98, symbol: "Cf", name: "Califórnio", mass: 251, period: 7, block: "f", category: "actinide", config: "[Rn] 5f¹⁰ 7s²", electronegativity: 1.3 },
  { z: 99, symbol: "Es", name: "Einstênio", mass: 252, period: 7, block: "f", category: "actinide", config: "[Rn] 5f¹¹ 7s²", electronegativity: 1.3 },
  { z: 100, symbol: "Fm", name: "Férmio", mass: 257, period: 7, block: "f", category: "actinide", config: "[Rn] 5f¹² 7s²", electronegativity: 1.3 },
  { z: 101, symbol: "Md", name: "Mendelévio", mass: 258, period: 7, block: "f", category: "actinide", config: "[Rn] 5f¹³ 7s²", electronegativity: 1.3 },
  { z: 102, symbol: "No", name: "Nobélio", mass: 259, period: 7, block: "f", category: "actinide", config: "[Rn] 5f¹⁴ 7s²", electronegativity: 1.3 },
  { z: 103, symbol: "Lr", name: "Laurêncio", mass: 266, period: 7, block: "d", category: "actinide", config: "[Rn] 5f¹⁴ 7s² 7p¹" },
  { z: 104, symbol: "Rf", name: "Rutherfórdio", mass: 267, group: 4, period: 7, block: "d", category: "transition", config: "[Rn] 5f¹⁴ 6d² 7s²" },
  { z: 105, symbol: "Db", name: "Dúbnio", mass: 268, group: 5, period: 7, block: "d", category: "transition", config: "[Rn] 5f¹⁴ 6d³ 7s²" },
  { z: 106, symbol: "Sg", name: "Seabórgio", mass: 269, group: 6, period: 7, block: "d", category: "transition", config: "[Rn] 5f¹⁴ 6d⁴ 7s²" },
  { z: 107, symbol: "Bh", name: "Bóhrio", mass: 270, group: 7, period: 7, block: "d", category: "transition", config: "[Rn] 5f¹⁴ 6d⁵ 7s²" },
  { z: 108, symbol: "Hs", name: "Hássio", mass: 269, group: 8, period: 7, block: "d", category: "transition", config: "[Rn] 5f¹⁴ 6d⁶ 7s²" },
  { z: 109, symbol: "Mt", name: "Meitnério", mass: 278, group: 9, period: 7, block: "d", category: "transition", config: "[Rn] 5f¹⁴ 6d⁷ 7s²" },
  { z: 110, symbol: "Ds", name: "Darmstádio", mass: 281, group: 10, period: 7, block: "d", category: "transition", config: "[Rn] 5f¹⁴ 6d⁸ 7s²" },
  { z: 111, symbol: "Rg", name: "Roentgênio", mass: 282, group: 11, period: 7, block: "d", category: "transition", config: "[Rn] 5f¹⁴ 6d⁹ 7s²" },
  { z: 112, symbol: "Cn", name: "Copernício", mass: 285, group: 12, period: 7, block: "d", category: "transition", config: "[Rn] 5f¹⁴ 6d¹⁰ 7s²" },
  { z: 113, symbol: "Nh", name: "Nihônio", mass: 286, group: 13, period: 7, block: "p", category: "post-transition", config: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p¹" },
  { z: 114, symbol: "Fl", name: "Fleróvio", mass: 289, group: 14, period: 7, block: "p", category: "post-transition", config: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p²" },
  { z: 115, symbol: "Mc", name: "Moscóvio", mass: 290, group: 15, period: 7, block: "p", category: "post-transition", config: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p³" },
  { z: 116, symbol: "Lv", name: "Livermório", mass: 293, group: 16, period: 7, block: "p", category: "post-transition", config: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁴" },
  { z: 117, symbol: "Ts", name: "Tenessino", mass: 294, group: 17, period: 7, block: "p", category: "halogen", config: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁵" },
  { z: 118, symbol: "Og", name: "Oganessônio", mass: 294, group: 18, period: 7, block: "p", category: "noble", config: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁶" },
];

export const ELEMENT_BY_SYMBOL: Record<string, Element> = ELEMENTS.reduce((acc, e) => {
  acc[e.symbol] = e;
  return acc;
}, {} as Record<string, Element>);

export const ELEMENT_BY_Z: Record<number, Element> = ELEMENTS.reduce((acc, e) => {
  acc[e.z] = e;
  return acc;
}, {} as Record<number, Element>);

export const CATEGORY_COLORS: Record<Category, string> = {
  alkali: "#fb7185",
  alkaline: "#f97316",
  transition: "#eab308",
  "post-transition": "#84cc16",
  metalloid: "#10b981",
  nonmetal: "#06b6d4",
  halogen: "#3b82f6",
  noble: "#a855f7",
  lanthanide: "#ec4899",
  actinide: "#d946ef",
};

export const CATEGORY_LABELS: Record<Category, string> = {
  alkali: "Metais alcalinos",
  alkaline: "Alcalino-terrosos",
  transition: "Metais de transição",
  "post-transition": "Metais pós-transição",
  metalloid: "Metaloides",
  nonmetal: "Não-metais",
  halogen: "Halogênios",
  noble: "Gases nobres",
  lanthanide: "Lantanídeos",
  actinide: "Actinídeos",
};

/**
 * Calcula a massa molar de uma fórmula química como "H2O", "C6H12O6",
 * "Ca(OH)2", "CuSO4·5H2O", "(NH4)2SO4". Suporta parênteses, números e
 * o caractere · (hidrato).
 */
export function parseFormula(formula: string): Map<string, number> {
  const counts = new Map<string, number>();
  // Normalizar · / * (hidratos) — somar todos componentes
  const parts = formula.split(/[·*•]/);
  for (const partRaw of parts) {
    let part = partRaw.trim();
    // prefixo numérico (ex: 5H2O)
    const prefMatch = part.match(/^(\d+)/);
    let prefix = 1;
    if (prefMatch) {
      prefix = Number(prefMatch[1]);
      part = part.slice(prefMatch[0].length);
    }
    const sub = parseInner(part);
    for (const [el, n] of sub) {
      counts.set(el, (counts.get(el) ?? 0) + n * prefix);
    }
  }
  return counts;
}

function parseInner(formula: string): Map<string, number> {
  const counts = new Map<string, number>();
  let i = 0;
  while (i < formula.length) {
    const ch = formula[i];
    if (ch === "(") {
      // find matching )
      let depth = 1;
      let j = i + 1;
      while (j < formula.length && depth > 0) {
        if (formula[j] === "(") depth++;
        else if (formula[j] === ")") depth--;
        if (depth > 0) j++;
      }
      if (depth !== 0) throw new Error("Parênteses desbalanceados");
      const inner = formula.slice(i + 1, j);
      i = j + 1;
      // multiplier
      const m = formula.slice(i).match(/^\d+/);
      const mult = m ? Number(m[0]) : 1;
      if (m) i += m[0].length;
      const sub = parseInner(inner);
      for (const [el, n] of sub) counts.set(el, (counts.get(el) ?? 0) + n * mult);
    } else if (/[A-Z]/.test(ch)) {
      // element symbol: 1 uppercase + 0..2 lowercase
      let sym = ch;
      i++;
      while (i < formula.length && /[a-z]/.test(formula[i])) {
        sym += formula[i];
        i++;
      }
      // number
      const m = formula.slice(i).match(/^\d+/);
      const mult = m ? Number(m[0]) : 1;
      if (m) i += m[0].length;
      if (!ELEMENT_BY_SYMBOL[sym]) throw new Error(`Elemento desconhecido: ${sym}`);
      counts.set(sym, (counts.get(sym) ?? 0) + mult);
    } else if (/\s/.test(ch)) {
      i++;
    } else {
      throw new Error(`Caractere inválido: ${ch}`);
    }
  }
  return counts;
}

export function molarMass(formula: string): { total: number; breakdown: Array<{ symbol: string; count: number; atomic: number; subtotal: number }> } {
  const counts = parseFormula(formula);
  const breakdown: Array<{ symbol: string; count: number; atomic: number; subtotal: number }> = [];
  let total = 0;
  for (const [sym, n] of counts) {
    const e = ELEMENT_BY_SYMBOL[sym];
    const sub = e.mass * n;
    breakdown.push({ symbol: sym, count: n, atomic: e.mass, subtotal: sub });
    total += sub;
  }
  return { total, breakdown };
}
