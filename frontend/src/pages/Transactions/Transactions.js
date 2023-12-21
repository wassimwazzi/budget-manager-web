import React, { useEffect, useState } from 'react'
import api from '../../api'
import TransactionForm from './TransactionForm'
import TableNavigator from '../../components/table/TableNavigator'
import Table from '../../components/table/Table'

const Transactions = () => {
  const [transactions, setTransactions] = useState([])
  const [editTransactionId, setEditTransactionId] = useState(null)
  const [totalPages, setTotalPages] = useState(1)
  const [categories, setCategories] = useState([])
  const [currencies, setCurrencies] = useState([])

  useEffect(() => {
    api
      .get('/api/categories/')
      .then(response => {
        setCategories(response.data)
      })
      .catch(error => {
        console.error('Error fetching currency data:', error)
      })
    api
      .get('/api/currencies/')
      .then(response => {
        setCurrencies(response.data)
      })
      .catch(error => {
        console.error('Error fetching currency data:', error)
      })
  }, [])


  const columns = [
    'date',
    'code',
    'description',
    'category',
    'amount',
    'currency',
    'actions'
  ]

  const fetchData = page => {
    api
      .get(`/api/transactions/?page=${page}`)
      .then(response => {
        let data = response.data
        // setTransactions(data.results)
        setTransactions(data.results.map(transaction => ({
          ...transaction,
          category: transaction.category.category,
          actions: <button onClick={() => handleEdit(transaction.id)} className='btn btn-primary'>Edit</button>
        })))
        setTotalPages(Math.max(1, Math.ceil(data.count / data.results.length)))
      })
      .catch(error => {
        console.error('Error fetching data:', error)
      })
  }

  useEffect(() => {
    fetchData(1)
  }, [])

  const handleEdit = transactionId => {
    setEditTransactionId(transactionId)
  }

  const handleFormUpdate = updatedTransaction => {
    // Update transactions list after adding/editing
    updatedTransaction.actions = (
      <button onClick={() => handleEdit(updatedTransaction.id)} className='btn btn-primary'>
        Edit
      </button>
    )
    updatedTransaction.category = updatedTransaction.category.category
    if (editTransactionId) {
      const updatedTransactions = transactions.map(transaction =>
        transaction.id === updatedTransaction.id
          ? updatedTransaction
          : transaction
      )
      setTransactions(updatedTransactions)
    } else {
      setTransactions([updatedTransaction, ...transactions])
    }
  }

  return (
    <>
      <h1>Transactions</h1>

      <TransactionForm
        transactionId={editTransactionId}
        categories={categories}
        currencies={currencies}
        onUpdate={handleFormUpdate}
      />

      <Table
        columns={columns}
        data={transactions}
      />

      <TableNavigator totalPages={totalPages} fetchData={fetchData} />
    </>
  )
}

export default Transactions
