const axios = require('axios');
const emails = require('email-generator');
const readlineSync = require('readline-sync');
const colors = require('colors');

colors.setTheme({
  info: 'green',
  warn: 'yellow',
  error: 'red',
});

function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === 'http:' || url.protocol === 'https:';
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function submitWaiter(email, UUID, referralLink) {
  try {
    const { data } = await axios({
      url: 'https://api.getwaitlist.com/api/v1/waiter',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        waitlist_id: 13055,
        referral_link: referralLink,
        heartbeat_uuid: UUID,
        widget_type: 'WIDGET_1',
        email: email,
        answers: [],
      },
    });

    if (!data.is_spam) {
      return { success: true, email, isSpam: false };
    } else {
      console.log(
        'Your account has been flagged as spam, waiting for 1 hour...'.error
      );
      return { success: false, isSpam: true };
    }
  } catch (error) {
    console.error('Error submitting referral: '.error + error.message);
    return { success: false, isSpam: false };
  }
}

(async () => {
  try {
    let referralLink = '';
    while (true) {
      referralLink = readlineSync.question('Enter the referral link: '.info);
      if (isValidHttpUrl(referralLink)) {
        break;
      } else {
        console.log('Invalid URL. Please enter a valid referral link.'.warn);
      }
    }

    let numberOfReferrals = parseInt(
      readlineSync.question('How many referrals do you want to make? '.info)
    );

    if (isNaN(numberOfReferrals) || numberOfReferrals <= 0) {
      console.log('Please enter a valid number.'.warn);
      return;
    }

    let i = 0;
    while (i < numberOfReferrals) {
      const heartbeatResponse = await axios({
        url: 'https://api.getwaitlist.com/api/v1/widget_heartbeats',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          location: referralLink,
          waitlist_id: '13055',
          referrer: '',
          widget_type: 'WIDGET_1',
        },
      });

      const heartbeatUUID = heartbeatResponse.data.uuid;
      const dummyEmail = emails.generateEmail();

      const submissionResult = await submitWaiter(
        dummyEmail.slice(1, dummyEmail.length - 1),
        heartbeatUUID,
        referralLink
      );

      if (submissionResult.success) {
        console.log(
          `${i + 1} referral has been added, the email is ${
            submissionResult.email
          }`.info
        );
        i++;
      }

      if (submissionResult.isSpam) {
        await delay(3600000);
        continue;
      }

      if (i < numberOfReferrals && !submissionResult.isSpam) {
        console.log(`Waiting for 1 minute before the next referral...`.info);
        await delay(60000);
      }
    }

    console.log('All referrals have been submitted.'.info);
  } catch (error) {
    console.error('An error occurred: '.error + error.message);
  }
})();
