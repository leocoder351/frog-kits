module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
  rules: {
    'no-unused-expressions': ['error', { 'allowShortCircuit': true }]
  }
};