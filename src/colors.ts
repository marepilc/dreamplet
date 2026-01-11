/**
 * Lightweight OKLCH to sRGB converter.
 * Based on https://bottosson.github.io/posts/oklab/
 */

export function parseOklch(color: string): Float32Array | null {
  const match = color.match(/oklch\(([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,\/]+([\d.]+))?\)/);
  if (!match) return null;

  const l = parseFloat(match[1]);
  const c = parseFloat(match[2]);
  const h = parseFloat(match[3]);
  const a = match[4] ? parseFloat(match[4]) : 1.0;

  // 1. OKLCH to OKLAB
  const hueRad = (h * Math.PI) / 180;
  const L = l;
  const a_lab = c * Math.cos(hueRad);
  const b_lab = c * Math.sin(hueRad);

  // 2. OKLAB to Linear LMS
  const l_lms = L + 0.3963377774 * a_lab + 0.2158037573 * b_lab;
  const m_lms = L - 0.1055613458 * a_lab - 0.0638541728 * b_lab;
  const s_lms = L - 0.0894841775 * a_lab - 1.2914855480 * b_lab;

  // 3. LMS to Linear sRGB
  const l_ = l_lms * l_lms * l_lms;
  const m_ = m_lms * m_lms * m_lms;
  const s_ = s_lms * s_lms * s_lms;

  const r_lin = +4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_;
  const g_lin = -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_;
  const b_lin = -0.0041960863 * l_ - 0.7034186147 * m_ + 1.7076147010 * s_;

  // 4. Linear sRGB to sRGB (gamma correction)
  const gamma = (v: number) =>
    v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;

  return new Float32Array([
    Math.max(0, Math.min(1, gamma(r_lin))),
    Math.max(0, Math.min(1, gamma(g_lin))),
    Math.max(0, Math.min(1, gamma(b_lin))),
    a
  ]);
}
