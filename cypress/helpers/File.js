const tweetsSavedPath = './tweetsSaved.json'
/**
 * Creates history file if it does not exists
 */
export const createHistoryFile = () => {
  if (!fileExists(tweetsSavedPath)){
    cy.writeFile(tweetsSavedPath, {})
  }
}

export const fileExists = (path) => {
  const fs = require('fs')

  try {
    if (fs.existsSync(path)) {
      return true;
    }
  } catch(err) {
    return false;
  }
}