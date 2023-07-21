# changelog-releasenotes-action

> **Warning**
> Do not use! Does not work yet!


This action generates release notes from changelog.md and uploads them into github release description automatically.


## Example usage


```yaml
jobs:
  releasenotes:
    runs-on: ubuntu-latest
    name: Generate release notes
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3
      - name: Generate release notes
        uses: kuvaus/changelog-releasenotes-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.DEPLOY_KEY }}
```

## Inputs

#### `who-to-greet`
**optional** The name of the person to greet. Default `"World"`.
#### `changelog`
**optional** The input path of the changelog file. Default: `"CHANGELOG.md"`.

#### `filtered_changelog`
**optional** The output path of the release notes file. Default: `"FILTERED_CHANGELOG.md"`.

#### `start_token`
**optional** The start tag of the release notes. Default: `"#### [v"`.

#### `end_token`
**optional** The end tag of the release notes. Default: `"#### [v"`.

#### `specific_tag`
**optional** Extract release notes from a specific tag (e.g. v0.1.2) instead of the newest one.  Default: `"false"`.

#### `use_date`
  description: Extract the date to the release notes. Default: `"false"`.

#### `upcoming_release`
**optional** Set this to `true` to get release notes from the [Upcoming] section instead of the first tagged release. Default: `"false"`.

#### `create_release`
**optional** Set this to `true` to make a new release if one does not exist. Default: `"true"`.

#### `update_release`
**optional** Set this to `true` to update a release. Default: `"true"`.

## Outputs

### `releasenotes`

The filtered release notes.

Here is a more detailed version with all the possible options:







```yaml
jobs:
  releasenotes:
    runs-on: ubuntu-latest
    name: Generate release notes
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3
      - name: Generate release notes
        uses: kuvaus/changelog-releasenotes-action@v2
        with:
          # The input path of the changelog file. Default: `CHANGELOG.md`
          changelog: CHANGELOG.md
          # The output path of the release notes file
          filtered_changelog: FILTERED_CHANGELOG.md
          # The start tag of the release notes
          start_token: "#### [v"
          # The end tag of the release notes
          end_token: "#### [v"
          # Extract release notes from a specific tag (e.g. v0.1.2) instead of the newest one. Set to v0.1.2 instead of `false`
          specific_tag: false
          # Extract the date to the release notes (otherwise skips the first two lines after the start_token).
          use_date: false
          # Set this to `true` to get release notes from the [Upcoming] section instead of the first tagged release. Sets the start_tag to  #### [ instead
          upcoming_release: false
          # Set this to `true` to make a new release if one does not exist
          create_release: true
          # Set this to `true` to update a release
          update_release: true
        env:
          GITHUB_TOKEN: ${{ secrets.DEPLOY_KEY }}
```
