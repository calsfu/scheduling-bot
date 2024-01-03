# Discord Event Scheduler Bot

This Discord bot is designed for scheduling events within your server. It efficiently converts data into JavaScript objects and stores them in an SQLite database, providing a seamless experience for managing and tracking events. Additionally, the bot automates the process of sending reminders to ensure that participants stay informed.
## Features

    Event Scheduling: Easily schedule events using intuitive commands.
    Data Conversion: Converts event data into JavaScript objects for efficient handling.
    SQLite Database: Stores scheduled events in an SQLite database for organized data management.
    Automatic Reminders: Sends timely reminders to participants for upcoming events.

## To Run

Deploying a new command

ts-node src/deploy-commands.ts 
ts-node src/index.ts

## To use
Use slash commands in discord to add events, check current events, and send out game invitaitons. 

## Database Structure

The SQLite database stores event information in a structured format. You can explore and query the database to gather insights into past and upcoming events.
