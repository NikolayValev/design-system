module.exports = {
  rules: {
    'no-inline-styles': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Disallow inline styles in React components',
        },
        schema: [],
      },
      create(context) {
        return {
          JSXAttribute(node) {
            if (
              node.name &&
              node.name.name === 'style' &&
              node.value &&
              node.value.type === 'JSXExpressionContainer'
            ) {
              context.report({
                node,
                message: 'Inline styles are forbidden. Use the design system tokens or classes.'
              });
            }
          },
        };
      },
    },
    'no-local-component': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Disallow local component definitions that duplicate design system components',
        },
        schema: [],
      },
      create(context) {
        return {
          ImportDeclaration(node) {
            if (
              node.source.value.match(/^\.\/?components?\/?/) ||
              node.source.value.match(/^\.\/?ui\/?/)
            ) {
              context.report({
                node,
                message: 'Local component definitions are forbidden. Use @nikolayvalev/design-system.'
              });
            }
          },
        };
      },
    },
    'no-local-css': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Disallow local CSS/Sass file imports if design system provides styles',
        },
        schema: [],
      },
      create(context) {
        return {
          ImportDeclaration(node) {
            if (
              node.source.value.match(/\.(css|scss|sass)$/) &&
              !node.source.value.includes('@nikolayvalev/design-system')
            ) {
              context.report({
                node,
                message: 'Local CSS/Sass files are forbidden. Use the design system styles.'
              });
            }
          },
        };
      },
    },
  },
};
