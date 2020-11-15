import sendTweet, {tweetMessage} from "../helpers/Tweet";
import {createHistoryFile} from "../helpers/File";

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})

const { $ } = Cypress;
const { get, visit } = cy;

it('Can arrive at Ontario covid website', () => {
  visit('https://covid-19.ontario.ca/data', {
    headers: { "Accept-Encoding": "gzip, deflate" }
  });
});
it('Click on new cases table', () => {
  const tablesButton = '#CasesDaily > div > div.ontario-margin-bottom-12-\\!.covid-viz-buttonGroup > button:nth-child(2)';
  get(tablesButton).click();
});

it('Can get values for daily count' , () => {
  const latestDateElement = '.ant-table-tbody > :nth-child(2) > :nth-child(1)'
  const latestCasesElement = '.ant-table-tbody > :nth-child(2) > :nth-child(2)';
  const changeSinceLastReportElement = '.ant-table-tbody > :nth-child(2) > :nth-child(3) > span';

  const latestDate = $(latestDateElement).text();
  const latestCases = $(latestCasesElement).text();
  const changeSinceLastReport = $(changeSinceLastReportElement).text();
  // Here we save the values in a JSON to get retrieved later. This is required because of the async nature of cypress.
  cy.writeFile(filePath, {latestDate, latestCases, changeSinceLastReport});
});

it('Click on likely sources table', () => {
  const tablesButton = '#bySourceCumulative > :nth-child(2) > .ontario-margin-bottom-12-\\! > [aria-label="Accessible table"] > span';
  get(tablesButton).click();
});

it('Can get values for likely source of information' , () => {
  const closeContactElem = "#bySourceCumulative > div:nth-child(2) > div.ant-table-wrapper > div > div > div > div > div > table > tbody > tr:nth-child(2) > td:nth-child(2)";
  const communitySpreadElem = "#bySourceCumulative > div:nth-child(2) > div.ant-table-wrapper > div > div > div > div > div > table > tbody > tr:nth-child(2) > td:nth-child(3)";
  const outbreakSettingElem = '#bySourceCumulative > div:nth-child(2) > div.ant-table-wrapper > div > div > div > div > div > table > tbody > tr:nth-child(2) > td:nth-child(4)'
  const travelElem =  '#bySourceCumulative > div:nth-child(2) > div.ant-table-wrapper > div > div > div > div > div > table > tbody > tr:nth-child(2) > td:nth-child(5)'
  const otherElem = '#bySourceCumulative > div:nth-child(2) > div.ant-table-wrapper > div > div > div > div > div > table > tbody > tr:nth-child(2) > td:nth-child(6)'

  const closeConcatText = { label: "close contact", value: $(closeContactElem).text()}
  const communitySpreadText = { label: "community spread",  value:$(communitySpreadElem).text()}
  const outbreakSettingText = { label: "outbreak setting", value:$(outbreakSettingElem).text()}
  const travelText =  { label: "travel", value:$(travelElem).text()}
  const otherText = { label: "other", value:$(otherElem).text()}
  const totalList = [closeConcatText, communitySpreadText, outbreakSettingText, travelText, otherText]
  let textAccum = "";
  for (let i = 0; i < totalList.length; i++){
    const currentObj = totalList[i];
    if (currentObj.value){
      textAccum += `${currentObj.label}:${currentObj.value}`
    }
  }

  if (textAccum.length > 0){
    textAccum = `Likely sources: ${textAccum}`;
  }
  cy.readFile(filePath).then(savedStatsString => {
    const savedStats = JSON.parse(savedStatsString);
    cy.writeFile(filePath, {...savedStats, likelySources: textAccum});
  });
});
it('Can arrive at twitter', () => {
  visit('https://twitter.com/login');
});
it('Can send tweet via API', () => {
  cy.readFile('./config.json').then(configObject => {
    cy.readFile(filePath).then(savedStatsString => {
      const savedStats = JSON.parse(savedStatsString);
      cy.readFile(tweetsSavedPath).then(savedObject => {
        if (!(`date_${savedStats.latestDate}` in savedObject)) {
          sendTweet(tweetMessage(savedStats), configObject);
          cy.writeFile(tweetsSavedPath, {...savedObject, [`date_${savedStats.latestDate}_${savedStatsString}`]: ""})
        }
      });
    });
  });
})



const filePath = './dailyNumbersSave'
const tweetsSavedPath = './tweetsSaved.json'


