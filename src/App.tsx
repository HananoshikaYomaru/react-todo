
import React, { Component } from "react";
import Modal , {itemStates}  from "./components/Modal";
import axios from "axios";

type MyProps = any ; 
type MyStates =  {
  modal : boolean, 
  viewCompleted : boolean , 
  activeItem : itemStates   ,
  todoList :  itemStates[], 
}

class App extends Component<MyProps, MyStates>  {
  constructor(props: any) {
    super(props);
    this.state = {
      modal : false , 
      viewCompleted: false,
      activeItem: { 
        title: "",
        description: "",
        completed: false
      },
      todoList: []
    };
  }
  componentDidMount() {
    this.refreshList();
  }
  refreshList = () => {
    axios
      .get("http://localhost:8000/api/testings/")
      .then(res => this.setState({ todoList: res.data }))
      .catch(err => console.log(err));
  };
  displayCompleted = (status : boolean ) => {
    if (status) {
      return this.setState({ viewCompleted: true });
    }
    return this.setState({ viewCompleted: false });
  };
  renderTabList = () => {
    return (
      <div className="my-5 tab-list">
        <span
          onClick={() => this.displayCompleted(true)}
          className={this.state.viewCompleted ? "active" : ""}
        >
          complete
            </span>
        <span
          onClick={() => this.displayCompleted(false)}
          className={this.state.viewCompleted ? "" : "active"}
        >
          Incomplete
            </span>
      </div>
    );
  };
  renderItems = () => {
    const { viewCompleted } = this.state;
    const newItems = this.state.todoList.filter(
      item => item.completed === viewCompleted
    );
    return newItems.map(item => (
      <li
        key={item.id}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        <span
          className={`todo-title mr-2 ${this.state.viewCompleted ? "completed-todo" : ""
            }`}
          title={item.description}
        >
          {item.title}
        </span>
        <span>
          <button
            onClick={() => this.editItem(item)}
            className="btn btn-secondary mr-2"
          >
            {" "}
                Edit{" "}
          </button>
          <button
            onClick={() => this.handleDelete(item)}
            className="btn btn-danger"
          >
            Delete{" "}
          </button>
        </span>
      </li>
    ));
  };
  toggle = () => {
    this.setState({ modal :!this.state.modal});
  };

  handleSubmit = (item : itemStates) => {
    this.toggle();
    console.log(item) ; 
    if (item.id) {
      axios
        .put(`http://localhost:8000/api/testings/${item.id}/`, item)
        .then(res => this.refreshList());
        console.log('submitted old') ; 
      return;
    }
    console.log('submitted new ') ; 
    axios
      .post("http://localhost:8000/api/testings/", item)
      .then(res => this.refreshList());
  };

  handleDelete = (item : itemStates) => {
    axios
      .delete(`http://localhost:8000/api/testings/${item.id}`)
      .then(res => this.refreshList());
  };
  createItem = () => {
    console.log(this.state.todoList.length) ; 
    
    console.log(this.state.activeItem.id) ; 
    const item = {  title: "", description: "", completed: false };
    
    this.setState({ activeItem: item, modal: !this.state.modal });
  };
  editItem = (item : itemStates) => {
    this.setState({ activeItem: item, modal: !this.state.modal});
  };
  render() {
    return (
      <main className="content">
        <h1 className="text-white text-uppercase text-center my-4">Todo app</h1>
        <div className="row ">
          <div className="col-md-6 col-sm-10 mx-auto p-0">
            <div className="card p-3">
              <div className="">
                <button onClick={this.createItem} className="btn btn-primary">
                  Add task
                    </button>
              </div>
              {this.renderTabList()}
              <ul className="list-group list-group-flush">
                {this.renderItems()}
              </ul>
            </div>
          </div>
        </div>
        {this.state.modal ? (
          <Modal
            activeItem={this.state.activeItem}
            toggle={this.toggle}
            onSave={this.handleSubmit}
          />
        ) : null}
      </main>
    );
  }
}
export default App;