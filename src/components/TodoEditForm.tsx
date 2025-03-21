import {
  useState,
  useEffect,
  memo,
  useCallback,
  FormEvent,
  ChangeEvent,
} from 'react'
import styled from 'styled-components'
import { ToDo } from '../types/types'

interface TodoEditFormProps {
  todo: ToDo
  onSave: (id: number, text: string, deadline: number) => void
  onCancel: () => void
}

const FormContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 8px;
  background-color: #f9f9f9;
  border: 1px solid #4a90e2;
`

const Input = styled.input`
  flex: 1;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
  font-size: 1rem;
  margin-right: 10px;

  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`

const Button = styled.button`
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  border: none;
`

const SaveButton = styled(Button)`
  background-color: #4a90e2;
  color: white;

  &:hover {
    background-color: #357ab8;
  }
`

const CancelButton = styled(Button)`
  background-color: #ddd;
  color: #333;

  &:hover {
    background-color: #ccc;
  }
`

const TodoEditForm: React.FC<TodoEditFormProps> = memo(
  ({ todo, onSave, onCancel }) => {
    const [text, setText] = useState(todo.text)
    const [deadline, setDeadline] = useState('')

    useEffect(() => {
      const date = new Date(todo.deadline)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')

      setDeadline(`${year}-${month}-${day}`)
      setText(todo.text)
    }, [todo])

    const handleSubmit = useCallback(
      (e: FormEvent) => {
        e.preventDefault()

        if (!text.trim()) return

        const deadlineDate = new Date(deadline)
        onSave(todo.id, text, deadlineDate.getTime())
      },
      [text, deadline, todo.id, onSave]
    )

    const handleTextChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
      setText(e.target.value)
    }, [])

    const handleDateChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
      setDeadline(e.target.value)
    }, [])

    return (
      <FormContainer onSubmit={handleSubmit}>
        <Input
          type="text"
          value={text}
          onChange={handleTextChange}
          placeholder="할 일"
        />
        <Input type="date" value={deadline} onChange={handleDateChange} />
        <ButtonGroup>
          <SaveButton type="submit">저장</SaveButton>
          <CancelButton type="button" onClick={onCancel}>
            취소
          </CancelButton>
        </ButtonGroup>
      </FormContainer>
    )
  }
)

export default TodoEditForm
