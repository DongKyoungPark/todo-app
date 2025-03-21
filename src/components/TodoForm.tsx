import { useState } from 'react'
import styled from 'styled-components'

interface TodoFormProps {
  onSubmit: (text: string, deadline: number) => void
}

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`

const InputGroup = styled.div`
  display: flex;
  gap: 10px;
`

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ddd;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`

const Button = styled.button`
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 15px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #357ab8;
  }
`

const ErrorText = styled.p`
  color: red;
  font-size: 0.8rem;
  margin: 0;
  padding-top: 5px;
  text-align: left;
`

const TodoForm: React.FC<TodoFormProps> = ({ onSubmit }) => {
  const [text, setText] = useState('')
  const [date, setDate] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!text.trim()) {
      setError('할 일을 입력하세요.')
      return
    }

    if (!date) {
      setError('날짜를 입력 or 선택하세요.')
      return
    }

    setError('')

    onSubmit(text, new Date(date).getTime())

    setText('')
    setDate('')
  }

  return (
    <FormContainer onSubmit={handleSubmit}>
      <InputGroup>
        <Input
          type="text"
          placeholder="할 일을 입력하세요"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{
            border:
              text.trim() || error === '' ? '1px solid #ddd' : '1px solid red',
          }}
        />
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{
            border: date || error === '' ? '1px solid #ddd' : '1px solid red',
          }}
        />
        <Button type="submit">추가</Button>
      </InputGroup>
      {error && <ErrorText>{error}</ErrorText>}
    </FormContainer>
  )
}

export default TodoForm
