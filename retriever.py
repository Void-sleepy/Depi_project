import os
from dotenv import load_dotenv
from qdrant_client import QdrantClient
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_qdrant import QdrantVectorStore

class QdrantRetrieverWrapper:
    def __init__(self):
        load_dotenv()
        self.qdrant_url = os.getenv("QDRANT_URL")
        self.qdrant_api_key = os.getenv("QDRANT_API_KEY")
        self.collection_name = os.getenv("QDRANT_COLLECTION_NAME")
        self.embedding_model_name = os.getenv("EMBEDDING_MODEL")
        
        self.embeddings = HuggingFaceEmbeddings(model_name=self.embedding_model_name)
        self.client = QdrantClient(url=self.qdrant_url, api_key=self.qdrant_api_key)
        
        # Initialize modern LangChain vector store instance
        self.vector_store = QdrantVectorStore(
            client=self.client,
            collection_name=self.collection_name,
            embedding=self.embeddings
        )

    def get_relevant_context(self, query: str, k: int = 3):
        # Perform the semantic search
        docs = self.vector_store.similarity_search(query, k=k)
        
        # Combine the retrieved text blocks directly
        context_blocks = [doc.page_content for doc in docs]
        return "\n\n".join(context_blocks)

if __name__ == "__main__":
    retriever = QdrantRetrieverWrapper()
    # Change this test query to match something actually written inside your .md files
    sample_query = "What is the main topic of this documentation?" 
    print(f"Testing retrieval for: '{sample_query}'")
    
    context = retriever.get_relevant_context(sample_query)
    print("\n--- Retrieved Context ---")
    print(context if context else "No context found.")