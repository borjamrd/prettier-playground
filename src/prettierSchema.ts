// Prettier configuration schema with descriptions and possible values
export const prettierSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "Prettier Configuration",
  description: "Configuration options for Prettier",
  type: "object",
  properties: {
    printWidth: {
      type: "integer",
      description: "Specify the line length that the printer will wrap on",
      default: 80,
      minimum: 0
    },
    tabWidth: {
      type: "integer",
      description: "Specify the number of spaces per indentation-level",
      default: 2,
      minimum: 0
    },
    useTabs: {
      type: "boolean",
      description: "Indent lines with tabs instead of spaces",
      default: false
    },
    semi: {
      type: "boolean",
      description: "Print semicolons at the ends of statements",
      default: true
    },
    singleQuote: {
      type: "boolean",
      description: "Use single quotes instead of double quotes",
      default: false
    },
    quoteProps: {
      type: "string",
      description: "Change when properties in objects are quoted",
      enum: ["as-needed", "consistent", "preserve"],
      default: "as-needed"
    },
    jsxSingleQuote: {
      type: "boolean",
      description: "Use single quotes instead of double quotes in JSX",
      default: false
    },
    trailingComma: {
      type: "string",
      description: "Print trailing commas wherever possible in multi-line comma-separated syntactic structures",
      enum: ["none", "es5", "all"],
      default: "es5"
    },
    bracketSpacing: {
      type: "boolean",
      description: "Print spaces between brackets in object literals",
      default: true
    },
    bracketSameLine: {
      type: "boolean",
      description: "Put the > of a multi-line HTML element at the end of the last line instead of being alone on the next line",
      default: false
    },
    arrowParens: {
      type: "string",
      description: "Include parentheses around a sole arrow function parameter",
      enum: ["always", "avoid"],
      default: "always"
    },
    proseWrap: {
      type: "string",
      description: "How to wrap prose",
      enum: ["always", "never", "preserve"],
      default: "preserve"
    },
    htmlWhitespaceSensitivity: {
      type: "string",
      description: "How to handle whitespaces in HTML",
      enum: ["css", "strict", "ignore"],
      default: "css"
    },
    endOfLine: {
      type: "string",
      description: "Which end of line characters to apply",
      enum: ["lf", "crlf", "cr", "auto"],
      default: "lf"
    },
    embeddedLanguageFormatting: {
      type: "string",
      description: "Control how Prettier formats quoted code embedded in the file",
      enum: ["auto", "off"],
      default: "auto"
    }
  }
};