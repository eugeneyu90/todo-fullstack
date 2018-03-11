import React, { Component } from 'react'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

// import logo from './logo.svg'
import './App.css'
import logo from './todo.svg'
import TodoAddBar from './TodoAddBar.js'
import TodoList from './TodoList.js'
import getToday from './getToday.js'
import Authentication from './Authentication.js'
import axios from 'axios'


class App extends Component {
  constructor() {
    super()
    this.state = {
      isLoggedIn: false,
      token: null,
      todoList: [
        { id: 1, task: 'Install Todo App', completeBy: null, completed: null, isComplete: false, isCleared: false }
      ],
      dropdownOpen: false,
      fname: 'You are not logged in!'
    }
  }

  toggle = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    })
  }

  addToList = task => { //handleNewTodo???
    axios({
      url: 'http://localhost:8181/addtodo',
      method: 'POST',
      headers: {
        'Authorization': this.state.token
      },
      data: {
        task: task
      }
    }).then(response => {
      // console.log(response)
      axios({
        url: 'http://localhost:8181/usertodos',
        method: 'GET',
        headers: {
          'Authorization': this.state.token
        }
      })
        .then(response => {
          this.setState({
            todoList: response.data.todos
          })
        })
        .catch(error => {
          console.log(error)
        })
    }).catch(error => {
      console.log(error)
    })
    // this.setState({
    //   todoList: this.state.todoList.concat(task) // Using concat to clean code. 
    // })
  }

  toggleComplete = item => { //handleCompleted???
    // let updatedList = this.state.todoList
    // let index = updatedList.indexOf((item))
    // updatedList[index].isComplete = !updatedList[index].isComplete
    // updatedList[index].completed === null ? updatedList[index].completed = getToday() : updatedList[index].completed = null
    // item.isComplete = !item.isComplete
    console.log(item.isComplete)
    axios({
      url: 'http://localhost:8181/updatetodo',
      method: 'POST',
      headers: {
        'Authorization': this.state.token
      },
      data: {
        _id: item._id,
        task: item.task,
        completeBy: item.completeBy,
        completed: !item.isComplete ? getToday() : null,
        isComplete: !item.isComplete,
        isCleared: item.isCleared
      }
    }).then(response => {
      console.log(response)
      axios({
        url: 'http://localhost:8181/usertodos',
        method: 'GET',
        headers: {
          'Authorization': this.state.token
        }
      })
        .then(response => {
          this.setState({
            todoList: response.data.todos
          })
        })
        .catch(error => {
          console.log(error)
        })
    })
  }

  setCleared = item => { //handleCleared???
    let updatedList = this.state.todoList
    let index = updatedList.indexOf((item))
    updatedList[index].isCleared = true
    this.setState({
      todoList: updatedList
    })
  }

  clearCompleted = () => {
    axios({
      url: 'http://localhost:8181/clearcompleted',
      method: 'POST',
      headers: {
        'Authorization': this.state.token
      }
    }).then(response => {
      console.log(response)
      axios({
        url: 'http://localhost:8181/usertodos',
        method: 'GET',
        headers: {
          'Authorization': this.state.token
        }
      })
        .then(response => {
          this.setState({
            todoList: response.data.todos
          })
        })
        .catch(error => {
          console.log(error)
        })
    })
  }

  updateTask = (item, newTask) => {
    let updatedList = this.state.todoList
    let index = updatedList.indexOf((item))
    updatedList[index].task = newTask
    this.setState({
      todoList: updatedList
    })
  }

  loginUser = (token) => {
    this.setState({
      isLoggedIn: true,
      token: token
    })
    axios({
      url: 'http://localhost:8181/usertodos',
      method: 'GET',
      headers: {
        'Authorization': token
      }
    })
      .then(response => {
        console.log(response.data)
        this.setState({
          todoList: response.data.todos
        })
      })
      .catch(error => {
        console.log(error)
      })
    
  }

  logoutUser = () => {
    this.setState({
      isLoggedIn: false,
      token: null,
      fname: 'You are not logged in!'
    })
  }

  updateName = (fname) => {
    this.setState({
      fname
    })
  }

  componentWillUpdate() {
    localStorage.setItem('todos', JSON.stringify(this.state.todoList))
  }

  componentWillMount() {
    const { token } = this.state
    if(token) {

    }
    // let todoList = JSON.parse(localStorage.getItem('todos'))
    // if(todoList) {
    //   this.setState({
    //     todoList: todoList
    //   })
    // }
  }

  render() {
    const styles = {
      logo: {
        padding: 5,
        width: 50,
        height: 50
      },
      banner: {
        backgroundColor: '#1F22A4'
      }
    }
    const {todoList, isLoggedIn} = this.state
    return (
      <div className="App container-fluid">
        <header style={styles.banner}>
          <img src={logo}
               style={styles.logo}
               alt="logo" />
          <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle} style={ {position: 'absolute', top: '12px', right: '25px'} }>
            <DropdownToggle caret>
              {this.state.fname}
            </DropdownToggle>
            {!isLoggedIn ? '' : (
            <DropdownMenu>
              <DropdownItem onClick={this.logoutUser} >Sign Out</DropdownItem>
            </DropdownMenu>) }
          </Dropdown>
        </header>
        {!isLoggedIn ?
          <Authentication loginUser={this.loginUser} updateName={this.updateName} /> 
          : 
          <div>
            <TodoAddBar lastID={todoList[todoList.length-1].id}
                        addToList={this.addToList} />
            <TodoList todoList={todoList}
                      toggleComplete={this.toggleComplete}
                      setCleared={this.setCleared}
                      updateTask={this.updateTask} 
                      clearCompleted={this.clearCompleted} />
          </div>
          }
      </div>
    )
  }
}

export default App;
