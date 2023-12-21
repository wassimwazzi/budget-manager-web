import React, { useEffect, useState } from 'react'
import api from '../../api'
import BudgetForm from './BudgetForm'
import SearchableTable from '../../components/table/SearchableTable'

const Budgets = () => {
    const [budgets, setBudgets] = useState([])
    const [editBudgetId, setEditBudgetId] = useState(null)
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
        'amount',
        'currency',
        'start_date',
        'category',
        'actions'
    ]

    const fetchData = (filter = null, filter_value = null) => {
        let url = `/api/budgets/`
        if (filter && filter_value) {
            url += `&filter=${filter}&filter_value=${filter_value}`
        }
        api
            .get(url)
            .then(response => {
                setBudgets(response.data.map(budget => ({
                    ...budget,
                    actions: <button onClick={() => handleEdit(budget.id)} className='btn btn-primary'>Edit</button>
                })))
            })
            .catch(error => {
                console.error('Error fetching data:', error)
            })
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleEdit = budgetId => {
        setEditBudgetId(() => budgetId)
    }

    const handleFormUpdate = updatedBudget => {
        // Update budgets list after adding/editing
        updatedBudget.actions = (
            <button onClick={() => handleEdit(updatedBudget.id)} className='btn btn-primary'>
                Edit
            </button>
        )
        updatedBudget.category = updatedBudget.category.category
        if (editBudgetId) {
            const updatedBudgets = budgets.map(budget =>
                budget.id === updatedBudget.id
                    ? updatedBudget
                    : budget
            )
            setBudgets(updatedBudgets)
        } else {
            setBudgets([updatedBudget, ...budgets])
        }
        setEditBudgetId(null)
    }

    return (
        <>
            <h1>Budgets</h1>

            <BudgetForm
                budgetId={editBudgetId}
                categories={categories}
                currencies={currencies}
                onUpdate={handleFormUpdate}
            />

            <SearchableTable
                columns={columns}
                data={budgets}
            />

        </>
    )
}

export default Budgets
