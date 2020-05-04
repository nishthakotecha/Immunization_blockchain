# Blockchain based Immunization Record System
It is a system which stores person's immunization records. It is built using blockchain technology, smart contracts, Ethereum, Solidity, Truffle, Ganache, IPFS, ReactJS and Metamask.


## Setup

Download the Blockchain based Immunization system project from Github at the following url >> https://github.com/nishthakotecha/Immunization_blockchain.git

This can be done using Git command(if you have downloaded Git):
git clone https://github.com/nishthakotecha/Immunization_blockchain.git

Open a terminal window e.g. Powershell.

Install Node.js by downloading from Internet. After installing in Command Prompt type: **npm –v** (It gives version number of nodejs)

Install Truffle : **npm install -g truffle**

Install Ganache: **npm install -g ganache** and then start Quickstart in it.
Install ipfs-mini using command: npm install --save ipfs-mini

Change to the sub directory by entering the following command in the terminal window:
**cd Immunization_blockchain**

Install the project dependancies by entering the following in the terminal window:
**npm install**
   
Compile the Truffle project by entering the following command in the terminal window:
**truffle compile**
   
Migrate the smart contract by entering the following command in the terminal window:
**truffle migrate --reset**

To use the system, launch MetaMask add-in and set the private network Custom RPC to the following url >> http://127.0.0.0:7545.
   
Run the development server and type in the following command in the terminal window:
**npm run start**

The Immunization Record system will launch and display in the browser.

It will load a form to enter the Immunization details like patient name, doctor name, immunization name and immunization date.

Having entered all details, press submit

It will launch Metamask which asks to confirm the transaction. Also it will give patient record number generated.

Now it will show a form where we can get immunization record of patient. When patient record number is entered in the textbox and button 'Get Patient Record' is pressed, it displays the Immunization record of the person.

Pressing 'Home' button goes back to immunization form.
  


 
