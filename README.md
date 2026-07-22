# fairy-bot for My Garden Tale
Discord bot for My Garden Tale.

### Commands
* `/code` - posts a nicely formatted message in the current or specified channel with the daily/weekly/permanent code. The code is struck out on expiry, and removed after a while to prevent clutter.

## Development Setup
* `npm run register` to update commands
* `npm start` to run the project
* `ngrok http 3000` to start the communication interface (Check to make sure **General Information/Interactions Endpoint** on [Bot Dashboard](https://discord.com/developers/applications) matches the generated URL)