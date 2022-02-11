import React from "react";
import {
  Container,
  Row,
  Form,
  FormGroup,
  FormControl,
  FormLabel,
  Button,
  Alert,
  Table,
} from "react-bootstrap";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      location: "",
      country: "",
      records: [],
      countrys: [],
      employeeType: [],
      employeeRole: [],
      selectemployeeType: "",
      selectemployeeRole: "",
      showAlert: false,
      alertMsg: "",
      alertType: "success",
      id: "",
      update: false,
    };
  }

  selectEmployee(event) {
    this.setState({ selectemployeeType: event.target.value });
    this.setState({
      employeeRole: this.state.employeeType.find(
        (x) => x.name === event.target.value
      ).employeeRole,
    });
  }
  changeRole(event) {
    this.setState({selectemployeeRole: event.target.value});  
  }

  handleChange = (evt) => {
    this.setState({
      [evt.target.name]: evt.target.value,
    });
    // this.setState({
    //   selectemployeeRole: evt.target.value,
    // });
  };

  // calling the fetch function
  componentWillMount() {
    this.fetchAllRecords();
    this.countryName();
    this.setState({
      employeeType: [
        {
          name: "Permanent",
          employeeRole: ["Team Incharge", "Project Lead", "Team Member"],
        },
        { name: "Temporary", employeeRole: ["Team Member"] },
        { name: "On Contract", employeeRole: ["Team Member"] },
      ],
    });
  }

  // add a record
  addRecord = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var body = JSON.stringify({
      name: this.state.name,
      location: this.state.location,
      country: this.state.country,
      selectemployeeType: this.state.selectemployeeType,
      selectemployeeRole: this.state.selectemployeeRole,
    });
    fetch("http://localhost:8000/api/create", {
      method: "POST",
      headers: myHeaders,
      body: body,
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        this.setState({
          name: "",
          location: "",
          country: "",
          selectemployeeType: "",
          selectemployeeRole: "",
          showAlert: true,
          alertMsg: result.response,
          alertType: "success",
        });
        this.fetchAllRecords();
      });
  };

  // fetch All Records
  fetchAllRecords = () => {
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    fetch("http://localhost:8000/api/view", {
      method: "GET",
      headers: headers,
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("result", result);
        this.setState({
          records: result.response,
        });
      })
      .catch((error) => console.log("error", error));
  };

  //view a single data for edit
  editRecord = (id) => {
    fetch("http://localhost:8000/api/view/" + id, {
      method: "Get",
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        this.setState({
          id: id,
          update: true,
          name: result.response[0].name,
          location: result.response[0].location,
          country: result.response[0].country,
          selectemployeeType: result.response[0].employeeType,
          selectemployeeRole: result.response[0].employeeRole,
        });
        // console.log(result.response[0].employeeRole);
      })
      .catch((error) => console.log("error", error));
  };

  // update record
  updateRecord = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var body = JSON.stringify({
      id: this.state.id,
      name: this.state.name,
      location: this.state.location,
      country: this.state.country,
      selectemployeeType: this.state.selectemployeeType,
      selectemployeeRole: this.state.selectemployeeRole,
    });
    fetch("http://localhost:8000/api/update", {
      method: "PUT",
      headers: myHeaders,
      body: body,
    })
      .then((response) => response.json())
      .then((result) => {
        this.setState({
          showAlert: true,
          alertMsg: result.response,
          alertType: "success",
          update: false,
          id: "",
          name: "",
          location: "",
          country: "",
        });
        this.fetchAllRecords();
      })
      .catch((error) => console.log("error", error));
  };

  // delete a Record
  deleteRecord = (id) => {
    fetch("http://localhost:8000/api/delete/" + id, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((result) => {
        this.setState({
          showAlert: true,
          alertMsg: result.response,
          alertType: "danger",
        });
        this.fetchAllRecords();
      })
      .catch((error) => console.log("error", error));
  };

  //view a country
  countryName = () => {
    fetch("http://localhost:8000/api/country", {
      method: "Get",
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        this.setState({
          countrys: result.response,
        });
      })
      .catch((error) => console.log("error", error));
  };

  render() {
    return (
      <div>
        <Container>
          {this.state.showAlert === true ? (
            <Alert
              variant={this.state.alertType}
              onClose={() => {
                this.setState({
                  showAlert: false,
                });
              }}
              dismissible
            >
              <Alert.Heading>{this.state.alertMsg}</Alert.Heading>
            </Alert>
          ) : null}

          {/* All Records */}
          <Row>
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>id</th>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Country</th>
                  <th>Employee Type</th>
                  <th>Employee Role</th>
                  <th colSpan="2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {this.state.records.map((record) => {
                  return (
                    <tr>
                      <td>{record.id}</td>
                      <td>{record.name}</td>
                      <td>{record.location}</td>
                      <td>{record.country}</td>
                      <td>{record.employeeType}</td>
                      <td>{record.employeeRole}</td>
                      <td>
                        <Button
                          variant="info"
                          onClick={() => this.editRecord(record.id)}
                        >
                          Edit
                        </Button>
                      </td>
                      <td>
                        <Button
                          variant="danger"
                          onClick={() => this.deleteRecord(record.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Row>

          {/* Insert Form */}
          <Row>
            <Form>
              <FormGroup>
                <FormLabel>Enter the name</FormLabel>
                <FormControl
                  type="text"
                  name="name"
                  placeholder="Enter the name"
                  onChange={this.handleChange}
                  value={this.state.name}
                ></FormControl>
              </FormGroup>
              <FormGroup>
                <FormLabel>Enter the Location</FormLabel>
                <FormControl
                  type="text"
                  name="location"
                  value={this.state.location}
                  onChange={this.handleChange}
                  placeholder="Enter the Location"
                ></FormControl>
              </FormGroup>
              <FormGroup>
                <FormLabel className="mx-2">Select Employee Type</FormLabel>
                <select
                  className="my-3"
                  name="selectemployeeType"
                  value={this.state.selectemployeeType}
                  onChange={this.selectEmployee.bind(this)}
                >
                  <option>---Select Type---</option>
                  {this.state.employeeType.map((type) => {
                    return <option>{type.name}</option>;
                  })}
                </select>
                <select 
                  name="selectemployeeRole"
                  className="mx-3" 
                  value={this.state.selectemployeeRole} 
                  
                  onChange={this.changeRole.bind(this)}>
                  
                  <option>---Slect Role---</option>
                  {this.state.employeeRole.map((role) => {
                    return (<option name="selectemployeeRole" value={role}>
                      {role}
                      </option>
                      );
                  })}
                </select>
              </FormGroup>
              <FormGroup>
                <FormLabel className="mx-2">Select the Country</FormLabel>

                <select
                  className="my-3"
                  name="country"
                  value={this.state.country}
                  onChange={this.handleChange}
                >
                  <option>---Country---</option>
                  {this.state.countrys.map((country) => {
                    return (
                      <option name="country" value={country.name}>
                        {country.name}
                      </option>
                    );
                  })}
                </select>
                {/* <Dropdown>
					<Dropdown.Toggle variant="success" id="dropdown-basic" onClick={this.countryName}>
						Country
					</Dropdown.Toggle>
					
					<Dropdown.Menu>
						{this.state.countrys.map((country) => {
							return (							
								<Dropdown.Item href="#">{country.name}</Dropdown.Item>
							  );
						})}
						
					</Dropdown.Menu>
				</Dropdown> */}
              </FormGroup>

              {this.state.update === true ? (
                <Button onClick={this.updateRecord}>update</Button>
              ) : (
                <Button onClick={this.addRecord}>Save</Button>
              )}
            </Form>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
