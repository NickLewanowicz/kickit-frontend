import React, { Component } from 'react'
import { AUTH_TOKEN } from '../constants'
import { Button, Input, Form, Message, Icon } from 'semantic-ui-react'
import logo from '../kickit_logo.png'
import Header from './Header'

import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import '../index.css';
import 'semantic-ui-css/semantic.min.css';

/*
  Todo: @nicklewanowicz using localstorage for JWT session tokens. 
        MUST swap this to serverside sessions and client cookie auth
*/
const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`

class Login extends React.Component {
  state = {
    login: true, // switch between Login and SignUp
    email: '',
    password: '',
    error: '',
  }

  render () {
    let CurrScreen = this.LoginModal
    return (
      <span>
        <Header/>
        <div className="login">
          <img src={logo} height={"300px"} width={"300px"} alt={""}/>
          <this.ErrorMessage error={this.state.error} />
          <div className="inputModal">
            <CurrScreen/>
          </div>
        </div>
      </span>
    )
  }

  //Triggered by login button
  attemptLogin = async () => {
    const { email, password } = this.state
    try {
      const result = await this.props.loginMutation({
        variables: {
          email,
          password,
        },
      })
      const { token } = result.data.login
      this.saveAuthData(token)
      this.props.history.push(`/0/`)
    } catch (e) {
      this.setState((prevState, props) => {
        return {error: "The username or password is not correct."}
      })
    }
  }

  checkAuth = () => {
    const authToken = localStorage.getItem(AUTH_TOKEN)
  }

  handleChange(v, e) {
    this.setState({ [v]: e.target.value });
  }

  saveAuthData = token => {
    localStorage.setItem(AUTH_TOKEN, token)
  }

  ErrorMessage = (error) => {
    if(error.error !== ""){
      return (
        <Message warning>
          <Message.Header>Opps!</Message.Header>
          <p>{error.error}</p>
        </Message>
      )
    }
    return ''
  }

  LoginModal = () => {
    return (
      <div className="container">
      <h3>Login</h3>
      <Form>
        <Form.Field>
          <Input 
            value={this.state.email} 
            onChange={ this.handleChange.bind(this, 'email') } 
            placeholder='Email' />
        </Form.Field>
        <Form.Field>
          <Input 
            value={this.state.password} 
            onChange={ this.handleChange.bind(this, 'password') } 
            placeholder='Password' 
            type='password' />
        </Form.Field>
        <Form.Field>
          <Button 
            type='submit' 
            onClick={() => this.attemptLogin()}  
            color='yellow'>Login</Button>
        </Form.Field>
      </Form>
      </div>
    )
  }
}

export default compose(
  graphql(LOGIN_MUTATION, { name: 'loginMutation' }),
)(Login)
