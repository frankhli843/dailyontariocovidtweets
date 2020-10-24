import sendTweet, {tweetMessage} from "../helpers/Tweet";
import {createHistoryFile} from "../helpers/File";


const { $ } = Cypress;
const { get, visit } = cy;

Cypress.Cookies.defaults({ preserve: ['token', 'NID'], });

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
  // Here we save the values in a JSON to get retrieved later. This is required because of the async nature of cypress.
  cy.writeFile(filePath, {latestDate, latestCases, changeSinceLastReport});
});

it('Can arrive at twitter', () => {
  visit('https://twitter.com/login');
});
it('Can send tweet via API', () => {
  cy.readFile('./config.json').then(configObject => {
    cy.readFile(filePath).then(savedStatsString => {
      const savedStats = JSON.parse(savedStatsString);
      createHistoryFile();  // we check if we already sent for that day if not then we send the tweet
      cy.readFile(tweetsSavedPath).then(savedObject => {
        if (!(savedStats.latestDate in savedObject)) {
          sendTweet(tweetMessage(savedStats), configObject);
          cy.writeFile(tweetsSavedPath, {...savedObject, [savedStats.latestDate]: ""})
        }
      });
    });
  });
})


const tablesButton = '#CasesDaily > :nth-child(3) > [style="position: relative;"] > .ontario-margin-bottom-12-\\! > [aria-hidden="false"] > span';
const latestDateElement = '[style="position: relative;"] > .ant-table-wrapper > .ant-spin-nested-loading > .ant-spin-container > .ant-table > .ant-table-container > .ant-table-content > table > .ant-table-tbody > :nth-child(1) > :nth-child(1)'
const latestCasesElement = '[style="position: relative;"] > .ant-table-wrapper > .ant-spin-nested-loading > .ant-spin-container > .ant-table > .ant-table-container > .ant-table-content > table > .ant-table-tbody > :nth-child(1) > :nth-child(2)';
const changeSinceLastReportElement = '[style="position: relative;"] > .ant-table-wrapper > .ant-spin-nested-loading > .ant-spin-container > .ant-table > .ant-table-container > .ant-table-content > table > .ant-table-tbody > :nth-child(1) > :nth-child(3)';
const filePath = './dailyNumbersSave'
const tweetsSavedPath = './tweetsSaved.json'


