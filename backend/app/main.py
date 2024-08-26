from anthropic import APIError
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from app.api.routes import router as v1_router

app = FastAPI()

app.include_router(v1_router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to the ChatData"}

@app.exception_handler(APIError)
async def api_error_handler(request: Request, exc: APIError):
    return JSONResponse(
        status_code=500,
        content={"message": exc.message},
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
