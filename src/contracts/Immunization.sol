pragma solidity ^0.5.0;

contract Immunization {

	struct patientRecord {
		string patientHash;
		uint recordNumber;
	}

	
	 mapping(uint => patientRecord) public Records;
	 event CreatedPatientEvent();
	 
	 

	function set(uint _recordNumber,string memory _patientHash) public returns (bool){
	    
	   require(_recordNumber > 0); //check the record number is entered
       require(bytes(_patientHash).length > 0, "Patient Name is required"); //check the patient name is entered
       
	   
	   Records[_recordNumber-1].patientHash = _patientHash;
	   Records[_recordNumber-1].recordNumber = _recordNumber;
	   emit CreatedPatientEvent();
	   return true;
	}


	function get(uint _recordNumber) public view returns(string memory){
		
	    
		 patientRecord storage r = Records[_recordNumber-1];
		 return(r.patientHash);
	    
	}
}