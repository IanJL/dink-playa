import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabaseClient.js'

// Loads all chat messages (per session_id) and keeps them live.
export function useMessages() {
  const [messages, setMessages] = useState([])

  const refetch = useCallback(async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true })
    if (!error) setMessages(data || [])
  }, [])

  useEffect(() => {
    refetch()
    const channel = supabase
      .channel('messages-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, refetch)
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [refetch])

  const forSession = useCallback(
    (sessionId) => messages.filter((m) => m.session_id === sessionId),
    [messages]
  )

  const countFor = useCallback(
    (sessionId) => messages.reduce((n, m) => (m.session_id === sessionId ? n + 1 : n), 0),
    [messages]
  )

  return { messages, refetch, forSession, countFor }
}
