import type { Component, ParentProps } from "solid-js";
import Nav from "../Nav";
import { ErrorBoundary } from "../ErrorBoundary";
import { ConnectionStatus } from "../status/ConnectionStatus";

interface MainLayoutProps extends ParentProps {
  // Add any additional props here
  className?: string;
}

export const MainLayout: Component<MainLayoutProps> = (props) => {
  return (
    <ErrorBoundary>
      <div class={`min-h-screen bg-slate-900 ${props.className ?? ""}`}>
        <Nav />
        <main class="mx-auto">{props.children}</main>
        <ConnectionStatus />
      </div>
    </ErrorBoundary>
  );
};
