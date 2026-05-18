import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'

function App() {
const [tasks, setTasks] = useState(() => {
  const saved = localStorage.getItem('bubble-tasks')
  return saved ? JSON.parse(saved) : []
})

useEffect(() => {
  localStorage.setItem('bubble-tasks', JSON.stringify(tasks))
}, [tasks])
  const [newTask, setNewTask] = useState('')

  function addTask() {
    if (newTask.trim() === '') return
    setTasks([...tasks, newTask])
    setNewTask('')
  }

  function popTask(indexToRemove) {
const audio = new Audio('/pop.wav')
  audio.play()
  setTasks(tasks.filter((_, index) => index !== indexToRemove)) 
 }

  return (
    <div className="app">
      <h1>Bubble Pop</h1>

      <div className="input-row">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="What needs doing?"
        />
        <button onClick={addTask}>Add</button>
      </div>

      <div className="bubble-container">
  <AnimatePresence>
    {tasks.map((task, index) => (
      <motion.div
  key={task + index}
  className="bubble"
  onClick={() => popTask(index)}
  initial={{ scale: 0, opacity: 0 }}
  animate={{
    scale: 1,
    opacity: 1,
    y: [0, -10, 0],
  }}
  exit={{ scale: 1.5, opacity: 0 }}
  transition={{
    scale: { duration: 0.3, ease: "easeOut" },
    opacity: { duration: 0.3 },
    y: {
      duration: 3 + (index % 3),
      repeat: Infinity,
      ease: "easeInOut",
    },
  }}
>
  {task}
</motion.div>
    ))}
  </AnimatePresence>
</div>
    </div>
  )
}

export default App
