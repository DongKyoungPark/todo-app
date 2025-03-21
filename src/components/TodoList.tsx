import { memo } from 'react'
import styled from 'styled-components'
import TodoItem from './TodoItem'
import todoStore from '../store/TodoStore'
import { usePagination } from '../hooks/usePagination'
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

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`

const ArrowButton = styled.button<{ disabled: boolean }>`
  background-color: transparent;
  color: ${({ disabled }) => (disabled ? '#ccc' : '#4a90e2')};
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0 5px;

  &:hover:not(:disabled) {
    background-color: #f0f7ff;
  }
`

const EllipsisButton = styled.button`
  background-color: transparent;
  color: #4a90e2;
  border: none;
  padding: 8px 4px;
  font-size: 1rem;
  font-weight: bold;
  margin: 0 2px;
  cursor: pointer;
`

const TodoList: React.FC<TodoListProps> = memo(
  ({ todos, onToggle, onEdit, onDelete, editingId }) => {
    const { selectedTodoIds, selectTodo, clearSelectedTodos } = todoStore()

    const {
      paginatedItems,
      pageSize,
      currentPage,
      pageButtons,
      totalPages,
      setPageSize,
      goToPage,
      goToNextPage,
      goToPreviousPage,
    } = usePagination<ToDo>({
      totalItems: todos,
      initialPageSize: 5,
      initialPage: 1,
    })

    const handleDeleteSelected = () => {
      onDelete(selectedTodoIds)
      clearSelectedTodos()
    }

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setPageSize(Number(e.target.value))
    }

    const getVisiblePageButtons = () => {
      if (totalPages <= 5) {
        return pageButtons
      }

      const visibleButtons = []

      visibleButtons.push(1)

      if (currentPage <= 3) {
        visibleButtons.push(2, 3, 4)
        if (totalPages > 5) {
          visibleButtons.push('ellipsis')
          visibleButtons.push(totalPages)
        }
      } else if (currentPage >= totalPages - 2) {
        visibleButtons.push('ellipsis')
        visibleButtons.push(
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        )
      } else {
        visibleButtons.push('ellipsis')
        visibleButtons.push(currentPage - 1, currentPage, currentPage + 1)
        visibleButtons.push('ellipsis2')
        visibleButtons.push(totalPages)
      }

      return visibleButtons
    }

    const handleEllipsisClick = (position: 'before' | 'after') => {
      if (position === 'before') {
        goToPage(Math.max(1, currentPage - 5))
      } else {
        goToPage(Math.min(totalPages, currentPage + 5))
      }
    }

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

        {paginatedItems.length === 0 ? (
          <EmptyState>
            할 일이 없습니다. 새로운 할 일을 추가해보세요!
          </EmptyState>
        ) : (
          paginatedItems.map((todo) => (
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

        {pageButtons.length > 1 && (
          <PaginationContainer>
            <ArrowButton
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            >
              &lt;
            </ArrowButton>

            {getVisiblePageButtons().map((page) => {
              if (page === 'ellipsis') {
                return (
                  <EllipsisButton
                    key={`ellipsis-before`}
                    onClick={() => handleEllipsisClick('before')}
                  >
                    ...
                  </EllipsisButton>
                )
              } else if (page === 'ellipsis2') {
                return (
                  <EllipsisButton
                    key={`ellipsis-after`}
                    onClick={() => handleEllipsisClick('after')}
                  >
                    ...
                  </EllipsisButton>
                )
              } else {
                return (
                  <PageButton
                    key={`page-${page}`}
                    active={page === currentPage}
                    onClick={() => goToPage(page as number)}
                  >
                    {page}
                  </PageButton>
                )
              }
            })}

            <ArrowButton
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              &gt;
            </ArrowButton>
          </PaginationContainer>
        )}
      </ListContainer>
    )
  }
)

TodoList.displayName = 'TodoList'

export default TodoList
