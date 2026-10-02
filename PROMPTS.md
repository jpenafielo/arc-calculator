# Prompts e instrucciones del desarrollo

Este documento resume la consigna inicial y las indicaciones con las que Juan Sebastián dirigió el desarrollo. Él eligió el repositorio de publicación, probó el proyecto en Windows, reportó errores de arranque y solicitó mejoras de estructura y despliegue. Codex asistió con una parte sustancial de la implementación, las pruebas y la documentación; las decisiones y revisiones del candidato guiaron las iteraciones.

## Consigna inicial compartida con Codex

Resumen del contenido técnico de la consigna que el candidato compartió en el primer mensaje; se omite el saludo del correo.

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

## Instrucciones de seguimiento durante el desarrollo

1. **Publicación del proyecto.** Publica la solución en mi cuenta personal de GitHub bajo `jpenafielo/arc-calculator`. Verifica que el nuevo repositorio contenga la versión final y, una vez confirmado, elimina el repositorio anterior.

2. **Compatibilidad con Windows.** Corrige las instrucciones de arranque para PowerShell. La asignación `STATIC_DIR=../frontend/dist go run ./cmd/server` usa sintaxis de Unix y no se ejecuta en mi entorno; documenta la variante correcta para Windows.

3. **Puesta en marcha con un solo comando.** Simplifica la ejecución del proyecto para que frontend y backend puedan iniciarse con un único comando. Evalúa Docker Compose y una alternativa local como `concurrently`, elige la opción más adecuada para esta entrega y explica sus requisitos en el README.

4. **Diagnóstico de Docker.** Revisa el error de conexión con `//./pipe/docker_engine` que aparece al ejecutar Compose en Windows. Aclara cómo comprobar que Docker Desktop o Docker Engine estén activos y qué pasos seguir antes de volver a iniciar la aplicación.

5. **Revisión y corrección del código.** Evalúa si la implementación sigue convenciones de código limpio, con especial atención a responsabilidades, nombres, estructura y mantenibilidad. Aplica las correcciones concretas que se identifiquen.

6. **Revisión final de la entrega.** Compara el resultado con todos los requisitos de la prueba técnica e identifica cualquier punto pendiente antes de considerar la solución terminada.
