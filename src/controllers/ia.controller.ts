import { Request, Response } from "express";
import createError from "http-errors";
import { MessageCreateParams } from "openai/resources/beta/threads/messages";

import { logger } from "../config/loggersApp.config";
import { decodedToken, splitTokenParts } from "../utils/token.utils";
import { endpointResponse } from "../utils/endpointResponse.utils";
import { userCredentialsAi } from "../services/auth.services";
import { getClient } from "../utils/azure.utils";
import { donwloadFileServices } from "../services/donwloadFile.services";
import { createThread, messageThread } from "../services/openai.services";

// Download File from IA
export const downloadFileIA = async (req: Request, res: Response, next: any): Promise<any> => {
  try {
    const { idFile } = req.params;

    // Retrieve token
    const Authorization = req.get("Authorization") || req.query.token || req.body.token;
    const tokenparts = splitTokenParts(Authorization);

    // Download file content and retrive mimetypes
    const file_base64 = await donwloadFileServices(idFile);
    const fileContent = {
      file: file_base64?.fileBase64,
      filename: idFile,
      mimeTypes: file_base64?.mimeTypeDetected,
    };

    return res.json(endpointResponse(new Date(), "success", 200, fileContent));
  } catch (err: any) {
    logger.error({ err: err.message });
    return next(createError(500, { err: err.message }));
  }
};

// Chat with assistant
export const chatAssistant = async (req: Request, res: Response, next: any): Promise<any> => {
  try {
    // request data
    const body = req.body;

    // Settings headers SSE
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Transfer-Encoding", "chunked");
    res.flushHeaders();

    // Credentiales User
    const Authorization = req.get("Authorization") || req.query.token || req.body.token;
    const infoUser: any = decodedToken(Authorization);
    const id_usuario = infoUser?.payload?.id_usuario;
    const credentials = await userCredentialsAi(id_usuario);

    if (!credentials) {
      logger.error({ err: "No se encuentran las credenciales del usuario" });
      return next(
        createError(500, {
          err: "No se encuentran las credenciales del usuario",
        })
      );
    }

    // IA parameters
    const assistantsClient = getClient();
    const assistantId = credentials.asistente;
    const vectorStore = credentials.vectores;

    const content = body[body?.length - 1]?.content;
    let text = "";
    const objectResponse = {
      response: "",
      id_file_download: "",
      thread_id_openai: body[body?.length - 1]?.threadId,
      id_image_download: "",
    };

    // Create attachment for code_interpreter and file list for system prompt
    const attachmentsCode: MessageCreateParams.Attachment[] | null | undefined = [];
    const attachmentsSearch: string[] = [];
    if (body[body?.length - 1]?.filesCodeInterpreter?.length > 0) {
      const idFiles = body[body?.length - 1]?.filesCodeInterpreter;
      idFiles.forEach((idFile: string) => {
        attachmentsCode.push({
          file_id: idFile,
          tools: [{ type: "code_interpreter" }],
        });
      });
    }

    if (body[body?.length - 1]?.fileSearch.length > 0) {
      const idFiles = body[body?.length - 1]?.fileSearch;
      idFiles.forEach((fileName: string) => {
        attachmentsSearch.push(fileName);
      });
    }

    const instruction = `Como gestor de conocimiento te haré preguntas, usa tu File search o tu Code interpreter para abrir y leer los archivos proporcionados, cuando sea necesario.
        Eres Thinker, la Inteligencia Artificial Generativa de Alaya, un asistente virtual que te ayudará a encontrar información relevante en documentos y fuentes de conocimiento.
        Cumple con las siguientes instrucciones para generar tu respuesta:
        1. Adicionalmente, agrega análisis, razonamientos y justificaciones de tu respuesta.
        2. Tu respuesta debe incluir la mayor cantidad de información que pueda estar relacionada con la pregunta.
        3. Escribe tu respuesta de forma estructurada e incluye listados si es necesario
        4. Adicionalmente, agrega análisis, razonamientos y justificaciones de tu respuesta.
        5. Si es un archivo excel o CSV, usa el Code Interpreter para analizar el archivo y así poder responder la pregunta.
        6. buscar la informacion solo en los archivos: ${attachmentsSearch}
        7. Si la información no esta en los archivos especificados, no extraigas ninguna información, y no menciones información de otra fuente
        8. Si hay fechas, números, estadísticas, nombre, incluye esos detalles en tu respuesta
        9. Responde siempre en español
        10. Sé cordial cuando te saluden y despidan
        11. Si es un archivo excel o CSV, usa el Code Interpreter para analizar el archivo y así poder responder la pregunta.
        Pregunta:
        `;

    // 1. Start a new thread
    if (objectResponse.thread_id_openai === "") {
      const threadIdResponse = await createThread(vectorStore, assistantsClient);
      objectResponse.thread_id_openai = threadIdResponse;
    }

    // 2. add message to thread
    await messageThread(assistantsClient, objectResponse.thread_id_openai, attachmentsCode, content);

    // 3. Run stream
    const run = assistantsClient.beta.threads.runs
      .stream(objectResponse.thread_id_openai, {
        assistant_id: assistantId,
        stream: true,
        temperature: 0.03,
        top_p: 1,
        model: "gpt-4o",
        instructions: instruction,
      })
      .on("textCreated", (text) => process.stdout.write("\ntextCreated assistant > "))
      .on("textDelta", (textDelta: any) => {
        if (textDelta && typeof textDelta.value === "string") {
          text += textDelta.value;
          objectResponse.response = text;
        } else {
          // retrieve id_file generated
          objectResponse.id_file_download = textDelta.annotations[0].file_path.file_id;
        }
        // process.stdout.write(text);
        res.write(JSON.stringify(objectResponse));
      })
      .on("toolCallCreated", (toolCall) => process.stdout.write(`\ntoolCallCreated assistant >`))
      .on("toolCallDelta", async (toolCallDelta: any, snapshot) => {
        // Get file image id and send in response
        const file_id = toolCallDelta?.code_interpreter?.outputs ? toolCallDelta?.code_interpreter?.outputs[0]?.image?.file_id : "";
        let base64 = "";
        objectResponse.id_image_download = "base64 empty";
        if (file_id) {
          logger.info(`File image id generated: ID ${file_id}`);
          base64 = file_id;
        }
        objectResponse.id_image_download = base64;
        res.write(JSON.stringify(objectResponse));

        if (toolCallDelta.type === "code_interpreter") {
          if (toolCallDelta.code_interpreter.input) {
            process.stdout.write("");
          }
          if (toolCallDelta.code_interpreter.outputs) {
            process.stdout.write("\ntoolCallDelta output >\n");
            toolCallDelta.code_interpreter.outputs.forEach((output: any) => {
              if (output.type === "logs") {
                process.stdout.write(``);
              }
            });
          }
        }
      })
      .on("end", () => {
        res.end();
      });

    // close connection
    req.on("close", () => {
      res.end();
    });
  } catch (err: any) {
    logger.error({ err: err.message });
    return next(createError(500, { err: err.message }));
  }
};
