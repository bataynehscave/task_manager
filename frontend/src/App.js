import React, { Component } from 'react'
import './App.css';
import CustomModal from './components/Modal'
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      viewCompleted: false,
      activeItem: {
        title: "",
        description: "",
        completed: false,
      },
      taskList: []
    };
  }
  componentDidMount() {
    this.refreshList();
  }
  refreshList = () => {
    axios.get("http://127.0.0.1:8000/api/tasks/")
      .then(res => this.setState({ taskList: res.data }))
      .catch(err => console.log(err))
  }
  toggle = () => {
    this.setState({ modal: !this.state.modal });
  }
  handleSubmit = item => {
    this.toggle()
    if (item.id) {
      axios.put(`http://localhost:8000/api/tasks/${item.id}/`, item)
        .then(res => this.refreshList())
    }
    axios.post('http://localhost:8000/api/tasks/', item)
      .then(res => this.refreshList())
  }
  handleDelete = item => {

    axios.delete(`http://localhost:8000/api/tasks/${item.id}/`)
      .then(res => this.refreshList())
  }
  displayCompleted = status => {
    if (status) {
      return this.setState({ viewCompleted: true });
    }
    return this.setState({ viewCompleted: false });
  }
  createItem = () => {
    const item = { title: '', modal: !this.state.modal }
    this.setState({ activeItem: item, modal: !this.state.modal })
  }
  editItem = (item) => {
    this.setState({ activeItem: item, modal: !this.state.modal })
  }
  renderTabList = () => {
    return (
      <div className="my-5 tab-list">
        <span onClick={() => this.displayCompleted(true)}
          className={this.state.viewCompleted ? "active" : ""}
        >
          Completed
        </span>
        <span onClick={() => this.displayCompleted(false)}
          className={this.state.viewCompleted ? "" : "active"}
        >
          InCompleted
        </span>
      </div>
    )
  }

  // render items in the list comp or incomp
  renderItems = () => {
    const { viewCompleted } = this.state;
    const newItems = this.state.taskList.filter(
      item => item.completed === viewCompleted
    );
    return newItems.map(item => (
      <li key={item.id} className='list-group-item d-flex justify-content-between align-items-center'>
        <span className={`todo-title mr-2 ${this.state.viewCompleted ? "completed-todo" : ""}`} title={item.title}>
          {item.title}
        </span>
        <span>
          <button className='btn btn-info mr-2' onClick={() => this.editItem(item)}>
            Edit
          </button>
          <button className='btn btn-danger mr-2' onClick={() => this.handleDelete(item)}>
            Delete
          </button>
        </span>
      </li>
    ))
  }



  render() {
    return (
      <main className='content p-3 mb-2 bg-success'>
        <h1 className='text-white text-uppercase text-center my-4'> Task Manager </h1>
        <div className='row'>
          <div className='col-md-6 col-sma-10 mx-auto p-0'>
            <div className='card p-3'>
              <div>
                <button className="btn btn-primary" onClick={this.createItem}>Add Task</button>
              </div>
              {this.renderTabList()}
              <ul className='list-group list-group-flush'>
                {this.renderItems()}
              </ul>
            </div>
          </div>
        </div>
        <footer className='my-5 mb-2 bg-success text-white text-center'>
          copyright 2024 &copy; all rights reserved
        </footer>
        {this.state.modal ? (
          <CustomModal activeItem={this.state.activeItem} toggle={this.toggle} onSave={this.handleSubmit} />
        ) : null}
      </main>
    )
  }



}

export default App;
