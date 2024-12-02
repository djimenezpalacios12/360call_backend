import { AzureOpenAI } from "openai";

const azureOpenAIKey = process.env.AZURE_OPENAI_KEY;
const azureOpenAIEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
const azureOpenAIVersion = process.env.AZUREOPENAIVERSION;

// Get Azure SDK client
export const getClient = () => {
  if (!azureOpenAIKey || !azureOpenAIEndpoint) {
    throw new Error(
      "Please set AZURE_OPENAI_KEY and AZURE_OPENAI_ENDPOINT in your environment variables."
    );
  }

  const assistantsClient = new AzureOpenAI({
    endpoint: azureOpenAIEndpoint,
    apiVersion: azureOpenAIVersion,
    apiKey: azureOpenAIKey,
  });

  return assistantsClient;
};

const assistantsClient = getClient();

// Options Assistant
export const options: any = {
  model: "gpt-4o-3", // replace with model deployment name
  name: "dev_asst_diego_jimenez",
  instructions:
    "Dar la información de manera sencilla formal y de manera resumida.",
  tools: [
    {
      type: "file_search",
      file_search: {
        ranking_options: { ranker: "default_2024_08_21", score_threshold: 0 },
      },
    },
  ],
  tool_resources: {
    file_search: { vector_store_ids: ["vs_eAnXsi09mqso4982xET2zk4I"] },
  },
  temperature: 0.03,
  top_p: 1,
};

// Setup (create) Assistant
export const setupAssistant = async () => {
  try {
    const assistantResponse = await assistantsClient.beta.assistants.create(
      options
    );
    console.log(`Assistant created: ${JSON.stringify(assistantResponse)}`);
  } catch (error: any) {
    console.error(`Error creating assistant: ${error.message}`);
  }
};

// setupAssistant();
