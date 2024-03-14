# web-components

My personal repo of useful web components... mostly experimental.

<br />

## GA4Tag.js

Inject the Google Analytics 4 scripts on the page.

### Use

Include the tag on the page in the header:

`<script src="https://paulcushing.dev/web-components/GA4Tag.js"></script>`

Use the tag on the page:

`<ga-tag propertyid="G-XXXXXXXXXX"></ga-tag>`

being sure to use your Google Tag property ID.

<br />

## ContactFormComponent.js

A custom component to include a Contact Form dialog. An api prepared to accept a form submission including ['name', 'email', 'message', 'site'] then send a message is required. (the API I'm using sends the message to my Slack Channel) This component includes the current page url in the site field.

Header tag:

`<script src="https://paulcushing.dev/web-components/contactFormComponent.js"></script>`

Put the tag on the page where you'd like the button that triggers the Form Dialog:

`<contact-form apiUrl="https://your-api-url"></contact-form>`

### Attributes:
- apiUrl="https://your-api-url" (required)
- buttonStyle="button" or "link" (optional) (default=button)
- buttonColor="#0369a1" (optional) - applies to button background if buttonStyle = button, or text if buttonStyle = link (default=#0369a1 )
- buttonText="Contact" (optional) (default=Contact)
- dialogTitle="Contact" (optional) (default=Contact)

#### Example

`<contact-form apiUrl="https://your-api-url" buttonStyle="button" buttonColor="#008000" buttonText="Send Me A Message" dialogTitle="Drop Me A Line"></contact-form>`