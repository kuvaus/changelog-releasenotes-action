const fs = require('fs');
const { write_filtered_changelog, read_filtered_changelog } = require('../src/index.js'); // replace with your source file path

jest.mock('fs', () => ({
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
  existsSync: jest.fn(),
  promises: {
    access: jest.fn(),
    // Add any other methods from fs.promises that you use
  },
}));

describe('write_filtered_changelog', () => {
  it('should write the release notes to the file correctly', async () => {
    const mockReleaseNotes = 'Mock release notes';
    const options = {
      filtered_changelog_path: 'filtered_changelog.md',
    };

    await write_filtered_changelog(mockReleaseNotes, options);

    expect(fs.writeFileSync).toHaveBeenCalledWith(options.filtered_changelog_path, mockReleaseNotes);
  });
});

describe('read_filtered_changelog', () => {
  it('should read the release notes from the file correctly', async () => {
    const mockReleaseNotes = 'Mock release notes';
    const options = {
      filtered_changelog_path: 'filtered_changelog.md',
    };

    fs.readFileSync.mockReturnValue(mockReleaseNotes);

    const releaseBody = await read_filtered_changelog(options);

    expect(releaseBody).toBe(mockReleaseNotes);
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

