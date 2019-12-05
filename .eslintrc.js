module.exports = {
  root: true,

  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },

  env: {
    browser: true,
    node: true,
    es6: true,
    jquery: true,
  },

  rules: {
    'no-undef': 'off',
    'no-console': "off",
    'no-unused-vars': 'off',
    'vue/no-unused-components': 'off',
    'vue/this-in-template': 'off',
    // 直接使用 prettier 不然會 loop 兩邊設定
    'prettier/prettier': [
      'error',
      {
        'singleQuote': true,
        'semi': false
      }
    ]
  },

  extends: [
    'eslint:recommended',
    'plugin:vue/recommended',
    // eslint-plugin-prettier 把 prettier cmd 加入到 eslint
    'plugin:prettier/recommended',
    // eslint-config-prettier 防止 eslint 與 prettier 相衝，需放最後
    'prettier/vue'
  ]
}
