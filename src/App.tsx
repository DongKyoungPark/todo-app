import { useMemo } from 'react'
import Layout from './components/Layout'
import TodoForm from './components/TodoForm'
import TodoList from './components/TodoList'
import TodoEditForm from './components/TodoEditForm'
import TodoSearch from './components/TodoSearch'
import todoStore from './store/TodoStore'
import {
  useTodosQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  useDeleteMultipleTodosMutation,
  useTodoQuery,
} from './hooks/useTodoQuery'
import './App.css'

const App = () => {
  const { data: todos = [], isLoading, error } = useTodosQuery()
  const addTodoMutation = useAddTodoMutation()
  const updateTodoMutation = useUpdateTodoMutation()
  const deleteMultipleTodosMutation = useDeleteMultipleTodosMutation()

  const {
    searchQuery,
    editingId,
    setSearchQuery,
    setEditingId,
    clearSelectedTodos,
  } = todoStore()

  const filteredTodos = useMemo(() => {
    if (!searchQuery.trim()) return todos

    const lowercaseQuery = searchQuery.toLowerCase()
    return todos.filter((todo) =>
      todo.text.toLowerCase().includes(lowercaseQuery)
    )
  }, [todos, searchQuery])

  const { data: editingTodo } = useTodoQuery(editingId || 0)

  const handleAddTodo = (text: string, deadline: number) => {
    addTodoMutation.mutate({
      text,
      done: false,
      deadline,
    })
  }

  const handleToggle = (id: number) => {
    const todo = todos.find((t) => t.id === id)
    if (todo) {
      updateTodoMutation.mutate({
        id,
        updates: { done: !todo.done },
      })
    }
  }

  const handleEdit = (id: number) => {
    setEditingId(id)
  }

  const handleSave = (id: number, text: string, deadline: number) => {
    updateTodoMutation.mutate({
      id,
      updates: { text, deadline },
    })
    setEditingId(null)
  }

  const handleCancel = () => {
    setEditingId(null)
  }

  const handleDelete = (ids: number[]) => {
    deleteMultipleTodosMutation.mutate(ids, {
      onSuccess: () => {
        clearSelectedTodos()
      },
    })
  }

  const errorMessage =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
      ? error
      : '오류가 발생했습니다.'

  return (
    <Layout>
      {error && (
        <div style={{ color: 'red', marginBottom: '15px' }}>{errorMessage}</div>
      )}

      <TodoForm onSubmit={handleAddTodo} />
      <TodoSearch onSearch={setSearchQuery} />

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>로딩 중...</div>
      ) : (
        <>
          <TodoList
            todos={filteredTodos}
            onToggle={handleToggle}
            onEdit={handleEdit}
            onDelete={handleDelete}
            editingId={editingId}
          />

          {editingId !== null && editingTodo && (
            <TodoEditForm
              todo={editingTodo}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          )}
        </>
      )}
    </Layout>
  )
}

export default App
