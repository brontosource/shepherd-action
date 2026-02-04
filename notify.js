import * as core from "@actions/core";

export async function notify(isPre) {
  const token = process.env['INPUT_BRONTO-SHEPHERD-WORKFLOW-TOKEN'];
  const url = process.env['INPUT_BRONTO-SHEPHERD-URL'];

  // If both inputs are missing, the action completes successfully, allowing
  // users to run actions manually without communicating with Bronto Shepherd.
  if (!token && !url) { return; }

  if (!token) {
    core.setFailed('Missing input: "bronto-shepherd-workflow-run"');
    return;
  }

  if (!url) {
    core.setFailed('Missing input: "bronto-shepherd-url"');
    return;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token,
      start: isPre,
      run_id: process.env.GITHUB_RUN_ID
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    core.setFailed(`Request failed (${response.status}): ${text}`);
    return;
  }
}
