module.exports = {
    'env': {
        'browser': true,
        'commonjs': true,
        'es2021': true,
    },
    'extends': 'eslint:recommended',
    'parserOptions': {
        'ecmaVersion': 12,
    },
    'rules': {
        'block-spacing': [
            'error',
            'always'
        ],
        'indent': [
            'error',
            4
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ],
        'spaced-comment': [ 'error', 'always', {
            'line': {
                'markers': [ '/' ],
                'exceptions': [ '-', '+' ]
            },
            'block': {
                'markers': [ '!' ],
                'exceptions': [ '*' ],
                'balanced': true
            }
        } ],
        'space-before-blocks': [
            'error',
            'always'
        ],
        'space-before-function-paren': [
            'error',
            'always'
        ],
        'space-in-parens': [
            'error', 'always'
        ],
        'eqeqeq': 'error',
        'no-trailing-spaces': 'error',
        'object-curly-spacing': [
            'error', 'always'
        ],
        'arrow-spacing': [
            'error', { 'before': true, 'after': true }
        ]
    },
};
