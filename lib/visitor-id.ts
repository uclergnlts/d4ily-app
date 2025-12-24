/**
 * Generate a unique visitor ID for reaction tracking
 * Uses browser fingerprinting (simple version)
 */
export function getVisitorId(): string {
  // Check if we have a stored ID
  if (typeof window !== 'undefined') {
    let visitorId = localStorage.getItem('d4ily_visitor_id');

    if (!visitorId) {
      // Generate a new ID using timestamp + random
      visitorId = `v_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem('d4ily_visitor_id', visitorId);
    }

    return visitorId;
  }

  // Fallback for SSR
  return 'anonymous';
}
