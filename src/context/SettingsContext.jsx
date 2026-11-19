import React, { createContext, useContext, useState, useEffect } from 'react'
import { settingsService } from '../services/settingsService'
import { initialSettings } from '../data/initialSettings'

const SettingsContext = createContext(null)

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(initialSettings)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      const { data } = await settingsService.getSettings()
      if (data) {
        setSettings(data)
      }
    } catch (e) {
      console.warn('Failed to load settings context:', e)
    } finally {
      setLoading(false)
    }
  }

  const refreshSettings = async () => {
    const { data } = await settingsService.getSettings()
    if (data) setSettings(data)
  }

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (!context) {
    return { settings: initialSettings, loading: false, refreshSettings: () => {} }
  }
  return context
}
