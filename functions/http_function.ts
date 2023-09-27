import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

/**
 * Functions are reusable building blocks of automation that accept
 * inputs, perform calculations, and provide outputs. Functions can
 * be used independently or as steps in workflows.
 * https://api.slack.com/automation/functions/custom
 */
export const SampleFunctionDefinition = DefineFunction({
  callback_id: "sample_function",
  title: "Make an HTTP request",
  description: "Interact with an external API over HTTP",
  source_file: "functions/http_function.ts",
  input_parameters: {
    properties: {
      http_method: {
        type: Schema.types.string,
        description: "HTTP method to use",
      },
      request_url: {
        type: Schema.types.string,
        description: "URL to fetch",
      },
      http_headers: {
        type: Schema.types.string,
        description: "Headers to include in JSON format",
      },
      request_body: {
        type: Schema.types.string,
        description: "Body to include with request",
      },
      transformation_a: {
        type: Schema.types.string,
        description: "Anonymous JS function to transform the response",
      },
      transformation_b: {
        type: Schema.types.string,
        description: "Anonymous JS function to transform the response",
      },
      transformation_c: {
        type: Schema.types.string,
        description: "Anonymous JS function to transform the response",
      },
      transformation_d: {
        type: Schema.types.string,
        description: "Anonymous JS function to transform the response",
      },
    },
    required: ["http_method", "request_url"],
  },
  output_parameters: {
    properties: {
      raw_response: {
        type: Schema.types.string,
        description: "Raw string response recieved",
      },
      custom_transformed_response_a: {
        type: Schema.types.string,
        description: "The first custom transformed response",
      },
      custom_transformed_response_b: {
        type: Schema.types.string,
        description: "The second custom transformed response",
      },
      custom_transformed_response_c: {
        type: Schema.types.string,
        description: "The third custom transformed response",
      },
      custom_transformed_response_d: {
        type: Schema.types.string,
        description: "The fourth custom transformed response",
      },
    },
    required: [
      "raw_response",
      "custom_transformed_response_a",
      "custom_transformed_response_b",
      "custom_transformed_response_c",
      "custom_transformed_response_d",
    ],
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
      inputs: {
        http_method: string;
        request_url: string;
        http_headers?: string;
        request_body?: string;
        transformation_a?: string;
        transformation_b?: string;
        transformation_c?: string;
        transformation_d?: string;
      };
    },
  ) => {
    const {
      http_method: method,
      request_url: url,
      http_headers,
      request_body: body,
      transformation_a,
      transformation_b,
      transformation_c,
      transformation_d,
    } = inputs;

    let headers = {};
    try {
      headers = JSON.parse(http_headers || "{}");
    } catch (_err) {
      // Do nothing
    }

    let response;
    try {
      response = await fetch(
        "https://slack-http-workflow-step-request-proxy.hackclub.dev/api",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            method,
            headers,
            body,
            url,
            transformations:
              (transformation_a || transformation_b || transformation_c ||
                  transformation_d)
                ? {
                  a: transformation_a,
                  b: transformation_b,
                  c: transformation_c,
                  d: transformation_d,
                }
                : undefined,
          }),
        },
      ).then((res) => res.json());
    } catch (err) {
      throw new Error(`Error fetching ${url}: ${err}`);
    }

    // Outputs are made available as variables for use in subsequent functions
    return {
      outputs: response,
    };
  },
);
