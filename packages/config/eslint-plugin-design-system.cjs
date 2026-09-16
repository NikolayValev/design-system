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
                message: 'Inline styles are forbidden. Use the design system tokens or classes.',
              });
            }
          },
        };
      },
    },
    /*
     * Raw design values are values the token layer already has a name for. The
     * repo documented this rule long before it enforced it: ARCHITECTURE.md
     * lists "hardcoding colors in app code" and "creating parallel token
     * systems" as anti-patterns, and DESIGN_SYSTEM.md claimed CI would block
     * them. Nothing did.
     *
     * The `[prop:var(--vde-*)]` bridge syntax is the library's legitimate idiom
     * and must not be flagged — a naive "no arbitrary Tailwind values" rule
     * would light up almost every component in the package.
     */
    'no-raw-design-values': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Disallow raw colours and off-scale sizes where a design token exists',
        },
        schema: [],
      },
      create(context) {
        // Tailwind arbitrary values use `_` for spaces, and `_` is a word
        // character — so a \b boundary before `rgba` never matches inside
        // `[box-shadow:0_0_12px_rgba(...)]`. Match on the function call itself.
        const CHECKS = [
          {
            pattern: /#[0-9a-fA-F]{3,8}(?![0-9a-fA-F])|rgba?\(\s*\d|hsla?\(\s*[\d.]+[\s,]/,
            message:
              'Raw colour value. Use a --vde-color-* token so the value follows the active vision and both modes.',
          },
          {
            pattern: /(?:text|rounded|leading|tracking)-\[[^\]]*(?:\d|px|rem|em)[^\]]*\]/,
            message:
              'Off-scale size. Use --vde-font-size-*, --vde-radius-*, --vde-line-height-* or --vde-letter-spacing-*.',
          },
          {
            pattern: /(?:^|[\s"'`])text-(?:xs|2xs)(?:[\s"'`]|$)/,
            message:
              'text-xs is 12px, below the 14px interactive floor. Use --vde-font-size-ui, or --vde-font-size-caption for non-interactive metadata.',
          },
        ];

        function check(node, value) {
          if (typeof value !== 'string' || value.length === 0) return;
          // Anything routed through a design token is fine by definition.
          const withoutTokens = value.replace(/var\(--vde-[^)]*\)/g, '');
          // Report every distinct problem in the string, not just the first.
          for (const { pattern, message } of CHECKS) {
            if (pattern.test(withoutTokens)) {
              context.report({ node, message });
            }
          }
        }

        return {
          Literal(node) {
            check(node, node.value);
          },
          TemplateElement(node) {
            check(node, node.value && node.value.cooked);
          },
        };
      },
    },

    'no-local-component': {
      meta: {
        type: 'problem',
        docs: {
          description:
            'Disallow local component definitions that duplicate design system components',
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
                message:
                  'Local component definitions are forbidden. Use @nikolayvalev/design-system.',
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
                message: 'Local CSS/Sass files are forbidden. Use the design system styles.',
              });
            }
          },
        };
      },
    },
  },
};
