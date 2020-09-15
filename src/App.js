import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      doctors: {},
      selectedDoctor: null,
    };
  }
  componentDidMount = async () => {
    await fetch('http://localhost:3000/api/v1/physicians')
      .then(function(response) {
        return response.json();
      }).then((data) => {
        this.setState({
          doctors: data,
          selectedDoctor: data[0].id, // setting default doctor to first one
          appointments: []
        })
      });
    let selected = this.state.selectedDoctor
    fetch(`http://localhost:3000/api/v1/appointments?id=${selected}`)
      .then(function(response) {
        return response.json();
      }).then((data) => {
        this.setState({
          isLoaded: true,
          appointments: data
        })
    });
  }

  getAppointments = (physician_id) => {
    fetch(`http://localhost:3000/api/v1/appointments?id=${physician_id}`)
      .then(function(response) {
        return response.json();
      }).then((data) => {
        this.setState({
          isLoaded: true,
          appointments: data,
          selectedDoctor: physician_id,
        })
    });
  }

  renderDoctorsList = (docs) => {
    let docList = [];
    for (const [index, value] of docs.entries()){
      docList.push(<button onClick={() => this.getAppointments(value.id)} key={index}>{value.name}</button>)
    }
    return docList;
  }

  renderAppointments = (appt) => {
    let apptList = [];
    for (const [index, value] of appt.entries()){
      apptList.push(<li key={index}>{value.id} {value.name} {value.time} {value.kind}</li>)
    }
    return apptList;
  }

  render() {
    if(!this.state.isLoaded) return (<div>Loading...</div>);
    console.log(this.state);
    return (
      <div className="App">
        <header className="app-body">
          {/* todo: break into components */}
          <div className="doctors column">
            {this.renderDoctorsList(this.state.doctors)}
          </div>
          <div className="appointments column">
            {this.renderAppointments(this.state.appointments)}
          </div>
        </header>
      </div>
    );
  }
  
}

export default App;
