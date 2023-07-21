
- Add this [changelog](https://github.com/kuvaus/LlamaGPTJ-chat/blob/main/CHANGELOG.md) :)
- Add sha256 hashes on release so you can verify the binaries
- All binaries are automatically generated with Github actions
- Add signal handling for SIGHUP (macOS, Linux) and CTRL_CLOSE_EVENT (Windows) to fix issue [`#16`](https://github.com/kuvaus/LlamaGPTJ-chat/issues/16)
- This allows you to run chat as a subprocess. The chat subprocess now quits properly if parent app is closed.
- Version information
- Fix segfault on`/help`
