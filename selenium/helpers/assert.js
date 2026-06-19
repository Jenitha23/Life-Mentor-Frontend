export function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

export function assertStatus(response, label, allowed = [200, 201, 204, 400, 401, 403, 404]) {
  assert(response && typeof response.status === 'number', `${label}: no HTTP response returned`);
  assert(response.status !== 404, `${label}: endpoint not found. Response: ${JSON.stringify(response.body)}`);
  assert(response.status < 500, `${label}: server error ${response.status}. Response: ${JSON.stringify(response.body)}`);
  assert(allowed.includes(response.status), `${label}: unexpected status ${response.status}. Response: ${JSON.stringify(response.body)}`);
}

export function assertSuccess(response, label) {
  assertStatus(response, label, [200, 201, 204]);
  if (response.status !== 204) {
    assert(response.body?.success === true, `${label}: expected success=true. Response: ${JSON.stringify(response.body)}`);
  }
}
