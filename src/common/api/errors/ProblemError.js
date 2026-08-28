export class ProblemError extends Error {
  constructor(problem, cause) {
    super(problem.detail ?? problem.title, { cause });

    this.name = "ProblemError";
    this.problem = problem;
    this.type = problem.type;
    this.title = problem.title;
    this.status = problem.status;
    this.detail = problem.detail;
    this.instance = problem.instance;
    this.code = problem.code;
    this.errors = problem.errors ?? [];
  }
}
