// @refresh reload
import { mount, StartClient } from "@solidjs/start/client";

// biome-ignore lint/style/noNonNullAssertion: This is how solid-start works
mount(() => <StartClient />, document.getElementById("app")!);
