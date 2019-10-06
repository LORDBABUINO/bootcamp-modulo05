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
    this.setState({ newRepo })
  }

  handleSubmit = async e => {
    e.preventDefault()
    this.setState({ loading: true })

    const { newRepo, repositories } = this.state
    const response = await api.get(`/repos/${newRepo}`)
    const { full_name: name } = response.data

    this.setState({
      repositories: [...repositories, name],
      newRepo: '',
      loading: false,
    })
  }

  render() {
    const { newRepo, loading, repositories } = this.state
    return (
      <Container>
        <h1>
          <FaGithubAlt />
          Repositórios
        </h1>
        <Form onSubmit={this.handleSubmit}>
          <input
            type="text"
            placeholder="Adicionar repositório"
            value={newRepo}
            onChange={this.handleInputChange}
          />
          <SubmitButton loading={loading}>
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
