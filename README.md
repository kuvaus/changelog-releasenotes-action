# changelog-releasenotes-action

> **Warning**
> Do not use! Does not work yet!


This action generates release notes from changelog.md and uploads them into github release description automatically.

## Inputs

### `who-to-greet`

**Required** The name of the person to greet. Default `"World"`.

## Outputs

### `time`

The time we greeted you.

## Example usage

```yaml
uses: actions/hello-world-javascript-action
with:
  who-to-greet: 'Mona the Octocat'
```

