import React, { Component } from 'react'
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, CardTitle, CardText, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import 'bootstrap/dist/css/bootstrap.css';

import axios from 'axios'

class Authentication extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modal: false,
      activeTab: '2'
    }
  }
  toggle = (tab) => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  register = () => {
    axios({
      method: 'POST',
      url: 'http://localhost:8181/register',
      data: {
        fname: this.fname.value,
        lname: this.lname.value,
        username: this.registerUsername.value,
        password: this.registerPassword.value
      }
    }).then((res) => {
      console.log(res)
    })
  }

  login = () => {
    axios({
      method: 'POST',
      url: 'http://localhost:8181/login',
      data: {
        username: this.loginUsername.value,
        password: this.loginPassword.value
      }
    }).then((res) => {
      const { token, fname } = res.data
      this.props.updateName(fname)
      if(token) this.props.loginUser(token)
      else console.log('Wrong Password!')
    })
  }

  render() {
    return (
      <div>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '1' })}
              onClick={() => { this.toggle('1'); }}
            >
              Signup
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '2' })}
              onClick={() => { this.toggle('2'); }}
            >
              Login
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            <Row>
              <Col sm="12">
                <Form>
                  <FormGroup>
                    <Label for="fname">First Name</Label>
                    <Input 
                      type="text" 
                      name="fname" 
                      placeholder="Enter your first name" 
                      innerRef={(input) => this.fname = input} 
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="lname">Last Name</Label>
                    <Input 
                      type="text" 
                      name="lname" 
                      placeholder="Enter your last name" 
                      innerRef={(input) => this.lname = input} 
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="exampleUsername">Username</Label>
                    <Input 
                      type="text" 
                      name="username" 
                      placeholder="Enter your email as the username" 
                      innerRef={(input) => this.registerUsername = input} 
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="examplePassword">Password</Label>
                    <Input 
                      type="password" 
                      name="password" 
                      placeholder="Enter your password" 
                      innerRef={(input) => this.registerPassword = input} 
                    />
                  </FormGroup>
                  <Button color="primary" onClick={this.register} type="button" >Register</Button>{' '}
                </Form>
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="2">
            <Row>
              <Col sm="12">
                <Form onSubmit={this.login} action="http://localhost:8181/login" method="POST" >
                  <FormGroup>
                    <Label for="exampleUsername">Username</Label>
                    <Input 
                      type="username" 
                      name="username" 
                      placeholder="Enter your email as the username" 
                      innerRef={(input) => this.loginUsername = input} 
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="examplePassword">Password</Label>
                    <Input 
                      type="password" 
                      name="password" 
                      placeholder="Enter your password" 
                      innerRef={(input) => this.loginPassword = input} 
                    />
                  </FormGroup>
                  <Button color="primary" onClick={this.login} type="button">Login</Button>{' '}
                </Form>
              </Col>
            </Row>
          </TabPane>
        </TabContent>
      </div>
    )
  }

}



export default Authentication