import React, { Component } from 'react'
import { Button, Form, Input } from 'reactstrap'
// import getToday from './getToday.js'

class TodoAddBar extends Component {
  constructor() {
    super()
    this.state = {
      task: '',
      isEmptyOnSubmit: false
    }
  }

  handleSubmit = () => {
    if(this.state.task !== '') {
      let newTask = {
        id: this.props.lastID + 1,
        task: this.state.task,
        completeBy: null,
        completed: null,
        isComplete: false,
        isCleared: false
      }
      this.props.addToList(newTask)
      this.setState({
        task: '',
        isEmptyOnSubmit: false
      })
    } else {
      this.setState({
        isEmptyOnSubmit: true
      })
    }
  }

  updateTask = (event) => {
    this.setState({
      task: event.target.value
    })
  }

  render() {
    const placeHolder = "What do you need to do?"
    const styles = {
      flex: {
        display: 'flex'
      },
      inputFont: {
        fontSize: '1.5rem'
      },
      buttonFont: {
        fontSize: '1.4rem'
      }
    }
    return (
      <Form style={styles.flex} onSubmit={(event) => {event.preventDefault()}}>
        <Input valid={!this.state.isEmptyOnSubmit}
               type="text"
               style={styles.inputFont}
               value={this.state.task}
               placeholder={placeHolder}
               onChange={this.updateTask}
               onKeyDown={(event) => {if(event.keyCode === 13) this.handleSubmit()}}/>
        <Button color="primary"
                type="button"
                style={styles.buttonFont}
                onClick={this.handleSubmit}>
          <span className="glyphicon glyphicon-plus"
                aria-hidden="true">
          </span>
        </Button>
      </Form>
    )
  }
}

export default TodoAddBar