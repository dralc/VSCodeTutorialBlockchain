'use strict';

const yaml = require('js-yaml');
const { FileSystemWallet, Gateway } = require('fabric-network');
const fs = require('fs');

// A wallet stores a collection of identities for use
// const wallet = new FileSystemWallet('./_idwallet');
const wallet = new FileSystemWallet('./local_fabric/wallet');

async function main() {

  // A gateway defines the peers used to access Fabric networks
  const gateway = new Gateway();

  // Main try/catch block
  try {

    const identityLabel = 'Admin@org1.example.com';
    let connectionProfile = yaml.safeLoad(fs.readFileSync('./network.yaml', 'utf8'));

    let connectionOptions = {
      identity: identityLabel,
      wallet: wallet,
      discovery: {
        asLocalhost: true
      }
    };

    // Connect to gateway using network.yaml file and our certificates in _idwallet directory
    await gateway.connect(connectionProfile, connectionOptions);

    console.log('Connected to Fabric gateway.');

    // Connect to our local fabric
    const network = await gateway.getNetwork('mychannel');

    console.log('\nSubmit query transaction.');

    const contract = await network.getContract('ibm-bp');

    console.log('\nSubmit hello world transaction.');

    let response = await contract.evaluateTransaction('query', 'arvind@ibm.com');

    console.log(JSON.parse(response.toString()))

  } catch (error) {
    console.log(`Error processing transaction. ${error}`);
    console.log(error.stack);
  } finally {
    // Disconnect from the gateway
    console.log('Disconnect from Fabric gateway.');
    gateway.disconnect();
  }
}

// invoke the main function, can catch any error that might escape
main().then(() => {
  console.log('done');
}).catch((e) => {
  console.log('Final error checking.......');
  console.log(e);
  console.log(e.stack);
  process.exit(-1);
});
