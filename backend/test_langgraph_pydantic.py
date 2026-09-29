from langgraph.graph import StateGraph
from pydantic import BaseModel

class State(BaseModel):
    a: int

graph = StateGraph(State)
print(graph.channels)
