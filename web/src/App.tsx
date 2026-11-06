import React, { useState, useEffect } from 'react';
import { NavigationPage, Project, ProductionPlan, GenerationInput } from './types';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { CreateProjectPage } from './pages/CreateProjectPage';
import { ProcessingPage } from './pages/ProcessingPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { SettingsPage } from './pages/SettingsPage';
import { ProductionPlanWorkspace } from './components/workspace/ProductionPlanWorkspace';
import { ExportModal } from './components/workspace/ExportModal';
import { ContentDirectorView } from './components/contentdirector/ContentDirectorView';
import { MemeStudioView } from './components/memestudio/MemeStudioView';
import { AnalyticsCopilotView } from './components/analytics/AnalyticsCopilotView';
import { useToast } from './components/common/Toast';
import { storage } from './services/storage';
import {
  generateProductionPlan,
  SAMPLE_MORNING_ROUTINE_PLAN,
  SAMPLE_MORNING_ROUTINE_SCRIPT,
} from './services/aiGenerator';

export default function App() {
  const [currentPage, setCurrentPage] = useState<NavigationPage>('landing');
  const [projects, setProjects] = useState<Project[]>(() => storage.getProjects());
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activePlan, setActivePlan] = useState<ProductionPlan>(SAMPLE_MORNING_ROUTINE_PLAN);

  // Pending generation state
  const [pendingInput, setPendingInput] = useState<GenerationInput | null>(null);
  const [generatedPlan, setGeneratedPlan] = useState<ProductionPlan | null>(null);

  // Export modal state
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const toast = useToast();

  // Initialize active project on mount
  useEffect(() => {
    const list = storage.getProjects();
    setProjects(list);
    const activeId = storage.getActiveProjectId();
    const found = list.find((p) => p.id === activeId) || list[0];
    if (found) {
      setActiveProject(found);
      if (found.plan) {
        setActivePlan(found.plan);
      }
    }
  }, []);

  // When user clicks "Generate Production Plan" from Create Project
  const handleStartGeneration = async (input: GenerationInput) => {
    setPendingInput(input);
    setCurrentPage('processing');

    try {
      const plan = await generateProductionPlan(input);
      setGeneratedPlan(plan);

      // Create new Project object
      const newProject: Project = {
        id: `proj-${Date.now()}`,
        title: input.title,
        platform: input.platform,
        videoType: input.videoType,
        targetDuration: input.targetDuration,
        tones: input.tones,
        script: input.script,
        creativeDirection: input.creativeDirection,
        status: 'Completed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        plan,
      };

      plan.projectId = newProject.id;

      // Save to storage
      storage.saveProject(newProject);
      storage.setActiveProjectId(newProject.id);
      setActiveProject(newProject);
      setActivePlan(plan);
      setProjects(storage.getProjects());
    } catch (err) {
      console.error(err);
      toast.error('Generation Failed', 'Could not complete production plan synthesis.');
    }
  };

  const handleOpenWorkspace = (project: Project) => {
    storage.setActiveProjectId(project.id);
    setActiveProject(project);
    if (project.plan) {
      setActivePlan(project.plan);
    }
    setCurrentPage('workspace');
  };

  const handleOpenSampleDemo = () => {
    const morningProj = projects.find((p) => p.id === 'proj-sample-morning-routine') || projects[0];
    if (morningProj) {
      handleOpenWorkspace(morningProj);
    } else {
      setCurrentPage('workspace');
    }
    toast.info('Loaded Morning Routine Demo', 'Exploring 6-scene production plan blueprint.');
  };

  const handleUpdatePlan = (updatedPlan: ProductionPlan) => {
    setActivePlan(updatedPlan);
    if (activeProject) {
      const updatedProject: Project = {
        ...activeProject,
        plan: updatedPlan,
        updatedAt: new Date().toISOString(),
      };
      setActiveProject(updatedProject);
      storage.saveProject(updatedProject);
      setProjects(storage.getProjects());
    }
  };

  const handleRefreshStorage = () => {
    const list = storage.getProjects();
    setProjects(list);
    const activeId = storage.getActiveProjectId();
    const found = list.find((p) => p.id === activeId) || list[0];
    if (found) {
      setActiveProject(found);
      if (found.plan) setActivePlan(found.plan);
    }
  };

  const handleHandoffToPreProduction = (topic: string, scriptText: string) => {
    const handoffInput: GenerationInput = {
      title: topic || 'New Production Project',
      platform: 'YouTube Shorts',
      videoType: 'Short-form video',
      targetDuration: '60 seconds',
      tones: ['Cinematic'],
      script: scriptText || 'Enter script here...',
    };
    handleStartGeneration(handoffInput);
  };

  const handleHandoffToContentDirector = (topic: string) => {
    setCurrentPage('content-director');
    toast.info('Switched to Content Director', `Loaded topic: ${topic}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-studio-bg text-studio-dark font-sans selection:bg-brand-500 selection:text-white">
      {/* Global Navbar */}
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />

      {/* Main View Router */}
      <div className="flex-1 flex flex-col">
        {/* View 1: Landing Page */}
        {currentPage === 'landing' && (
          <LandingPage
            onNavigate={setCurrentPage}
            onOpenSampleDemo={handleOpenSampleDemo}
          />
        )}

        {/* View 2: Dashboard */}
        {currentPage === 'dashboard' && (
          <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
            <DashboardPage
              onNavigate={setCurrentPage}
              onSelectProject={setActiveProject}
              onOpenWorkspace={handleOpenWorkspace}
            />
          </main>
        )}

        {/* View 3: Create Project Wizard */}
        {currentPage === 'create' && (
          <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
            <CreateProjectPage
              onStartGeneration={handleStartGeneration}
              onNavigate={setCurrentPage}
            />
          </main>
        )}

        {/* View 4: AI Generation / Processing Screen */}
        {currentPage === 'processing' && (
          <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex items-center justify-center">
            <ProcessingPage
              input={
                pendingInput || {
                  title: 'My Morning Routine',
                  platform: 'YouTube Shorts',
                  videoType: 'Short-form video',
                  targetDuration: '60 seconds',
                  tones: ['Energetic'],
                  script: SAMPLE_MORNING_ROUTINE_SCRIPT,
                }
              }
              plan={generatedPlan || activePlan}
              onOpenPlan={() => {
                setCurrentPage('workspace');
                toast.success('Production Plan Active', 'Viewing full scenes and shot list.');
              }}
            />
          </main>
        )}

        {/* View 5: Pre-Production Studio Workspace (Repo 25) */}
        {currentPage === 'workspace' && (
          <ProductionPlanWorkspace
            project={
              activeProject || {
                id: 'proj-sample-morning-routine',
                title: 'My Morning Routine',
                platform: 'YouTube Shorts',
                videoType: 'Short-form video',
                targetDuration: '60 seconds',
                tones: ['Energetic'],
                script: SAMPLE_MORNING_ROUTINE_SCRIPT,
                status: 'Completed',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                plan: activePlan,
              }
            }
            plan={activePlan}
            onUpdatePlan={handleUpdatePlan}
            onBackToDashboard={() => setCurrentPage('dashboard')}
            onRegenerate={() => setCurrentPage('create')}
            onOpenExport={() => setIsExportModalOpen(true)}
          />
        )}

        {/* View 6: AI Content Director (7-Stage Pipeline - Repo 18) */}
        {currentPage === 'content-director' && (
          <main className="flex-1">
            <ContentDirectorView
              onNavigateToPreProduction={handleHandoffToPreProduction}
              onNavigateToMemeStudio={() => setCurrentPage('meme-studio')}
            />
          </main>
        )}

        {/* View 7: Viral Meme Studio (Repo 18) */}
        {currentPage === 'meme-studio' && (
          <main className="flex-1">
            <MemeStudioView
              onAttachMemeToProject={(meme) => {
                toast.success('Meme Saved to Project', `Attached "${meme.name}" as promotional cutaway.`);
                setCurrentPage('workspace');
              }}
            />
          </main>
        )}

        {/* View 8: Creator Analytics Copilot (Repo 24) */}
        {currentPage === 'analytics-copilot' && (
          <main className="flex-1">
            <AnalyticsCopilotView
              onNavigateToPreProduction={handleHandoffToPreProduction}
              onNavigateToContentDirector={handleHandoffToContentDirector}
              onNavigate={setCurrentPage}
            />
          </main>
        )}

        {/* View 9: Projects History */}
        {currentPage === 'projects' && (
          <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
            <ProjectsPage
              onNavigate={setCurrentPage}
              onOpenWorkspace={handleOpenWorkspace}
            />
          </main>
        )}

        {/* View 10: Settings & Billing */}
        {currentPage === 'settings' && (
          <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
            <SettingsPage
              onNavigate={setCurrentPage}
              onRefreshData={handleRefreshStorage}
            />
          </main>
        )}
      </div>

      {/* Global Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        project={
          activeProject || {
            id: 'proj-sample-morning-routine',
            title: 'My Morning Routine',
            platform: 'YouTube Shorts',
            videoType: 'Short-form video',
            targetDuration: '60 seconds',
            tones: ['Energetic'],
            script: SAMPLE_MORNING_ROUTINE_SCRIPT,
            status: 'Completed',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            plan: activePlan,
          }
        }
        plan={activePlan}
      />

      {/* Global Footer */}
      <Footer onNavigate={setCurrentPage} />
    </div>
  );
}
