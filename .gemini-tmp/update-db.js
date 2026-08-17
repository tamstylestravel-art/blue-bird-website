
const admin = require('firebase-admin');
const privateKey = \-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCvtwcQQ5N8yCZm\nCxUUW5+pnDU2fAwxxcgwhdcHyqnuehXId0315Q7kSfwsTTSXJr9PnzXhiDOCYOYN\nnxm/i3r3XmRdD2Dkwiu2Qjtc9s5koLMEkPqIh6NeWekmjYj5IXVYr5LnNNHKu8Mg\nA0Ts57ejY3nOvBH7d4UV+fhESU8XUB+7xHv8FK0ZK92Z1gyHsdfFKOyFNLUfrrzR\nDZziYaf0O0z9GplbinhfDXmngzNdwsWgnAilnvoudOzw/u1jA8UZhK2jDIpa3cbi\nJI3zEJVv5pR9MCHzMS8eeG+9FFwag6dNUlo22+leZ7q1D8eHKYo4bmEEu2sE1A0P\nZEdLQScdAgMBAAECggEABQmzWyUE2oQGjdBth0rlNgCzid9eniK0jaeYtbF608qO\nS1QYWR97INJ6N27zPg4vWAIRkmjMSUWr8uIH4/UEzojXSc/CEGz8wdn+R7kPy9TL\nrSrW9AknhvH+/Er8jWAHNEa8aIKcLTra6lUNqdku67FTcbj0rwgLOckT9ClB6kIm\nqY07WoEa9AfdFjCiStisEGAbCR97f8ODC6a0+MS3uruOeS4AfNk8hSEMKVXShJmE\nk0agop5p0hQNUV25Lh5z8Nr9dfVZkGLTwqSC64H1gFyXAJG26KK1ys06WDiYAjSq\n5wzXtsDrb4+Ie/yi4TBrqmndiq6rwbRqU1N70uKogQKBgQDeyo6WDl6G4fXUH6uo\n0S21Vdxo54JMuc5PKr/n0IAhdtCgBJp3GD18psHOyQ8Up+Q1j51+9e/5wRyC0aUl\n+5WAIwCKw+Ok6Ac1ufOGcaok3zNry8cwb8KoaBPkO3j/9uX+wEF/vWMwCShl8a1S\nm2oNCZM+BqGVJOUN1hDKr3LBIQKBgQDJ6BjBULKLbOpoBbdVwDG4S5SHzvI4ixHG\nL2W8xVrZiV36HrhPpu6EUk8IsCIfMqmtQBtMEi4xRXGQwie0FDyIXG9iXinqQMim\ne6vX9ETsOtrBiR7mBXWNdHLUm4BaQlCHwUgQWGoexLK494yS6wagoPR74mooqLtb\nW/Uvt6uafQKBgB4JqVfJ8Cy3YnGLI5XLPiJoxSLPs92sX4iE9wLGNcBNSKuKc1kD\nR6b6xL6glQvv5vDhwBZSClzeEH4CzgVk+i8giP4skxC0x+QSgibqREpcXY53FxAM\nwW37OlNXQWUhYLkMKsiSPEFJusyj3P56Pb4sQFHoiviU1N0cs37gUNSBAoGAYrDC\nOOva+e+4/DOfE5koNG8tINz05NKFU5wjXIwTBjXw66tMaBKuj5sz6ok9hIZdDcRC\nE4LndUn+YsWkZo9lrzmPcEOatVgJO+dDbgGGFvoFp4gAxGpytTvwTR/dM0Eq39CI\nCwVMidGXknXeDoo26RkDp/JZ9ZnUSqm+RR7AEHkCgYEAwOfQCpqfuGgmobTcLgLE\nmIobeggftx9tPHfT3c5FMiUaq4EB2+zv+ABp+7kizC5gXa3785Mp0Tt2ZWFr+Y2V\n8KSNEDW75WGrCl2AH50lRj9/4M2D6PDJk9IyqTBB+Zgkpg+f9cYsnFsmrbzYhcym\n4xs+Zy/duS0p80TMrfzVDOM=\n-----END PRIVATE KEY-----\n\;
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: 'blue-bird-pictures-studio',
    clientEmail: 'firebase-adminsdk-fbsvc@blue-bird-pictures-studio.iam.gserviceaccount.com',
    privateKey: privateKey.replace(/\\n/g, '\n'),
  })
});
const db = admin.firestore();
db.collection('system').doc('plugin_info').set({
  latestVersion: '1.2.4',
  downloadUrl: 'http://localhost:3000/blue-bird-update.zip'
}, { merge: true }).then(() => {
  console.log('Updated');
  process.exit(0);
}).catch(e => {
  console.error(e);
  process.exit(1);
});

