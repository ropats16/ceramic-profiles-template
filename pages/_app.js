import { MainContext } from '../context';

import { CeramicClient } from '@ceramicnetwork/http-client';
import { EthereumAuthProvider } from '@ceramicnetwork/blockchain-utils-linking';
import { DIDSession } from '@glazed/did-session';

import '../styles/globals.css';

function MyApp({ Component, pageProps }) {

  const ceramic = new CeramicClient("https://ceramic-clay.3boxlabs.com");

  const aliases = {
    schemas: {
      basicProfile: 'ceramic://k3y52l7qbv1frxt706gqfzmq6cbqdkptzk8uudaryhlkf6ly9vx21hqu4r6k1jqio',

    },
    definitions: {
      BasicProfile: 'kjzl6cwe1jw145cjbeko9kil8g9bxszjhyde21ob8epxuxkaon1izyqsu8wgcic',
    },
    tiles: {},
  }

  const authenticateWithEthereum = async (ethereumProvider) => {
    const accounts = await ethereumProvider.request({
      method: 'eth_requestAccounts',
    });

    const authProvider = new EthereumAuthProvider(ethereumProvider, accounts[0]);

    const session = new DIDSession({ authProvider });

    const did = await session.authorize();

    ceramic.did = did;
    console.log(did);
  }

  const auth = async () => {
    if (window.ethereum == null) {
      throw new Error('No injected Ethereum provider found')
    }
    await authenticateWithEthereum(window.ethereum);
  }


  return (
    <MainContext.Provider value={{
      auth,
      ceramic,
      aliases
    }}>
      <Component {...pageProps} />
    </MainContext.Provider>
  )
}

export default MyApp
