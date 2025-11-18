import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@solidjs/testing-library";
import { ConnectionStatus } from "../ConnectionStatus";
import { Services } from "~/services/Services";

// Mock the Services
vi.mock("~/services/Services", () => ({
  Services: {
    getInstance: vi.fn(() => ({
      getChatService: vi.fn(() => ({
        checkHealth: vi.fn(async () => true),
      })),
      getImageService: vi.fn(() => ({
        checkHealth: vi.fn(async () => true),
      })),
    })),
  },
}));

describe("ConnectionStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render collapsed view initially", async () => {
    render(() => <ConnectionStatus />);

    await waitFor(() => {
      expect(
        screen.getByText("All Systems Operational"),
      ).toBeInTheDocument();
    });
  });

  it("should show connection status indicators", async () => {
    render(() => <ConnectionStatus />);

    await waitFor(() => {
      const button = screen.getByTitle("Connection Status");
      expect(button).toBeInTheDocument();
    });
  });

  it("should expand when clicked", async () => {
    render(() => <ConnectionStatus />);

    await waitFor(() => {
      const button = screen.getByTitle("Connection Status");
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(screen.getByText("Chat (Ollama)")).toBeInTheDocument();
      expect(screen.getByText("Image (ComfyUI)")).toBeInTheDocument();
    });
  });

  it("should show service names in expanded view", async () => {
    render(() => <ConnectionStatus />);

    await waitFor(() => {
      const button = screen.getByTitle("Connection Status");
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(screen.getByText(/Chat \(Ollama\)/)).toBeInTheDocument();
      expect(screen.getByText(/Image \(ComfyUI\)/)).toBeInTheDocument();
    });
  });

  it("should collapse when close button is clicked", async () => {
    render(() => <ConnectionStatus />);

    // Expand first
    await waitFor(() => {
      const button = screen.getByTitle("Connection Status");
      fireEvent.click(button);
    });

    // Wait for expanded view
    await waitFor(() => {
      expect(screen.getByText("Connection Status")).toBeInTheDocument();
    });

    // Click collapse button
    const collapseButton = screen.getByTitle("Collapse");
    fireEvent.click(collapseButton);

    // Should return to collapsed view
    await waitFor(() => {
      expect(
        screen.getByText("All Systems Operational"),
      ).toBeInTheDocument();
    });
  });

  it("should show Refresh Status button in expanded view", async () => {
    render(() => <ConnectionStatus />);

    await waitFor(() => {
      const button = screen.getByTitle("Connection Status");
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(screen.getByText("Refresh Status")).toBeInTheDocument();
    });
  });

  it("should handle unhealthy services", async () => {
    // Mock unhealthy services
    const mockServices = {
      getChatService: vi.fn(() => ({
        checkHealth: vi.fn(async () => false),
      })),
      getImageService: vi.fn(() => ({
        checkHealth: vi.fn(async () => false),
      })),
    };

    vi.mocked(Services.getInstance).mockReturnValue(mockServices as any);

    render(() => <ConnectionStatus />);

    await waitFor(
      () => {
        expect(screen.getByText("Service Issues Detected")).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });
});
