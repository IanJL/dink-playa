import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabaseClient.js'

// Loads the 3 recurring session rows and keeps them live.
export function useSessions() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refetch = useCallback(async () => {
    const { data, error } = await supabase.from('sessions').select('*').order('day_of_week')
    if (error) {
      setError(error.message)
    } else {
      // Order Tue, Fri, Sun (the club's week) rather than numeric day order.
      const want = ['tue', 'fri', 'sun']
      const sorted = [...(data || [])].sort((a, b) => want.indexOf(a.id) - want.indexOf(b.id))
      setSessions(sorted)
      setError(null)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    refetch()
    const channel = supabase
      .channel('sessions-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sessions' }, refetch)
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [refetch])

  // Optimistically patch one session in local state (host edits feel instant).
  const patchLocal = useCallback((id, patch) => {
    setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)))
  }, [])

  return { sessions, loading, error, refetch, patchLocal }
}
