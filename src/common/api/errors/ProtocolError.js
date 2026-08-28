export class ProtocolError extends Error {
  constructor(message, cause) {
    super(message, { cause });

    this.name = "ProtocolError";
  }
}
