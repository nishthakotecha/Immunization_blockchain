
## Setup

After installing Ganache, NPM, and MetaMask:
Install ipfs-mini: 
npm install --save ipfs-mini

Install project dependencies from project directory: **npm install**
   
Compile the Truffle project by entering the following command in the terminal window:
**truffle compile**
   
Migrate the smart contract:
**truffle migrate --reset**

Set MetaMask URL to http://127.0.0.0:7545.
   
Run the application: **npm run start**

Enter all required details, and press confirm. MetaMask will ask to confirm the transaction.
A pop-up will show up with your patient ID.
You can use this number or a past number during the same session to look up your patient record.
Press Home to enter a new immunization record without closing the session.

If you restart the app, the old records will be wiped.


