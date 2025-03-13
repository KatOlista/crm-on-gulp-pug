/** @type {import('stylelint').Config} */
export default {
  extends: ["stylelint-config-standard-scss"],
  "rules": {
    "scss/dollar-variable-pattern": null,
    "at-rule-empty-line-before": null,
    "media-feature-name-no-vendor-prefix": null,
    // "media-feature-range-notation": "context",
    "selector-class-pattern": "^\.[a-z0-9]+([-_]+[a-z0-9]+)*$",
    "custom-property-pattern": null,
    "custom-property-empty-line-before": null,
    "declaration-empty-line-before": null
  }
};
