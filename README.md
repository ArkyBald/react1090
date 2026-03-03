This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Personal Note
Filepath for aircraft data on Pi is 

    /run/dump1090-fa/aircraft.json

The JSON feed to the server (on raspberry pi) is localhost:8080/data/aircraft.json

will need to update IP occasionally?? in pi terminal: 
    ip address show
to access from pc http://192.168.1.65:8080/data/aircraft.json

AI instructions for building raspberry pi
Building a Next.js application for a Raspberry Pi kiosk involves two main phases:
deploying the Next.js app to the Pi and configuring the Pi to run a web browser in full-screen kiosk mode on boot. 
Phase 1: Deploy the Next.js Application to the Raspberry Pi
You need Node.js and npm installed on the Raspberry Pi to build and serve the Next.js application. 

    Prepare the Raspberry Pi OS:
        Flash the latest Raspberry Pi OS (with a desktop environment for simplicity) onto a microSD card using the Raspberry Pi Imager.
        During the imaging process, use the OS customizer to set a hostname, enable SSH, configure Wi-Fi, and set user credentials for easier remote access.
        Boot the Pi and ensure it's connected to the internet.
    Install Node.js and Update System:
        SSH into your Raspberry Pi.
        Update the system packages by running:
        bash

        sudo apt update && sudo apt upgrade -y

        Install Node.js (which includes npm). The default version may be old, so follow the official Node.js installation instructions for Raspberry Pi to get a recent version.
    Transfer Your Next.js Project:
        Clone your Next.js project repository from GitHub onto the Pi:
        bash

        git clone https://github.com/yourusername/yourrepo.git
        cd yourrepo

        Install dependencies and build the application for production:
        bash

        npm install
        npm run build

    Run the Next.js Server:
        Test that your application runs correctly by starting the production server, usually with:
        bash

        npm start

        In a browser on another device, verify you can access the app at http://[your-pi-ip-address]:3000 (or the port specified in your project). 

Phase 2: Configure the Raspberry Pi for Kiosk Mode 
This involves setting the Pi to automatically log in and launch a web browser in full-screen kiosk mode on startup. 

    Enable Autologin:
        Run sudo raspi-config in the terminal.
        Navigate to System Options > Boot / Auto Login and select the option to boot into the Desktop Autologin.
    Install Kiosk Dependencies (if not already present):
        Install Chromium browser and other necessary utilities:
        bash

        sudo apt install chromium-browser x11-xserver-utils unclutter

        unclutter is used to hide the mouse cursor when inactive.
    Create a Kiosk Startup Script:
        Create a shell script that launches Chromium in kiosk mode when the desktop environment loads. Edit the autostart file:
        bash

        nano ~/.config/lxsession/LXDE-pi/autostart

        Add the following lines to disable screen blanking and launch Chromium, replacing http://localhost:3000 with the actual address of your application (if running a separate server, use its URL, otherwise you can run the npm start command in this script using a method like a systemd service):
        bash

        @xset s off
        @xset -dpms
        @xset noblank
        @chromium-browser --noerrdialogs --disable-infobars --kiosk http://localhost:3000

        Save the file and exit the editor.
    Configure Application Auto-start (using systemd):
        To ensure your Next.js app starts automatically and independently of the browser, create a systemd service.
        Follow guides for creating a systemd service to run a Node.js server on startup, ensuring the ExecStart line runs npm start (or node server.js depending on your setup) in your project directory.
    Reboot the Pi:
        Reboot the system to apply all changes:
        bash

        sudo reboot

        The Raspberry Pi should now boot directly into your Next.js application running in full-screen kiosk mode. 

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
