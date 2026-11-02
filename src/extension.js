const vscode = require('vscode');

const { CONFIG_KEY, PLUGIN_KEY } = require('./node_modules/hide-jsts-diagnostic-squiggles/constants.js');

// /**
//  *  @type {NodeJS.Timeout | undefined}
//  */
// let timeout = undefined;

/**
 *  Restarting the entire TS Language Server was the only method I could find that
 *  reliably refreshed VSCode's diagnostics cache.
 */
function restartTsServer() {
  // vscode.window.showInformationMessage(`[${performance.now()}]: restartTsServer()`);
  // clearTimeout(timeout);
  // timeout = setTimeout(async () => {
  process.env[PLUGIN_KEY] = JSON.stringify(vscode.workspace.getConfiguration().get(CONFIG_KEY));
  vscode.commands.executeCommand('typescript.restartTsServer');
  // }, 0);
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
