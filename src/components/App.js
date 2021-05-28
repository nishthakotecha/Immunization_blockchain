import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import Immunization from '../abis/Immunization.json'

const ipfsClient = require('ipfs-mini')
const ipfs = new ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values
var immunization_data = [ ];
var record_number = 1;

class App extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
      patientName: '',
      doctorName: '',
      data: null,
      contract: null,
      web3: null,
      account: null,
      immunizationName: '',
      immunizationDate:'',
      patientRecordNo:0,
      recordNumber:0,
      patientRecord:[],
      display: true
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleGetRecord = this.handleGetRecord.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

   async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
     console.log('accounts=' , accounts)
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    console.log('networkId=' , networkId)
    const networkData = Immunization.networks[networkId]
    console.log('networkData=' , networkData)
    if(networkData) {

      const contract = new web3.eth.Contract(Immunization.abi, networkData.address)
      this.setState({ contract })
      console.log('contract=' , contract)
      this.setState({ display : true })
    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }


  handleChange = (event) => {
    event.preventDefault()

    const target = event.target;
    const name = target.name;
    var value = '';

    if(name === 'patientName'){
      value = target.value;
    }
    else if(name === 'doctorName'){
      value = target.value;
    }
    else if(name === 'immunizationName'){
      value = target.value;
    }
    else if(name === 'immunizationDate'){
      value = target.value;
    }
    else if(name === 'recordNumber'){
      value = target.value;
    }

  
    this.setState({
      [name]: value
    });
    
  }

  handleGetRecord = (event) => {
    event.preventDefault()

    
    if(this.state.recordNumber < record_number && this.state.recordNumber > 0)
    {
        this.state.contract.methods.get(this.state.recordNumber).call().then((result) => {     
            console.log("Hash value from Smart Contract =",result)
            const url = 'https://ipfs.infura.io/ipfs/' + result
            console.log("Location of patient data in IPFS =",url)
            fetch(url).then((response) => {
              response.text().then((pRecord) => {
                console.log("Patient Record from IPFS =",pRecord)
                const pRecord_parts = pRecord.split(',');
                this.setState({ patientRecord : pRecord_parts })
              }); //response   
            });//fetch
          });//get

        
    }
    else
    {
       window.alert('Invalid record number.')
    }

        
  }


  handleSubmit = (event) => {
    event.preventDefault()
    
    
    if(this.state.patientName == '' || this.state.doctorName == '')
    {
      window.alert("Please enter Patient name or Doctor name.")
      return;
    }

    if(this.state.immunizationName == '')
    {
      window.alert("Please enter Immunization name.")
      return;
    }

    if(this.state.immunizationDate == '')
    {
      window.alert("Please enter Immunization date.")
      return;
    }

    var CurrentDate = new Date();
    var GivenDate = new Date(this.state.immunizationDate);

    if(GivenDate > CurrentDate){
      window.alert('Invalid date. Please enter valid date.');
      return;
    }else{
      console.log('valid date');
    }
      
    if(immunization_data.length > 0){
      var flag = false;
      for(var i = 0; i < immunization_data.length; i++){
        var parts = immunization_data[i].split(",")
        // check if record of patient already exists, store only doctor name, immunization name and date
        if(parts[1] === this.state.patientName){
          this.state.data = immunization_data[i] + ',' + this.state.doctorName + ',' + this.state.immunizationName + ',' + this.state.immunizationDate;
          immunization_data[i] = this.state.data;
          this.state.patientRecordNo = parts[0];
          flag = true;
          break;
        } 
      }

      // if none of the records match then flag will remain false
      if(flag == false)
      {
        this.state.data =  record_number + ',' + this.state.patientName + ',' + this.state.doctorName + ',' + this.state.immunizationName + ',' + this.state.immunizationDate;
        immunization_data.push(this.state.data)
        this.state.patientRecordNo = record_number;
        record_number = record_number + 1;
      }
    }

     if(immunization_data.length === 0){
        this.state.data =  record_number + ',' + this.state.patientName + ',' + this.state.doctorName + ',' + this.state.immunizationName + ',' + this.state.immunizationDate;
        immunization_data.push(this.state.data)
        this.state.patientRecordNo = record_number;
        record_number = record_number + 1;
        //console.log("first immunization data  =",immunization_data)
      }

      console.log("immunization data =",immunization_data)

    
      console.log("Submitting file to ipfs...")
      ipfs.add(this.state.data, (error, hash) => {
        if(error) {
          console.log(error)
          return
        }
        console.log('https://ipfs.infura.io/ipfs/' + hash);
       
       
        this.state.contract.methods.set(this.state.patientRecordNo,hash).send({ from: this.state.account })
       
        this.state.contract.once('CreatedPatientEvent', {fromBlock: 0}, function(error, event){ 
          console.log("event=",event); 
         
        }); // event
        
         window.alert('Patient Record Stored. Record number is ' + this.state.patientRecordNo)
         this.setState({ display : false })

      })// ipfs
  }
   
  handleClick()  {
    this.setState({ display : true });
    this.setState({ patientName : ''})
    this.setState({ doctorName : ''})
    this.setState({ immunizationName : ''})
    this.setState({ immunizationDate : ''})
    this.setState({ patientRecord : ''})
  }


  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top flex-md-nowrap p-0 shadow">
          <h1>TravelFree. Let's get Movin'</h1>
        </nav>
        <p>&nbsp;</p>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
             { this.state.display?
              <div className="content mr-auto ml-auto">
                <h2>Immunization Form</h2>
                <p> </p>
                 <form onSubmit={this.handleSubmit}>
                    <label>
                      Patient Name:
                      <input name = "patientName" type="text" value={this.state.patientName} onChange={this.handleChange} />
                    </label>
                    <p> </p>
                    <label>
                      Medical Center:
                      <input name = "doctorName" type="text" value={this.state.doctorName} onChange={this.handleChange} />
                    </label>
                    <p> </p>
                    <p>Immunization Type</p>
                    <select 
                      name = "immunizationName"
                      value={this.state.immunization} 
                      onChange={this.handleChange} 
                    >
                      <option value=''></option>
                      <option value="Astra-Zeneca">Astra-Zeneca</option>
                      <option value="Johnson&Johnson">Johnson&Johnson</option>
                      <option value="Moderna">Moderna</option>
                      <option value="Pfizer">Pfizer</option>
                      <option value="PCR">PCR</option>
                      <option value="Recovery from past exposure">Recovery</option>
                    </select>
                    <p> </p>
                    <label>
                      Immunization Date:
                      <input name = "immunizationDate" type="date" value={this.state.immunizationDate} onChange={this.handleChange} />
                    </label>
                    <p> </p>
                  <input type="submit" value="Submit" />
                   <p>&nbsp;</p>
                </form> 
                </div>
                  :
                <form onSubmit={this.handleGetRecord} className="content mr-auto ml-auto">
                 <h2>Get Patient Immunization Record </h2>
                 <p>&nbsp;</p>
                  <label>
                   Enter Record Number:
                    <input name="recordNumber" type="number" value={this.state.recordNumber} onChange={this.handleChange} />
                  </label>
                  <input type="submit" value="Get Patient Record" />
                  <p>&nbsp;</p>
                  <div>
                    <h3> Patient Record </h3>
                    <p> Patient Record Number: {this.state.patientRecord[0]}  </p>
                    <p> Patient name : {this.state.patientRecord[1]}</p>
                    <p> Medical Center : Immunization Type : Immunization Date </p>
                    <p> {this.state.patientRecord[2]} : {this.state.patientRecord[3]} : {this.state.patientRecord[4]}</p>
                    <p> {this.state.patientRecord[5]} : {this.state.patientRecord[6]} : {this.state.patientRecord[7]}</p>
                    <p> {this.state.patientRecord[8]} : {this.state.patientRecord[9]} : {this.state.patientRecord[10]}</p>
                    <button onClick={() => this.handleClick()}>
                        Home
                    </button> 
                  </div>
                </form> 
              }
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;