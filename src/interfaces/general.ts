enum Environment {
  DEV = 'development',
  STAGING = 'staging',
  PROD = 'production',
}

enum Status {
  SUCCESS = 'success',
  FAIL = 'failure',
}

interface CountResult {
  count: string;
}

export { Environment, Status, CountResult };
