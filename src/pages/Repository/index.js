import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import PropTypes from 'prop-types'
import api from '../../services/api'

import Container from '../../components/container'
import { Loading, Owner, IssueList, Filter, Paginator } from './styles'

class Repository extends Component {
  state = {
    repository: {},
    issues: [],
    loading: true,
    filter: 'open',
    page: 1,
  }

  async componentDidMount() {
    const { match } = this.props
    const repoName = decodeURIComponent(match.params.repository)

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
  }

  handleFilter = async e => {
    const filter = e.target.value
    const {
      repository: { full_name: name },
    } = this.state

    this.setState({ filter, loading: true })
    const { data: issues } = await api.get(`/repos/${name}/issues`, {
      params: {
        state: filter,
        per_page: 5,
      },
    })

    this.setState({
      issues,
      loading: false,
      page: 1,
    })
  }

  handlePagination = page => async () => {
    this.setState({ loading: true, page })
    const {
      repository: { full_name: name },
      filter,
    } = this.state

    const { data: issues } = await api.get(`/repos/${name}/issues`, {
      params: {
        state: filter,
        per_page: 5,
        page,
      },
    })

    this.setState({
      issues,
      loading: false,
    })
  }

  render() {
    const {
      repository: { name, description, owner },
      issues,
      loading,
      filter,
      page,
    } = this.state
    return loading ? (
      <Loading>Carregando</Loading>
    ) : (
      <Container>
        <Owner>
          <Link to="/">Voltar aos repositórios</Link>
          <img src={owner.avatar_url} alt={owner.login} />
          <h1>{name}</h1>
          <p>{description}</p>
        </Owner>
        <IssueList>
          <Filter>
            <label>
              <input
                type="radio"
                name="state"
                id="stateOpen"
                value="open"
                checked={filter === 'open'}
                onChange={this.handleFilter}
              />
              abertas
            </label>
            <label>
              <input
                type="radio"
                name="state"
                id="stateAll"
                value="all"
                checked={filter === 'all'}
                onChange={this.handleFilter}
              />
              todas
            </label>
            <label>
              <input
                type="radio"
                name="state"
                id="stateClosed"
                value="closed"
                checked={filter === 'closed'}
                onChange={this.handleFilter}
              />
              fechadas
            </label>
          </Filter>
          {issues.map(
            ({
              id,
              user: { avatar_url: avatar, login },
              html_url: url,
              title,
              labels,
            }) => (
              <li key={String(id)}>
                <img src={avatar} alt={login} />
                <div>
                  <strong>
                    <a href={url}>{title}</a>
                    {labels.map(label => (
                      <span key={String(label.id)}>{label.name}</span>
                    ))}
                  </strong>
                  <p>{login}</p>
                </div>
              </li>
            )
          )}
          <Paginator>
            <button type="button" onClick={this.handlePagination(page + 1)}>
              <FaArrowRight />
            </button>
            {page !== 1 && (
              <button type="button" onClick={this.handlePagination(page - 1)}>
                <FaArrowLeft />
              </button>
            )}
          </Paginator>
        </IssueList>
      </Container>
    )
  }
}

Repository.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      repository: PropTypes.string,
    }),
  }).isRequired,
}

export default Repository
