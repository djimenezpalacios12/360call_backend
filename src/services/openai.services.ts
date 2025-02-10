import { AzureOpenAI } from "openai";
import { MessageCreateParams } from "openai/resources/beta/threads/messages";

import { logger } from "../config/loggersApp.config";

// 1. thread
export const createThread = async (
  tokenparts: string[],
  vectorStore: string,
  assistantsClient: AzureOpenAI
) => {
  try {
    const thread = await assistantsClient.beta.threads.create({
      tool_resources: {
        file_search: { vector_store_ids: [vectorStore] },
      },
    });

    logger.info(`Nueva conversación iniciada creado", ID: ${thread.id}`);

    return thread.id;
  } catch (err) {
    logger.error(err);
  }
};

// 2. messages
export const messageThread = async (
  assistantsClient: AzureOpenAI,
  thread_id_openai: string,
  attachmentsCode: MessageCreateParams.Attachment[],
  content: any
) => {
  try {
    await assistantsClient.beta.threads.messages.create(thread_id_openai, {
      role: "user",
      content: content,
      attachments: attachmentsCode,
    });
  } catch (err: any) {
    logger.error(err);
  }
};
