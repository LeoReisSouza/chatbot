from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from anthropic import APIError
from app.api.routes import router as api_router
from backend.app.api.middleware.SqlInjectionSanitizerMiddleware import SQLInjectionSanitizerMiddleware
from backend.app.shared.utils.sanitizer_sql_injection import SQLSanitizer

app = FastAPI()

# Instancia o sanitizador e middleware
sql_sanitizer = SQLSanitizer()
app.add_middleware(SQLInjectionSanitizerMiddleware, sanitizer=sql_sanitizer)

app.include_router(api_router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to the ChatData"}

@app.exception_handler(APIError)
async def api_error_handler(request: Request, exc: APIError):
    return JSONResponse(
        status_code=500,
        content={"message": str(exc)},
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)