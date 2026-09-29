import { orchestrator } from '../langchain/orchestrator.js'
import { traceable } from 'langsmith/traceable'

export const executeApiCallAgent = traceable(async (toolName: string, inputs: Record<string, any>) => {
  if (!toolName) {
    return {
      success: false,
      tool: toolName,
      error: { code: '400', message: 'Tool name is required' }
    }
  }

  try {
    const startTime = Date.now()
    const result = await orchestrator.runTool(toolName, inputs)
    
    return {
      success: true,
      tool: toolName,
      result: result,
      metadata: {
        tool: toolName,
        executionTime: Date.now() - startTime
      }
    }
  } catch (err: any) {
    const msg = err.message || 'Unknown error'
    
    let code = '500'
    if (msg.includes('not registered')) code = '404'
    else if (msg.includes('GEMINI_API_KEY')) code = '401'
    else if (msg.includes('rate limit')) code = '429'
    else if (msg.includes('timeout')) code = '408'
    else if (msg.includes('malformed')) code = '422'
    
    return {
      success: false,
      tool: toolName,
      error: {
        code,
        message: msg
      }
    }
  }
}, { name: "API Call Agent" })

export const executeWorkflowAgent = traceable(async (workflowName: string, inputs: Record<string, any>) => {
  if (!workflowName) {
    return {
      success: false,
      workflow: workflowName,
      error: { code: '400', message: 'Workflow name is required' }
    }
  }

  try {
    const workflow = await orchestrator.executeWorkflow(workflowName, inputs)
    return {
      success: true,
      workflow: workflowName,
      ...workflow
    }
  } catch (err: any) {
    return {
      success: false,
      workflow: workflowName,
      error: {
        code: '500',
        message: err.message
      }
    }
  }
}, { name: "API Call Agent" })
