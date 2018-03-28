import React, { Component } from 'react';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';
import axios from 'axios';
import './App.css';

// TODO add loading component
// TODO display errors nicely

const SortableItem = SortableElement(({value}) =>
  <li className="list-item">{value}</li>
);

const SortableList = SortableContainer(({items}) => {
  return (
    <ul>
      {items.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} value={value} />
      ))}
    </ul>
  );
});

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      success: '',
      error: '',
      items: ['Dining', 'Laundry', 'News', 'Events', 'Feedback'],
    }
    this.submitForm = this.submitForm.bind(this);
  }

  componentDidMount() {
    axios.get('http://localhost:5000/homepage/order')
    .then(resp => {
      // TODO error check
      console.log('what is resp.data', resp.data, resp.data.cells);
      if (resp.data.cells && resp.data.cells.length) {
        this.setState({
          items: resp.data.cells,
        });
      }
    })
    .catch(err => {
      this.setState({
        error: 'Error finding homepage content.',
      })
    })
  }

  onSortEnd = ({oldIndex, newIndex}) => {
    this.setState({
      items: arrayMove(this.state.items, oldIndex, newIndex),
    });
  };

  submitForm() {
    console.log('submitted', this.state.items);
    axios.post('http://localhost:5000/homepage/order', {
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
          <SortableList items={this.state.items} onSortEnd={this.onSortEnd} />
        </div>
        <input name="number" type="number"/>
        <input type="submit" className="submit" onClick={this.submitForm}></input>
      </div>
    );
  }
}

export default App;
