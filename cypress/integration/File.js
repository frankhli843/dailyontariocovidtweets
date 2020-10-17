/**
 * Creates history file if it does not exists
 */
export const createHistoryFile = () => {
  if (!fileExists(tweetsSavedPath)){
    cy.writeFile(tweetsSavedPath, {})
  }
}

export const fileExists = () => {
  const fs = require('fs')

  const path = './file.txt'

  try {
    if (fs.existsSync(path)) {
      return true;
    }
  } catch(err) {
    return false;
  }
}