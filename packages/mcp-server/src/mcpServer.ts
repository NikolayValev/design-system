import * as z from 'zod/v4';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  getArtifactInstallBundle,
  getArtifactList,
  getArtifactSource,
  searchArtifacts,
  getComponentList,
  getComponentInstallBundle,
  getComponentSource,
  getPageInstallBundle,
  getPageList,
  getPageSource,
  getSectionInstallBundle,
  getSectionList,
  getSectionSource,
  type ArtifactKind,
  type ArtifactSummary,
  searchComponents,
  type ComponentSummary,
} from './tools/designSystemTools.js';
import { getContributionGuide, getContributionGuideMarkdown } from './tools/contributionGuideTool.js';

export const SERVER_NAME = 'design-system-service';
export const SERVER_VERSION = '0.4.0';

const formatComponentResult = (components: ComponentSummary[]) => ({
  count: components.length,
  components,
});

const formatArtifactResult = (kind: ArtifactKind, artifacts: ArtifactSummary[]) => ({
  kind,
  count: artifacts.length,
  artifacts,
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
    'list_artifacts',
    {
      title: 'List Artifacts',
      description: 'List design-system artifacts by kind (component, section, page), optionally by query.',
      inputSchema: {
        kind: z.enum(['component', 'section', 'page']).describe('Artifact kind to list.'),
        query: z.string().optional().describe('Optional search query (name or JSDoc text).'),
      },
    },
    async ({ kind, query }) => {
      const artifacts = query ? await searchArtifacts(kind, query) : await getArtifactList(kind);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(formatArtifactResult(kind, artifacts), null, 2),
          },
        ],
        structuredContent: formatArtifactResult(kind, artifacts),
      };
    },
  );

  server.registerTool(
    'get_artifact_source',
    {
      title: 'Get Artifact Source',
      description: 'Read source for a component, section, or page template.',
      inputSchema: {
        kind: z.enum(['component', 'section', 'page']).describe('Artifact kind.'),
        name: z.string().min(1).describe('Artifact file base name.'),
      },
    },
    async ({ kind, name }) => {
      const artifact = await getArtifactSource(kind, name);
      if (!artifact) {
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: `${kind} "${name}" was not found.`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: artifact.source,
          },
        ],
        structuredContent: artifact,
      };
    },
  );

  server.registerTool(
    'get_artifact_bundle',
    {
      title: 'Get Artifact Bundle',
      description: 'Return an install bundle for components, sections, or pages (with transitive source files).',
      inputSchema: {
        kind: z.enum(['component', 'section', 'page']).describe('Artifact kind.'),
        names: z.array(z.string().min(1)).min(1).max(25).describe('Artifact names to bundle.'),
      },
    },
    async ({ kind, names }) => {
      const bundle = await getArtifactInstallBundle(kind, names);
      if (bundle.resolved.length === 0) {
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: `No ${kind}s were resolved. Missing: ${bundle.missing.join(', ') || 'unknown'}.`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(bundle, null, 2),
          },
        ],
        structuredContent: bundle,
      };
    },
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
    'list_sections',
    {
      title: 'List Sections',
      description: 'List all design-system sections or search by query.',
      inputSchema: {
        query: z.string().optional().describe('Optional search query (name or JSDoc text).'),
      },
    },
    async ({ query }) => {
      const sections = query ? await searchArtifacts('section', query) : await getSectionList();
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(formatArtifactResult('section', sections), null, 2),
          },
        ],
        structuredContent: formatArtifactResult('section', sections),
      };
    },
  );

  server.registerTool(
    'list_pages',
    {
      title: 'List Pages',
      description: 'List all design-system pages or search by query.',
      inputSchema: {
        query: z.string().optional().describe('Optional search query (name or JSDoc text).'),
      },
    },
    async ({ query }) => {
      const pages = query ? await searchArtifacts('page', query) : await getPageList();
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(formatArtifactResult('page', pages), null, 2),
          },
        ],
        structuredContent: formatArtifactResult('page', pages),
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
    'get_section_source',
    {
      title: 'Get Section Source',
      description: 'Read section source from packages/design-system/src/sections.',
      inputSchema: {
        name: z.string().min(1).describe('Section file base name (for example: "HeroSection").'),
      },
    },
    async ({ name }) => {
      const section = await getSectionSource(name);
      if (!section) {
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: `Section "${name}" was not found.`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: section.source,
          },
        ],
        structuredContent: section,
      };
    },
  );

  server.registerTool(
    'get_page_source',
    {
      title: 'Get Page Source',
      description: 'Read page source from packages/design-system/src/pages.',
      inputSchema: {
        name: z.string().min(1).describe('Page file base name (for example: "MarketingLandingPage").'),
      },
    },
    async ({ name }) => {
      const page = await getPageSource(name);
      if (!page) {
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: `Page "${name}" was not found.`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: page.source,
          },
        ],
        structuredContent: page,
      };
    },
  );

  server.registerTool(
    'get_component_bundle',
    {
      title: 'Get Component Bundle',
      description:
        'Return a shadcn-style install bundle: requested components plus transitive local source files and external dependencies.',
      inputSchema: {
        names: z
          .array(z.string().min(1))
          .min(1)
          .max(25)
          .describe('Component names (for example: [\"Button\", \"Card\"]).'),
      },
    },
    async ({ names }) => {
      const bundle = await getComponentInstallBundle(names);
      if (bundle.resolved.length === 0) {
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: `No components were resolved. Missing: ${bundle.missing.join(', ') || 'unknown'}.`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(bundle, null, 2),
          },
        ],
        structuredContent: bundle,
      };
    },
  );

  server.registerTool(
    'get_section_bundle',
    {
      title: 'Get Section Bundle',
      description: 'Return an install bundle for section templates plus transitive source files and dependencies.',
      inputSchema: {
        names: z.array(z.string().min(1)).min(1).max(25).describe('Section names.'),
      },
    },
    async ({ names }) => {
      const bundle = await getSectionInstallBundle(names);
      if (bundle.resolved.length === 0) {
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: `No sections were resolved. Missing: ${bundle.missing.join(', ') || 'unknown'}.`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(bundle, null, 2),
          },
        ],
        structuredContent: bundle,
      };
    },
  );

  server.registerTool(
    'get_page_bundle',
    {
      title: 'Get Page Bundle',
      description: 'Return an install bundle for page templates plus transitive source files and dependencies.',
      inputSchema: {
        names: z.array(z.string().min(1)).min(1).max(25).describe('Page names.'),
      },
    },
    async ({ names }) => {
      const bundle = await getPageInstallBundle(names);
      if (bundle.resolved.length === 0) {
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: `No pages were resolved. Missing: ${bundle.missing.join(', ') || 'unknown'}.`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(bundle, null, 2),
          },
        ],
        structuredContent: bundle,
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
    'section_index',
    'design-system://sections',
    {
      title: 'Section Index',
      description: 'List of all design-system sections and extracted docs.',
      mimeType: 'application/json',
    },
    async () => {
      const sections = await getSectionList();
      return {
        contents: [
          {
            uri: 'design-system://sections',
            mimeType: 'application/json',
            text: JSON.stringify(formatArtifactResult('section', sections), null, 2),
          },
        ],
      };
    },
  );

  server.registerResource(
    'page_index',
    'design-system://pages',
    {
      title: 'Page Index',
      description: 'List of all design-system pages and extracted docs.',
      mimeType: 'application/json',
    },
    async () => {
      const pages = await getPageList();
      return {
        contents: [
          {
            uri: 'design-system://pages',
            mimeType: 'application/json',
            text: JSON.stringify(formatArtifactResult('page', pages), null, 2),
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
