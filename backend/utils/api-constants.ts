const BASE = '/b2c/x/classic/healthcare-1126';

// Test user params extracted from authenticated session
const USER = {
  externalFacingId: 'hXngHeN46%2BvplOESj7vyUHIAGaSXuKopIDVAalMijC8497000058',
  affiliationId: '28c6476d-2f62-40b7-a435-a618b735b4e4',
  employerId: 'fa778ba9-bbef-4abd-9ac9-e8addd397c57',
  client: 'nationwide',
} as const;

// ── Common / Global APIs ────────────────────────────────────────────────
export const COMMON = {
  prelogin: `${BASE}/v1/prelogin?language=en`,
  preloginWithEmployer: `${BASE}/v1/prelogin?language=en&employerId=${USER.employerId}`,
  postLogin: `${BASE}/v2/post-login?language=en`,
  missionCategories: `${BASE}/v1/activity-category?&language=en&type=mission&isMissionFilterCategory=true`,
  challengeCategories: `${BASE}/v1/activity-category?&language=en&type=challenge&isChallengeFilterCategory=true`,
  giftCardCategories: `${BASE}/v1/rewards/gift-cards/categories`,
  focusAreas: `${BASE}/v1/focus-areas?language=en`,
  userPoints: `${BASE}/v1/rewards/user-points?externalFacingId=${USER.externalFacingId}`,
  onboardingSteps: `${BASE}/v1/user/onboarding-steps?externalFacingId=${USER.externalFacingId}&affiliationId=${USER.affiliationId}&language=en&isFirstTimeLogin=false`,
  onboardingFirstLogin: `${BASE}/v1/user/onboarding-steps?externalFacingId=${USER.externalFacingId}&affiliationId=${USER.affiliationId}&language=en&isFirstTimeLogin=true`,
  rewardableGatekept: `${BASE}/v1/rewardable-activities?language=en&externalFacingId=${USER.externalFacingId}&affiliationId=${USER.affiliationId}&activityType=gatekept`,
  tokenDetails: '/extapi/management/token/details',
  banners: `${BASE}/v1/banners?language=en&affiliationId=${USER.affiliationId}`,
};

// ── Home Page APIs ──────────────────────────────────────────────────────
export const HOME = {
  employerRewards: `${BASE}/v1/rewards/user-employer-rewards?externalFacingId=${USER.externalFacingId}&affiliationId=${USER.affiliationId}`,
  spotlightItems: `${BASE}/v1/user/spotlight-items?language=en&externalFacingId=${USER.externalFacingId}&affiliationId=${USER.affiliationId}`,
  topPicks: `${BASE}/v1/user/top-picks?externalFacingId=${USER.externalFacingId}&affiliationId=${USER.affiliationId}&client=${USER.client}`,
  myActivitiesStride: `${BASE}/v1/user/my-activities?language=en&externalFacingId=${USER.externalFacingId}&affiliationId=${USER.affiliationId}&typeFilter=stride`,
  myActivitiesChallenge: `${BASE}/v1/user/my-activities?language=en&externalFacingId=${USER.externalFacingId}&affiliationId=${USER.affiliationId}&typeFilter=challenge`,
  myActivitiesMission: `${BASE}/v1/user/my-activities?language=en&externalFacingId=${USER.externalFacingId}&affiliationId=${USER.affiliationId}&typeFilter=mission`,
  myActivitiesGymCheckin: `${BASE}/v1/user/my-activities?language=en&externalFacingId=${USER.externalFacingId}&affiliationId=${USER.affiliationId}&typeFilter=gymCheckin`,
  myActivitiesFitnessReimbursement: `${BASE}/v1/user/my-activities?language=en&externalFacingId=${USER.externalFacingId}&affiliationId=${USER.affiliationId}&typeFilter=fitnessReimbursement`,
  missionsHome: `${BASE}/v1/missions?limit=3&language=en&externalFacingId=${USER.externalFacingId}`,
  healthSurvey: `${BASE}/v1/rewardable-activities/health-survey?language=en&externalFacingId=${USER.externalFacingId}&affiliationId=${USER.affiliationId}`,
  healthScore: `${BASE}/v1/health-profile/health-score?client=${USER.client}`,
  legalAuths: `${BASE}/v1/user/legal-auths?language=en`,
};

// ── Explore Page APIs ───────────────────────────────────────────────────
export const EXPLORE = {
  challenges: `${BASE}/v1/challenges?limit=10&language=en&employerId=${USER.employerId}&affiliationId=${USER.affiliationId}&externalFacingId=${USER.externalFacingId}`,
  teamChallenges: `${BASE}/v1/challenges/team-challenges?limit=10&language=en&employerId=${USER.employerId}&affiliationId=${USER.affiliationId}&externalFacingId=${USER.externalFacingId}`,
  userCreatedOptions: `${BASE}/v1/challenges/user-created/options?language=en`,
  recommendedActivities: `${BASE}/v1/rewardable-activities?language=en&externalFacingId=${USER.externalFacingId}&affiliationId=${USER.affiliationId}&limit=6&activityType=recommended`,
  missionsExplore: `${BASE}/v1/missions?limit=10&language=en&employerId=${USER.employerId}&externalFacingId=${USER.externalFacingId}`,
};

// ── Benefits Page APIs ──────────────────────────────────────────────────
export const BENEFITS = {
  otherBenefits: `${BASE}/v1/benefits/other-benefits?language=en&affiliationId=${USER.affiliationId}&employerId=${USER.employerId}&client=${USER.client}`,
  resources: `${BASE}/v1/affiliation/resources?language=en&affiliationId=${USER.affiliationId}`,
  wellnessCoaching: `${BASE}/v1/benefits/wellness-coaching?language=en&employerId=${USER.employerId}&affiliationId=${USER.affiliationId}&client=${USER.client}`,
};

// ── Rewards Page APIs ───────────────────────────────────────────────────
export const REWARDS = {
  sweepstakesPublic: `${BASE}/v1/rewards/sweepstakes?language=en&externalFacingId=${USER.externalFacingId}&affiliationId=${USER.affiliationId}&type=public&page=1&limit=3`,
  sweepstakesPrivate: `${BASE}/v1/rewards/sweepstakes?language=en&externalFacingId=${USER.externalFacingId}&affiliationId=${USER.affiliationId}&type=private&page=1&limit=3`,
  auctions: `${BASE}/v1/rewards/auctions?language=en&externalFacingId=${USER.externalFacingId}&affiliationId=${USER.affiliationId}&page=1&limit=3`,
  myAuctions: `${BASE}/v1/rewards/auctions/my-auctions?page=1&language=en&limit=3&externalFacingId=${USER.externalFacingId}&affiliationId=${USER.affiliationId}`,
  offers: `${BASE}/v1/rewards/offers?language=en&externalFacingId=${USER.externalFacingId}&affiliationId=${USER.affiliationId}&page=1&limit=3`,
  donations: `${BASE}/v1/rewards/donations?language=en&externalFacingId=${USER.externalFacingId}&affiliationId=${USER.affiliationId}&page=1&limit=3`,
  programOverview: `${BASE}/v1/user/program-overview?externalFacingId=${USER.externalFacingId}&affiliationId=${USER.affiliationId}&employerId=${USER.employerId}`,
};

// ── Settings Page APIs ──────────────────────────────────────────────────
export const SETTINGS = {
  avatars: `${BASE}/v1/avatars?language=en`,
};

// ── Home page also calls benefits/all (paginated) ───────────────────────
export const HOME_BENEFITS = {
  benefitsAll: `${BASE}/v1/benefits/all?language=en&externalFacingId=${USER.externalFacingId}&affiliationId=${USER.affiliationId}&categories=null&limit=3&page=1`,
};
