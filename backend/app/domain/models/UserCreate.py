from mongoengine import Document, fields
from datetime import datetime

class UserCreate(Document):
    nome = fields.StringField(required=True)
    senha = fields.StringField(required=True)
    data_nascimento = fields.DateField(required=True)
    cpf = fields.StringField(required=True)
    rg = fields.StringField(required=True)
    data_criacao = fields.DateTimeField(default=datetime.datetime.utcnow)
    email = fields.StringField(required=True)
    telefone = fields.StringField(required=True)
    endereco = fields.StringField(required=True)
    cep = fields.StringField(required=True)
    uf = fields.StringField(required=True)
    municipio = fields.StringField(required=True)
