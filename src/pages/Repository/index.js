import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import api from '../../services/api'

import Container from '../../components/container'
import { Loading, Owner } from './styles'

class Repository extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        repository: PropTypes.string,
      }),
    }).isRequired,
  }

  state = {
    repository: {},
    issues: [],
    loading: true,
  }

  async componentDidMount() {
    const repoName = decodeURIComponent(this.props.match.params.repository)

    const [{ data: repository }, { data: issues }] = await Promise.all([
      await api.get(`/repos/${repoName}`),
      await api.get(`/repos/${repoName}/issues`, {
        params: {
          state: 'open',
          per_page: 5,
        },
      }),
    ])
    this.setState({
      repository,
      issues,
      loading: false,
    })
    console.log({ repository })
    console.log({ issues })
  }

  render() {
    const { repository, issues, loading } = this.state
    return loading ? (
      <Loading>Carregando</Loading>
    ) : (
      <Container>
        <Owner>
          <Link to="/">Voltar aos repositórios</Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>
      </Container>
    )
  }
}

export default Repository
