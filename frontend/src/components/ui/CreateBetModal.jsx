import { useState } from 'react'
import { ethers } from 'ethers'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../../contract'

export function CreateBetModal({ onClose, onCreated }) {
  const [metric, setMetric] = useState('')
  const [stake, setStake] = useState('')
  const [deadline, setDeadline] = useState('')
  const [verifier, setVerifier] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleCreate() {
    if (!metric || !stake || !deadline || !verifier) return alert('Fill in all fields!')
    try {
      setLoading(true)
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
      const deadlineTs = Math.floor(new Date(deadline).getTime() / 1000)
      const tx = await contract.createBet(metric, deadlineTs, verifier, {
        value: ethers.parseEther(stake)
      })
      await tx.wait()
      onCreated()
      onClose()
    } catch (err) {
      console.error(err)
      alert('Transaction failed — check the console for details.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
    }}>
      <div style={{
        background: 'var(--background)', border: '1px solid var(--border)',
        borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '480px',
        display: 'flex', flexDirection: 'column', gap: '16px'
      }}>
        <h2 style={{ margin: 0, color: 'var(--foreground)' }}>Create a Bet</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '13px', color: 'var(--muted-foreground)' }}>Your goal</label>
          <input
            placeholder="e.g. Lose 5 lbs by June 1st"
            value={metric}
            onChange={e => setMetric(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '13px', color: 'var(--muted-foreground)' }}>Stake (ETH)</label>
          <input
            placeholder="e.g. 0.05"
            value={stake}
            onChange={e => setStake(e.target.value)}
            type="number"
            step="0.01"
            style={inputStyle}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '13px', color: 'var(--muted-foreground)' }}>Deadline</label>
          <input
            type="date"
            value={deadline}
            onChange={e => setDeadline(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '13px', color: 'var(--muted-foreground)' }}>Verifier wallet address</label>
          <input
            placeholder="0x..."
            value={verifier}
            onChange={e => setVerifier(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          <button className="btn-secondary" onClick={onClose} style={{ flex: 1 }}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleCreate} disabled={loading} style={{ flex: 1 }}>
            {loading ? 'Creating...' : 'Create Bet'}
          </button>
        </div>
      </div>
    </div>
  )
}

const inputStyle = {
  background: 'var(--input)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  padding: '10px 14px',
  color: 'var(--foreground)',
  fontSize: '14px',
  fontFamily: 'inherit',
  width: '100%',
  boxSizing: 'border-box',
}
