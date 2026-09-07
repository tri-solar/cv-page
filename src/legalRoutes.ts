const legalRoutes = new Set(['/imprint', '/privacy-policy']);

export const LEGAL_CAMERA_TURN_ANGLE = Math.PI * 0.25;

function normalizePath(pathname: string): string {
  return pathname.replace(/\/+$/, '') || '/';
}

export function isLegalRoute(pathname: string): boolean {
  return legalRoutes.has(normalizePath(pathname));
}
