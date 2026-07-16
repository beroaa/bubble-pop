import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppState, useDispatch } from '../../hooks/useAppState.jsx'
import { useSound } from '../../hooks/useSound.js'
import { selectVisibleClients, selectCurrentAccount, selectIsOperator, selectAgents } from '../../engine/selectors.js'
import { clientAdd, clientUpdate, clientSetStatus, uiCloseModal } from '../../engine/actions.js'
import Modal from '../Modal.jsx'
import Icon from '../Icon.jsx'
import { SPRING } from '../../motion/tokens.js'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'lead', label: 'Leads' },
  { id: 'secured', label: 'Secured' },
  { id: 'live', label: 'Live' },
  { id: 'churned', label: 'Churned' },
]

const STATUS_META = {
  lead: { label: 'Lead', dot: 'var(--text-3)' },
  secured: { label: 'Secured — menu in design', dot: 'var(--info)' },
  live: { label: 'Live', dot: 'var(--positive)' },
  churned: { label: 'Churned', dot: 'var(--negative)' },
}

export default function ClientsView() {
  const state = useAppState()
  const dispatch = useDispatch()
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [openId, setOpenId] = useState(null)
  const clients = selectVisibleClients(state)
  const globalAdd = state.ui.modal?.kind === 'client-add'
  const [localAdd, setLocalAdd] = useState(false)
  const adding = globalAdd || localAdd

  const shown = useMemo(() => {
    const q = search.trim().toLowerCase()
    return clients
      .filter((c) => filter === 'all' || c.status === filter)
      .filter((c) => !q || c.name.toLowerCase().includes(q) || c.contact.toLowerCase().includes(q))
  }, [clients, filter, search])

  const open = openId ? state.clients[openId] : null

  function closeAdd() {
    setLocalAdd(false)
    if (globalAdd) dispatch(uiCloseModal())
  }

  return (
    <div className="view stack-4">
      <div className="section-head">
        <h1 className="display page-title">
          Clients <span className="chip num">{clients.length}</span>
        </h1>
        <motion.button type="button" className="btn btn-primary btn-sm" whileTap={{ scale: 0.96 }} onClick={() => setLocalAdd(true)}>
          <Icon name="plus" size={16} /> Add
        </motion.button>
      </div>

      <div className="chip-row" role="tablist" aria-label="Filter clients">
        {FILTERS.map((f) => (
          <button
            key={f.id} type="button" role="tab" aria-selected={filter === f.id}
            className={`filter-chip ${filter === f.id ? 'chip-active' : ''}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <input className="search-input" type="search" placeholder="Search clients…" value={search} onChange={(e) => setSearch(e.target.value)} />

      {shown.length === 0 ? (
        <div className="empty-state">
          <p className="h3">No clients {filter !== 'all' ? `in ${filter}` : 'yet'}</p>
          <p className="small dim">Secure your first client to start ranking up.</p>
          <button type="button" className="btn btn-primary" onClick={() => setLocalAdd(true)}>Add client</button>
        </div>
      ) : (
        <div className="card list-card">
          <AnimatePresence initial={false}>
            {shown.map((c) => {
              const meta = STATUS_META[c.status]
              const agent = state.accounts[c.agentId]
              return (
                <motion.button
                  key={c.id}
                  type="button"
                  className="client-row"
                  layout
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                  transition={{ ...SPRING.soft, opacity: { duration: 0.2 } }}
                  onClick={() => setOpenId(c.id)}
                >
                  <span className="avatar" aria-hidden="true">{initials(c.name)}</span>
                  <span className="client-main">
                    <span className="h3">{c.name}</span>
                    <span className="small dim client-sub">
                      <i className="dot" style={{ background: meta.dot }} />
                      {meta.label}
                      {agent && <> · by {agent.displayName}</>}
                    </span>
                  </span>
                  <span className="client-side">
                    {c.securedAt && <time className="micro dim num">{new Date(c.securedAt).toLocaleDateString()}</time>}
                    <Icon name="chevron-right" size={16} className="dim" />
                  </span>
                </motion.button>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      <ClientSheet client={open} onClose={() => setOpenId(null)} />
      <AddClientSheet open={adding} onClose={closeAdd} />
    </div>
  )
}

function initials(name) {
  return name.split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('')
}

function ClientSheet({ client, onClose }) {
  const state = useAppState()
  const dispatch = useDispatch()
  const sfx = useSound()
  const isOperator = selectIsOperator(state)
  const agents = selectAgents(state)
  const [confirmChurn, setConfirmChurn] = useState(false)
  const [form, setForm] = useState(null)
  const id = client?.id

  const current = form && form.id === id ? form : client ? {
    id, name: client.name, contact: client.contact, notes: client.notes,
    menuUrl: client.menuUrl, planValue: client.commission.planValue, agentId: client.agentId,
  } : null

  function save() {
    dispatch(clientUpdate(id, {
      name: current.name, contact: current.contact, notes: current.notes, menuUrl: current.menuUrl,
      ...(isOperator ? { planValue: current.planValue, agentId: current.agentId } : {}),
    }))
    onClose()
    setForm(null)
  }

  function setStatus(status) {
    if (status === 'churned') { setConfirmChurn(true); return }
    if (status === 'secured' || status === 'live') sfx.uiClick()
    dispatch(clientSetStatus(id, status))
  }

  if (!client) return null
  const commission = client.commission
  const amount = commission.rate * commission.planValue

  return (
    <>
      <Modal open={!!client && !confirmChurn} title={client.name} onClose={() => { onClose(); setForm(null) }}>
        <div className="stack">
          <div className="seg-control" role="tablist" aria-label="Menu status">
            {['lead', 'secured', 'live'].map((s) => (
              <button
                key={s} type="button" role="tab" aria-selected={client.status === s}
                className={`seg ${client.status === s ? 'seg-active' : ''}`}
                onClick={() => setStatus(s)}
                disabled={client.status === 'churned'}
              >
                {s === 'lead' ? 'Lead' : s === 'secured' ? 'Secured' : 'Live'}
              </button>
            ))}
          </div>
          {client.status === 'churned' && (
            <p className="small negative-text">Churned — <button type="button" className="link" onClick={() => setStatus('secured')}>re-secure</button></p>
          )}

          <label className="field">
            <span className="overline">Restaurant name</span>
            <input value={current.name} onChange={(e) => setForm({ ...current, name: e.target.value })} />
          </label>
          <label className="field">
            <span className="overline">Contact</span>
            <input value={current.contact} placeholder="Phone / Instagram" onChange={(e) => setForm({ ...current, contact: e.target.value })} />
          </label>
          <label className="field">
            <span className="overline">Menu URL</span>
            <input value={current.menuUrl} placeholder="https://…" onChange={(e) => setForm({ ...current, menuUrl: e.target.value })} />
          </label>
          <label className="field">
            <span className="overline">Notes</span>
            <textarea rows={2} value={current.notes} onChange={(e) => setForm({ ...current, notes: e.target.value })} />
          </label>

          {isOperator && (
            <>
              <label className="field">
                <span className="overline">Plan value (monthly $)</span>
                <input type="number" min="0" value={current.planValue} onChange={(e) => setForm({ ...current, planValue: e.target.value })} />
              </label>
              <label className="field">
                <span className="overline">Closer</span>
                <select value={current.agentId} onChange={(e) => setForm({ ...current, agentId: e.target.value })}>
                  {Object.values(state.accounts).filter((a) => !a.deletedAt).map((a) => (
                    <option key={a.id} value={a.id}>{a.displayName}{a.role === 'operator' ? ' (operator)' : ''}</option>
                  ))}
                </select>
              </label>
            </>
          )}

          {client.securedAt && (
            <div className="meta-list small">
              <div><span className="dim">Secured</span><span className="num">{new Date(client.securedAt).toLocaleDateString()}</span></div>
              <div>
                <span className="dim">Commission</span>
                <span className="num">
                  {commission.status === 'void' ? 'void' : commission.planValue === 0 ? 'awaiting pricing' : `$${amount.toLocaleString()} · ${commission.status}`}
                </span>
              </div>
              {isOperator && commission.status === 'pending' && commission.planValue > 0 && (
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => dispatch({ type: 'COMMISSION_MARK_PAID', payload: { clientId: id } })}>
                  Mark commission paid
                </button>
              )}
            </div>
          )}

          <div className="row gap-3 sheet-footer">
            <button type="button" className="btn btn-ghost btn-danger-ghost" onClick={() => setConfirmChurn(true)} disabled={client.status === 'churned'}>
              Mark churned
            </button>
            <button type="button" className="btn btn-primary grow" onClick={save}>Save</button>
          </div>
          {agents.length === 0 && !isOperator ? null : null}
        </div>
      </Modal>

      <Modal open={confirmChurn} title="Mark churned?" onClose={() => setConfirmChurn(false)}>
        <p className="small dim">Their menu goes offline in spirit, pending commission is voided, and your rank recalculates. Quota is not refunded.</p>
        <div className="row gap-3 sheet-footer">
          <button type="button" className="btn btn-ghost" onClick={() => setConfirmChurn(false)}>Keep</button>
          <button
            type="button" className="btn btn-danger grow"
            onClick={() => { dispatch(clientSetStatus(id, 'churned')); setConfirmChurn(false); onClose() }}
          >
            Churn
          </button>
        </div>
      </Modal>
    </>
  )
}

function AddClientSheet({ open, onClose }) {
  const state = useAppState()
  const dispatch = useDispatch()
  const isOperator = selectIsOperator(state)
  const me = selectCurrentAccount(state)
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [agentId, setAgentId] = useState(null)
  const [secured, setSecured] = useState(true)

  function submit(e) {
    e.preventDefault()
    if (!name.trim()) return
    dispatch(clientAdd({
      name, contact,
      status: secured ? 'secured' : 'lead',
      agentId: isOperator ? (agentId ?? me.id) : undefined,
    }))
    setName(''); setContact(''); setSecured(true); setAgentId(null)
    onClose()
  }

  return (
    <Modal open={open} title="Add client" onClose={onClose}>
      <form className="stack" onSubmit={submit}>
        <label className="field">
          <span className="overline">Restaurant name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Al-Baik Downtown" />
        </label>
        <label className="field">
          <span className="overline">Contact (optional)</span>
          <input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Phone / Instagram" />
        </label>
        {isOperator && (
          <label className="field">
            <span className="overline">Closer</span>
            <select value={agentId ?? me.id} onChange={(e) => setAgentId(e.target.value)}>
              {Object.values(state.accounts).filter((a) => !a.deletedAt && !a.disabled).map((a) => (
                <option key={a.id} value={a.id}>{a.displayName}{a.role === 'operator' ? ' (you)' : ''}</option>
              ))}
            </select>
          </label>
        )}
        <label className="check-row">
          <input type="checkbox" checked={secured} onChange={(e) => setSecured(e.target.checked)} />
          <span>Secured — count toward rank <span className="dim">(uncheck for a lead)</span></span>
        </label>
        <motion.button type="submit" className="btn btn-primary btn-block" whileTap={{ scale: 0.97 }} disabled={!name.trim()}>
          {secured ? 'Secure client' : 'Save lead'}
        </motion.button>
      </form>
    </Modal>
  )
}
