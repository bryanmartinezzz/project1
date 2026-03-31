import './App.css'
import { HandWrittenTitle } from './components/ui/hand-writing-text'

const OPEN_BETS = [
  {
    id: 0,
    metric: 'Lose 5 lbs by June 1st',
    stake: '0.05 ETH',
    deadline: 'Jun 1, 2026',
    creator: '0x1a2b...3c4d',
    status: 'Pending',
  },
  {
    id: 1,
    metric: 'Run a 5K in under 25 minutes',
    stake: '0.10 ETH',
    deadline: 'May 15, 2026',
    creator: '0x9e8f...7a6b',
    status: 'Active',
  },
  {
    id: 2,
    metric: 'Read 10 books this quarter',
    stake: '0.02 ETH',
    deadline: 'Jun 30, 2026',
    creator: '0xabc1...def2',
    status: 'Pending',
  },
]

const STEPS = [
  {
    icon: '✦',
    title: 'Create a Bet',
    desc: 'Define your personal goal, set a deadline, stake ETH, and name a trusted verifier.',
  },
  {
    icon: '⇄',
    title: 'Find a Challenger',
    desc: 'A friend matches your stake and takes the other side — they bet you won\'t make it.',
  },
  {
    icon: '◎',
    title: 'Get Settled',
    desc: 'Your verifier reviews the proof and the contract auto-pays the winner. No middlemen.',
  },
]

function BetCard({ bet }) {
  return (
    <div className="bet-card">
      <div className="bet-status" data-status={bet.status.toLowerCase()}>
        {bet.status}
      </div>
      <p className="bet-metric">{bet.metric}</p>
      <div className="bet-meta">
        <span className="bet-stake">{bet.stake}</span>
        <span className="bet-deadline">Due {bet.deadline}</span>
      </div>
      <div className="bet-creator">by {bet.creator}</div>
      <button className="bet-accept-btn">
        {bet.status === 'Pending' ? 'Accept Bet' : 'View Details'}
      </button>
    </div>
  )
}

function App() {
  return (
    <>
      <nav className="navbar">
        <span className="nav-logo">StakeYourself</span>
        <button className="connect-btn">Connect Wallet</button>
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
          <button className="btn-primary">Create a Bet</button>
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
            <span className="stat-value">142</span>
            <span className="stat-label">Active Bets</span>
          </div>
          <div className="stat">
            <span className="stat-value">38.4 ETH</span>
            <span className="stat-label">Total Staked</span>
          </div>
          <div className="stat">
            <span className="stat-value">391</span>
            <span className="stat-label">Settled</span>
          </div>
        </div>

        <section id="open-bets">
          <h2>Open Bets</h2>
          <p className="section-sub">Pick a side. Match the stake. Let the best person win.</p>
          <div className="bets-grid">
            {OPEN_BETS.map((bet) => (
              <BetCard key={bet.id} bet={bet} />
            ))}
          </div>
        </section>

        <div id="spacer" />
      </div>
    </>
  )
}

export default App
