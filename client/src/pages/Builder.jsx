import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { FiPlus, FiTrash2, FiGlobe, FiLock, FiZap, FiCheckCircle } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import AssistantPreview from '../components/AssistantPreview'
import { getThemeConfig } from '../utils/themeStyles'
import { CLIENT_URL } from '../App'
const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:8000'

const Builder = ({ user, setUser }) => {
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(true)
  const [form, setForm] = useState({
    assistantName: '',
    businessName: '',
    businessType: '',
    businessDescription: '',
    tone: 'friendly',
    theme: 'dark',
    geminiApiKey: '',
    pages: [],
  })

  useEffect(() => {
    if (!user) return

    setForm({
      assistantName: user.assistantName || '',
      businessName: user.businessName || '',
      businessType: user.businessType || '',
      businessDescription: user.businessDescription || '',
      tone: user.tone || 'friendly',
      theme: user.theme || 'dark',
      geminiApiKey: '',
      pages: Array.isArray(user.pages) && user.pages.length > 0
        ? user.pages
        : [{ name: '', path: '', keywords: [''] }],
    })
      setIsEditing(!user.isSetupComplete)
  }, [user])

  const previewTheme = useMemo(() => getThemeConfig(form.theme), [form.theme])
  const builderTheme = useMemo(() => getThemeConfig('dark'), [])

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const updatePage = (index, field, value) => {
    setForm((current) => {
      const nextPages = [...current.pages]
      nextPages[index] = { ...nextPages[index], [field]: value }
      return { ...current, pages: nextPages }
    })
  }

  const updatePageKeywords = (index, value) => {
    const keywords = value.split(',').map((keyword) => keyword.trim())
    updatePage(index, 'keywords', keywords.length > 0 ? keywords : [])
  }

  const addPage = () => {
    setForm((current) => ({
      ...current,
      pages: [...current.pages, { name: '', path: '', keywords: [''] }],
    }))
  }

  const removePage = (index) => {
    setForm((current) => {
      const nextPages = current.pages.filter((_, pageIndex) => pageIndex !== index)
      return { ...current, pages: nextPages.length > 0 ? nextPages : [{ name: '', path: '', keywords: [''] }] }
    })
  }

  const handleSave = async (event) => {
    event.preventDefault()

    setSaving(true)
    try {
      const payload = {
        ...form,
        pages: form.pages
          .filter((page) => page.name || page.path || (page.keywords || []).some(Boolean))
          .map((page) => ({
            name: page.name,
            path: page.path,
            keywords: Array.isArray(page.keywords)
              ? page.keywords.filter(Boolean)
              : [],
          })),
      }

      const response = await axios.post(`${serverUrl}/api/user/save-assistant`, payload, {
        withCredentials: true,
      })

      setUser(response.data.user)
      toast.success('Assistant saved successfully')
      setIsEditing(false)
    } catch (error) {
      console.error('Save assistant error:', error)
      toast.error('Unable to save assistant. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const themeOptions = ['light', 'dark', 'glass', 'neon']
  const toneOptions = [
    { value: 'friendly', label: 'Friendly' },
    { value: 'professional', label: 'Professional' },
    { value: 'sales', label: 'Sales-focused' },
  ]
  const previewUser = {
    ...user,
    ...form,
    pages: form.pages,
  }

  const sleekInputClass = `w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/30 hover:border-white/20 hover:bg-white/7 focus:border-cyan-400/50 focus:bg-white/5 focus:ring-4 focus:ring-cyan-400/10`

 const remainingMessages =Math.max(0, user?.requestLimit - (user?.totalMessages || 0)) ;
 const remainingDays=user?.proExpiresAt ? Math.max(0, Math.ceil((new Date(user.proExpiresAt) - new Date()) / (1000 * 60 * 60 * 24))) : 0;

 const embedCode=`<script src="${CLIENT_URL}/assistant.js" data-user-id="${user?._id}" data-api-base="${serverUrl}"></script>`;
  return (
    <div className={`relative min-h-screen overflow-hidden pb-20 ${builderTheme.pageClass}`}>
      {/* Background Glows */}
      <div className={`pointer-events-none absolute -left-28 top-16 h-80 w-80 rounded-full blur-3xl ${builderTheme.glowOneClass}`} />
      <div className={`pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full blur-3xl ${builderTheme.glowTwoClass}`} />

      <div className='relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
        <div className='mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
          <div>
            <p className={`text-xs uppercase tracking-[0.35em] font-semibold ${builderTheme.textMuted}`}>
              Assistant builder
            </p>
            <h1 className='mt-3 text-4xl font-bold tracking-tight sm:text-5xl'>
              Customize your assistant
            </h1>
            <p className={`mt-4 max-w-2xl text-base leading-relaxed ${builderTheme.textMuted}`}>
              Configure your assistant's knowledge, personality, and visual style. Save it once, then use Edit to open the form again.
            </p>
          </div>

          <div className={`rounded-3xl border px-4 py-3 ${builderTheme.shellClass}`}>
            <div className='flex items-center gap-2 text-sm font-medium'>
              <FiCheckCircle className='text-emerald-400' />
              {user?.isSetupComplete ? 'Setup complete' : 'Setup in progress'}
            </div>
            <p className={`mt-1 text-xs ${builderTheme.textMuted}`}>Changes are saved to your current assistant profile.</p>
          </div>
        </div>

        {!isEditing ? (
          <section className="rounded-4xl border border-white/10 bg-[#111827] p-8 shadow-2xl">

  {/* Header */}
  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
    <div>
      <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-emerald-400">
        <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
        Assistant Active
      </div>

      <h2 className="mt-4 text-3xl font-bold">
        Assistant saved successfully
      </h2>

      <p className="mt-2 text-slate-400">
        Your AI assistant is configured and ready to be embedded.
      </p>
    </div>

    <button
      type="button"
      onClick={() => setIsEditing(true)}
      className="rounded-full bg-linear-to-r from-cyan-400 via-blue-500 to-indigo-500 px-6 py-3 font-bold text-slate-950 transition hover:scale-105"
    >
      Edit Assistant
    </button>
  </div>

  {/* Stats */}
  <div className="mt-10 grid gap-4 md:grid-cols-3">

    <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-5">
      <p className="text-sm text-slate-400">Current Plan</p>

      <h3 className="mt-2 text-xl font-bold">
        {user?.plan === "free" ? "Free" : "Pro"}
      </h3>

      {user?.plan === "Pro" && (
        <p className="mt-1 text-sm text-cyan-400">
          {user.remainingDays} days remaining
        </p>
      )}
    </div>

    <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-5">
      <p className="text-sm text-slate-400">OpenAI Status</p>

      <h3 className="mt-2 text-xl font-bold capitalize">
        {user?.geminiStatus || "Inactive"}
      </h3>
    </div>

    <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-5">
      <p className="text-sm text-slate-400">Messages Remaining</p>

      <h3 className="mt-2 text-xl font-bold">
        {remainingMessages}
      </h3>
    </div>

  </div>

  {/* Installation */}
  <div className="mt-10 rounded-3xl border border-white/10 bg-slate-900/40 p-6">

    <h3 className="text-xl font-semibold">
      Website Installation
    </h3>

    <p className="mt-2 text-slate-400">
      Paste this script before the closing body tag of your website.
    </p>

    <div className="relative mt-5">
      <pre className="overflow-x-auto rounded-2xl bg-black p-5 text-sm text-cyan-300">
{`<script
 src="${CLIENT_URL}/assistant.js"
 data-user-id="${user?._id}"
 data-api-base="${serverUrl}"
></script>`}
      </pre>

      <button
        onClick={() => {
          navigator.clipboard.writeText(
`<script
 src="${CLIENT_URL}/assistant.js"
 data-user-id="${user?._id}"
 data-api-base="${serverUrl}"
></script>`
          );
          toast.success("Script copied");
        }}
        className="absolute right-3 top-3 rounded-lg bg-cyan-500 px-3 py-2 text-sm font-semibold text-black"
      >
        Copy
      </button>
    </div>

  </div>

  {/* Embed Widget */}
  <div className="mt-8 rounded-3xl border border-white/10 bg-slate-900/40 p-6">

    <h3 className="text-xl font-semibold">
      Embed Widget
    </h3>

    <p className="mt-2 text-slate-400">
      Use this iframe/embed code anywhere.
    </p>

    <div className="relative mt-5">

      <textarea
        value={embedCode}
        readOnly
        rows={8}
        className="
          w-full
          rounded-2xl
          bg-black
          p-4
          text-sm
          text-cyan-300
          outline-none
        "
      />

      <button
        onClick={() => {
          navigator.clipboard.writeText(embedCode);
          toast.success("Embed code copied");
        }}
        className="
          absolute
          right-3
          top-3
          rounded-lg
          bg-cyan-500
          px-3
          py-2
          text-sm
          font-semibold
          text-black
        "
      >
        Copy
      </button>

    </div>

  </div>

</section>
          

        ) : (
          <form onSubmit={handleSave} className='space-y-10'>
          
          {/* Main Settings Panel */}
          <section className={`rounded-4xl p-8 sm:p-10 shadow-2xl ${builderTheme.shellClass} border border-white/5 backdrop-blur-sm`}>
            
            {/* SECTION: Core Identity */}
            <div className='mb-8 flex items-center gap-4'>
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br shadow-lg ${builderTheme.accentClass} text-slate-950`}>
                <FiZap className='text-xl' />
              </div>
              <div>
                <h2 className='text-2xl font-semibold'>Core settings</h2>
                <p className={`text-sm mt-1 ${builderTheme.textMuted}`}>Define the identity and primary function of your assistant.</p>
              </div>
            </div>

            <div className='grid gap-8 sm:grid-cols-2'>
              <label className='flex flex-col gap-2.5'>
                <span className='text-sm font-semibold tracking-wide text-white/90'>Assistant name</span>
                <input
                  type='text'
                  value={form.assistantName}
                  onChange={(event) => updateField('assistantName', event.target.value)}
                  placeholder='e.g., Jarvis'
                  className={sleekInputClass}
                />
              </label>

              <label className='flex flex-col gap-2.5'>
                <span className='text-sm font-semibold tracking-wide text-white/90'>Business name</span>
                <input
                  type='text'
                  value={form.businessName}
                  onChange={(event) => updateField('businessName', event.target.value)}
                  placeholder='e.g., Acme Studio'
                  className={sleekInputClass}
                />
              </label>

              <label className='flex flex-col gap-2.5'>
                <span className='text-sm font-semibold tracking-wide text-white/90'>Business type</span>
                <input
                  type='text'
                  value={form.businessType}
                  onChange={(event) => updateField('businessType', event.target.value)}
                  placeholder='e.g., SaaS, Agency, E-commerce'
                  className={sleekInputClass}
                />
              </label>

              <label className='flex flex-col gap-2.5'>
                <span className='text-sm font-semibold tracking-wide text-white/90'>OpenAI API key</span>
                <div className='relative'>
                  <FiLock className='pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/40' />
                  <input
                    type='password'
                    value={form.geminiApiKey}
                    onChange={(event) => updateField('geminiApiKey', event.target.value)}
                    placeholder='Enter API key'
                    className={`${sleekInputClass} pl-11`}
                  />
                </div>
              </label>
            </div>

            <label className='mt-8 flex flex-col gap-2.5'>
              <span className='text-sm font-semibold tracking-wide text-white/90'>Business description</span>
              <textarea
                rows='4'
                value={form.businessDescription}
                onChange={(event) => updateField('businessDescription', event.target.value)}
                placeholder='Describe what your business does, who it serves, and what the assistant should focus on...'
                className={`${sleekInputClass} resize-none`}
              />
            </label>

            <hr className="my-10 border-white/5" />

            {/* SECTION: Appearance & Tone */}
            <div className='mb-8'>
              <h2 className='text-xl font-semibold'>Personality & Style</h2>
              <p className={`text-sm mt-1 ${builderTheme.textMuted}`}>Shape how your assistant sounds and looks.</p>
            </div>

            <div className='grid gap-8 sm:grid-cols-2'>
              <div>
                <h3 className='mb-4 text-sm font-semibold tracking-wide text-white/90'>Tone of Voice</h3>
                <div className='grid gap-3'>
                  {toneOptions.map((option) => (
                    <button
                      key={option.value}
                      type='button'
                      onClick={() => updateField('tone', option.value)}
                      className={`group flex items-center justify-between rounded-2xl border px-5 py-3.5 text-left text-sm transition-all duration-300 hover:-translate-y-0.5 ${
                        form.tone === option.value
                          ? 'border-cyan-400/50 bg-cyan-400/10 text-white shadow-[0_0_15px_rgba(34,211,238,0.1)]'
                          : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <span className='font-medium'>{option.label}</span>
                      <span className={`text-[10px] uppercase tracking-[0.2em] transition-opacity duration-300 ${form.tone === option.value ? 'opacity-100 text-cyan-300' : 'opacity-0 group-hover:opacity-50'}`}>Select</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className='mb-4 text-sm font-semibold tracking-wide text-white/90'>UI Theme</h3>
                <div className='grid gap-3'>
                  {themeOptions.map((option) => (
                    <button
                      key={option}
                      type='button'
                      onClick={() => updateField('theme', option)}
                      className={`group flex items-center justify-between rounded-2xl border px-5 py-3.5 text-left text-sm capitalize transition-all duration-300 hover:-translate-y-0.5 ${
                        form.theme === option
                          ? 'border-cyan-400/50 bg-cyan-400/10 text-white shadow-[0_0_15px_rgba(34,211,238,0.1)]'
                          : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <span className='font-medium'>{option}</span>
                      <span className={`text-[10px] uppercase tracking-[0.2em] transition-opacity duration-300 ${form.theme === option ? 'opacity-100 text-cyan-300' : 'opacity-0 group-hover:opacity-50'}`}>Theme</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <hr className="my-10 border-white/5" />

            {/* SECTION: Knowledge Base */}
            <div className='flex items-end justify-between gap-4 mb-8'>
              <div>
                <h2 className='text-xl font-semibold flex items-center gap-2'>
                  <FiGlobe className="text-cyan-400" /> Knowledge Base
                </h2>
                <p className={`text-sm mt-1 ${builderTheme.textMuted}`}>Connect URLs so the assistant knows your content.</p>
              </div>

              <button
                type='button'
                onClick={addPage}
                className='inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5'
              >
                <FiPlus className="text-lg" />
                Add Page
              </button>
            </div>

            <div className='space-y-5'>
              {form.pages.map((page, index) => (
                <div key={index} className={`rounded-3xl border border-white/5 bg-white/2 p-6 transition-all duration-300 hover:bg-white/4`}>
                  <div className='flex items-center justify-between gap-3 mb-5'>
                    <div className='flex items-center gap-3'>
                      <div className='flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white/70'>
                        {index + 1}
                      </div>
                      <p className='text-sm font-medium text-white/90'>Page Mapping</p>
                    </div>
                    <button
                      type='button'
                      onClick={() => removePage(index)}
                      className='inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-red-400 transition-colors duration-300 hover:bg-red-500/10 hover:text-red-300'
                    >
                      <FiTrash2 />
                      Remove
                    </button>
                  </div>

                  <div className='grid gap-6 sm:grid-cols-2'>
                    <label className='flex flex-col gap-2'>
                      <span className='text-[11px] uppercase tracking-[0.2em] font-medium text-white/50'>Page Name</span>
                      <input
                        type='text'
                        value={page.name}
                        onChange={(event) => updatePage(index, 'name', event.target.value)}
                        placeholder='e.g., Home or Pricing'
                        className={`${sleekInputClass} py-3`}
                      />
                    </label>

                    <label className='flex flex-col gap-2'>
                      <span className='text-[11px] uppercase tracking-[0.2em] font-medium text-white/50'>URL Path</span>
                      <input
                        type='text'
                        value={page.path}
                        onChange={(event) => updatePage(index, 'path', event.target.value)}
                        placeholder='e.g., /pricing'
                        className={`${sleekInputClass} py-3`}
                      />
                    </label>
                  </div>

                  <label className='mt-6 flex flex-col gap-2'>
                    <span className='text-[11px] uppercase tracking-[0.2em] font-medium text-white/50'>Target Keywords (Comma Separated)</span>
                    <input
                      type='text'
                      value={(page.keywords || []).join(', ')}
                      onChange={(event) => updatePageKeywords(index, event.target.value)}
                      placeholder='e.g., pricing, features, testimonials'
                      className={`${sleekInputClass} py-3`}
                    />
                  </label>
                </div>
              ))}
            </div>

            {/* Form Footer / Save Action */}
            <div className='mt-10 flex flex-col gap-5 rounded-3xl bg-black/20 p-6 border border-white/5 sm:flex-row sm:items-center sm:justify-between'>
              <div className='flex items-start gap-3'>
                <FiCheckCircle className='mt-1 text-emerald-400 shrink-0' />
                <p className={`text-sm leading-relaxed ${builderTheme.textMuted}`}>
                  Saving applies these updates to your assistant instantly. Make sure you check the live preview below!
                </p>
              </div>

              <button
                type='submit'
                disabled={saving}
                className='inline-flex shrink-0 items-center justify-center rounded-full bg-linear-to-r from-cyan-400 via-blue-500 to-indigo-500 px-8 py-3.5 text-sm font-bold text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100'
              >
                {saving ? 'Saving...' : 'Save Assistant'}
              </button>
            </div>
          </section>

          {/* Live Preview Panel */}
          <section className={`rounded-4xl p-10 sm:p-10 shadow-2xl border border-white/5 ${previewTheme.shellClass}`}>
            <div className='mb-4 flex items-center gap-4'>
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br shadow-lg ${previewTheme.accentClass} text-slate-950`}>
                <FiZap className='text-xl' />
              </div>
              <div>
                <h2 className='text-2xl font-semibold'>Live preview</h2>
                <p className={`text-sm mt-1 ${previewTheme.textMuted}`}>Test out your configuration before deploying.</p>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-white/5 bg-black/40 shadow-inner p-3 h-175">
               <AssistantPreview user={previewUser} />
            </div>
          </section>
        </form>
        )}
      </div>
    </div>
  )
}

export default Builder