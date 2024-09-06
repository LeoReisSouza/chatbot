from abc import ABC, abstractmethod
from typing import List, Dict, Any

class RepositoryInterface(ABC):
    
    @abstractmethod
    def get_document(self, collection_name: str, query: Dict[str, Any]) -> Dict[str, Any]:
        """Retrieve a single document based on a query."""
        pass

    @abstractmethod
    def get_documents(self, collection_name: str, query: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Retrieve multiple documents based on a query."""
        pass

    @abstractmethod
    def insert_document(self, collection_name: str, document: Dict[str, Any]) -> None:
        """Insert a single document into a collection."""
        pass

    @abstractmethod
    def update_document(self, collection_name: str, query: Dict[str, Any], update: Dict[str, Any]) -> None:
        """Update a document in a collection based on a query."""
        pass

    @abstractmethod
    def delete_document(self, collection_name: str, query: Dict[str, Any]) -> None:
        """Delete a document from a collection based on a query."""
        pass