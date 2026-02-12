import * as core from "@actions/core";

function parseWorkflowFilename(workflowRef) {
  const WORKFLOW_DIRECTORY = '/.github/workflows/';
  const dirStart = workflowRef.indexOf(WORKFLOW_DIRECTORY);
  if (dirStart === -1) { return null; }
  const filenameStart = dirStart + WORKFLOW_DIRECTORY.length;
  let refStart = workflowRef.indexOf('@refs/', filenameStart);
  if (refStart === -1) { refStart = workflowRef.lastIndexOf('@'); }
  if (refStart === -1) { return null; }
  return workflowRef.substring(filenameStart, refStart);
}

export async function notify(isPre) {
  const token = process.env['INPUT_BRONTO-SHEPHERD-WORKFLOW-TOKEN'] || null;
  const url = process.env['INPUT_BRONTO-SHEPHERD-URL'] || null;

  // If both inputs are missing, the action completes successfully, allowing
  // users to run actions manually without communicating with Bronto Shepherd.
  if (!token && !url) { return; }

  if (!url) {
    core.setFailed('Missing input: "bronto-shepherd-url"');
    return;
  }

  const workflowRef = process.env.GITHUB_WORKFLOW_REF;
  const workflow = parseWorkflowFilename(workflowRef);

  if (!workflow) {
    core.setFailed(`Failed to parse workflow ref '${workflowRef}'`);
    return;
  }

  const [owner, name] = process.env.GITHUB_REPOSITORY.split('/');
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token,
      start: isPre,
      workflow,
      run_id: process.env.GITHUB_RUN_ID,
      commit: process.env.GITHUB_SHA,
      repo_owner: owner,
      repo_name: name
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    core.setFailed(`Request failed (${response.status}): ${text}`);
    return;
  }
}
