const vscode = require('vscode');

module.exports = {
  /**
   *  @param {vscode.ExtensionContext} context
   */
  activate(context) {
    // self-explanatory: adds a file watcher through vscode api
    const tsconfigWatcher = vscode.workspace.createFileSystemWatcher('**/tsconfig.json');

    /**
     *  @type {number | undefined}
     */
    let timeout = undefined;

    // triggers when any tsconfig.json in the project is updated
    tsconfigWatcher.onDidChange(() => {
      // the timer is used as a light debounce
      clearTimeout(timeout);
      timeout = setTimeout(async () => {
        // restarting the entire language server was the only thing that worked reliably
        await vscode.commands.executeCommand('typescript.restartTsServer');
      }, 50);
    });

    context.subscriptions.push(tsconfigWatcher);
  },
  deactivate() {}
};
