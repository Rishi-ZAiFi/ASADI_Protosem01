from langgraph.graph import StateGraph, START, END
from pydantic import BaseModel
from typing import Optional

class State(BaseModel):
    count: int
    msg: Optional[str] = None

def node1(state: State):
    return {"count": state.count + 1}

def node2(state: State):
    return {"msg": f"Final {state.count}"}

builder = StateGraph(State)
builder.add_node("n1", node1)
builder.add_node("n2", node2)
builder.add_edge(START, "n1")
builder.add_edge("n1", "n2")
builder.add_edge("n2", END)
graph = builder.compile()

res = graph.invoke({"count": 0})
print(res)
