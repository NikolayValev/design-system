import type { IncomingMessage, ServerResponse } from 'node:http';
import type { ArtifactKind, ArtifactSummary } from '../src/tools/designSystemTools.js';
import { getComponentList, getPageList, getSectionList } from '../src/tools/designSystemTools.js';
import { escapeHtml, renderSitePage, sendHtml, sendJson, wantsHtml } from './_lib/site.js';

type CatalogPayload = {
  generatedAt: string;
  components: ArtifactSummary[];
  sections: ArtifactSummary[];
  pages: ArtifactSummary[];
};

function renderArtifactPanel(kind: ArtifactKind, artifacts: ArtifactSummary[]): string {
  const localCount = artifacts.filter(entry => entry.origin === 'local').length;
  const remoteCount = artifacts.length - localCount;
  const preview = artifacts.slice(0, 15);
  const rows = preview
    .map(
      artifact =>
        `<li><code>${escapeHtml(artifact.name)}</code> <span style="color:#8da8d6">(${escapeHtml(artifact.origin)})</span></li>`,
    )
    .join('');
  const remainder = artifacts.length > preview.length ? artifacts.length - preview.length : 0;

  return `
    <article class="card">
      <h3 style="margin-top: 0; text-transform: capitalize;">${kind}s (${artifacts.length})</h3>
      <p>local: ${localCount} | remote: ${remoteCount}</p>
      <ol style="margin: 10px 0 0; padding-left: 20px; line-height: 1.6;">
        ${rows}
      </ol>
      ${remainder > 0 ? `<p style="margin-top: 12px; color: #9fb3d6;">...and ${remainder} more</p>` : ''}
    </article>
  `;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    const [components, sections, pages] = await Promise.all([getComponentList(), getSectionList(), getPageList()]);
    const payload: CatalogPayload = {
      generatedAt: new Date().toISOString(),
      components,
      sections,
      pages,
    };

    if (!wantsHtml(req)) {
      sendJson(res, payload);
      return;
    }

    const body = `
      <section class="panel">
        <span class="pill">Catalog</span>
        <h1 class="hero-title">Live Artifact Inventory</h1>
        <p class="hero-subtitle">
          Generated directly from the MCP source layer. This is the same data exposed to tools through
          <code>list_components</code>, <code>list_sections</code>, and <code>list_pages</code>.
        </p>
      </section>

      <section class="panel" style="margin-top: 16px;">
        <p class="hero-subtitle">Generated at: <code>${escapeHtml(payload.generatedAt)}</code></p>
        <div class="grid" style="margin-top: 14px;">
          ${renderArtifactPanel('component', components)}
          ${renderArtifactPanel('section', sections)}
          ${renderArtifactPanel('page', pages)}
        </div>
      </section>
    `;

    sendHtml(
      res,
      renderSitePage({
        title: 'Catalog - Design System Platform',
        description: 'Live component, section, and page inventory.',
        pathname: '/catalog',
        body,
      }),
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load catalog';
    sendJson(
      res,
      {
        error: 'catalog_unavailable',
        message,
      },
      500,
    );
  }
}
