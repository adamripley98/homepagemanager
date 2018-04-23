import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      success: '',
      error: '',
      items: [],
      options: ['Dining', 'Laundry', 'News', 'Event', 'GSR'],
    }
    this.submitForm = this.submitForm.bind(this);
    this.renderItems = this.renderItems.bind(this);
    this.addItem = this.addItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
  }

  componentDidMount() {
    axios.get('http://api-dev.pennlabs.org/homepage/order')
    .then(resp => {
      if (resp.data.cells && resp.data.cells.length) {
        this.setState({
          items: resp.data.cells,
        });
      }
    })
    .catch(err => {
      this.setState({
        error: 'Error finding homepage content.',
        success: '',
      })
    })
  }

  submitForm() {
    axios.post('http://api-dev.pennlabs.org/homepage/order', {
      cellOptions: this.state.items,
    })
    .then(resp => {
      if (resp.data.success) {
        this.setState({
          success: 'Homepage updated.',
          error: ''
        })
      } else {
        this.setState({
          success: '',
          error: 'Error updating homepage.',
        })
      }
    })
    .catch(err => {
      this.setState({
        success: '',
        error: 'Error updating homepage.',
      });
    });
  }

  addItem() {
    const newItems = this.state.items.slice();
    newItems.push(this.state.items[0]);
    this.setState({items: newItems});
  }

  removeItem() {
    const newItems = this.state.items.slice();
    newItems.pop();
    this.setState({items: newItems});
  }

  changeItem(e, i){
    const newItems = this.state.items.slice();
    newItems.splice(i, 1, e.target.value);
    this.setState({
      items: newItems,
    });
  }

  renderItems() {
    return (
      <form id="myForm">
        {
          this.state.items.map((_, index) => (
            <div key={index}>
              <select className="custom-select select" value={this.state.items[index]} key={index} onChange={(e) => this.changeItem(e, index)}>
                {this.state.options.map((item, i) => (
                  <option value={item} key={i}>{item}</option>
                ))}
              </select>
              <br/>
            </div>
          ))
        }
      </form>
    )
  }

  render() {
    return (
      <div className="container">
        <div className="card">
          <div className="card-header">
            This web app will be used to control what cells Penn Mobile users will see on the homepage.
          </div>
          <div className="card-body">
            {
              this.state.success &&
              <div className="alert alert-success" role="alert">
                {this.state.success}
              </div>
            }
            {
              this.state.error &&
              <div className="alert alert-danger" role="alert">
                {this.state.error}
              </div>
            }
            {this.renderItems()}
            <div className="buttons">
              <input type="submit" value="Remove item" className="btn btn-secondary" onClick={this.removeItem}></input>
              <input type="submit" value="Add item" className="btn btn-secondary" onClick={this.addItem}></input>
            </div>
            <div className="line" />
            <input type="submit" onClick={this.submitForm} value="Submit" className="btn btn-primary"></input>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
