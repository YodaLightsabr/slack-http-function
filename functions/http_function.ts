import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

/**
 * Functions are reusable building blocks of automation that accept
 * inputs, perform calculations, and provide outputs. Functions can
 * be used independently or as steps in workflows.
 * https://api.slack.com/automation/functions/custom
 */
export const SampleFunctionDefinition = DefineFunction({
  callback_id: "sample_function",
  title: "Sample function",
  description: "A sample function",
  source_file: "functions/http_function.ts",
  input_parameters: {
    properties: {
      method: {
        type: Schema.types.string,
        description: "HTTP method to use",
      },
      url: {
        type: Schema.types.string,
        description: "URL to fetch",
      },
      headers: {
        type: Schema.types.string,
        description: "JSON string of headers to send",
      },
      body: {
        type: Schema.types.string,
        description: "Body to send",
      },
    },
    required: ["method", "url"],
  },
  output_parameters: {
    properties: {
      response: {
        type: Schema.types.string,
        description: "Raw response recieved",
      },
    },
    required: ["response"],
  },
});

/**
 * SlackFunction takes in two arguments: the CustomFunction
 * definition (see above), as well as a function that contains
 * handler logic that's run when the function is executed.
 * https://api.slack.com/automation/functions/custom
 */
export default SlackFunction(
  SampleFunctionDefinition,
  async (
    { inputs }: {
      inputs: { method: string; url: string; headers?: string; body?: string };
    },
  ) => {
    const { method, url, headers, body } = inputs;

    let requestHeaders = {};
    try {
      requestHeaders = JSON.parse(headers || "{}");
    } catch (_err) {
      // Do nothing
    }

    const requestObject = {
      method,
      headers: requestHeaders,
      body,
    };

    let response;
    try {
      response = await fetch(url, requestObject).then((res) => res.text());
    } catch (err) {
      throw new Error(`Error fetching ${url}: ${err}`);
    }

    // Outputs are made available as variables for use in subsequent functions
    return { outputs: { response } };
  },
);
