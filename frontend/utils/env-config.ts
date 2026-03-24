type EnvName = '1126' | 'uat';

interface EnvConfig {
  baseURL: string;
  apiBaseURL: string;
  apiBasePath: string;
  credentials: {
    email: string;
    password: string;
    otp: string;
  };
  exploreCredentials: {
    email: string;
    password: string;
    otp: string;
  };
  user: {
    externalFacingId: string;
    affiliationId: string;
    employerId: string;
    client: string;
  };
}

const ENV_MAP: Record<EnvName, EnvConfig> = {
  '1126': {
    baseURL: 'https://1126.rallyengage.com',
    apiBaseURL: 'https://api.rallyengage.com',
    apiBasePath: '/b2c/x/classic/healthcare-1126',
    credentials: {
      email: 'FNVNKMBONMPE.LNIETSDXXC@invalid.com',
      password: 'Password12345',
      otp: '987654',
    },
    exploreCredentials: {
      email: 'fnmaggy',
      password: 'Password12345',
      otp: '987654',
    },
    user: {
      externalFacingId: 'hXngHeN46%2BvplOESj7vyUHIAGaSXuKopIDVAalMijC8497000058',
      affiliationId: '28c6476d-2f62-40b7-a435-a618b735b4e4',
      employerId: 'fa778ba9-bbef-4abd-9ac9-e8addd397c57',
      client: 'nationwide',
    },
  },
  uat: {
    baseURL: 'https://optum-healthcare-frontend-main.vercel.app',
    apiBaseURL: 'https://api.rallyengage.com',
    apiBasePath: '/b2c/x/classic/healthcare-1126',
    credentials: {
      email: 'FNQWPLUWUHSB.LNZHJGDCOQ@invalid.com',
      password: 'Password12345',
      otp: '987654',
    },
    exploreCredentials: {
      email: 'fnmaggy',
      password: 'Password12345',
      otp: '987654',
    },
    // TODO: Update these with UAT-specific user params once available
    user: {
      externalFacingId: 'hXngHeN46%2BvplOESj7vyUHIAGaSXuKopIDVAalMijC8497000058',
      affiliationId: '28c6476d-2f62-40b7-a435-a618b735b4e4',
      employerId: 'fa778ba9-bbef-4abd-9ac9-e8addd397c57',
      client: 'nationwide',
    },
  },
};

const ENV_NAME: EnvName = (process.env.ENV as EnvName) || '1126';

if (!ENV_MAP[ENV_NAME]) {
  throw new Error(`Unknown environment "${ENV_NAME}". Use ENV=1126 or ENV=uat`);
}

export const ENV = ENV_MAP[ENV_NAME];
export const CURRENT_ENV = ENV_NAME;
