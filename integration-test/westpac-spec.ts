import { westpacCrawler } from '../src/banks/westpac';
import { decrypt } from '../src/encrypt';

describe('westpac crawler', () => {

  it('decrypt', () => {
    console.log(decrypt('abcec34d1734a75aab311ff64f3aa82ef9291bdcf6bb81e93474cd47790f807a31974aa345c9b4dd28b230630bdc9f3fa68476132f5a65d38facd2cdd1f270d7fed17c681b109e97d25b216a28be8bbdd3f1664fd6d56d90463319b9bcbd8fab7b93e5d4a77b04c1394a0308e7ad32'));
  })

  it('should scrape', async () => {
    
    try {
      let crawler;
      const bankAccount = {
        accountName: 'Westpac Choice',
        active: true,
      };

      const creds =
        'abcec34d1734a75aab311ff64f3aa82ef9291bdcf6bb81e93474cd47790f807a31974aa345c9b4dd28b230630bdc9f3fa68476132f5a65d38facd2cdd1f270d7fed17c681b109e97d25b216a28be8bbdd3f1664fd6d56d90463319b9bcbd8fab7b93e5d4a77b04c1394a0308e7ad32';
      crawler = await westpacCrawler(creds);
      await crawler.login();

      const reader = await crawler.getAccountReader(bankAccount);
      const transactions = await reader.getTodaysTransactions();

      console.log('transactions', transactions);
      await crawler.quit();
    } catch (err) {
      console.error('err', err);
    }
  }).timeout(20000);
});
