from pydantic import BaseModel

class SchemaRequest(BaseModel):
    dbname: str

class TableRequest(BaseModel):
    dbname: str
    schema: str