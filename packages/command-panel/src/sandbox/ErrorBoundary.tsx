import * as React from 'react';

interface Props {
  fallback: (message: string) => React.ReactNode;
  children: React.ReactNode;
  /** Changing this key resets the boundary (e.g. when the widget source changes). */
  resetKey?: string;
}
interface State {
  message: string | null;
}

export class WidgetErrorBoundary extends React.Component<Props, State> {
  state: State = { message: null };

  static getDerivedStateFromError(error: unknown): State {
    return { message: error instanceof Error ? error.message : String(error) };
  }

  componentDidUpdate(prev: Props): void {
    if (prev.resetKey !== this.props.resetKey && this.state.message !== null) {
      this.setState({ message: null });
    }
  }

  render(): React.ReactNode {
    if (this.state.message !== null) return this.props.fallback(this.state.message);
    return this.props.children;
  }
}
