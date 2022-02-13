import classes from './App.module.css'
import SimpleStorage from '../contracts/SimpleStorage'
import { useEffect, useState } from 'react'
import { providers } from 'ethers'

function App() {
  const [number, setNumber] = useState(null)
  const [account, setAccount] = useState('')
  const [loading, setLoading] = useState(false)
  const [provider, setProvider] = useState(null)
  const [contract, setContract] = useState(null)

  useEffect(() => {
    if (window.ethereum) {
      const _provider = new providers.Web3Provider(window.ethereum, 'any')
      const _contract = SimpleStorage({
        address: '0xbe9cF0c23A0A0d4c63c6Ce76662Cc0E5D4f7759e',
        provider: _provider,
      })
      setProvider(_provider)
      setContract(_contract)
    }
  }, [])

  const handleLogin = async () => {
    if (window.ethereum) {
      const [_account] = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      setAccount(_account)
    }
  }

  const handleGetNumbers = async () => {
    const number = await contract.retrieve()
    const parsedNumber = number.toNumber()
    setNumber(parsedNumber)
  }

  const handleSubmit = async (e) => {
    setLoading(true)
    try {
      const golosoNumber = e.target.quantity.value
      e.preventDefault()

      const signer = await provider.getSigner()
      const transaction = await contract.populateTransaction.store(golosoNumber)

      const execTransaction = await signer.sendTransaction({ ...transaction })

      await provider.waitForTransaction(execTransaction.hash)
      await handleGetNumbers()
    } catch (error) {
      console.error('LA CAGASTE MI REY', { error })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={classes.container}>
      <section className={classes.loginContainer}>
        {account ? (
          <>
            <p>User: {account}</p>
            <button onClick={handleGetNumbers}>Get numbers</button>
          </>
        ) : (
          <button onClick={handleLogin}>Login with Metamask</button>
        )}
      </section>
      {account && (
        <section>
          <form onSubmit={handleSubmit}>
            <input
              disabled={loading}
              name="quantity"
              placeholder="Set quantity (27, 666, 69, etc)"
            />
          </form>
        </section>
      )}
      <section>
        <p>
          La cantidad de PORONGAS en el orto que tenes:{' '}
          <strong>{loading ? 'Esperate...' : number}</strong>
        </p>
      </section>
    </main>
  )
}

export default App
