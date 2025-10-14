export const getAppropriateError = (
  error: unknown,
  alternativeText: string = "Unknown error occurred"
) => {
  return { message: error instanceof Error ? error.message : alternativeText };
};
