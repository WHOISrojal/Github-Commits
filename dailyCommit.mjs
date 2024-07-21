// Created a Bat File name run_daily.bat on "C:\Applications\VsCode\GithubAutoCommits" path 
// Made a task in Task Scheduler named 'AutoGitCommit' and set the commit to be run daily at 9:00 pm 
// Also you can run this code by "node dailyCommit.mjs".

import jsonfile from 'jsonfile'; // For JSON file operations
import moment from 'moment'; // For date manipulation
import simpleGit from 'simple-git'; // For Git operations

const FILE_PATH = './data.json'; 
const git = simpleGit(); // Initialize the simple-git instance

// Function to pull from and push to the remote Git repository
const pushToGit = async () => {
  try {
    // Pull the latest changes from the remote repository with --allow-unrelated-histories option
    await git.pull('origin', 'main', {'--allow-unrelated-histories': null});
    // Push the local changes to the remote repository and set the upstream branch
    await git.push(['--set-upstream', 'origin', 'main']);
  } catch (e) {
    // Log any errors that occur during the pull or push operations
    console.error('Error during git push/pull:', e);
  }
};

// Function to make a commit with the current date
const makeCommit = async () => {
  // Get the current date and time
  const DATE = moment().format();

  // Create a data object with the current date
  const data = {
    date: DATE
  };

  // Log the date to the console
  console.log('Committing date:', DATE);

  // Write the date to the JSON file
  jsonfile.writeFile(FILE_PATH, data, async (err) => {
    if (err) {
      // Log any errors that occur during the file write operation
      console.error('Error writing to file:', err);
      return;
    }

    try {
      // Stage the JSON file for the next commit
      await git.add([FILE_PATH]);
      // Commit the staged file with the current date as the commit message and date
      await git.commit(DATE, { '--date': DATE });
      // Push the changes to the remote repository
      await pushToGit();
    } catch (e) {
      // Log any errors that occur during the git add or commit operations
      console.error('Error during git commit:', e);
    }
  });
}

// Execute the commit function
makeCommit();
