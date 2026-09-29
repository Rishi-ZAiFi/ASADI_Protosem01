import { toolRegistry } from './toolRegistry.js'
import { traceable } from 'langsmith/traceable'

export class CreatorOrchestrator {
  /**
   * Executes a single tool via LangChain tool registry
   */
  runTool = traceable(async (toolName: string, inputs: Record<string, any>) => {
    const tool = (toolRegistry as Record<string, any>)[toolName]
    
    if (!tool) {
      throw new Error(`Tool "${toolName}" is not registered in the LangChain registry.`)
    }

    try {
      const startTime = Date.now()
      const resultString = await tool.invoke({ inputs })
      let resultObj = {}
      try {
        resultObj = JSON.parse(resultString)
      } catch (e) {
        console.warn(`[Orchestrator] Failed to parse JSON for tool ${toolName}:`, resultString)
        throw new Error('AI returned malformed JSON')
      }
      return resultObj
    } catch (err: any) {
      console.error(`[Orchestrator] Tool execution failed for ${toolName}:`, err)
      throw err
    }
  }, { name: "Creator Orchestrator" })

  /**
   * Multi-step workflow orchestration
   */
  executeWorkflow = traceable(async (workflowName: string, initialInputs: Record<string, any>) => {
    const steps: any[] = []
    let currentContext = { ...initialInputs }
    
    let pipelineSteps: {name: string, tool: string}[] = []

    if (workflowName === 'ai-content-director') {
      pipelineSteps = [
        { name: 'Research', tool: 'creator-research-assistant' },
        { name: 'Angles', tool: 'hook-generator' },
        { name: 'Narrative', tool: 'creator-second-brain' },
        { name: 'Script', tool: 'reel-script-builder' },
        { name: 'Visuals/B-roll', tool: 'clip-finder' },
        { name: 'Shot List', tool: 'creator-workspace' },
        { name: 'Publishing Copy', tool: 'caption-assistant' }
      ]
    } else if (workflowName === 'autonomous-content-pipeline') {
      pipelineSteps = [
        { name: 'Idea', tool: 'content-idea-generator' },
        { name: 'Research', tool: 'creator-research-assistant' },
        { name: 'YouTube Script', tool: 'ai-screenplay-workspace' },
        { name: '3 Reels', tool: 'reel-script-builder' },
        { name: 'LinkedIn', tool: 'content-repurposer' },
        { name: 'X Thread', tool: 'content-recycler' },
        { name: 'Captions', tool: 'caption-assistant' },
        { name: 'Calendar', tool: 'daily-content-planner' }
      ]
    } else if (workflowName === 'ai-creative-producer') {
      pipelineSteps = [
        { name: 'Goal', tool: 'ai-content-director' },
        { name: 'Audience', tool: 'comment-analyzer' },
        { name: 'Content Pillars', tool: 'creator-second-brain' },
        { name: '30-Day Strategy', tool: 'daily-content-planner' },
        { name: 'Today\'s Content', tool: 'content-idea-generator' },
        { name: 'Performance Analysis', tool: 'comment-to-content' },
        { name: 'Adaptation', tool: 'content-recycler' }
      ]
    }

    if (pipelineSteps.length > 0) {
      for (const step of pipelineSteps) {
        try {
          const runStep = traceable(async (c: any) => {
             return await this.runTool(step.tool, c)
          }, { name: step.name })
          const stepResult = await runStep(currentContext)
          steps.push({ tool: step.tool, status: 'completed', result: stepResult })
          currentContext = { ...currentContext, ...stepResult }
        } catch (err: any) {
          steps.push({ tool: step.tool, status: 'failed', error: err.message })
          break // Halt workflow on failure
        }
      }
      return { steps, finalResult: currentContext }
    }

    throw new Error(`Workflow "${workflowName}" is not implemented yet.`)
  }, { name: "Creator Orchestrator" })
}

export const orchestrator = new CreatorOrchestrator()
