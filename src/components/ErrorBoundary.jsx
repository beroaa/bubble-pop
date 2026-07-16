// Render errors must never strand data: offer reload + raw backup download.
import { Component } from 'react'
import { DOC_KEY, loadRaw } from '../lib/storage.js'
import { downloadText } from '../lib/fileio.js'

export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className="boundary">
        <h1 className="display">Something broke</h1>
        <p className="dim">Your data is safe on this device. Reload, or download a backup first.</p>
        <div className="row gap-3">
          <button type="button" className="btn btn-primary" onClick={() => location.reload()}>Reload</button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => downloadText(`clientos-backup-${Date.now()}.json`, loadRaw(DOC_KEY) ?? '{}')}
          >
            Download backup
          </button>
        </div>
        <pre className="boundary-detail">{String(this.state.error?.stack ?? this.state.error)}</pre>
      </div>
    )
  }
}
