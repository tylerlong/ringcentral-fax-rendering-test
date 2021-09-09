import RingCentral from '@rc-ex/core';
import {Attachment} from '@rc-ex/core/lib/definitions';
import path from 'path';
import fs from 'fs';

const rc = new RingCentral({
  server: process.env.RINGCENTRAL_SERVER_URL,
  clientId: process.env.RINGCENTRAL_CLIENT_ID,
  clientSecret: process.env.RINGCENTRAL_CLIENT_SECRET,
});

(async () => {
  await rc.authorize({
    username: process.env.RINGCENTRAL_USERNAME!,
    extension: process.env.RINGCENTRAL_EXTENSION,
    password: process.env.RINGCENTRAL_PASSWORD!,
  });

  const attachment = new Attachment();
  attachment.filename = 'index.html';
  attachment.content = fs.createReadStream(path.join(__dirname, 'index.html'));
  attachment.contentType = 'text/html';
  const faxResponse = await rc
    .restapi()
    .account()
    .extension()
    .fax()
    .post({
      to: [
        {
          phoneNumber: process.env.RINGCENTRAL_RECEIVER,
        },
      ],
      attachments: [attachment],
    });
  console.log(faxResponse);

  await rc.revoke();
})();
