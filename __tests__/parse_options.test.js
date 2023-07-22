const core = require('@actions/core');
const path = require('path');
const { parse_options } = require('../src/index.js');

jest.mock('@actions/core');

//This is for the old Node16 version
jest.mock('node-fetch', () => ({
  default: jest.fn(),
}));

describe('parse_options', () => {
  it('should correctly parse options', async () => {
    // Mock the inputs
    core.getInput.mockImplementation((input) => {
      switch (input) {
        case 'changelog':
          return 'CHANGELOG.md';
        case 'filtered_changelog':
          return 'FILTERED_CHANGELOG.md';
        case 'changelog_format':
          return 'keepachangelog';
        case 'start_token':
          return '## [';
        case 'end_token':
          return '## [';
        case 'specific_tag':
          return '';
        case 'upcoming_release':
          return 'false';
        case 'create_release':
          return 'true';
        case 'update_release':
          return 'true';
        case 'skip_n_lines':
          return '0';
        default:
          return '';
      }
    });

    const expectedOptions = {
      changelog: 'CHANGELOG.md',
      filtered_changelog: 'FILTERED_CHANGELOG.md',
      changelog_format: 'keepachangelog',
      start_token: '## [',
      end_token: '## [',
      specific_tag: '',
      upcoming_release: 'false',
      create_release: 'true',
      update_release: 'true',
      skip_n_lines: 0,
      changelog_path: path.join(process.env.GITHUB_WORKSPACE || "./", 'CHANGELOG.md'),
      filtered_changelog_path: path.join(process.env.GITHUB_WORKSPACE || "./", 'FILTERED_CHANGELOG.md')
    };

    const options = await parse_options();

    expect(options).toEqual(expectedOptions);
  });
});

