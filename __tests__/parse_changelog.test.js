const fs = require('fs');
const { parse_changelog } = require('../src/index.js'); // replace with your source file path

//This is for the old Node16 version
jest.mock('node-fetch', () => ({
  default: jest.fn(),
}));

//jest.mock('fs');

jest.mock('fs', () => ({
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
  existsSync: jest.fn(),
  promises: {
    access: jest.fn(),
    // Add any other methods from fs.promises that you use
  },
}));

describe('parse_changelog', () => {
  it('should parse the changelog correctly', async () => {
    const mockChangelog = `
## [Unreleased]
- Added new feature
- Fixed bug
## [0.1.0]
- Initial release
`;
//jest.spyOn(fs, 'readFileSync').mockReturnValue(mockChangelog);

      fs.readFileSync.mockReturnValue(mockChangelog);

    const options = {
      upcoming_release: 'true',
      start_token: '## [Unreleased]',
      end_token: '## [0.1.0]',
      skip_n_lines: 0,
      changelog_path: 'CHANGELOG.md',
      changelog_format: 'keepachangelog',
    };

    const expectedReleaseNotes = `
- Added new feature
- Fixed bug
`;

    const releaseNotes = await parse_changelog(options);
    console.log(releaseNotes);
    expect(releaseNotes).toEqual(expectedReleaseNotes.trim());
  });
});

