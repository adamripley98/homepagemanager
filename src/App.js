import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

// TODO add loading component
// TODO display errors nicely

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      success: '',
      error: '',
      items: ['Dining', 'Laundry', 'News', 'Events', 'Feedback'],
      options: ['Dining', 'Laundry', 'News', 'Events', 'Feedback'],
      itemNum: 0,
      newItem: '',
    }
    this.submitForm = this.submitForm.bind(this);
    this.renderItems = this.renderItems.bind(this);
    this.handleChangeNewItem = this.handleChangeNewItem.bind(this);
    this.addOption = this.addOption.bind(this);
    this.addItem = this.addItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
  }

  componentDidMount() {
    axios.get('http://localhost:5000/homepage/order')
    .then(resp => {
      // TODO error check
      console.log('what is resp.data', resp.data, resp.data.cells);
      if (resp.data.cells && resp.data.cells.length) {
        this.setState({
          items: resp.data.cells,
          itemNum: resp.data.cells.length,
        });
      }
    })
    .catch(err => {
      this.setState({
        error: 'Error finding homepage content.',
      })
    })
  }

  submitForm() {
    axios.post('http://localhost:5000/homepage/order', {
      cellOptions: this.state.items,
    })
    .then(resp => {
      if (resp.data.success) {
        console.log('homepage updated');
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

  handleChangeNewItem(e) {
    this.setState({
      newItem: e.target.value,
    });
  }

  addItem() {
    const newItems = this.state.items.slice();
    newItems.push(this.state.items[0]);
    console.log(newItems);
    this.setState({
      items: newItems,
    });
  }

  removeItem() {
    const newItems = this.state.items.slice();
    newItems.pop();
    console.log(newItems);
    this.setState({
      items: newItems,
    });
  }

  addOption() {
    if (this.state.newItem) {
      const newItems = this.state.items.slice();
      newItems.push(this.state.newItem);
      this.setState({
        items: newItems,
      });
      console.log('adding option', this.state.newItem);
    }
  }

  changeItem(e, i){
    const newItems = this.state.items.slice();
    newItems.splice(i, 1, e.target.value);
    console.log('what is newItems', newItems);
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
              <select value={this.state.items[index]} key={index} onChange={(e) => this.changeItem(e, index)}>
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
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Homepage Manager</h1>
        </header>
        <p className="App-intro">
          This web app will be used to control what cells Penn Mobile users will see on the homepage.
        </p>
        <div className="container">
          {this.renderItems()}
          <p>Add an item to homepage</p>
          <input type="submit" value="+" className="add" onClick={this.addItem}></input>
          <p>Remove an item from homepage</p>
          <input type="submit" value="-" className="delete" onClick={this.removeItem}></input>
          <br/>
          <input type="submit" onClick={this.submitForm} value="Submit" className="submit"></input>
        </div>
      </div>
    );
  }
}

export default App;
