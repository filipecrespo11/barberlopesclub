import type { Headers } from "next/dist/compiled/@edge-runtime/primitives";

// Decide which token to use when calling the backend:
// 1) SERVICE_API_TOKEN from env (service token)
// 2) Client token forwarded from the request (Authorization or x-access-token)
export function getServiceAuthToken(reqHeaders: Headers) {
  // 1) Se vier um token do cliente, priorize-o (o middleware autenticaAdmin valida usuário logado admin)
  const auth = reqHeaders.get('authorization') || reqHeaders.get('Authorization');
  const xToken = reqHeaders.get('x-access-token');
  if (auth) return auth; // já no formato correto
  if (xToken) return `Bearer ${xToken}`;

  // 2) Caso contrário, use o SERVICE_API_TOKEN se existir
  const serviceToken = process.env.SERVICE_API_TOKEN;
  if (serviceToken) return `Bearer ${serviceToken}`;
  return '';
}
