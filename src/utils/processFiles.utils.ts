//TODO: Process files (storage and assistant)
export const processDoc = async (file: Express.Multer.File) => {
  console.log(`Procesando Docs: ${file.originalname}`);
  return { file: file.originalname, action: "Procesado como Docs" };
};

//TODO: Process files (whisper, storage and assistant)
export const processAudio = async (file: Express.Multer.File) => {
  console.log(`Procesando audio: ${file.originalname}`);
  return { file: file.originalname, action: "Procesado como audio" };
};
