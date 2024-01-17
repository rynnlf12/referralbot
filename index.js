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

    return data;
  } catch (error) {
    console.error(error.message.error);
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

    const { data } = await axios({
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

    const heartbeatUUID = data.uuid;
    const dummyEmail = emails.generateEmail();

    submitWaiter(
      dummyEmail.slice(1, dummyEmail.length - 1),
      heartbeatUUID,
      referralLink
    ).then((res) => {
      if (res && res.email) {
        console.log('Referral has been added, the email: '.info + res.email);
      }
    });
  } catch (error) {
    console.error('An error occurred: '.error + error.message);
  }
})();
