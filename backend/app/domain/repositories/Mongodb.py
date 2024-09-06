from pymongo import MongoClient
from pymongo.collection import Collection
from typing import List, Dict, Any
import pymongo

class MongoDBRepository(RepositoryInterface):
    def __init__(self, uri: str, database_name: str):
        self.client = MongoClient(uri)
        self.database = self.client[database_name]

    def get_collection(self, collection_name: str) -> Collection:
        return self.database[collection_name]

    def get_document(self, collection_name: str, query: Dict[str, Any]) -> Dict[str, Any]:
        collection = self.get_collection(collection_name)
        document = collection.find_one(query)
        return document if document else {}

    def get_documents(self, collection_name: str, query: Dict[str, Any]) -> List[Dict[str, Any]]:
        collection = self.get_collection(collection_name)
        documents = list(collection.find(query))
        return documents

    def insert_document(self, collection_name: str, document: Dict[str, Any]) -> None:
        collection = self.get_collection(collection_name)
        collection.insert_one(document)

    def update_document(self, collection_name: str, query: Dict[str, Any], update: Dict[str, Any]) -> None:
        collection = self.get_collection(collection_name)
        collection.update_one(query, {'$set': update})

    def delete_document(self, collection_name: str, query: Dict[str, Any]) -> None:
        collection = self.get_collection(collection_name)
        collection.delete_one(query)
