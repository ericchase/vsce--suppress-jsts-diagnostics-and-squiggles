// const fs = require('node:fs');
// const { PLUGIN_KEY, LOG_PATH } = require('./constants');
// const starttime = performance.now();
// /**
//  * @param {string} message
//  */
// function log(message) {
//   fs.appendFileSync(LOG_PATH, `[${starttime}] [${performance.now()}] ${message}\n`, { encoding: 'utf8' });
// }

const { PLUGIN_KEY } = require('./constants');

/**
 *  @param {unknown} config
 *  @returns {number[]}
 */
function getCodes(config) {
  if (config && typeof config === 'object' && 'codes' in config && Array.isArray(config.codes)) {
    return config.codes;
  }
  return [];
}

/**
 *  @returns {any}
 */
function getSettings() {
  const config = process.env[PLUGIN_KEY];
  if (typeof config === 'string') {
    try {
      return JSON.parse(config);
    } catch {}
  }
  return {};
}

/** @type {import('typescript/lib/tsserverlibrary').server.PluginModuleFactory} */
module.exports = function () {
  return {
    create(createInfo) {
      try {
        /** @type {Set<number>} */
        const codes = new Set([...getCodes(getSettings()), ...getCodes(createInfo.config)]);
        // log(`${JSON.stringify([...codes])}\n`);

        /**
         *  Creates a basic wrapper over the languageService object so we can modify the
         *  diagnostics data before the language server consumes it.
         *
         *  @type {import('typescript/lib/tsserverlibrary').LanguageService}
         */
        const proxy = Object.create(createInfo.languageService);

        /**
         *  We're running an O(n^2) algorithm three times because it's probably faster
         *  than trying to figure out which code goes to which diagnostics array...
         *  Unless you're crazy and pack a few hundred codes into your config...
         */
        proxy.getSemanticDiagnostics = (fileName) => {
          return createInfo.languageService.getSemanticDiagnostics(fileName).filter((d) => !codes.has(d.code));
        };
        proxy.getSuggestionDiagnostics = (fileName) => {
          return createInfo.languageService.getSuggestionDiagnostics(fileName).filter((d) => !codes.has(d.code));
        };
        proxy.getSyntacticDiagnostics = (fileName) => {
          return createInfo.languageService.getSyntacticDiagnostics(fileName).filter((d) => !codes.has(d.code));
        };

        return proxy;
      } catch {
        return createInfo.languageService;
      }
    }
    /**
     *  Since we need the both settings and tsconfig.json before the languageService
     *  calls getSemanticDiagnostics and similar methods, this function is basically
     *  useless for us.
     */
    // onConfigurationChanged(config) {}
  };
};
