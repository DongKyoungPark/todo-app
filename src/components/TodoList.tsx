import { useState, memo, useCallback, useMemo, ChangeEvent } from 'react'
import styled from 'styled-components'
import TodoItem from './TodoItem'
import todoStore from '../store/TodoStore'
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

const TodoList: React.FC<TodoListProps> = memo(
  ({ todos, onToggle, onEdit, onDelete, editingId }) => {
    const [pageSize, setPageSize] = useState<number>(5)
    const [currentPage, setCurrentPage] = useState<number>(1)

    const { selectedTodoIds, selectTodo, clearSelectedTodos } = todoStore()

    const handleDeleteSelected = useCallback(() => {
      onDelete(selectedTodoIds)
      clearSelectedTodos()
    }, [selectedTodoIds, onDelete, clearSelectedTodos])

    const handlePageSizeChange = useCallback(
      (e: ChangeEvent<HTMLSelectElement>) => {
        setPageSize(Number(e.target.value))
        setCurrentPage(1)
      },
      []
    )

    const handlePageClick = useCallback((page: number) => {
      setCurrentPage(page)
    }, [])

    const { paginatedTodos, totalPages } = useMemo(() => {
      const startIndex = (currentPage - 1) * pageSize
      const endIndex = startIndex + pageSize
      return {
        paginatedTodos: todos.slice(startIndex, endIndex),
        totalPages: Math.ceil(todos.length / pageSize),
      }
    }, [todos, currentPage, pageSize])

    const pageButtons = useMemo(() => {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }, [totalPages])

    return (
      <ListContainer>
        <ActionsBar>
          <DeleteButton
            onClick={handleDeleteSelected}
            disabled={selectedTodoIds.length === 0}
          >
            선택 항목 삭제 ({selectedTodoIds.length})
          </DeleteButton>

          <PageSizeSelector value={pageSize} onChange={handlePageSizeChange}>
            <option value={5}>5개씩 보기</option>
            <option value={10}>10개씩 보기</option>
            <option value={20}>20개씩 보기</option>
          </PageSizeSelector>
        </ActionsBar>

        {paginatedTodos.length === 0 ? (
          <EmptyState>
            할 일이 없습니다. 새로운 할 일을 추가해보세요!
          </EmptyState>
        ) : (
          paginatedTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onSelect={selectTodo}
              selected={selectedTodoIds.includes(todo.id)}
              isEditing={editingId === todo.id}
              onEdit={onEdit}
            />
          ))
        )}

        {pageButtons.map((page) => (
          <PageButton
            key={page}
            active={page === currentPage}
            onClick={() => handlePageClick(page)}
          >
            {page}
          </PageButton>
        ))}
      </ListContainer>
    )
  }
)

export default TodoList
