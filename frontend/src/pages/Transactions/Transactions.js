import React, { useEffect, useState } from 'react'
import api from '../../api'
import TransactionForm from './TransactionForm'
import TableNavigator from '../../components/TableNavigator'

const Transactions = () => {
  const [transactions, setTransactions] = useState([])
  const [editTransactionId, setEditTransactionId] = useState(null)
  const [totalPages, setTotalPages] = useState(1)

  const fetchData = page => {
    api
      .get(`/api/transactions/?page=${page}`)
      .then(response => {
        let data = response.data
        setTransactions(data.results)
        setTotalPages(Math.max(1, Math.ceil(data.count / data.results.length)))
      })
      .catch(error => {
        console.error('Error fetching data:', error)
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
      <TableNavigator totalPages={totalPages} fetchData={fetchData} />
    </div>
  )
}

export default Transactions
