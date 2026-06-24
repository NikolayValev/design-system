import { parse } from '@babel/parser';
import {
  HOST_ELEMENTS,
  ALLOWED_HOST_ATTRS,
  DISALLOWED_IDENTIFIERS,
  FORBIDDEN_MEMBER_PROPS,
} from './constants';

export interface ValidationResult {
  ok: boolean;
  errors: string[];
}

type AnyNode = { type: string; [k: string]: any };

const SKIP_KEYS = new Set([
  'loc', 'start', 'end', 'range', 'extra', 'comments', 'tokens',
  'leadingComments', 'trailingComments', 'innerComments',
]);

/** Depth-first walk passing each node with its parent and the key it was reached by. */
function walk(
  node: any,
  parent: AnyNode | null,
  key: string,
  visit: (node: AnyNode, parent: AnyNode | null, key: string) => void,
): void {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    for (const child of node) walk(child, parent, key, visit);
    return;
  }
  if (typeof node.type === 'string') visit(node as AnyNode, parent, key);
  for (const k of Object.keys(node)) {
    if (SKIP_KEYS.has(k)) continue;
    walk(node[k], typeof node.type === 'string' ? (node as AnyNode) : parent, k, visit);
  }
}

/** Is this Identifier a variable reference (vs. a property/key name that is harmless)? */
function isReference(parent: AnyNode | null, key: string): boolean {
  if (!parent) return true;
  // obj.prop  /  obj?.prop  — `prop` (non-computed) is not a reference
  if (
    (parent.type === 'MemberExpression' || parent.type === 'OptionalMemberExpression') &&
    key === 'property' &&
    !parent.computed
  ) {
    return false;
  }
  // { key: ... } / class member key (non-computed) — `key` is not a reference
  if (
    (parent.type === 'ObjectProperty' || parent.type === 'ObjectMethod' || parent.type === 'ClassProperty' || parent.type === 'ClassMethod') &&
    key === 'key' &&
    !parent.computed
  ) {
    return false;
  }
  return true;
}

function jsxName(nameNode: any): string {
  if (!nameNode) return '';
  if (nameNode.type === 'JSXIdentifier') return nameNode.name;
  if (nameNode.type === 'JSXMemberExpression') return `${jsxName(nameNode.object)}.${jsxName(nameNode.property)}`;
  if (nameNode.type === 'JSXNamespacedName') return `${jsxName(nameNode.namespace)}:${jsxName(nameNode.name)}`;
  return '';
}

export function validateWidgetSource(source: string, allowedComponents: Set<string>): ValidationResult {
  let ast: unknown;
  try {
    ast = parse(source, {
      sourceType: 'script',
      allowReturnOutsideFunction: true,
      plugins: ['jsx'],
      errorRecovery: false,
    });
  } catch (e) {
    return { ok: false, errors: [`Syntax error: ${(e as Error).message}`] };
  }

  const errors: string[] = [];

  walk(ast, null, '', (node, parent, key) => {
    switch (node.type) {
      case 'ImportDeclaration':
      case 'ImportExpression':
      case 'ExportNamedDeclaration':
      case 'ExportDefaultDeclaration':
      case 'ExportAllDeclaration':
        errors.push('Imports and exports are not allowed.');
        break;
      case 'TaggedTemplateExpression':
        errors.push('Tagged template expressions are not allowed.');
        break;
      case 'Identifier':
        if (DISALLOWED_IDENTIFIERS.has(node.name) && isReference(parent, key)) {
          errors.push(`Use of "${node.name}" is not allowed.`);
        }
        break;
      case 'MemberExpression':
      case 'OptionalMemberExpression': {
        const prop = node.property;
        if (!node.computed && prop?.type === 'Identifier' && FORBIDDEN_MEMBER_PROPS.has(prop.name)) {
          errors.push(`Access to "${prop.name}" is not allowed.`);
        }
        if (node.computed && prop?.type === 'StringLiteral' && FORBIDDEN_MEMBER_PROPS.has(prop.value)) {
          errors.push(`Access to "${prop.value}" is not allowed.`);
        }
        break;
      }
      case 'JSXOpeningElement': {
        const name = jsxName(node.name);
        const isComponent = /^[A-Z]/.test(name);
        if (isComponent) {
          if (!allowedComponents.has(name)) {
            errors.push(`Component "${name}" is not in the allow-list.`);
          }
        } else if (!HOST_ELEMENTS.has(name)) {
          errors.push(`HTML element "<${name}>" is not allowed.`);
        } else {
          for (const attr of node.attributes ?? []) {
            if (attr.type === 'JSXSpreadAttribute') {
              errors.push(`Spread attributes on <${name}> are not allowed.`);
              continue;
            }
            const attrName = jsxName(attr.name);
            if (!ALLOWED_HOST_ATTRS.has(attrName)) {
              errors.push(`Attribute "${attrName}" on <${name}> is not allowed.`);
            }
          }
        }
        break;
      }
      case 'JSXAttribute':
        if (jsxName(node.name) === 'dangerouslySetInnerHTML') {
          errors.push('"dangerouslySetInnerHTML" is not allowed.');
        }
        break;
    }
  });

  const unique = [...new Set(errors)];
  return { ok: unique.length === 0, errors: unique };
}
