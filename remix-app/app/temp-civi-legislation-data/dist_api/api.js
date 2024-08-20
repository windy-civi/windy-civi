"use strict";
exports.__esModule = true;
exports.civiLegislationApi = void 0;
var types_1 = require("./types");
exports.civiLegislationApi = {
  getLegislationDataUrl: function (locale) {
    return "https://github.com/sartaj/windy-civi/releases/download/nightly/".concat(
      locale,
      ".legislation.json"
    );
  },
  getGptLegislationUrl: function (locale) {
    return "https://github.com/sartaj/windy-civi/releases/download/nightly/".concat(
      locale,
      ".legislation.gpt.json"
    );
  },
  locales: types_1.locales,
};
//# sourceMappingURL=api.js.map
