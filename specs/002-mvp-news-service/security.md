# Security Notes

- Do not commit secrets. Use environment variables for runtime secrets.
- For local dev, store email/third-party keys in a `.env` file excluded by `.gitignore`.
- Tests should mock external services (email, HTTP fetch) and avoid network calls.
- For production, a secrets manager (AWS Secrets Manager or similar) is recommended; document migration in `release-plan.md`.
