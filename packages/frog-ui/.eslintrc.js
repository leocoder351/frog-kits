module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    require.resolve('@umijs/fabric/dist/eslint'),
    'prettier/@typescript-eslint',
    'plugin:react/recommended'
  ],
  rules: {
    'react/prop-types': 'off',
    "no-unused-expressions": "off",
    "@typescript-eslint/no-unused-expressions": ["error", { "allowShortCircuit": true }]
  },
  ignorePatterns: ['.eslintrc.js', 'gulpfile.js', 'build', 'es', 'lib', 'dist'],
  settings: {
    react: {
      version: "detect"
    }
  }
}