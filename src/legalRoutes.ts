const legalRoutes = new Set(['/imprint', '/privacy-policy'])

export const LEGAL_CAMERA_TURN_ANGLE = Math.PI * 0.25

export function isLegalRoute(pathname: string): boolean {
  return legalRoutes.has(pathname)
}
