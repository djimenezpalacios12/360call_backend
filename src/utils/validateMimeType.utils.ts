const allowedMimetypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "audio/mpeg",
];

/**
 * Filter by allowed mimetypes
 */
export const filterFilesByMimetype = (
  files: Express.Multer.File[]
): {
  validFiles: Express.Multer.File[];
  invalidFiles: Express.Multer.File[];
} => {
  const validFiles = files.filter((file) =>
    allowedMimetypes.includes(file.mimetype)
  );
  const invalidFiles = files.filter(
    (file) => !allowedMimetypes.includes(file.mimetype)
  );

  return { validFiles, invalidFiles };
};
