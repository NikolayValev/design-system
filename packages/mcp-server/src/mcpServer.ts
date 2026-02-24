import * as z from 'zod/v4';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  getComponentList,
  getComponentSource,
  searchComponents,
  type ComponentSummary,
} from './tools/designSystemTools.js';
import { getContributionGuide, getContributionGuideMarkdown } from './tools/contributionGuideTool.js';

export const SERVER_NAME = 'design-system-service';
export const SERVER_VERSION = '0.2.0';

const formatComponentResult = (components: ComponentSummary[]) => ({
  count: components.length,
  components,
});

export function createMcpServer() {
  const server = new McpServer(
    {
      name: SERVER_NAME,
      version: SERVER_VERSION,
    },
    { capabilities: { tools: {}, resources: {} } },
  );

  server.registerTool(
    'list_components',
    {
      title: 'List Components',
      description: 'List all design-system components or search by query.',
      inputSchema: {
        query: z.string().optional().describe('Optional search query (name or JSDoc text).'),
      },
    },
    async ({ query }) => {
      const components = query ? await searchComponents(query) : await getComponentList();
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(formatComponentResult(components), null, 2),
          },
        ],
        structuredContent: formatComponentResult(components),
      };
    },
  );

  server.registerTool(
    'get_component_source',
    {
      title: 'Get Component Source',
      description: 'Read component source from packages/design-system/src/components.',
      inputSchema: {
        name: z.string().min(1).describe('Component file base name (for example: "Button").'),
      },
    },
    async ({ name }) => {
      const component = await getComponentSource(name);
      if (!component) {
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: `Component "${name}" was not found.`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: component.source,
          },
        ],
        structuredContent: component,
      };
    },
  );

  server.registerTool(
    'get_contribution_guide',
    {
      title: 'Get Contribution Guide',
      description: 'Read the design-system contribution guide markdown.',
      inputSchema: {},
    },
    async () => {
      const metadata = getContributionGuide();
      const markdown = await getContributionGuideMarkdown();
      return {
        content: [
          {
            type: 'text',
            text: markdown,
          },
        ],
        structuredContent: metadata,
      };
    },
  );

  server.registerResource(
    'component_index',
    'design-system://components',
    {
      title: 'Component Index',
      description: 'List of all design-system components and extracted docs.',
      mimeType: 'application/json',
    },
    async () => {
      const components = await getComponentList();
      return {
        contents: [
          {
            uri: 'design-system://components',
            mimeType: 'application/json',
            text: JSON.stringify(formatComponentResult(components), null, 2),
          },
        ],
      };
    },
  );

  server.registerResource(
    'contribution_guide',
    'design-system://contribution-guide',
    {
      title: 'Contribution Guide',
      description: 'Design-system contribution guide markdown.',
      mimeType: 'text/markdown',
    },
    async () => {
      const markdown = await getContributionGuideMarkdown();
      return {
        contents: [
          {
            uri: 'design-system://contribution-guide',
            mimeType: 'text/markdown',
            text: markdown,
          },
        ],
      };
    },
  );

  return server;
}
