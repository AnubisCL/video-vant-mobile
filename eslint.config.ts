import antfu from '@antfu/eslint-config'

export default antfu({
  // enable UnoCSS support
  // https://unocss.dev/integrations/vscode
  unocss: true,

  formatters: {
    css: true,
  },

  ignores: [
    '.github/**',
    'scripts/**',
  ],

  // 添加 rules 部分来覆盖默认规则
  rules: {
    '@typescript-eslint/no-unsafe-function-type': 'off',
    'no-console': 'off',
    'regexp/no-unused-capturing-group': 'off',
  },
})
