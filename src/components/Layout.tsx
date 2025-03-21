import { ReactNode } from 'react'
import styled from 'styled-components'

interface LayoutProps {
  children: ReactNode
}

const LayoutContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
`

const Header = styled.header`
  margin-bottom: 20px;
  text-align: center;
`

const Title = styled.h1`
  color: #333;
  font-size: 2rem;
`

const Content = styled.main`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
`

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <LayoutContainer>
      <Header>
        <Title>Todo 애플리케이션</Title>
      </Header>
      <Content>{children}</Content>
    </LayoutContainer>
  )
}

export default Layout
