import { Manifest } from "deno-slack-sdk/mod.ts";
import { SampleFunctionDefinition } from "./functions/http_function.ts";

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/automation/manifest
 */
export default Manifest({
  name: "External APIs",
  description: "Connect to external APIs from Slack",
  icon: "assets/icon.png",
  workflows: [],
  functions: [SampleFunctionDefinition],
  outgoingDomains: [
    "slack-http-workflow-step-request-proxy.hackclub.dev",
  ],
  datastores: [],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "datastore:read",
    "datastore:write",
  ],
});
