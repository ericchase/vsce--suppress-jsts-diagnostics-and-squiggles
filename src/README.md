# TypeScript Diagnostics Filter

A lightweight VS Code extension and TypeScript Language Service Plugin that gives you absolute control over your editor's visual environment. By intercepting diagnostic arrays directly at the server layer, this tool removes unwanted error/warning/hint squiggly underlines and by consequence the the matching lightbulb quick-fixes from your workspace.

# Configuration

The TypeScript Language Service plugin reads your project's local **tsconfig.json** (or jsconfig.json) file.

Add any diagnostic codes directly to the `codes` array property within the plugin declaration block:

```json
// tsconfig.json
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "typescript-diagnostics-filter",
        "codes": [80002]
      }
    ]
  }
}
```

## Configuration Behavior

- Hot-Reloading: When you make changes to the `codes` array and save your **tsconfig.json** file, the extension force restarts the TS Server because I was unable to find a more efficient, reliable way to tell VS Code that the diagnostics cache needs to be refreshed. If anyone smarter out there finds a better way, please let me know!

- Project Isolation: work-in-progress.

## How It Works

This extension uses an inline language service proxy to intercept and modify these compiler validation pipelines:

1. `getSemanticDiagnostics`: Manages type safety boundaries and assignment checks.
2. `getSuggestionDiagnostics`: Manages text opacity changes and dead code fade states.
3. `getSyntacticDiagnostics`: Manages hard grammar parsing rules.

By filtering matching rule targets directly out of these data arrays, the editor UI layer remains entirely unaware that a violation ever took place.

# Was This Written By AI?

Most of this readme was, yes. I edited a few things here and there. As for the code... most of it was, too; until I stripped out everything that was unrelated to the goal and rewrote the parts that were sloppy. At this point, I basically know what every line does to some degree.

I have no idea what the performance metrics of this extension are, but I have to start somewhere. As always, I welcome any discourse in the GitHub repository's issues section.

# Uninstall

You may need to run the `Restart TS Server` or `Reload Window` command yourself to refresh the UI.
