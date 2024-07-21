// Run this code using "node randomCommit.mjs" on terminal to commit the no of times according to the script.
// Undo Last Commit on Gtithub (Keep Changes):
// code : git reset --soft HEAD~1 
// code: git push origin main --force


import jsonfile from 'jsonfile'; // Module to handle JSON file operations
import moment from 'moment'; // Module to handle date and time operations
import simpleGit from 'simple-git'; // Module to handle Git commands
import random from 'random'; // Module to generate random numbers

const FILE_PATH = './data.json';

// Initializing the simple-git instance
const git = simpleGit();

// Function to pull from and push to the remote Git repository
const pushToGit = async () => {
  try {
    // Pull the latest changes from the remote repository with --allow-unrelated-histories option
    await git.pull('origin', 'main', {'--allow-unrelated-histories': null});
    // Push the local changes to the remote repository and set the upstream branch
    await git.push(['--set-upstream', 'origin', 'main']);
  } catch (e) {
    console.error(e);
  }
};

// Recursive function to make a specified number of commits
const makeCommit = async (n) => {
  // Base case: if no more commits are needed, push the changes to the remote repository
  if (n === 0) {
    return pushToGit();
  }

  // Generate random values for weeks and days
  const x = random.int(0, 54);
  const y = random.int(0, 6);
  
  // Calculate a random date within the past year
  const DATE = moment().subtract(1, 'y').add(1, 'd').add(x, 'w').add(y, 'd').format();

  // Create a data object with the generated date
  const data = {
    date: DATE
  };

  // Log the generated date to the console
  console.log(DATE);

  // Write the date to the JSON file
  jsonfile.writeFile(FILE_PATH, data, async (err) => {
    // Log any errors that occur during the file write operation
    if (err) console.error(err);

    try {
      // Stage the JSON file for the next commit
      await git.add([FILE_PATH]);
      // Commit the staged file with the generated date as the commit message and date
      await git.commit(DATE, { '--date': DATE });
      // Recursively call makeCommit to create the next commit
      makeCommit(n - 1);
    } catch (e) {
      // Log any errors that occur during the git add or commit operations
      console.error(e);
    }
  });
}

// Start the commit-making process with the specified number of commits
makeCommit(2);
