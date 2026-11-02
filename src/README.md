# Suppress User-Defined JS/TS Diagnostic Squiggles

An extension and TypeScript Language Service plugin that give you control over VSCode's diagnostics output. By intercepting diagnostic arrays directly at the server layer, this tool removes unwanted error, warning, info, and hint underlining, the matching lightbulb quick-fixes, and matching output in the `Problems` view.

# Configuration

The extension and plugin read from both your **settings.json** _and_ **tsconfig.json** (or jsconfig.json) files. They are actively merged.

Add any diagnostic codes directly to the `codes` array in either location:

```json
// settings.json
{
  "suppress-jsts-diagnostics-and-squiggles.codes": [80001, 80002]
}
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "suppress-jsts-diagnostics-and-squiggles",
        "codes": [80001, 80002]
      }
    ]
  }
}
```

## Configuration Behavior

- Hot-Reloading: When you make changes to the `codes` array and save your **tsconfig.json** file, the extension force restarts the TS Server because I was unable to find a more efficient, reliable way to tell VSCode that the diagnostics cache needs to be refreshed. If anyone smarter out there finds a better way, please let me know!

- Project Isolation: Not yet tested.

## How It Works

This extension uses an inline language service proxy to intercept and modify these compiler validation pipelines:

1. `getSemanticDiagnostics`: Manages type safety boundaries and assignment checks.
2. `getSuggestionDiagnostics`: Manages text opacity changes and dead code fade states.
3. `getSyntacticDiagnostics`: Manages hard grammar parsing rules.

By filtering matching rule targets directly out of these data arrays, the editor UI layer remains entirely unaware that a violation ever took place.

# Was This Written By AI?

This readme was a combined effort by myself _and_ AI. As for the code... AI came up with the initial implementation, but I rewrote almost all of it as I learned what each line was doing and was _supposed_ to be doing. At this point, I basically know what every line does, as the AI wrongly explained each of them to me.

I have no idea what the performance metrics of this extension are, but I think this is a good start. I welcome any discourse in the GitHub repository's issues section.

# Uninstall

You may need to run the `Restart TS Server` or `Reload Window` command yourself to refresh the UI.
