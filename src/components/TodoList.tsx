import { useState } from 'react'
import styled from 'styled-components'
import TodoItem from './TodoItem'
import { ToDo } from '../types/types'

interface TodoListProps {
  todos: ToDo[]
  onToggle: (id: number) => void
  onEdit: (id: number) => void
  onDelete: (ids: number[]) => void
  editingId: number | null
}

const ListContainer = styled.div`
  margin-top: 20px;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 20px;
  color: #888;
  font-style: italic;
`

const ActionsBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`

const DeleteButton = styled.button`
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 0.9rem;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: #c0392b;
  }
`

const PageSizeSelector = styled.select`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
`

const PageButton = styled.button<{ active: boolean }>`
  background-color: ${({ active }) => (active ? '#4a90e2' : 'transparent')};
  color: ${({ active }) => (active ? 'white' : '#4a90e2')};
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 0.9rem;
  margin: 0 5px;

  &:hover {
    background-color: #4a90e2;
    color: white;
  }
`

const TodoList: React.FC<TodoListProps> = ({
  todos,
  onToggle,
  onEdit,
  onDelete,
  editingId,
}) => {
  const [selectedTodos, setSelectedTodos] = useState<number[]>([])
  const [pageSize, setPageSize] = useState<number>(5)
  const [currentPage, setCurrentPage] = useState<number>(1)

  const handleSelect = (id: number, selected: boolean) => {
    if (selected) {
      setSelectedTodos([...selectedTodos, id])
    } else {
      setSelectedTodos(selectedTodos.filter((todoId) => todoId !== id))
    }
  }

  const handleDeleteSelected = () => {
    onDelete(selectedTodos)
    setSelectedTodos([])
  }

  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedTodos = todos.slice(startIndex, endIndex)

  const totalPages = Math.ceil(todos.length / pageSize)

  return (
    <ListContainer>
      <ActionsBar>
        <DeleteButton
          onClick={handleDeleteSelected}
          disabled={selectedTodos.length === 0}
        >
          선택 항목 삭제 ({selectedTodos.length})
        </DeleteButton>

        <PageSizeSelector
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value))
            setCurrentPage(1)
          }}
        >
          <option value={5}>5개씩 보기</option>
          <option value={10}>10개씩 보기</option>
          <option value={20}>20개씩 보기</option>
        </PageSizeSelector>
      </ActionsBar>

      {paginatedTodos.length === 0 ? (
        <EmptyState>할 일이 없습니다. 새로운 할 일을 추가해보세요!</EmptyState>
      ) : (
        paginatedTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onSelect={handleSelect}
            selected={selectedTodos.includes(todo.id)}
            isEditing={editingId === todo.id}
            onEdit={onEdit}
          />
        ))
      )}

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <PageButton
          key={page}
          active={page === currentPage}
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </PageButton>
      ))}
    </ListContainer>
  )
}

export default TodoList
