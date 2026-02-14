# Buzz Controller LED Debugging Guide

## Steps to Debug LED Control

### 1. Open the WebHID Version in Chrome/Edge
Make sure you're using Chrome or Edge browser (Firefox doesn't support WebHID).

### 2. Open Browser Console
Press **F12** to open Developer Tools, then click the **Console** tab.

### 3. Connect the HID Device
1. Click "🔌 Connect WebHID Devices (For LED Control)"
2. Select your Buzz controller from the permission dialog
3. Look at the **WebHID Device Information** section

### 4. Check Output Reports
Look for the section that says "Output Reports (For LED Control)":
- **If it says "No output reports found"** → The Buzz controller may not support LED control via HID, or it uses a different method
- **If it lists output reports** → Note the Report IDs shown

### 5. Test LED Buttons
Click one of the "Player X LED" buttons and watch the browser console for:
```
Attempted to set Player X LED to ON
```

### 6. Check for Errors
Look for any error messages in the console like:
- "HID device not connected"
- "NotAllowedError"
- "InvalidStateError"
- Any other error messages

## What We're Looking For

The code tries sending multiple report formats:
1. Bit flags (0x01, 0x02, 0x04, 0x08 for players 1-4)
2. Command byte + player index + state
3. Array of all player states
4. Various report IDs (0-5)

**If an LED lights up**, please note:
- Which player button you pressed
- Whether the LED actually turned on
- Any console messages that appeared

## Why This Might Not Work

The PlayStation Buzz controllers may:
1. **Not expose LED control via HID** - LEDs might be controlled internally
2. **Use a proprietary protocol** - Not accessible via standard HID
3. **Require specific driver commands** - Beyond what WebHID can do
4. **Not have programmable LEDs** - LEDs might only respond to internal logic

## Alternative Explanation

The LEDs you see on the Buzz controllers might be:
- **Input indicators only** - They light up when YOU press buttons, not controllable by the computer
- **Power indicators** - Just showing the device is connected
- **Not programmable** - Fixed behavior in the hardware

The computer can READ the buttons, but controlling outputs (LEDs, rumble, etc.) requires the device to support it, and Buzz controllers were designed primarily as input devices.
