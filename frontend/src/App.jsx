import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import './App.css'
import { HandWrittenTitle } from './components/ui/hand-writing-text'
import { CreateBetModal } from './components/ui/CreateBetModal'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './contract'

const STEPS = [
  {
    icon: '✦',
    title: 'Create a Bet',
    desc: 'Define your personal goal, set a deadline, stake ETH, and name a trusted verifier.',
  },
  {
    icon: '⇄',
    title: 'Find a Challenger',
    desc: "A friend matches your stake and takes the other side — they bet you won't make it.",
  },
  {
    icon: '◎',
    title: 'Get Settled',
    desc: 'Your verifier reviews the proof and the contract auto-pays the winner. No middlemen.',
  },
]

const STATUS = ['Pending', 'Active', 'Settled', 'Cancelled']

function BetCard({ bet, account, onAccept }) {
  const stake = ethers.formatEther(bet.stake)
  const deadline = new Date(Number(bet.deadline) * 1000).toLocaleDateString()
  const status = STATUS[Number(bet.status)]
  const isCreator = account?.toLowerCase() === bet.creator.toLowerCase()

  return (
    <div className="bet-card">
      <div className="bet-status" data-status={status.toLowerCase()}>
        {status}
      </div>
      <p className="bet-metric">{bet.metric}</p>
      <div className="bet-meta">
        <span className="bet-stake">{stake} ETH</span>
        <span className="bet-deadline">Due {deadline}</span>
      </div>
      <div className="bet-creator">by {bet.creator.slice(0, 6)}...{bet.creator.slice(-4)}</div>
      {status === 'Pending' && !isCreator && (
        <button className="bet-accept-btn" onClick={() => onAccept(bet.id, stake)}>
          Accept Bet
        </button>
      )}
      {status === 'Active' && (
        <button className="bet-accept-btn">View Details</button>
      )}
    </div>
  )
}

function App() {
  const [account, setAccount] = useState(null)
  const [bets, setBets] = useState([])
  const [showModal, setShowModal] = useState(false)

  async function connectWallet() {
    if (!window.ethereum) return alert('Please install MetaMask!')
    const provider = new ethers.BrowserProvider(window.ethereum)
    const accounts = await provider.send('eth_requestAccounts', [])
    setAccount(accounts[0])
  }

  async function loadBets() {
    try {
      const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545')
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)
      const count = await contract.betCount()
      const loaded = []
      for (let i = 0; i < Number(count); i++) {
        const bet = await contract.getBet(i)
        loaded.push({
          id: i,
          creator: bet[0],
          challenger: bet[1],
          verifier: bet[2],
          stake: bet[3],
          metric: bet[4],
          deadline: bet[5],
          status: bet[6],
          winner: bet[7],
        })
      }
      setBets(loaded)
    } catch (err) {
      console.error('Failed to load bets:', err)
    }
  }

  async function acceptBet(betId, stake) {
    if (!account) return alert('Connect your wallet first!')
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
    const tx = await contract.acceptBet(betId, { value: ethers.parseEther(stake) })
    await tx.wait()
    loadBets()
  }

  useEffect(() => {
    loadBets()
  }, [])

  const activeBets = bets.filter(b => Number(b.status) === 1).length
  const totalStaked = bets.reduce((sum, b) => {
    try { return sum + Number(ethers.formatEther(b.stake)) } catch { return sum }
  }, 0)
  const settled = bets.filter(b => Number(b.status) === 2).length

  return (
    <>
      <nav className="navbar">
        <span className="nav-logo">StakeYourself</span>
        <button className="connect-btn" onClick={connectWallet}>
          {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Connect Wallet'}
        </button>
      </nav>

      <section id="hero">
        <div className="ticks" />
        <h1>
          <HandWrittenTitle title="Bet on Yourself." subtitle="Win or Lose." />
        </h1>
        <p className="hero-sub">
          Challenge a friend on a personal goal — lose weight, run faster, read more.
          Stake ETH, pick a verifier, and let the contract settle it automatically.
        </p>
        <div className="hero-actions">
          <button className="btn-primary" onClick={() => setShowModal(true)}>Create a Bet</button>
          <button className="btn-secondary">Browse Open Bets</button>
        </div>
        <div className="ticks" />
      </section>

      <div className="page-content">
        <div id="next-steps">
          {STEPS.map((step, i) => (
            <div key={i} className={i === 0 ? 'step' : 'step step-border'}>
              <div className="step-icon">{step.icon}</div>
              <h2>{step.title}</h2>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>

        <div id="stats-bar">
          <div className="stat">
            <span className="stat-value">{activeBets}</span>
            <span className="stat-label">Active Bets</span>
          </div>
          <div className="stat">
            <span className="stat-value">{totalStaked.toFixed(2)} ETH</span>
            <span className="stat-label">Total Staked</span>
          </div>
          <div className="stat">
            <span className="stat-value">{settled}</span>
            <span className="stat-label">Settled</span>
          </div>
        </div>

        <section id="open-bets">
          <h2>Open Bets</h2>
          <p className="section-sub">Pick a side. Match the stake. Let the best person win.</p>
          <div className="bets-grid">
            {bets.length === 0 ? (
              <p style={{ color: 'var(--text)' }}>No bets yet. Create the first one!</p>
            ) : (
              bets.map((bet) => (
                <BetCard key={bet.id} bet={bet} account={account} onAccept={acceptBet} />
              ))
            )}
          </div>
        </section>

        <div id="spacer" />
      </div>

      {showModal && (
        <CreateBetModal
          onClose={() => setShowModal(false)}
          onCreated={loadBets}
        />
      )}
    </>
  )
}

export default App
