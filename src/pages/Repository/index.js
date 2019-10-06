import React, { Component } from 'react'
import api from '../../services/api'

class Repository extends Component {
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
    return <h1>Repository: {decodeURIComponent(repository)}</h1>
  }
}

export default Repository
