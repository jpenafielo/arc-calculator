# Development prompts and instructions

This document summarizes the initial assignment and the instructions Juan Sebastián used to guide the work. He chose the publication repository, tested the project on Windows, reported startup issues, and requested improvements to the code structure and deployment. Codex assisted with a substantial portion of the implementation, tests, and documentation; the candidate's decisions and reviews guided the iterations.

## Initial assignment shared with Codex

The following is a summary of the technical brief shared in the first message, with the email greeting omitted.

~~~text
Objective
Build a full-stack calculator application with a React frontend and a backend microservice. The frontend should consume the backend API to perform basic and advanced arithmetic operations. Focus on clean design, maintainable code, and testable architecture.

Requirements
Functional Operations:
- Addition, Subtraction, Multiplication, Division
- Optional: Exponentiation, Square Root, Percentage

Frontend (React):
- Intuitive UI for entering input and displaying results
- Input validation and error handling
- Responsive design (basic mobile support)

Backend (REST API):
- Expose endpoints for calculator operations
- Validate input and handle edge cases (division by zero, invalid data)
- Return results in JSON format

Non-Functional:
- Clean, readable, and idiomatic code (frontend and backend)
- Unit tests covering key functionality for both layers
- Documentation: setup instructions, API usage, and design rationale
- Optional: Dockerfile for full-stack deployment

Constraints:
- Frontend: React (TypeScript preferred)
- Backend: Go is preferred

Deliverables:
1. Git repository with frontend and backend code
2. README with setup instructions, API examples, and design decisions
3. Unit tests and coverage report
4. Optional: Dockerfile to run frontend + backend together

Instructions:
1. Use any AI tooling you would like
2. Spend approximately 2–4 hours on this assignment. Prioritize correctness, clarity, and maintainability over extra features.
3. Push your solution to GitHub, GitLab, or another Git repository.
4. Share the repository link with us for evaluation.
5. Share any prompts that you used in your work.
6. Make sure your README includes setup instructions, how to run the frontend and backend, examples of API calls, and design decisions or assumptions.
~~~

## Follow-up instructions during development

1. **Repository publication.** Publish the solution to my personal GitHub account as `jpenafielo/arc-calculator`. Confirm that the new repository contains the final version, then delete the previous repository.

2. **Windows compatibility.** Correct the startup instructions for PowerShell. The command `STATIC_DIR=../frontend/dist go run ./cmd/server` uses Unix environment-variable syntax and does not run in my environment. Document the equivalent Windows command.

3. **Single-command startup.** Simplify the setup so the frontend and backend can be started with one command. Evaluate Docker Compose and a local option such as `concurrently`, choose the more suitable approach for this assignment, and document its prerequisites in the README.

4. **Docker troubleshooting.** Investigate the connection error involving `//./pipe/docker_engine` when running Compose on Windows. Explain how to check whether Docker Desktop or Docker Engine is running and what to do before retrying the application startup.

5. **Code quality review and corrections.** Assess whether the implementation follows clean code conventions, focusing on responsibilities, naming, structure, and maintainability. Apply the specific corrections identified in the review.

6. **Final requirements review.** Compare the completed solution against every requirement in the assignment and identify any remaining gaps before considering the submission complete.
