from pydantic import BaseModel, Field

class SchemaRequest(BaseModel):
    dbname: str

class TableRequest(BaseModel):
    dbname: str
    schema_name: str = Field(..., alias="schema")