import os
import pathlib
from dotenv import load_dotenv
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Qdrant

def main():
    # 1. Load environment variables
    load_dotenv()
    
    qdrant_url = os.getenv("QDRANT_URL")
    qdrant_api_key = os.getenv("QDRANT_API_KEY")
    collection_name = os.getenv("QDRANT_COLLECTION_NAME")
    embedding_model_name = os.getenv("EMBEDDING_MODEL")
    
    # 2. Initialize Qdrant Client
    print("Connecting to your Qdrant Cloud cluster...")
    client = QdrantClient(url=qdrant_url, api_key=qdrant_api_key)
    
    # Check if collection exists; if not, create it with 384 dimensions for MiniLM
    collections = client.get_collections().collections
    collection_exists = any(c.name == collection_name for c in collections)
    
    if not collection_exists:
        print(f"Collection '{collection_name}' not found. Creating new collection (384 dimensions)...")
        client.create_collection(
            collection_name=collection_name,
            vectors_config=VectorParams(size=384, distance=Distance.COSINE),
        )
        print(f"Collection '{collection_name}' created successfully.")
    else:
        print(f"Collection '{collection_name}' already exists. Skipping recreation.")

    # 3. Setup Text Splitter and Arabic-friendly Embedding Model
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=512,
        chunk_overlap=64,
        separators=["\n\n", "\n", " ", ""]
    )
    
    print(f"Loading multilingual embedding model: {embedding_model_name}...")
    embeddings = HuggingFaceEmbeddings(model_name=embedding_model_name)

    # 4. Read and Parse local Markdown documentation
    docs_dir = pathlib.Path("data/docs")
    md_files = list(docs_dir.glob("*.md"))
    
    if not md_files:
        print(f"Warning: No .md files found in '{docs_dir}'. Please drop your markdown files in data/docs/ and rerun.")
        return

    print(f"Found {len(md_files)} documentation files. Processing chunks...")
    
    all_chunks = []
    chunk_counter = 0
    
    for md_file in md_files:
        try:
            with open(md_file, "r", encoding="utf-8") as f:
                content = f.read()
                
            file_chunks = text_splitter.split_text(content)
            
            for chunk_text in file_chunks:
                # Clean injection: MiniLM does not need the 'passage: ' prefix.
                doc = Document(
                    page_content=chunk_text,
                    metadata={
                        "source": md_file.name,
                        "chunk_id": chunk_counter
                    }
                )
                all_chunks.append(doc)
                chunk_counter += 1
                
        except Exception as e:
            print(f"Error processing file {md_file.name}: {str(e)}")

    print(f"Successfully processed {len(md_files)} files into {len(all_chunks)} chunks.")

    # 5. Index chunks into Qdrant
    if all_chunks:
        print(f"Uploading {len(all_chunks)} chunks to Qdrant Cloud. This might take a minute...")
        
        vector_store = Qdrant(
            client=client,
            collection_name=collection_name,
            embeddings=embeddings,
        )
        
        vector_store.add_documents(all_chunks)
        print("Upload confirmed! Your Arabic-ready database is now live.")
    else:
        print("No valid chunks generated. Vector store upload skipped.")

if __name__ == "__main__":
    main()