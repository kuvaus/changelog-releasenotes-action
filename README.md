# changelog-releasenotes-action

This action generates release notes from `CHANGELOG.md` and uploads them into github release description automatically.


## Usage


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

The simple script above is enough for most usage. It extracts the changes of newest tag from `CHANGELOG.md`, skips the date, and uploads them into github release description body. If no release has been specified, it will create one, but if a release with the tag already exists, it will modify its release description.

> **Note**
>  Note that the script needs the `GITHUB_TOKEN` for creating or updating the release.

## Options

**Version 2** `kuvaus/changelog-releasenotes-action@v2` uses Node 20. There is also an optional old **Version 1** `kuvaus/changelog-releasenotes-action@v1` that uses Node 16.


Optionally there are `inputs` that you can change to modify the actions behavior. The action also `outputs` the filtered release notes as `releasenotes`. Below is a more detailed version with all the possible options:

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
          # Below are the optional options you can change and their default values
          changelog: 'CHANGELOG.md'  # Changelog file name for input
          filtered_changelog: 'FILTERED_CHANGELOG.md' # The output name release notes file
          changelog_format: 'keepachangelog' # 'auto-changelog' to change the defaults to the other format
          start_token: '## [' # The start tag of the release notes
          end_token:   '## [' # The end tag of the release notes
          specific_tag: ''  # Use specific tag (e.g. v0.1.2) instead of the newest
          skip_n_lines: '0' # Skip first N lines in parsing
          upcoming_release: 'false' # Create prerelease with [Upcoming] section
          create_release: 'true' # make a new release if one does not exist
          update_release: 'true' # update existing release
        env:
          GITHUB_TOKEN: ${{ secrets.DEPLOY_KEY }}
```


## File format

By default the action wants a `CHANGELOG.md` file in the style of **keepachangelog** format:

```txt
# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

## [1.1.1] - 2023-03-05

### Added

- Keepachangelog feature(#3).

### Fixed

- Keepachangelog feature(#2).

### Changed

- Keepachangelog features

### Removed

- Unused keepachangelog features

## [1.1.0] - 2019-02-15

### Added

- Keepachangelog feature(#1).
```

Another option is the **auto-changelog** format. You can also use the format in the style of the auto-changelog tool by specifying `changelog_format: 'auto-changelog'`. Below is an example of the other format:



```txt
## Changelog

#### [Upcoming](https///github.com/kuvaus/changelog-releasenotes-action/compare/v1.0.1...HEAD)

- Upcoming commit

#### [v1.0.1](https://github.com/kuvaus/changelog-releasenotes-action/releases/tag/v1.0.1)

> 21 July 2023

- Add this feature
- Add that feature

#### [v1.0.0](https://github.com/kuvaus/changelog-releasenotes-action/releases/tag/v1.0.0)

> 20 July 2023

- Version 1.0.0 feature
```

Here is a simple example using the  **auto-changelog** format:

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
          changelog_format: 'auto-changelog'
        env:
          GITHUB_TOKEN: ${{ secrets.DEPLOY_KEY }}
```

Third option is a non standard format. If you want to use **your own formatting** for the `CHANGELOG.md`, just change the `start_token` and `end_token` from the options to your liking.


## License

This project is licensed under the MIT [License](https://github.com/kuvaus/changelog-releasenotes-action/blob/main/LICENSE)
