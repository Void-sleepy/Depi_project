import os
from dotenv import load_dotenv
from langchain_community.llms import Ollama
from langchain_core.prompts import PromptTemplate
from retriever import QdrantRetrieverWrapper

class RAGChain:
    def __init__(self):
        load_dotenv()
        self.ollama_base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
        self.model_name = os.getenv("LLM_MODEL", "llama3:8b-instruct-q4_K_M")
        
        self.retriever = QdrantRetrieverWrapper()
        
        print(f"Connecting to local Ollama instance running {self.model_name}...")
        self.llm = Ollama(base_url=self.ollama_base_url, model=self.model_name)
        
        # --- THE WHIMSICAL PROMPT UPDATE ---
        self.template = """You are a delightfully whimsical, cheerful, and slightly magical AI Assistant! 
Speak with charm, wonder, and a playful tone, but always base your answers strictly on the provided context. 
If the context doesn't contain the answer, admit it in a quirky, fun way, but do not make things up!

Context:
{context}

Question: {question}

Whimsical Answer:"""
        self.prompt = PromptTemplate(template=self.template, input_variables=["context", "question"])

    def ask(self, question: str) -> str:
        context = self.retriever.get_relevant_context(question)
        formatted_prompt = self.prompt.format(context=context, question=question)
        response = self.llm.invoke(formatted_prompt)
        return response

if __name__ == "__main__":
    chain = RAGChain()
    
    # Put a sample question here that relates to your documentation file!
    test_question = "What is the main topic of our documentation?"
    
    print(f"\nAsking AI: '{test_question}'")
    print("AI is dreaming up an answer...")
    
    response = chain.ask(test_question)
    print("\n--- Whimsical AI Response ---")
    print(response)