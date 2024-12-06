---
created: 2022-10-26T09:11:00+10:00
# updated: 2022-03-29T13:33:00+10:00
section: blog
tags: [android, WSL2]
title: Android development in Ubuntu WSL2
---

I'm been working on an app that I'm not sure if it'll be a website, PWA, mobile app or any combination of them. But I ran into a problem linking Android Studio in Windows from my development environment in Ubuntu WSL2. Here's how I solved it.

---

## WSL2 prerequisites

### Windows build

Up until August 2022, WSL2 wasn't able to run GUI applications without some workarounds. But starting with the _Windows 11 Build 22000_ the ability to run GUI applications is now all rolled into WSL2.

### Virtual GPU drivers

To allow hardware accelerated OpenGL rendering, you'll need to install a driver to enable the virtual GPU.

- [Intel GPU driver for WSL](https://www.intel.com/content/www/us/en/download/19344/intel-graphics-windows-dch-drivers.html)
- [AMD GPU driver for WSL](https://www.amd.com/en/support/kb/release-notes/rn-rad-win-wsl-support)
- [NVIDIA GPU driver for WSL](https://developer.nvidia.com/cuda/wsl)

## Install Open JDK

To build for Android, you'll need a JDK installed. OpenJDK is the way to go.

Install by running `sudo apt install openjdk-11-jdk`.

## Install the Android Studio repository

Android studio isn't available in the default repositories, so you'll have to add it yourself. Thankfully it's a simple command.

Add the repository by running `sudo add-apt-repository ppa:maarten-fonville/android-studio`

After that is done you're ready to install by running `sudo apt install android-studio`

## Running Android Studio

Android Studio is installed into `/opt/android-studio/` you'll need to take note of this if you want to integrate it into your development tools.

To run Android Studio from the CLI, run `/opt/android-studio/bin/studio.sh`. But it also is linked in the start menu, under `Ubuntu>Android Studio (Ubuntu)`

On first run Android studio will have some setup to complete. This includes downloading the Android SDK(s) and Android Virtual Machine(s).

## Kernel-based Virtual Machine

When I first got Android studio running, I was unable to get a basic app to run. Worst of all, there was no useful error message.

Eventually I found out that the problem is the Android Virtual Machine in Android Studio requires access to the Kernel-based Virtual Machine (kvm). And the user I was logged in to (the only user I log in as on WSL) did not have access to it.

The fix was as simple as running `sudo chmod 777 -R /dev/kvm`. After this, I was able to launch my application in the emulator. YAY!
