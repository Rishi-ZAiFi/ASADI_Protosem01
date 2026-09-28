import React, { useState, useEffect } from 'react'
import {
  Layers,
  Plus,
  Tv,
  Globe,
  Tag,
  ArrowRight,
  CheckCircle2,
  Calendar,
} from 'lucide-react'
import { ProjectItem } from '../types'
import { getProjects, createProject } from '../services/api'

interface ProjectsPageProps {
  onNavigate: (route: string) => void
  onRefreshStats?: () => void
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ onNavigate, onRefreshStats }) => {
  const [projects, setProjects] = useState<ProjectItem[]>([])
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)

  // Form states
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [niche, setNiche] = useState('')
  const [platform, setPlatform] = useState('YouTube & Instagram')
  const [tagsInput, setTagsInput] = useState('')

  const loadProjects = async () => {
    setLoading(true)
    try {
      const data = await getProjects()
      setProjects(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    try {
      const newProj = await createProject({
        title,
        description,
        niche: niche || 'General',
        platform,
        tags,
      })
      setProjects((prev) => [newProj, ...prev])
      setShowModal(false)
      setTitle('')
      setDescription('')
      setNiche('')
      setTagsInput('')
      if (onRefreshStats) onRefreshStats()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Layers className="w-7 h-7 text-purple-400" />
            Projects & Creator Channels
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Organize your media assets, target channels, and brand pillars across distinct projects.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 transition-all cursor-pointer self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>New Project / Channel</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-purple-500/40 transition-all space-y-4 flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {proj.status.toUpperCase()}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {new Date(proj.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                  {proj.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{proj.description}</p>
              </div>

              <div className="space-y-1.5 pt-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-purple-400" />
                  <span><strong>Platforms:</strong> {proj.platform}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tv className="w-3.5 h-3.5 text-indigo-400" />
                  <span><strong>Niche:</strong> {proj.niche}</span>
                </div>
              </div>

              {proj.tags && proj.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {proj.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md bg-slate-900 text-slate-400 border border-slate-800 text-[11px]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <button
                type="button"
                onClick={() => onNavigate('content-idea-generator')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
              >
                <span>Generate Content for Channel</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Project Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-3xl p-6 md:p-8 border border-slate-800 space-y-6 animate-scaleIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">Create New Project / Channel</h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Project / Channel Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. AI Film Studio & YouTube Series"
                  className="glass-input w-full px-4 py-2.5 rounded-xl text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the channel vision and target audience..."
                  className="glass-input w-full px-4 py-2.5 rounded-xl text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Niche</label>
                  <input
                    type="text"
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    placeholder="e.g. AI & Filmmaking"
                    className="glass-input w-full px-4 py-2 rounded-xl text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Primary Platforms</label>
                  <input
                    type="text"
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    placeholder="e.g. YouTube & X"
                    className="glass-input w-full px-4 py-2 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Tags (comma separated)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="AI, Filmmaking, Tech, Weekly"
                  className="glass-input w-full px-4 py-2 rounded-xl text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white cursor-pointer"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
