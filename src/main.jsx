import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'framer-motion'
import './styles/tokens.css'
import './styles/base.css'
import './styles/components.css'
import { AppProvider } from './hooks/useAppState.jsx'
import { armAudio } from './lib/sounds.js'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import App from './App.jsx'

armAudio()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <MotionConfig reducedMotion="user">
        <AppProvider>
          <App />
        </AppProvider>
      </MotionConfig>
    </ErrorBoundary>
  </StrictMode>,
)
