
  document.getElementById("run").addEventListener("click", run);
  let item;
  
  function run()
  {
	const userProfile = Office.context.mailbox.userProfile;
	//Console.Log('Hello {userProfile.displayName} ');
	//Office.context.mailbox.item.Recipients.getAsync(callback);

 // Confirms that the Office.js library is loaded.
	Office.onReady((info) => {
		if (info.host === Office.HostType.Outlook) {
			item = Office.context.mailbox.item;
			getAllRecipients();
		}
	});
  }
  
  // Gets the email addresses of all the recipients of the item being composed.
function getAllRecipients() {
    let toRecipients, ccRecipients, bccRecipients;

    // Verify if the mail item is an appointment or message.
    if (item.itemType === Office.MailboxEnums.ItemType.Appointment) {
        toRecipients = item.requiredAttendees;
        ccRecipients = item.optionalAttendees;
    }
    else {
        toRecipients = item.to;
        ccRecipients = item.cc;
        bccRecipients = item.bcc;
    }

    // Get the recipients from the To or Required field of the item being composed.
    toRecipients.getAsync((asyncResult) => {
        if (asyncResult.status === Office.AsyncResultStatus.Failed) {
            write(asyncResult.error.message);
            return;
        }

        // Display the email addresses of the recipients or attendees.
        write(`Recipients in the To or Required field: ${displayAddresses(asyncResult.value)}`);
    });

    // Get the recipients from the Cc or Optional field of the item being composed.
    ccRecipients.getAsync((asyncResult) => {
        if (asyncResult.status === Office.AsyncResultStatus.Failed) {
            write(asyncResult.error.message);
            return;
        }

        // Display the email addresses of the recipients or attendees.
        write(`Recipients in the Cc or Optional field: ${displayAddresses(asyncResult.value)}`);
    });

    // Get the recipients from the Bcc field of the message being composed, if applicable.
    if (bccRecipients.length > 0) {
        bccRecipients.getAsync((asyncResult) => {
        if (asyncResult.status === Office.AsyncResultStatus.Failed) {
            write(asyncResult.error.message);
            return;
        }

        // Display the email addresses of the recipients.
        write(`Recipients in the Bcc field: ${displayAddresses(asyncResult.value)}`);
        });
    } else {
        write("Recipients in the Bcc field: None");
    }
}

// Displays the email address of each recipient.
function displayAddresses (recipients) {
    for (let i = 0; i < recipients.length; i++) {
        write(recipients[i].emailAddress);
    }
}

// Writes to a div with id="message" on the page.
function write(message) {
    document.getElementById("message").innerText += message;
}

  
