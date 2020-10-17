import sendTweet from "./Tweet";
import {createHistoryFile} from "./File";

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

const filePath = './dailyNumbersSave'
const tweetsSavedPath = './tweetsSaved.json'

const tweetMessage = (savedStats) => {
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
it('Can send tweet via API', () => {
  cy.readFile('./config.json').then(configObject => {
    cy.readFile(filePath).then(savedStatsString => {
      const savedStats = JSON.parse(savedStatsString);
      createHistoryFile();
      cy.readFile(tweetsSavedPath).then(savedObject => {
        if (!(savedStats.latestDate in savedObject)){
          sendTweet(
              tweetMessage(savedStats),
              configObject["consumerKey"],
              configObject["applicationKey"],
              configObject["userAccessToken"],
              configObject["userSecret"],
          )
          cy.writeFile(tweetsSavedPath, {...savedObject, [savedStats.latestDate]: ""})
        }
      });
    });
  });
})




