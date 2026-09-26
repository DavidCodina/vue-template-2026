<!-- See Traversy Media tutorial: https://www.youtube.com/watch?v=hNPwdOZ3qFU -->

<script setup lang="ts">
/* ======================
        Imports
====================== */

import { ref, computed, onMounted } from 'vue'
import Balance from './components/Balance.vue'
import IncomeExpenses from './components/IncomeExpenses.vue'
import TransactionList from './components/TransactionList.vue'
import AddTransaction from './components/AddTransaction.vue'

const toast = useToast()

/* ======================
        Types
====================== */

type Transaction = {
  id: number
  text: string
  amount: number
}

/* ======================
    Refs (i.e., State)
====================== */

const transactions = ref<Transaction[]>([])

/* ======================
       Computed
====================== */

// Get total
const total = computed(() => {
  return transactions.value.reduce((acc, transaction) => {
    return acc + transaction.amount
  }, 0)
})

// ⚠️ Using .toFixed(2) here might not be the best solution,
// or it simply may not be needed at all.

// Get income
const income = computed(() => {
  const value = transactions.value
    .filter((transaction) => transaction.amount > 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0)
    .toFixed(2)
  return value
})

// ⚠️ Using .toFixed(2) here might not be the best solution,
// or it simply may not be needed at all.

// Get expenses
const expenses = computed(() => {
  const value = transactions.value
    .filter((transaction) => transaction.amount < 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0)
    .toFixed(2)

  return value
})

/* ======================
Event Handlers / Functions
====================== */

// Submit transaction
const handleTransactionSubmitted = (transactionData: Omit<Transaction, 'id'>) => {
  const newTransaction = {
    id: generateUniqueId(),
    text: transactionData.text,
    amount: transactionData.amount
  }

  transactions.value.push(newTransaction)

  saveTransactionsToLocalStorage()

  toast.add({
    title: 'Success!',
    description: 'Transaction added.',
    class: '[&_[data-slot=title]]:text-green-500',
    color: 'success',
    icon: 'i-lucide-circle-check'
  })
}

// Generate unique ID
const generateUniqueId = () => {
  return Math.floor(Math.random() * 1000000)
}

// Delete transaction
const handleTransactionDeleted = (id: number) => {
  transactions.value = transactions.value.filter((transaction) => transaction.id !== id)

  saveTransactionsToLocalStorage()

  toast.add({
    // Unfortuanately, it seems like we can only modify position globally in App.uve
    // ❌ position: 'top-right',
    title: 'Success!',
    description: 'Transaction deleted.',
    class: '[&_[data-slot=title]]:text-green-500',
    color: 'success',
    icon: 'i-lucide-circle-check', // Or Use your own
    duration: 3000
    // progress: true,
    // avatar: ...
  })
}

// Save transactions to local storage
const saveTransactionsToLocalStorage = () => {
  localStorage.setItem('transactions', JSON.stringify(transactions.value))
}

/* ======================
     Lifecycle Hooks
====================== */

onMounted(() => {
  const transactionsFromLocalStorage = localStorage.getItem('transactions')
  if (!transactionsFromLocalStorage) {
    return
  }

  const savedTransactions = JSON.parse(transactionsFromLocalStorage)

  if (savedTransactions && typeof savedTransactions === 'object') {
    transactions.value = savedTransactions
  }
})
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <div class="bg-card mx-auto mb-6 max-w-100 space-y-4 rounded-xl border p-4 shadow">
    <!-- <h2 class="text-primary mb-4 text-center text-3xl font-black">Expense Tracker</h2> -->

    <Balance :total="total" />

    <div class="bg-secondary/20 my-4 h-px rounded-full px-2" />

    <IncomeExpenses :income="+income" :expenses="+expenses" />

    <div class="bg-secondary/20 my-4 h-px rounded-full px-2" />

    <TransactionList :transactions="transactions" @transactionDeleted="handleTransactionDeleted" />

    <div class="bg-secondary/20 my-4 h-px rounded-full px-2" />

    <AddTransaction @transactionSubmitted="handleTransactionSubmitted" />
  </div>
</template>
