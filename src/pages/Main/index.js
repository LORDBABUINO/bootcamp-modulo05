import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa'

import api from '../../services/api'

import Container from '../../components/container'
import { Form, SubmitButton, List } from './styles'

class Main extends Component {
  state = {
    newRepo: '',
    repositories: [],
    loading: false,
    valid: true,
  }

  componentDidMount() {
    const repositories = localStorage.getItem('repositories')
    if (repositories) this.setState({ repositories: JSON.parse(repositories) })
  }

  componentDidUpdate(_, prevState) {
    const { repositories } = this.state
    if (prevState.repositories !== repositories)
      localStorage.setItem('repositories', JSON.stringify(repositories))
  }

  handleInputChange = e => {
    const newRepo = e.target.value
    this.setState({ newRepo, valid: true })
  }

  handleSubmit = async e => {
    e.preventDefault()
    this.setState({ loading: true })

    try {
      const { newRepo, repositories } = this.state
      const response = await api.get(`/repos/${newRepo}`)
      const { full_name: name } = response.data

      if (repositories.includes(name)) throw new Error('Duplicated repository')

      this.setState({
        repositories: [...repositories, name],
        newRepo: '',
      })
    } catch (error) {
      this.setState({
        valid: false,
      })
    }

    this.setState({
      loading: false,
    })
  }

  render() {
    const { newRepo, loading, repositories, valid } = this.state
    return (
      <Container>
        <h1>
          <FaGithubAlt />
          Repositórios
        </h1>
        <Form onSubmit={this.handleSubmit} valid={valid ? 1 : 0}>
          <input
            type="text"
            placeholder="Adicionar repositório"
            value={newRepo}
            onChange={this.handleInputChange}
          />
          <SubmitButton loading={loading ? 1 : 0}>
            {loading ? (
              <FaSpinner color="white" size={14} />
            ) : (
              <FaPlus color="white" size="14" />
            )}
          </SubmitButton>
        </Form>
        <List>
          {repositories.map(repository => (
            <li key={repository}>
              <span>{repository}</span>
              <Link to={`/repository/${encodeURIComponent(repository)}`}>
                Detalhes
              </Link>
            </li>
          ))}
        </List>
      </Container>
    )
  }
}

export default Main
