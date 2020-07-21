import * as React from "react";

import {StoryError} from "./StoryError";

export type StoryErrorBoundaryProps = {
  onRetry?: () => void;
};

export type StoryErrorBoundaryState = {
  error?: Error;
};

export class StoryErrorBoundary extends React.Component<StoryErrorBoundaryProps, StoryErrorBoundaryState> {
  state: StoryErrorBoundaryState = {};

  static getDerivedStateFromError(error: Error): Partial<StoryErrorBoundaryState> {
    return {error};
  }

  render() {
    const {children, onRetry} = this.props;
    const {error} = this.state;

    return error ? <StoryError title="There was unexpected error" error={error} onRetry={onRetry || (() => this.setState({error: undefined}))} /> : children;
  }
}
