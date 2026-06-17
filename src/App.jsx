import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase, isConfigured } from './supabaseClient.js'
import { palette } from './lib/palettes.js'
import { CLUB_NAME, LOCATION, MONTHS, DAY_SHORT, DAY_FULL } from './lib/config.js'
import {
  sessionDate,
  sessionTimes,
  isOverrideActive,
  toISO,
  fmtTime,
  daysUntil,
  nextFreeNum,
} from './lib/helpers.js'
import { deriveSeating } from './lib/seating.js'

import { useIdentity } from './hooks/useIdentity.js'
import { useSessions } from './hooks/useSessions.js'
import { useSignups } from './hooks/useSignups.js'
import { useMessages } from './hooks/useMessages.js'

import Header from './components/Header.jsx'
import WeekCalendar from './components/WeekCalendar.jsx'
import Banner from './components/Banner.jsx'
import GameCard from './components/GameCard.jsx'
import HostControls from './components/HostControls.jsx'
import AddCourtPrompt from './components/AddCourtPrompt.jsx'
import Courts from './components/Courts.jsx'
import Waitlist from './components/Waitlist.jsx'
import SignupBar from './components/SignupBar.jsx'
import GearModal from './components/GearModal.jsx'
import ChatModal from './components/ChatModal.jsx'
import SetupScreen from './components/SetupScreen.jsx'

export default function App() {
  const pal = palette()
  const colors = pal.colors
  const accent = pal.accent

  const { uid, name, setName } = useIdentity()
  const { sessions, loading: sessionsLoading, error: sessionsError, refetch: refetchSessions, patchLocal } = useSessions()
  const { forSession: signupsFor } = useSignups()
  const { forSession: messagesFor, countFor: msgCount } = useMessages()

  const [selectedId, setSelectedId] = useState(null)
  const [hostView, setHostView] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [pending, setPending] = useState(null) // name awaiting gear choice
  const [pendingBring, setPendingBring] = useState([])
  const [status, setStatus] = useState(null)
  const [chatOpenId, setChatOpenId] = useState(null)
  const statusTimer = useRef(null)

  // Prefill the signup name once we know this device's name.
  useEffect(() => {
    if (name && !nameInput) setNameInput(name)
  }, [name]) // eslint-disable-line react-hooks/exhaustive-deps

  // Default to the soonest upcoming session once sessions load.
  useEffect(() => {
    if (!selectedId && sessions.length) {
      const soonest = [...sessions].sort(
        (a, b) => daysUntil(a.day_of_week) - daysUntil(b.day_of_week)
      )[0]
      setSelectedId(soonest.id)
    }
  }, [sessions, selectedId])

  // Tidy up: once a one-off override's date has passed, clear it in the database
  // so the session cleanly reverts to its regular weekday + time.
  useEffect(() => {
    sessions.forEach((s) => {
      const expired = s.override_date && !isOverrideActive(s)
      if (expired) {
        supabase
          .from('sessions')
          .update({ override_date: null, override_start_time: null, override_end_time: null })
          .eq('id', s.id)
          .then(() => {})
      }
    })
  }, [sessions])

  const flash = useCallback((kind, msg) => {
    setStatus({ kind, msg })
    clearTimeout(statusTimer.current)
    statusTimer.current = setTimeout(() => setStatus(null), 6000)
  }, [])

  // ---- Setup / loading gates ----
  if (!isConfigured) return <SetupScreen reason="config" />
  if (sessionsError) return <SetupScreen reason="db" />
  if (sessionsLoading && !sessions.length) {
    return <CenterMsg>Loading…</CenterMsg>
  }
  if (!sessions.length) return <SetupScreen reason="db" />

  // ---- Derive everything for the selected session ----
  const selSession = sessions.find((s) => s.id === selectedId) || sessions[0]
  const selISO = toISO(sessionDate(selSession))
  const selSignups = signupsFor(selSession.id, selISO)
  const seat = deriveSeating(selSignups, selSession, colors)
  const { cap, courts, courtNums, confirmedCount, waitlist, courtBlocks, waitlistRows } = seat
  const maxCourts = selSession.max_courts
  const spots = selSession.spots_per_court

  const selDate = sessionDate(selSession)
  const selTimes = sessionTimes(selSession)
  const gameWhen = `${DAY_FULL[selSession.day_of_week]}, ${MONTHS[selDate.getMonth()]} ${selDate.getDate()} · ${fmtTime(
    selTimes.start,
    selTimes.end
  )}`

  const showAddCourt = hostView && courts < maxCourts && waitlist.length >= 1
  const promoteCount = Math.min(waitlist.length, spots)

  const waitlistHint =
    !hostView && waitlist.length >= 2 && courts < maxCourts
      ? 'The host can open another court to move everyone up.'
      : courts >= maxCourts && waitlist.length
        ? `All ${maxCourts} courts are full — spots open up in waitlist order.`
        : 'If someone drops out, the next person moves up automatically.'

  // ---- Calendar helpers ----
  const signedCountFor = (s) => signupsFor(s.id, toISO(sessionDate(s))).length

  // ---- Session DB helper (optimistic) ----
  const updateSession = async (patch) => {
    patchLocal(selSession.id, patch)
    const { error } = await supabase.from('sessions').update(patch).eq('id', selSession.id)
    if (error) {
      flash('info', 'Could not save change — check your connection.')
      refetchSessions()
    }
  }

  // ---- Signup flow ----
  const startAdd = () => {
    const n = (nameInput || '').trim()
    if (!n) return
    const exists = selSignups.some((p) => p.display_name.toLowerCase() === n.toLowerCase())
    if (exists) {
      setNameInput('')
      flash('info', `"${n}" is already on this session.`)
      return
    }
    setPending(n)
    setPendingBring([])
    setNameInput('')
  }

  const toggleBring = (label) => {
    setPendingBring((cur) => (cur.indexOf(label) >= 0 ? cur.filter((x) => x !== label) : [...cur, label]))
  }

  const cancelBring = () => {
    setNameInput((v) => v || pending || '')
    setPending(null)
    setPendingBring([])
  }

  const finalizeAdd = async (list) => {
    const n = pending
    if (!n) return
    const bringing = Array.isArray(list) ? list : pendingBring
    const idx = selSignups.length // seat position for this new person
    const { error } = await supabase.from('signups').insert({
      session_id: selSession.id,
      session_date: selISO,
      user_id: uid,
      display_name: n,
      bringing,
    })
    setPending(null)
    setPendingBring([])
    if (error) {
      flash('info', 'Could not add you — please try again.')
      return
    }
    if (!name) setName(n)
    if (idx < cap) {
      const courtNo = courtNums[Math.floor(idx / spots)]
      flash('confirmed', `You're in, ${n.split(' ')[0]} — Court ${courtNo}! 🎾`)
    } else {
      flash('waitlist', `${n.split(' ')[0]}, you're #${idx - cap + 1} on the waitlist.`)
    }
  }

  const removePlayer = async (signupId) => {
    const index = selSignups.findIndex((p) => p.id === signupId)
    const wasConfirmed = index > -1 && index < cap
    const promoted = wasConfirmed && selSignups.length > cap ? selSignups[cap] : null
    const { error } = await supabase.from('signups').delete().eq('id', signupId)
    if (error) {
      flash('info', 'Could not remove — please try again.')
      return
    }
    if (promoted) flash('confirmed', `${promoted.display_name.split(' ')[0]} moved up from the waitlist! 🎉`)
  }

  const addCourt = async () => {
    if (courts >= maxCourts) return
    const nums = courtNums.slice()
    nums.push(nextFreeNum(nums))
    await updateSession({ court_nums: nums })
    flash('confirmed', `Court ${nums[nums.length - 1]} is open — waitlisters moved up! 🙌`)
  }

  const resetSession = async () => {
    await supabase.from('signups').delete().eq('session_id', selSession.id).eq('session_date', selISO)
    await updateSession({ court_nums: [1] })
    setStatus(null)
  }

  // ---- Host edits ----
  const setCourts = (n) => {
    const target = Math.max(1, Math.min(maxCourts, n))
    const nums = courtNums.slice()
    while (nums.length < target) nums.push(nextFreeNum(nums))
    while (nums.length > target) nums.pop()
    updateSession({ court_nums: nums })
  }
  const setCourtNum = (idx, value) => {
    const n = parseInt(value, 10)
    const nums = courtNums.slice()
    if (!isNaN(n)) nums[idx] = Math.max(1, Math.min(99, n))
    updateSession({ court_nums: nums })
  }
  // One-off edits for the NEXT occurrence. They auto-expire once the date passes.
  // Changing only the time still anchors the override to the upcoming date so it
  // expires on schedule. Resetting clears the whole one-off and reverts to the
  // regular day + time.
  const setDate = (value) => {
    if (value) updateSession({ override_date: value })
    else updateSession({ override_date: null, override_start_time: null, override_end_time: null })
  }
  const clearOverride = () =>
    updateSession({ override_date: null, override_start_time: null, override_end_time: null })
  const setStart = (value) => {
    if (!value) return
    const patch = { override_start_time: value }
    if (!isOverrideActive(selSession)) patch.override_date = selISO
    updateSession(patch)
  }
  const setEnd = (value) => {
    if (!value) return
    const patch = { override_end_time: value }
    if (!isOverrideActive(selSession)) patch.override_date = selISO
    updateSession(patch)
  }

  // ---- Chat ----
  const chatSession = chatOpenId ? sessions.find((s) => s.id === chatOpenId) : null
  const chatMessages = chatOpenId ? messagesFor(chatOpenId) : []

  const openChat = (id) => {
    setSelectedId(id)
    setChatOpenId(id)
    setStatus(null)
  }
  const sendMsg = async (text) => {
    if (!name) return
    const { error } = await supabase.from('messages').insert({
      session_id: chatOpenId,
      user_id: uid,
      display_name: name,
      body: text,
    })
    if (error) flash('info', 'Message failed to send.')
  }
  const joinChat = (n) => setName(n)

  // ---- Render ----
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#efe6d4',
        display: 'flex',
        justifyContent: 'center',
        padding: '30px 16px 90px',
        color: '#1a1a1a',
      }}
    >
      <div style={{ width: '100%', maxWidth: 480 }}>
        <Header
          clubName={CLUB_NAME}
          accent={accent}
          bandColors={colors}
          hostView={hostView}
          onToggleHost={() => setHostView((v) => !v)}
        />

        <WeekCalendar
          sessions={sessions}
          selectedId={selSession.id}
          accent={accent}
          signedCountFor={signedCountFor}
          msgCountFor={msgCount}
          onSelect={(id) => {
            setSelectedId(id)
            setStatus(null)
          }}
          onOpenChat={openChat}
        />

        <Banner status={status} onDismiss={() => setStatus(null)} />

        <GameCard
          gameWhen={gameWhen}
          location={LOCATION}
          accent={accent}
          courts={courts}
          confirmedCount={confirmedCount}
          cap={cap}
          totalSignedUp={selSignups.length}
          fillPct={(cap ? Math.min(100, (confirmedCount / cap) * 100) : 0) + '%'}
          bandColors={colors}
        />

        {hostView && (
          <HostControls
            sessionFull={DAY_FULL[selSession.day_of_week]}
            sessionDayShort={DAY_SHORT[selSession.day_of_week]}
            selDateISO={selISO}
            dateOverridden={isOverrideActive(selSession)}
            onDateChange={(e) => setDate(e.target.value)}
            onResetDate={clearOverride}
            startTime={selTimes.start}
            endTime={selTimes.end}
            onStartChange={(e) => setStart(e.target.value)}
            onEndChange={(e) => setEnd(e.target.value)}
            courts={courts}
            maxCourts={maxCourts}
            onCourtDec={() => setCourts(courts - 1)}
            onCourtInc={() => setCourts(courts + 1)}
            courtNums={courtNums}
            onCourtNumChange={setCourtNum}
            onReset={resetSession}
            accent={accent}
          />
        )}

        {showAddCourt && (
          <AddCourtPrompt
            waitCount={waitlist.length}
            nextCourt={courts + 1}
            promoteCount={promoteCount}
            bandColors={colors}
            accent={accent}
            onAddCourt={addCourt}
          />
        )}

        <Courts courtBlocks={courtBlocks} accent={accent} onRemove={removePlayer} />

        <Waitlist rows={waitlistRows} count={waitlist.length} hint={waitlistHint} accent={accent} onRemove={removePlayer} />

        <SignupBar value={nameInput} onChange={setNameInput} onAdd={startAdd} accent={accent} />

        <div style={{ textAlign: 'center', fontSize: 11.5, fontWeight: 600, opacity: 0.4, marginTop: 18, letterSpacing: '.3px' }}>
          Pick a day above · Tap × to drop out · Tap the chat icon on a day to message the group
        </div>
      </div>

      {pending && (
        <GearModal
          pendingFirst={pending.split(' ')[0]}
          willConfirm={selSignups.length < cap}
          selected={pendingBring}
          bandColors={colors}
          accent={accent}
          onToggle={toggleBring}
          onConfirm={() => finalizeAdd()}
          onSkip={() => finalizeAdd([])}
          onCancel={cancelBring}
        />
      )}

      {chatOpenId && (
        <ChatModal
          chatDay={chatSession ? DAY_FULL[chatSession.day_of_week] : ''}
          messages={chatMessages}
          meName={name}
          accent={accent}
          bandColors={colors}
          onSend={sendMsg}
          onJoin={joinChat}
          onClose={() => setChatOpenId(null)}
        />
      )}
    </div>
  )
}

function CenterMsg({ children }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Hanken Grotesk'", fontWeight: 600, opacity: 0.6 }}>
      {children}
    </div>
  )
}
