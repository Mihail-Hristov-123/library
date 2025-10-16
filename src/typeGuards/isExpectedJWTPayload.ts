const isExpectedJWTPayload = (
  payload: unknown
): payload is { email: string } => {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "email" in payload &&
    typeof payload.email === "string"
  );
};

export default isExpectedJWTPayload;
