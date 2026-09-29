import dotenv from 'dotenv'

dotenv.config()

if (process.env.LANGSMITH_TRACING === 'true') {
  process.env.LANGCHAIN_TRACING_V2 = 'true'
}
if (process.env.LANGSMITH_API_KEY) {
  process.env.LANGCHAIN_API_KEY = process.env.LANGSMITH_API_KEY
}
if (process.env.LANGSMITH_PROJECT) {
  process.env.LANGCHAIN_PROJECT = process.env.LANGSMITH_PROJECT
}
