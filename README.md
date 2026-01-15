<div align="center">

# GrocARy

**AR Grocery Shopping Companion**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Android](https://img.shields.io/badge/Android-3DDC84?style=for-the-badge&logo=android&logoColor=white)](https://developer.android.com/)
[![iOS](https://img.shields.io/badge/iOS-000000?style=for-the-badge&logo=ios&logoColor=white)](https://developer.apple.com/ios/)

</div>

---

## Table of Contents

- [Getting Started](#getting-started)
- [Step 0: Use correct Node version](#step-0-use-correct-node-version)
- [Step 1: Install Dependencies](#step-1-install-dependencies)
- [Step 2: Start the Metro Server](#step-2-start-the-metro-server)
- [Step 3: Start your Application](#step-3-start-your-application)
- [Step 4: Modifying your App](#step-4-modifying-your-app)
- [Acknowledgments](#acknowledgments)
- [Star History](#star-history)

---

## Getting Started

> **Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions. Stop before you get to the `Creating a new application` section; we have done that for you!

## Step 0: Use correct Node version

```bash
nvm use
```

## Step 1: Install Dependencies

```bash
npm install
```

### iOS only:

```bash
cd ios
pod install
cd ..
```

## Step 2: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
npm start
```

## Step 3: Start your Application

> **Warning**: Due to limitations of the Apple Simulator and the Android Emulator, you must run your project on a physical device.

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

```bash
# iOS
npx react-native run-ios
# Android
npx react-native run-android
```

If everything is set up _correctly_, you should see your new app running on you device.

#### Install CocoaPods

```bash
cd ios
pod install
cd ..
```

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## Step 4: Modifying your App

Now that you have successfully run the app, let's modify it.

1. Open `App.tsx` in your text editor of choice and edit some lines.
2. For **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Developer Menu** (<kbd>Ctrl</kbd> + <kbd>M</kbd> (on Window and Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (on macOS)) to see your changes!

## Acknowledgments

This app uses the [ViroReact](https://viro-community.readme.io/) library for AR functionality and [OpenFoodFacts](https://world.openfoodfacts.org/) for product data.

## Star History

<a href="https://www.star-history.com/#MemerGamer/GrocARy&type=date&legend=top-left">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=MemerGamer/GrocARy&type=date&theme=dark&legend=top-left" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=MemerGamer/GrocARy&type=date&legend=top-left" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=MemerGamer/GrocARy&type=date&legend=top-left" />
 </picture>
</a>
