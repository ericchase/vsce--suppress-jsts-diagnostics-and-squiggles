const vscode = require('vscode');

const { CONFIG_KEY, PLUGIN_KEY } = require('./node_modules/suppress-jsts-diagnostics-and-squiggles/constants.js');

/**
 *  Restarting the entire TS Language Server was the only method I could find that
 *  reliably refreshed VSCode's diagnostics cache.
 */
function restartTsServer() {
  process.env[PLUGIN_KEY] = JSON.stringify(vscode.workspace.getConfiguration().get(CONFIG_KEY));
  vscode.commands.executeCommand('typescript.restartTsServer');
}

module.exports = {
  /**
   *  @param {vscode.ExtensionContext} context
   */
  async activate(context) {
    const tsconfigWatcher = vscode.workspace.createFileSystemWatcher('**/tsconfig.json');
    tsconfigWatcher.onDidChange(() => {
      restartTsServer();
    });
    context.subscriptions.push(tsconfigWatcher);

    context.subscriptions.push(
      vscode.workspace.onDidChangeConfiguration((event) => {
        if (event.affectsConfiguration(CONFIG_KEY)) {
          restartTsServer();
        }
      })
    );

    restartTsServer();
  },
  deactivate() {
    restartTsServer();
  }
};
