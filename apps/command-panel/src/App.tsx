import * as React from 'react';
import { CommandPanel } from '@nikolayvalev/command-panel';
import { defaultComponentRegistry } from '@nikolayvalev/command-panel';

export function App(): JSX.Element {
  return (
    <main style={{ height: '100vh', padding: '1rem', boxSizing: 'border-box' }}>
      <CommandPanel
        registry={defaultComponentRegistry}
        apiEndpoint="/api/chat"
        dataEndpoint="/api/data"
      />
    </main>
  );
}
