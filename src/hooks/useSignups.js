import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabaseClient.js'
import { toISO } from '../lib/helpers.js'

// Loads all upcoming signups (today onward) for every session, ordered by
// created_at (= seat order), and keeps them live via realtime.
export function useSignups() {
  const [signups, setSignups] = useState([])
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(async () => {
    const today = toISO(new Date())
    const { data, error } = await supabase
      .from('signups')
      .select('*')
      .gte('session_date', today)
      .order('created_at', { ascending: true })
    if (!error) setSignups(data || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    refetch()
    const channel = supabase
      .channel('signups-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'signups' }, refetch)
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [refetch])

  // signups for one session occurrence, already in seat order
  const forSession = useCallback(
    (sessionId, sessionISO) =>
      signups.filter((s) => s.session_id === sessionId && s.session_date === sessionISO),
    [signups]
  )

  return { signups, loading, refetch, forSession }
}
