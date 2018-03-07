import React, { Component } from 'react'
import { Button, ButtonGroup, InputGroup, Input, Badge, ButtonToolbar, Tooltip } from 'reactstrap'

// TodoList + filter capabilities
class TodoList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // When no tasks are checked
      disableClear: this.props.todoList.every((item) => { return item.isComplete === false}),
      viewSelected: 'Active',
    }
  }

  clearCompleted = () => {
    // Goes through each item in todoList using map function and if item is checked as completed -> run setCleared function.
    this.props.todoList.map(item => (item.isComplete === true) ? this.props.setCleared(item) : null)
    this.setState({ 
      disableClear: true,
    })
  }

  onRadioBtnClick = (view) => {
    this.setState({
      viewSelected: view
    })
  }

  componentWillUpdate(nextProps, nextState) {
    localStorage.setItem('viewSelected', nextState.viewSelected)
  }

  componentWillMount() {
    let viewSelected = localStorage.getItem('viewSelected')
    if(viewSelected) {
      this.setState({
        viewSelected: viewSelected
      })
    }
  }

  render() {
    const { todoList } = this.props
    const { viewSelected } = this.state
    let selectedList
    // Filter list into new array to be mapped
    viewSelected === 'Active' &&
      (selectedList = todoList.filter((item) => { return item.isCleared === false }))
    
    viewSelected === 'Completed' &&
    (selectedList = todoList.filter((item) => { return item.isCleared === true || item.isComplete === true }))    

    viewSelected === 'All' && 
      (selectedList = todoList) 
    
    const disableClear = selectedList.every((item) => { return item.isComplete === false || item.isCleared === true })
    const activeNum = todoList.reduce((acc, cur) => { return acc + !cur.isCleared }, 0)
    const completedNum = todoList.reduce((acc, cur) => { return acc + (cur.isComplete && cur.isCleared) }, 0)
    // const completedNum = todoList.reduce((acc, cur) => { return acc + cur.isComplete}, 0)
    const itemsToDisplay = selectedList.map((item) => 
      <Todo key={item.id}
            item={item}
            toggle={this.props.toggleComplete}
            checkCompleted={this.checkCompleted}
            updateTask={this.props.updateTask} />
    )
    const styles = {
      inlineBlock: {
        display: 'inline-block'
      },
      congratsMessage: {
        color: '#1F22A4',
        marginTop: 20,
        fontSize: '2rem'
      },
      buttonFont: {
        fontSize: '1.4rem'
      }
    }

    return <div>
        <ButtonToolbar>
          <ButtonGroup className={'btn-group-justified'} style={styles.inlineBlock}>
            <Button href="#" 
                    color="primary"
                    style={styles.buttonFont}
                    onClick={() => this.onRadioBtnClick('Active')}
                    active={viewSelected === 'Active'}>
              Active <Badge color="secondary">{activeNum}</Badge>
            </Button>
            <Button href="#" 
                    color="primary" 
                    style={styles.buttonFont}
                    onClick={() => this.onRadioBtnClick('Completed')} 
                    active={viewSelected === 'Completed'}>
              Completed <Badge color="secondary">{completedNum}</Badge>
            </Button>
            <Button href="#" 
                    color="primary" 
                    style={styles.buttonFont}
                    onClick={() => this.onRadioBtnClick('All')} 
                    active={viewSelected === 'All'}>
              All <Badge color="secondary">{todoList.length}</Badge>
            </Button>
            <Button href="#" 
                    color="success" 
                    style={styles.buttonFont}
                    onClick={this.clearCompleted} 
                    disabled={disableClear || viewSelected === 'Completed'}>
              Clear Completed
            </Button>
          </ButtonGroup>
        </ButtonToolbar>
        {(itemsToDisplay.length === 0 && viewSelected === 'Active') ? 
          <h3 className="lead" style={styles.congratsMessage}>Congrats! You have no more to-do's!</h3> : itemsToDisplay }
      </div>
  }
}

// Individual Todo Component
class Todo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      editOn: false,
      task: this.props.item.task
    }
  }

  toggleClick = (event) => {
    this.props.toggle(this.props.item)
  }

  enableEdit = () => {
    this.setState(prevState => ({
      editOn: !prevState.editOn
    }))
  }

  updateTask = (event) => {
    this.setState({
      task: event.target.value
    })
    this.props.updateTask(this.props.item, event.target.value)
  }

  shouldComponentUpdate() {
    console.log(`shouldComponentUpdate returns true`);
    return true
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(`ComponentDidUpdate:  prevState = `)
    console.log(prevState)

    this.state.editOn && this.state.editOn !== prevState.editOn ? this.textInput.focus() || this.textInput.select() : console.log('editOn is false')
    
  }
  
  componentWillUpdate(nextProps, nextState) {
    console.log(`ComponentWillUpdate:  nextState = `)
    console.log(nextState)
  }
  



  render() {
    const { id, task, isComplete, isCleared, completed } = this.props.item
    const styles = {
      // Include readOnly attribute with no change in styling
      noGreyOut: {
        backgroundColor: 'transparent',
        borderColor: 'lightgrey',
        borderWidth: 0.25,
        borderBottomWidth: 0.5
      },
      clearHint: {
        color: 'darkblue',
        backgroundColor: 'lightblue',
      },
      completed: {
        textDecoration: 'line-through',
        color: '#5BC16C'
      },
      clearableTooltip: {
        color: 'white',
        fontSize: '1rem',
        backgroundColor: '#050755',
        marginRight: 43,
        verticalAlign: 'bottom'
      },
      canEdit: {
        color: 'black',
        backgroundColor: '#D7F9DD'
      },
      cannotEdit: {
        color: 'black'
      },
      transparentButton: {
        backgroundColor: 'white',
        borderColor: 'lightgrey'
      },
      editOnButton: {
        backgroundColor: '#D7F9DD',
        borderColor: 'transparent'
      },
      checked: {
        color: '#5BC16C',
      },
      unchecked: {
        color: '#D4DDDF'
      },
      inputFont: {
        fontSize: '1.4rem'
      }
    }
    // Conditional Rendering 
    const showLineThrough = isComplete ? styles.completed : false 
    const editOrNot = this.state.editOn ? styles.canEdit : styles.cannotEdit
    const showClearHint = isComplete && !isCleared
    const itemId = `item${id}`
    const customTask = isComplete ? `${task} ---- Done ${completed}` : task

    return (
      <div>
        <InputGroup>
          <Button style={{...this.state.editOn ? styles.editOnButton : styles.transparentButton, ...styles.inputFont}}
                  type="button"
                  onClick={this.toggleClick}>
            <span className="glyphicon glyphicon-ok"
                  style={isComplete ? styles.checked : styles.unchecked}
                  aria-hidden="true">
            </span>
          </Button>
          <Input id={itemId}
                 readOnly={!this.state.editOn}
                 style={{...styles.noGreyOut, ...editOrNot, ...showLineThrough, ...styles.inputFont}}
                 type="text"
                 value={customTask}
                 onChange={this.updateTask}
                 // Bootstrap Input uses innerRef instead of ref [ref will only get you a reference to the Input component, use innerRef to get a reference to the DOM input (for things like focus management).]
                 innerRef={(input) => { this.textInput = input }} />
          <Tooltip style={styles.clearableTooltip}
                   placement="left"
                   isOpen={showClearHint}
                   target={itemId}>
            Clearable
          </Tooltip>
          <Button style={{...this.state.editOn ? styles.editOnButton : styles.transparentButton, ...styles.inputFont}}
                  onClick={this.enableEdit}>
            <span className="glyphicon glyphicon-pencil"
                  style={this.state.editOn ? styles.checked : styles.unchecked}
                  aria-hidden="true" >
            </span>
          </Button>
        </InputGroup>
      </div>
    )
  }
}


export default TodoList