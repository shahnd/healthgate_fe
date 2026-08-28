export class TransportError extends Error {
  constructor(code, message, cause) {
    super(message, { cause });

    this.name = "TransportError";
    this.code = code;
  }
}
