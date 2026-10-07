from typing import List
from langchain_core.retrievers import BaseRetriever
from langchain_core.callbacks import CallbackManagerForRetrieverRun
from langchain_core.documents import Document

class RetrievalServiceRetriever(BaseRetriever):
    retrieval_service: any
    project_id: str
    post_type: str

    def _get_relevant_documents(
        self, query: str, *, run_manager: CallbackManagerForRetrieverRun
    ) -> List[Document]:
        raw_results = self.retrieval_service.retrieve_relevant_posts(
            project_id=self.project_id,
            query_text=query,
            top_k=5,
            post_type_filter=self.post_type
        )
        return [Document(page_content=r["caption"], metadata={"id": r["id"]}) for r in raw_results]


class StyleExemplarRetriever(BaseRetriever):
    retrieval_service: any
    project_id: str
    post_type: str

    def _get_relevant_documents(
        self, query: str, *, run_manager: CallbackManagerForRetrieverRun
    ) -> List[Document]:
        exemplars = self.retrieval_service.retrieve_style_exemplars(
            project_id=self.project_id,
            query_text=query,
            top_k=3,
            post_type_filter=self.post_type
        )
        return [Document(page_content=e["caption"], metadata={"id": e["id"], "post_type": e.get("post_type")}) for e in exemplars]
