// Registries
export {
  createComponentRegistry,
  extendRegistry,
  registryComponentNames,
  registryScope,
  type ComponentEntry,
  type ComponentRegistry,
} from './registry/component-registry';
export {
  createDataRegistry,
  getDataSource,
  createRegistryResolver,
  type DataSource,
  type DataRegistry,
  type DataResolver,
} from './registry/data-registry';
export { defaultComponentRegistry } from './registry/default-registry';

// Sandbox
export { validateWidgetSource, type ValidationResult } from './sandbox/validate';
export { WidgetRenderer, type WidgetRendererProps } from './sandbox/WidgetRenderer';
export { WidgetErrorBoundary } from './sandbox/ErrorBoundary';
export { DataResolverProvider, useMetric, type MetricState } from './sandbox/use-metric';

// Client-side data transport for useMetric (no AI SDK — safe in client bundles).
export { createHttpDataResolver } from './generation/http-resolver';

// Server-side data route handler (no AI SDK — safe to import anywhere).
export { createDataRouteHandler } from './generation/data-route';

// Panel UI (client-safe).
export { CommandPanel, type CommandPanelProps } from './ui/CommandPanel';
export { ChatPane, type ChatPaneProps } from './ui/ChatPane';
export { DashboardGrid, type DashboardGridProps } from './ui/DashboardGrid';
export { WidgetPreviewCard, type WidgetPreviewCardProps, type WidgetProposal } from './ui/WidgetPreviewCard';

// Pinned dashboard state.
export {
  PinnedStoreProvider,
  usePinnedStore,
  type PinnedStoreApi,
} from './state/use-pinned-store';
export {
  createPinnedStore,
  DEFAULT_STORAGE_KEY,
  type PinnedStore,
  type PinnedStoreOptions,
  type PinnedWidget,
  type StorageLike,
} from './state/pinned-store';
