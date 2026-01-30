import process from "node:process";
import { EnvHttpProxyAgent, setGlobalDispatcher } from "undici";
import { createSubsystemLogger } from "../logging/subsystem.js";

const log = createSubsystemLogger("proxy");

let initialized = false;

/**
 * Configures a global proxy dispatcher for Node.js native fetch.
 * Uses EnvHttpProxyAgent which automatically handles HTTP_PROXY, HTTPS_PROXY,
 * and NO_PROXY environment variables correctly, avoiding issues with local
 * webhooks and internal LAN tool calls.
 *
 * Should be called early in the CLI/gateway startup.
 */
export function initGlobalProxy(): void {
  if (initialized) return;
  initialized = true;

  const proxyUrl =
    process.env.HTTPS_PROXY ||
    process.env.https_proxy ||
    process.env.HTTP_PROXY ||
    process.env.http_proxy;

  if (!proxyUrl) return;

  try {
    const agent = new EnvHttpProxyAgent();
    setGlobalDispatcher(agent);
    log.info(`global proxy configured via EnvHttpProxyAgent`);
  } catch (err) {
    log.warn(`failed to configure global proxy: ${err instanceof Error ? err.message : err}`);
  }
}
