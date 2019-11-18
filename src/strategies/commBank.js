export default class CommBank {
  constructor(driver) {
    this.webdriver = driver;
  }

  async login(username, password) {
    await this.webdriver.get(
      'https://www.my.commbank.com.au/netbank/Logon/Logon.aspx'
    );

    const inputEl = await this.webdriver.findElement(By.id('txtMyClientNumber_field'));
    await inputEl.sendKeys(username);

    const passwordEl = await this.webdriver.findElement(By.id('txtMyPassword_field'));
    await passwordEl.sendKeys(password);

    const btnEl = await this.webdriver.findElement(By.id('btnLogon_field'));
    await btnEl.click();

    await pause(1000); 

    
    // get the new transactions
  }

  async getAccounts() {
    const links = await this.webdriver.findElements(By.css('.main_group_account_row div.ellipsisFix div.left a'));
  
    return Promise.all(links.map(async link => {
      const accountName = await link.getText();
      
      return {
        accountName,
        link
      }
    }));
  }
}