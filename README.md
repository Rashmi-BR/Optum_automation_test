# Optum Engage - Automation Test Suite

Lightweight Playwright automation suite for **Optum Engage (Rally Engage)** covering both Web UI smoke tests and Backend API validation.

Frontend tests use **API-driven preconditions** — real backend APIs are called before each test so UI assertions verify actual data, not just element visibility.

## Framework Structure

```
Optum_automation_test/
├── backend/
│   ├── tests/
│   │   ├── api-auth.setup.ts          # Auth setup - extracts Bearer token via UI login
│   │   ├── common.api.spec.ts         # Global/shared API endpoints (11 tests)
│   │   ├── home.api.spec.ts           # Home page API endpoints (11 tests)
│   │   ├── explore.api.spec.ts        # Explore page API endpoints (5 tests)
│   │   ├── benefits.api.spec.ts       # Benefits page API endpoints (3 tests)
│   │   ├── rewards.api.spec.ts        # Rewards page API endpoints (8 tests)
│   │   └── settings.api.spec.ts       # Settings page API endpoints (1 test)
│   └── utils/
│       ├── api-constants.ts           # Centralized API endpoint URLs organized by page
│       ├── api-helpers.ts             # Response validation helpers (envelope checks)
│       └── api-test.ts               # Custom Playwright fixture with Bearer token auth
│
├── frontend/
│   ├── pages/                         # Page Object Models
│   │   ├── login.page.ts             # Welcome, HealthSafe ID login, OTP flow
│   │   ├── home.page.ts              # Navigation, banner, summary, sections
│   │   ├── explore.page.ts           # Activities, missions, categories
│   │   ├── benefits.page.ts          # Resources, benefit links
│   │   ├── rewards.page.ts           # Points, redeem, offers, auctions, sweepstakes
│   │   ├── settings.page.ts          # Sidebar menu, account details, logout
│   │   └── signout.page.ts           # Thank you page, return to welcome
│   ├── tests/
│   │   ├── auth.setup.ts             # Auth setup - saves browser state + extracts API token
│   │   ├── login.spec.ts             # Login flow tests (4 tests)
│   │   ├── home.spec.ts              # Home page tests with API preconditions (9 tests)
│   │   ├── explore.spec.ts           # Explore page tests with API preconditions (3 tests)
│   │   ├── benefits.spec.ts          # Benefits page tests with API preconditions (1 test)
│   │   ├── rewards.spec.ts           # Rewards page tests with API preconditions (7 tests)
│   │   ├── settings.spec.ts          # Settings page tests with API preconditions (3 tests)
│   │   ├── signout.spec.ts           # Signout flow tests (2 tests)
│   │   └── debug-api.spec.ts         # Debug utility for capturing API requests
│   └── utils/
│       ├── api-test.ts               # Custom fixture - adds `api` context to `page`
│       └── test-data.ts              # Test credentials
│
├── .github/
│   └── workflows/
│       └── playwright.yml            # CI/CD pipeline
│
├── playwright.config.ts              # Playwright configuration with project setup
└── package.json                      # Scripts and dependencies
```

## API-Driven Frontend Tests

Frontend tests follow a **precondition → navigate → assert** pattern. Before each test, real backend APIs are called and the responses are stored. UI assertions then verify both structural visibility and that displayed values match the API data.

```
1. auth.setup.ts logs in → saves storageState + extracts API token
2. test.beforeEach:
   a. Call real backend APIs (e.g., GET /v1/rewards/user-points)
   b. Parse responses → store data (e.g., pointsBalanceAmt = 2500)
   c. page.goto('/home') → navigate to the page
3. Test assertions:
   a. Structural: "Summary section is visible"        ✓ (existing)
   b. Dynamic:  "Summary section contains 2500"       ✓ (API-verified)
```

### APIs Called Per Page

| Frontend Spec | APIs Called in `beforeEach` | Dynamic Assertions |
|---------------|---------------------------|--------------------|
| **home** | banners, employerRewards, userPoints, healthScore, onboardingSteps, focusAreas, missionsHome, topPicks | Banner headline text, rewards/points/health score values in summary |
| **explore** | recommendedActivities, missionsExplore, challenges | Activities count, missions presence |
| **benefits** | resources | Resource names match API response |
| **rewards** | employerRewards, userPoints, offers, auctions, sweepstakes, donations | Rewards balance, points balance, section content |
| **settings** | avatars | Avatar data loaded |

The `api` fixture is provided by `frontend/utils/api-test.ts`, which reads the token from `playwright/.auth/api-token.json` and creates an authenticated `APIRequestContext`. API endpoint constants are reused from `backend/utils/api-constants.ts`.

## Test Coverage

### Backend API Tests (39 tests)

All API tests hit `https://api.rallyengage.com` with an authenticated Bearer token.

| Spec File | Tests | Endpoints Covered |
|-----------|-------|-------------------|
| **common** | 11 | Prelogin (with/without employer), post-login eligibility, mission & challenge categories, gift card categories, focus areas, user points, onboarding steps (first login + regular), rewardable activities, token details, banners |
| **home** | 11 | Employer rewards, spotlight items, top picks, my activities (stride, challenge, mission, gym check-in, fitness reimbursement), missions feed, health survey, health score, legal auths |
| **explore** | 5 | Challenges, team challenges, user-created challenge options, recommended activities, missions |
| **benefits** | 3 | Other benefits, resources, wellness coaching |
| **rewards** | 8 | Public sweepstakes, private sweepstakes, auctions, my auctions, offers, donations, program overview |
| **settings** | 1 | Avatars |

**Response validation helpers:**
- `expectSuccessResponse` - Standard envelope `{ title, status: 200, data }`
- `expectArrayResponse` - Data is an array with optional minimum length
- `expectObjectResponse` - Data is a non-null object
- `expectPaginatedResponse` - Envelope with `pagination.totalResults`
- `expectAvatarsResponse` - Avatars envelope `{ success, status, errors, data }`
- `expectTokenResponse` - Token details `{ hsidToken }`
- `expectLegalAuthsResponse` - Legal auths `{ legalAuthForms: [] }`

### Frontend UI Tests (29 tests)

All UI tests run against `https://1126.rallyengage.com` using the Page Object Model pattern. Tests combine structural checks (element visibility) with dynamic assertions (API data matches displayed values).

| Spec File | Tests | What's Verified |
|-----------|-------|-----------------|
| **login** | 4 | Welcome page, HealthSafe ID navigation, identity confirmation, OTP submission, home page redirect |
| **home** | 9 | Nav tabs, banner headline (API), summary values — rewards/points/health score (API), setup guide, focus areas, missions, challenges, top picks, token count |
| **explore** | 3 | Rewardable activities, missions section (API count), category filtering |
| **benefits** | 1 | Resource links visibility, resource names match API |
| **rewards** | 7 | Rewards balance (API), points balance (API), redeem section, offers (API count), auctions, sweepstakes, donations (API count) |
| **settings** | 3 | Page load, sidebar menu items, account details, avatars loaded (API) |
| **signout** | 2 | Signout page display, navigation back to welcome |

## Authentication Flow

The framework uses a **unified auth system** — both frontend and backend tests share the same login flow, and frontend auth setup also extracts the API token for use in test preconditions.

```
                    UI Login (HealthSafe ID + OTP)
                          |
              +-----------+-----------+
              v                       v
     Frontend Auth                Backend Auth
  (auth.setup.ts)            (api-auth.setup.ts)
        |     |                    |      |
        v     v                    v      v
  user.json  api-token.json   api-user.json  api-token.json
  (browser    (Bearer token)  (browser       (Bearer token)
   state)          |           state)              |
        |          |                               |
        v          v                               v
  UI tests    API preconditions              API tests use
  use saved   in beforeEach call             token in request
  cookies     real backend APIs                  headers
```

## Playwright Config - Projects

| Project | Purpose | Depends On | Auth State |
|---------|---------|------------|------------|
| `setup` | Frontend auth setup | - | Creates `user.json` + `api-token.json` |
| `login` | Login flow tests | - | None (tests login itself) |
| `chromium` | All other frontend tests | `setup` | Uses `user.json` + `api-token.json` |
| `api-setup` | Backend auth setup | - | Creates `api-token.json` + `api-user.json` |
| `api` | All API tests | `api-setup` | Uses `api-token.json` |

## Getting Started

### Prerequisites
- Node.js (LTS)
- npm

### Installation

```bash
npm install
npx playwright install --with-deps
```

### Running Tests

```bash
# Run all tests (frontend + backend)
npm test

# -- Frontend tests --
npm run test:login
npm run test:home
npm run test:explore
npm run test:benefits
npm run test:rewards
npm run test:settings
npm run test:signout

# -- Backend API tests --
npm run test:api                 # All API tests
npm run test:api:common          # Common/global endpoints
npm run test:api:home            # Home page endpoints
npm run test:api:explore         # Explore page endpoints
npm run test:api:benefits        # Benefits page endpoints
npm run test:api:rewards         # Rewards page endpoints
npm run test:api:settings        # Settings page endpoints

# -- Reports --
npm run report                   # Open HTML test report
```

## CI/CD

GitHub Actions workflow (`.github/workflows/playwright.yml`) runs on every push/PR to `main`/`master`:
1. Installs dependencies and Playwright browsers
2. Runs the full test suite
3. Uploads the HTML report as an artifact (30-day retention)

## Tech Stack

- **Playwright** `^1.58.2` - Test runner, browser automation, and API testing
- **TypeScript** - Type-safe test authoring
- **Node.js** - Runtime
- **GitHub Actions** - CI/CD
