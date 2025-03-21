import { memo, MouseEvent, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { ToDo } from '../types/types'

interface TodoItemProps {
  todo: ToDo
  onToggle: (id: number) => void
  onSelect: (id: number, selected: boolean) => void
  selected: boolean
  isEditing: boolean
  onEdit: (id: number) => void
}

const ItemContainer = styled.div<{
  done: boolean
  isNearDeadline: boolean
  selected: boolean
}>`
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 8px;
  background-color: ${({ selected }) => (selected ? '#f0f7ff' : '#fff')};
  border: 1px solid ${({ selected }) => (selected ? '#4a90e2' : '#eee')};
  transition: all 0.2s;

  ${({ done }) =>
    done &&
    `
    opacity: 0.7;
    text-decoration: line-through;
  `}

  ${({ isNearDeadline, done }) =>
    !done &&
    isNearDeadline &&
    `
    border-left: 3px solid #e74c3c;
  `}
`

const Checkbox = styled.input`
  margin-right: 10px;
  width: 18px;
  height: 18px;
  cursor: pointer;
`

const Text = styled.span<{ done: boolean }>`
  flex: 1;
  font-size: 1rem;
  color: ${({ done }) => (done ? '#888' : '#333')};
`

const Deadline = styled.span<{ isNearDeadline: boolean }>`
  font-size: 0.85rem;
  color: ${({ isNearDeadline }) => (isNearDeadline ? '#e74c3c' : '#888')};
  margin-left: 10px;
`

const EditButton = styled.button`
  background-color: transparent;
  border: none;
  color: #4a90e2;
  cursor: pointer;
  margin-left: 10px;

  &:hover {
    text-decoration: underline;
  }
`

const TodoItem: React.FC<TodoItemProps> = memo(
  ({ todo, onToggle, onSelect, selected, isEditing, onEdit }) => {
    const { id, text, done, deadline } = todo

    const { isNearDeadline, formattedDate } = useMemo(() => {
      const threeDaysAgo = Date.now() - 259200000
      const isNear = deadline > threeDaysAgo && deadline < Date.now()

      const formatted = new Date(deadline).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })

      return { isNearDeadline: isNear, formattedDate: formatted }
    }, [deadline])

    const handleClick = useCallback(() => {
      onSelect(id, !selected)
    }, [id, selected, onSelect])

    const handleToggle = useCallback(() => {
      onToggle(id)
    }, [id, onToggle])

    const handleEdit = useCallback(
      (e: MouseEvent) => {
        e.stopPropagation()
        onEdit(id)
      },
      [id, onEdit]
    )

    return (
      <ItemContainer
        done={done}
        isNearDeadline={isNearDeadline}
        selected={selected}
        onClick={handleClick}
      >
        <Checkbox
          type="checkbox"
          checked={done}
          onChange={handleToggle}
          onClick={(e) => e.stopPropagation()}
        />
        <Text done={done}>{text}</Text>
        <Deadline isNearDeadline={isNearDeadline}>{formattedDate}</Deadline>
        {!isEditing && <EditButton onClick={handleEdit}>수정</EditButton>}
      </ItemContainer>
    )
  }
)

export default TodoItem
