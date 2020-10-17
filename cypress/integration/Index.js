import sendTweet, {tweetMessage} from "../helpers/Tweet";
import {createHistoryFile} from "../helpers/File";
import {
  changeSinceLastReportElement,
  filePath,
  latestCasesElement,
  latestDateElement, tablesButton,
  tweetsSavedPath
} from "../helpers/Constants";

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




