export class AuthenticationError extends Error {
  constructor(code, message, cause) {
    super(message, { cause });

    this.name = "AuthenticationError";
    this.code = code;
    this.status = 401;
  }
}
