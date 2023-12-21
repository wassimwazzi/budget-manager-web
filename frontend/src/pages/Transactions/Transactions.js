import React, { useEffect, useState } from 'react'
import api from '../../api'
import TransactionForm from './TransactionForm'

const Transactions = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [editTransactionId, setEditTransactionId] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () => {
    api
      .get('/api/transactions')
      .then(response => {
        setTransactions(response.data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching data:', error)
        setLoading(false)
      })
  }

  const handleEdit = transactionId => {
    setEditTransactionId(transactionId)
  }

  const handleFormUpdate = updatedTransaction => {
    // Update transactions list after adding/editing
    if (editTransactionId) {
      const updatedTransactions = transactions.map(transaction =>
        transaction.id === updatedTransaction.id
          ? updatedTransaction
          : transaction
      )
      setTransactions(updatedTransactions)
    } else {
      setTransactions([...transactions, updatedTransaction])
    }
  }

  return (
    <div>
      <h1>Transactions</h1>

      <TransactionForm
        transactionId={editTransactionId}
        onUpdate={handleFormUpdate}
      />

      <table className='table table-striped'>
        <thead>
          <tr>
            <th>Date</th>
            <th>Code</th>
            <th>Description</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Currency</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(transaction => (
            <tr key={transaction.id}>
              <td>{transaction.date}</td>
              <td>{transaction.code}</td>
              <td>{transaction.description}</td>
              <td>{transaction.category.category}</td>
              <td
                style={{ color: transaction.category.income ? 'green' : 'red' }}
              >
                {transaction.amount}
              </td>
              <td>{transaction.currency}</td>
              <td>
                <button
                  onClick={() => handleEdit(transaction.id)}
                  className='btn btn-primary'
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Transactions
