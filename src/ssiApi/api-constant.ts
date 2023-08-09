export const APIENDPOINT = {
  STUDIO_API_BASE_URL: 'http://localhost:3001/api/v1',

  // STUDIO_API_BASE_URL: 'https://api.entity.hypersign.id/api/v1',
  STUDIO_API_ORIGIN: 'https://entity.hypersign.id',
  AUTH: '/app/oauth',
  DID: {
    CREATE_DID_ENDPOINT: '/did/create',
    REGISTER_DID_ENDPOINT: '/did/register',
    UPDATE_DID_ENDPOINT: '/did',
    RESOLVE_DID_ENDPOINT: '/did/resolve',
  },
  CREDENTIALS: {
    REGISTER_CREDENTIAL_STATUS: '/credential/status/register',
  },
  SCHEMA: {
    REGISTER_SCHEMA: '/schema/register',
  },
};
