export interface DataSource {
  /** Stable id the LLM references, e.g. "components.count". */
  id: string;
  /** Shown to the LLM in the system prompt (Phase 2b). */
  description: string;
  /** Optional shape documentation for the LLM. */
  resultSchema?: Record<string, unknown>;
  load(params?: Record<string, unknown>): Promise<unknown>;
}

export interface DataRegistry {
  sources: DataSource[];
}

/** The only data channel exposed to generated widgets (via useMetric). */
export type DataResolver = (id: string, params?: Record<string, unknown>) => Promise<unknown>;

export function createDataRegistry(sources: DataSource[]): DataRegistry {
  return { sources: [...sources] };
}

export function getDataSource(reg: DataRegistry, id: string): DataSource | undefined {
  return reg.sources.find((s) => s.id === id);
}

/** Build a resolver that loads registered sources by id and rejects anything unknown. */
export function createRegistryResolver(reg: DataRegistry): DataResolver {
  return async (id, params) => {
    const source = getDataSource(reg, id);
    if (!source) throw new Error(`Unknown data source: ${id}`);
    return source.load(params);
  };
}
