// Bubble Pop, rebuilt on the store: pops feed the XP loop (+10, first 10/day).
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppState, useDispatch } from '../../hooks/useAppState.jsx'
import { useSound } from '../../hooks/useSound.js'
import { useFX } from '../../motion/useFX.js'
import { selectCurrentAccount, selectTasks, selectPoppedToday } from '../../engine/selectors.js'
import { localDay } from '../../engine/xp.js'
import { taskAdd, taskPop } from '../../engine/actions.js'
import Bubble from './Bubble.jsx'

export default function TasksView() {
  const state = useAppState()
  const dispatch = useDispatch()
  const sfx = useSound()
  const { burst } = useFX()
  const [text, setText] = useState('')
  const [today] = useState(() => localDay(Date.now()))
  const me = selectCurrentAccount(state)
  const tasks = selectTasks(state, me.id)
  const poppedToday = selectPoppedToday(state, me.id, today)

  function add(e) {
    e.preventDefault()
    if (!text.trim()) return
    dispatch(taskAdd(text))
    setText('')
  }

  function pop(id, e) {
    sfx.pop()
    const r = e.currentTarget.getBoundingClientRect()
    burst({ x: r.left + r.width / 2, y: r.top + r.height / 2, count: 8, power: [150, 320], sizePx: [3, 5], ttl: [300, 500] })
    dispatch(taskPop(id))
  }

  return (
    <div className="view stack-4">
      <div className="section-head">
        <h1 className="display page-title">Tasks</h1>
        <span className="chip num">popped today: {poppedToday}</span>
      </div>

      <form className="row gap-2" onSubmit={add}>
        <input className="grow" type="text" value={text} placeholder="What needs doing?" onChange={(e) => setText(e.target.value)} />
        <motion.button type="submit" className="btn btn-primary" whileTap={{ scale: 0.96 }} disabled={!text.trim()}>Add</motion.button>
      </form>

      {tasks.length === 0 ? (
        <div className="empty-state">
          <p className="h3">Nothing floating</p>
          <p className="small dim">Add a task, then pop it for +10 XP. First 10 a day count.</p>
        </div>
      ) : (
        <div className="bubble-field">
          <AnimatePresence>
            {tasks.map((t, i) => (
              <Bubble key={t.id} task={t} index={i} small={tasks.length >= 12} onPop={pop} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
