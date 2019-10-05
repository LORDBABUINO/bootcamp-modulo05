import React, { Component } from 'react'
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa'

import api from '../../services/api'

import { Container, Form, SubmitButton } from './styles'

class Main extends Component {
  state = {
    newRepo: '',
    repositories: [],
    loading: false,
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
    const { newRepo, loading } = this.state
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
      </Container>
    )
  }
}

export default Main
