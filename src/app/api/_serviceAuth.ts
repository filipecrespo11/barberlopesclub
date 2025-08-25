import type { Headers } from "next/dist/compiled/@edge-runtime/primitives";

// Decide which token to use when calling the backend:
// 1) SERVICE_API_TOKEN from env (service token)
// 2) Client token forwarded from the request (Authorization or x-access-token)
export function getServiceAuthToken(reqHeaders: Headers) {
  const serviceToken = process.env.SERVICE_API_TOKEN;
  if (serviceToken) return `Bearer ${serviceToken}`;

  const auth = reqHeaders.get('authorization') || reqHeaders.get('Authorization');
  const xToken = reqHeaders.get('x-access-token');
  if (auth) return auth; // already in the correct format
  if (xToken) return `Bearer ${xToken}`;
  return '';
}
