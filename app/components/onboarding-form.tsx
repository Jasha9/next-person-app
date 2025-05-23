'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LANGUAGE_NAMES, SupportedLanguage } from '../constants/languages'

type OnboardingData = {
  occupation: string
  organization: string
  preferredLanguage: SupportedLanguage | ''
}

export default function OnboardingForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<OnboardingData>({
    occupation: '',
    organization: '',
    preferredLanguage: '' as const,
  })
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/user/onboarding', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save onboarding data')
      }

      router.push('/')
      router.refresh() // Refresh to update session data
    } catch (error) {
      console.error('Error saving onboarding data:', error)
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-6 bg-white rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Complete Your Profile
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please provide some additional information to get started
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label htmlFor="occupation" className="block text-sm font-medium text-gray-700">
                Occupation
              </label>
              <input
                id="occupation"
                name="occupation"
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="organization" className="block text-sm font-medium text-gray-700">
                Organization
              </label>
              <input
                id="organization"
                name="organization"
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="preferredLanguage" className="block text-sm font-medium text-gray-700">
                Preferred Language
              </label>              <select
                id="preferredLanguage"
                name="preferredLanguage"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.preferredLanguage}
                onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value as SupportedLanguage | '' })}
              >
                <option value="">Select a language</option>
                {Object.entries(LANGUAGE_NAMES).map(([code, name]) => (
                  <option key={code} value={code}>
                    {String(name)}
                  </option>
                ))}
              </select>
            </div>
          </div>          {error && (
            <div className="rounded-md bg-red-50 p-4 mb-4">
              <div className="flex">
                <div className="text-sm text-red-700">
                  {error}
                </div>
              </div>
            </div>
          )}
          
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Complete Onboarding'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
