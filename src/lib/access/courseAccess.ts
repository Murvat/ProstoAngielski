export type AccessCheckResult = {
  hasPaidPurchase: boolean;
  hasActiveSubscription: boolean;
  hasFullAccess: boolean;
};

export async function resolveCourseAccess(): Promise<AccessCheckResult> {
  return {
    hasPaidPurchase: false,
    hasActiveSubscription: false,
    hasFullAccess: true,
  };
}
