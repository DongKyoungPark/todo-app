import { useState } from 'react'
import Layout from './components/Layout'
import TodoForm from './components/TodoForm'
import TodoList from './components/TodoList'
import TodoEditForm from './components/TodoEditForm'
import TodoSearch from './components/TodoSearch'
import { ToDo } from './types/types'
import './App.css'

function App() {
  const [todos, setTodos] = useState<ToDo[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // 필터링된 Todo 목록
  const filteredTodos = todos.filter((todo) =>
    todo.text.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Todo 추가
  const handleAddTodo = (text: string, deadline: number) => {
    // 실제 구현에서는 API 호출 필요
    const newTodo: ToDo = {
      id: Date.now(), // 임시 ID
      text,
      done: false,
      deadline,
    }

    setTodos([...todos, newTodo])
  }

  // Todo 완료 상태 토글
  const handleToggle = (id: number) => {
    // 실제 구현에서는 API 호출 필요
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    )
  }

  // Todo 편집 모드 시작
  const handleEdit = (id: number) => {
    setEditingId(id)
  }

  // Todo 수정 저장
  const handleSave = (id: number, text: string, deadline: number) => {
    // 실제 구현에서는 API 호출 필요
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, text, deadline } : todo))
    )
    setEditingId(null)
  }

  // Todo 편집 취소
  const handleCancel = () => {
    setEditingId(null)
  }

  // Todo 삭제
  const handleDelete = (ids: number[]) => {
    // 실제 구현에서는 API 호출 필요
    setTodos(todos.filter((todo) => !ids.includes(todo.id)))
  }

  return (
    <Layout>
      <TodoForm onSubmit={handleAddTodo} />
      <TodoSearch onSearch={setSearchQuery} />
      <TodoList
        todos={filteredTodos}
        onToggle={handleToggle}
        onEdit={handleEdit}
        onDelete={handleDelete}
        editingId={editingId}
      />
      {editingId !== null && (
        <TodoEditForm
          todo={todos.find((todo) => todo.id === editingId)!}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </Layout>
  )
}

export default App
