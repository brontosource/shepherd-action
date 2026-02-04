# Bronto Shepherd Action

This action notifies the [Bronto Shepherd GitHub Application](https://github.com/apps/bronto-shepherd)
when an action it manages has started or completed. In order to make full use of this
action, you will need to install the application. If this action runs on a repository
which does not have a Bronto Shepherd installation, nothing will happen.

## Usage

To use this action, add the following to your action:

```yaml
- uses: brontosource/shepherd-action@vmain
  with:
    bronto-shepherd-workflow-token: ${{ inputs.bronto-shepherd-workflow-token }}
    bronto-shepherd-url: ${{ inputs.bronto-shepherd-url }}
```

If an action was triggered by Bronto Shepherd, it will be notified of the start
and stop times. If the action was triggered by any other mechanism, Bronto
Shepherd will not be notified.

## Artifacts

Bronto Shepherd inspects the output artifact named `bronto-shepherd-output`.
It may retain copies of the output. Please refrain from including any sensitive 
information in this output.

While this action is under initial development, the format expected in
`bronto-shepherd-output` is unspecified and subject to change without notice.
