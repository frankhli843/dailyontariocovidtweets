const { $ } = Cypress;
const { get, visit, contains, env } = cy;
const { expect } = chai;

Cypress.Cookies.defaults({
  preserve: ['token', 'NID'],
});


const tablesButton = '#CasesDaily > :nth-child(3) > [style="position: relative;"] > .ontario-margin-bottom-12-\\! > [aria-hidden="false"] > span';
const latestDateElement = '[style="position: relative;"] > .ant-table-wrapper > .ant-spin-nested-loading > .ant-spin-container > .ant-table > .ant-table-container > .ant-table-content > table > .ant-table-tbody > :nth-child(1) > :nth-child(1)'
const latestCasesElement = '[style="position: relative;"] > .ant-table-wrapper > .ant-spin-nested-loading > .ant-spin-container > .ant-table > .ant-table-container > .ant-table-content > table > .ant-table-tbody > :nth-child(1) > :nth-child(2)';
const changeSinceLastReportElement = '[style="position: relative;"] > .ant-table-wrapper > .ant-spin-nested-loading > .ant-spin-container > .ant-table > .ant-table-container > .ant-table-content > table > .ant-table-tbody > :nth-child(1) > :nth-child(3)';

const twitterLoginElement = ':nth-child(6) > .r-1uaug3w > :nth-child(1) > .css-1dbjc4n > .css-901oao > .r-30o5oe'
const twitterPasswordElement = ':nth-child(7) > .r-1uaug3w > :nth-child(1) > .css-1dbjc4n > .css-901oao > .r-30o5oe'
const twitterLoginButtonElement = '.r-1jgb5lz > .css-1dbjc4n.r-13qz1uu > form > :nth-child(1) > :nth-child(8) > [data-testid=LoginForm_Login_Button] > .r-1awozwy'
const tweetInputElement = '.public-DraftStyleDefault-block'

const filePath = './dailyNumbersSave'

const tweetMessage = (savedStatsString) => {
  const savedStats = JSON.parse(savedStatsString);
  return `  ${savedStats.latestDate} had ${savedStats.latestCases} cases reported in Ontario. 
  Change since last report: ${savedStats.changeSinceLastReport}. 
  Info taken from covid-19.ontario.ca/`
}

it('Can arrive at Ontario covid website', () => {
  visit('https://covid-19.ontario.ca/data');
});

it('Can click on tables', () => {
  get(tablesButton).click();
});
it('Can get values' , () => {
  const latestDate = $(latestDateElement).text();
  const latestCases = $(latestCasesElement).text();
  const changeSinceLastReport = $(changeSinceLastReportElement).text();
  cy.writeFile(filePath, {latestDate, latestCases, changeSinceLastReport})
});
it('Can arrive at twitter', () => {
  visit('https://twitter.com/login');
});
it('Can login to twitter', () => {
  // Gets the username and password from config file
  cy.readFile('./config.json').then(savedObject => {
    get(twitterLoginElement).type(savedObject.username);
    get(twitterPasswordElement).type(savedObject.password);
    get(twitterLoginButtonElement).click();
  });
});
it('Can add tweet', () => {
  cy.readFile(filePath).then(savedStatsString => {
    get(tweetInputElement).type(tweetMessage(savedStatsString))
  });
})


