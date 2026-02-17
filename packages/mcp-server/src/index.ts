import express from 'express';
import { getComponentList, searchComponents } from './tools/designSystemTools';
import { getContributionGuide } from './tools/contributionGuideTool';

const app = express();
const port = process.env.PORT || 4000;

// MCP tool: List/search design system components
app.get('/mcp/tools/components', async (req, res) => {
  const q = req.query.q as string | undefined;
  if (q) {
    res.json(await searchComponents(q));
  } else {
    res.json(await getComponentList());
  }
});

// MCP tool: Contribution Guide
app.get('/mcp/tools/contribution-guide', (req, res) => {
  res.json(getContributionGuide());
});

app.get('/', (req, res) => {
  res.send('MCP Server for Design System Governance');
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`MCP server listening on http://localhost:${port}`);
});
