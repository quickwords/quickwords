<p align="center"><a href="https://quickwords.co"><img width="450" src="https://quickwords.co/assets/logo.svg"></a></p>

## Table of Contents
- [What is Quickwords?](#what-is-quickwords)
- [Installation](#installation)
    - [MacOS](#macos)
    - [Linux & Windows](#linux--windows)
- [Privacy and Security](#privacy-and-security)
- [Contribution](#contribution)
- [FAQ](#faq)
- [Authors](#authors)
- [License](#license)

## What is Quickwords?
Quickwords is a productivity app, to get on with your work quicker. It helps you substitute common words, phrases and paragraphs with just few key strokes. It is available on MacOS (other systems coming very soon).
You can check out the [website](https://quickwords.co) and [full documentation](https://quickwords.co/docs) for more information.

![](https://i.imgur.com/asCk1Ds.png)

## Installation
### MacOS
Download the [latest release](https://github.com/quickwords/quickwords/releases/latest), unzip and drag `Quickwords.app` to your `Applications` folder.

### Linux & Windows
Linux and Windows versions of the app are coming soon. In the meantime all PRs are very welcome.

## Privacy and Security
Quickwords registers all global keyboard events, so it has an access to everything you type on the system. No data is saved on the system, and only 20 last keystrokes are remembered in the memory of the app. All your data should be secure.

If you discover a security vulnerability within Quickwords, please DM [@quickwordsapp](https://twitter.com/quickwordsapp). All security vulnerabilities will be promptly addressed.

## Contribution
Contributions are very welcome. If you want, just drop a PR with any feature you'd like to see. If you want to help with the development of the app, you could [buy us a coffee](https://www.patreon.com/quickwords).

## FAQ
### Replacements do not work after installation
Please make sure you gave the accessibility access in your system preferences. If it still does not work, try restarting the app. On newer versions of macOS (including Mojave and Catalina), computer restart may be required. It seems like a bug with macOS not registering granted accessibility permission.

It appears that sometimes in Mojave and Catalina the app stops working when you open the computer after a longer period of time (like after the night). Simply go to the Login screen (ctrl+cmd+q) and log back in. The issue should be resolved. If it is not, please file an issue. If you know how to fix this or the cause of the issue, we would like to know :)

## Authors
The app was made by [Dariusz Czajkowski](https://dczajkowski.com/) and [Grzegorz Tłuszcz](https://github.com/gtluszcz), two students from Kraków, Poland.

## License
The Quickwords app is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
