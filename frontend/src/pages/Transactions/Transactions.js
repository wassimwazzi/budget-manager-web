import React, { useEffect, useState } from 'react'
import api from '../../api'
import TransactionForm from './TransactionForm'
import TableNavigator from '../../components/table/TableNavigator'
import SearchableTable from '../../components/table/SearchableTable'
import Status from '../../components/Status'
import { Button } from 'react-bootstrap'

const Transactions = () => {
  const [transactions, setTransactions] = useState([])
  const [editTransactionId, setEditTransactionId] = useState(null)
  const [totalPages, setTotalPages] = useState(1)
  const [categories, setCategories] = useState([])
  const [currencies, setCurrencies] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedColumn, setSelectedColumn] = useState('')
  const [inferring, setInferring] = useState(false)
  const [inferranceSuccessMessage, setInferranceSuccessMessage] = useState(null)
  const [inferranceErrorMessage, setInferranceErrorMessage] = useState(null)

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

  const fetchData = (page, filter = null, filter_value = null) => {
    let url = `/api/transactions/?page=${page}`
    if (filter && filter_value) {
      url += `&filter=${filter}&filter_value=${filter_value}`
    }
    api
      .get(url)
      .then(response => {
        let data = response.data
        setTransactions(data.results.map(transaction => ({
          ...transaction,
          category: transaction.category.category,
          actions: <button onClick={() => handleEdit(transaction.id)} className='btn btn-primary'>Edit</button>
        })))
        setTotalPages(data.count === 0 ? 1 : Math.max(1, Math.ceil(data.count / data.results.length)))
      })
      .catch(error => {
        console.error('Error fetching data:', error)
      })
  }

  useEffect(() => {
    fetchData(1, selectedColumn, searchTerm)
  }, [searchTerm, selectedColumn])

  const handleEdit = transactionId => {
    setEditTransactionId(transactionId)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const inferCategories = () => {
    setInferring(true)
    api
      .post('/api/transactions/infer/')
      .then(response => {
        setInferring(false)
        setInferranceSuccessMessage('Categories successfully inferred')
        setInferranceErrorMessage(null)
        fetchData(1, selectedColumn, searchTerm)
      })
      .catch(error => {
        setInferring(false)
        setInferranceSuccessMessage(null)
        setInferranceErrorMessage('Error infering categories')
        console.error('Error infering categories:', error)
      })
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
    setEditTransactionId(null)
  }

  const searchHandler = (searchTerm, selectedColumn) => {
    setSearchTerm(searchTerm)
    setSelectedColumn(selectedColumn)
  };

  const pageHandler = page => {
    fetchData(page, selectedColumn, searchTerm)
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

      <div className='d-flex mb-3'>
        <Button onClick={() => inferCategories()} className='mb-3' disabled={inferring}>
          Re-infer categories
        </Button>
        <Status loading={inferring} successMessage={inferranceSuccessMessage} errorMessage={inferranceErrorMessage} />
      </div>

      <SearchableTable
        columns={columns}
        data={transactions}
        searchHandler={searchHandler}
      />

      <TableNavigator totalPages={totalPages} fetchData={pageHandler} />
    </>
  )
}

export default Transactions
