import React, { useState, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { format } from 'prettier';
import * as prettier from 'prettier/standalone';
import babelParser from 'prettier/plugins/babel';
import typescriptParser from 'prettier/plugins/typescript';
import estreeParser from 'prettier/plugins/estree';
import { RotateCcw, Play } from 'lucide-react';
import { ErrorBoundary } from 'react-error-boundary';
import { prettierSchema } from './prettierSchema';
import type * as Monaco from 'monaco-editor';

const DEFAULT_CONFIG = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: "es5",
  bracketSpacing: true,
  arrowParens: "avoid"
};

const DEFAULT_CODE = `// Example TypeScript code
interface User {
    id: number;
    name: string;
    email: string;
    isActive: boolean;
}

const formatUser = (user: User): string => {
    return JSON.stringify(user, null, 2);
};

const users: User[] = [
    { id: 1, name: "John Doe", email: "john@example.com", isActive: true },
    { id: 2, name: "Jane Smith", email: "jane@example.com", isActive: false }
];

const activeUsers = users.filter(user => user.isActive).map(({name, email}) => ({name, email}));

console.log(formatUser(users[0]));`;

function ConfigErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
      <h3 className="text-red-800 font-semibold mb-2">Configuration Error</h3>
      <p className="text-red-600 text-sm mb-4">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
      >
        Reset Configuration
      </button>
    </div>
  );
}

function App() {
  const [config, setConfig] = useState(JSON.stringify(DEFAULT_CONFIG, null, 2));
  const [code, setCode] = useState(DEFAULT_CODE);
  const [error, setError] = useState<string | null>(null);
  const [monacoInstance, setMonacoInstance] = useState<typeof Monaco | null>(null);

  const handleEditorDidMount = useCallback((editor: any, monaco: typeof Monaco) => {
    setMonacoInstance(monaco);
    
    // Register the JSON schema for Prettier configuration
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      schemas: [{
        uri: "http://myserver/prettier-schema.json",
        fileMatch: ["*"],
        schema: prettierSchema
      }],
      enableSchemaRequest: false
    });
  }, []);

  const formatCode = useCallback(async (codeToFormat: string, configStr: string) => {
    try {
      const parsedConfig = JSON.parse(configStr);
      const formatted = await format(codeToFormat, {
        ...parsedConfig,
        parser: "typescript",
        plugins: [babelParser, typescriptParser, estreeParser],
      });
      setCode(formatted);
      setError(null);
      return formatted;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return codeToFormat;
    }
  }, []);

  const handleConfigChange = useCallback((value: string | undefined) => {
    if (!value) return;
    setConfig(value);
    try {
      // Try parsing the config to validate it
      JSON.parse(value);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON configuration');
    }
  }, []);

  const handleCodeChange = useCallback((value: string | undefined) => {
    if (!value) return;
    setCode(value);
  }, []);

  const applyConfig = useCallback(async () => {
    try {
      await formatCode(code, config);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to apply configuration');
    }
  }, [code, config, formatCode]);

  const resetToDefault = useCallback(() => {
    const defaultConfigStr = JSON.stringify(DEFAULT_CONFIG, null, 2);
    setConfig(defaultConfigStr);
    setCode(DEFAULT_CODE);
    formatCode(DEFAULT_CODE, defaultConfigStr);
    setError(null);
  }, [formatCode]);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Prettier Playground</h1>
          <button
            onClick={resetToDefault}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Default
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gray-800 px-4 py-2 flex justify-between items-center">
              <h2 className="text-white text-sm font-medium">.prettierrc</h2>
              <button
                onClick={applyConfig}
                disabled={!!error}
                className="flex items-center gap-2 px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="w-3 h-3" />
                Apply Changes
              </button>
            </div>
            <ErrorBoundary
              FallbackComponent={ConfigErrorFallback}
              onReset={resetToDefault}
            >
              <div className="h-[600px]">
                <Editor
                  height="100%"
                  defaultLanguage="json"
                  value={config}
                  onChange={handleConfigChange}
                  onMount={handleEditorDidMount}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    wordWrap: 'on',
                    wrappingIndent: 'indent',
                    formatOnType: true,
                    formatOnPaste: true,
                    quickSuggestions: true,
                    suggestOnTriggerCharacters: true,
                  }}
                />
              </div>
            </ErrorBoundary>
            {error && (
              <div className="p-4 bg-red-50 border-t border-red-200">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gray-800 px-4 py-2 flex justify-between items-center">
              <h2 className="text-white text-sm font-medium">TypeScript Preview</h2>
              <div className="text-gray-400 text-xs">Format with Prettier config</div>
            </div>
            <div className="h-[600px]">
              <Editor
                height="100%"
                defaultLanguage="typescript"
                value={code}
                onChange={handleCodeChange}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  wrappingIndent: 'indent',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;