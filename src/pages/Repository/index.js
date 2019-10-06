import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import api from '../../services/api'

import Container from '../../components/container'
import { Loading, Owner, IssueList } from './styles'

class Repository extends Component {
  state = {
    repository: {},
    issues: [],
    loading: true,
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

  render() {
    const {
      repository: { name, description, owner },
      issues,
      loading,
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
