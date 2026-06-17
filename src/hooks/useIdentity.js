import { useState, useCallback } from 'react'

// No-login identity: a stable per-device id + a display name the person types once.
// Both live in localStorage so this phone is "you" across visits.

const UID_KEY = 'dink_uid'
const NAME_KEY = 'dink_name'

function getOrCreateUid() {
  let uid = localStorage.getItem(UID_KEY)
  if (!uid) {
    uid =
      (crypto.randomUUID && crypto.randomUUID()) ||
      'u' + Date.now() + Math.random().toString(36).slice(2)
    localStorage.setItem(UID_KEY, uid)
  }
  return uid
}

export function useIdentity() {
  const [uid] = useState(getOrCreateUid)
  const [name, setNameState] = useState(() => localStorage.getItem(NAME_KEY) || '')

  const setName = useCallback((n) => {
    const v = (n || '').trim()
    if (!v) return
    localStorage.setItem(NAME_KEY, v)
    setNameState(v)
  }, [])

  return { uid, name, setName }
}
