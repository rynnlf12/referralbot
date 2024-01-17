# Dappad-Referral-Bot

This Node.js script allows users to submit referrals to a waitlist API using dynamically entered referral links. It uses `axios` for HTTP requests, `email-generator` for generating dummy emails, `readline-sync` for reading user input, and `colors` to enhance console output.

## Features

- Dynamic referral link input via command line.
- Validation of the referral link URL.
- Colorful console messages for better user experience.
- Automatic generation and submission of dummy emails.

## Prerequisites

Before running the script, make sure you have Node.js installed on your machine. You can download and install Node.js from [nodejs.org](https://nodejs.org/).

## Installation

1. Clone the repository or download the script to your local machine with this command :
    ```bash
    git clone https://github.com/dante4rt/Dappad-Referral-Bot.git && cd Dappad-Referral-Bot
    ```
2. Install the necessary npm packages:
   ```bash
   npm install
   ```

## Usage

To run the script, execute the following command in the terminal:

```bash
node index.js
```

Follow the on-screen prompts to enter the referral link.

## Important Notes

- Ensure the referral link entered is in a correct URL format for the script to work properly.
- The script uses a mock waitlist API endpoint; replace it with your actual API endpoint if necessary.
- The `email-generator` package is used for demonstration purposes. In a real-world application, use valid emails or handle email generation appropriately.