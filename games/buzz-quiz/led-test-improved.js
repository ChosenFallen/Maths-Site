// Improved LED testing function based on discovered output report
// Report ID: 0, Size: 7 bytes

async function testPlayerLED(playerIndex, state) {
    if (!hidDevice || !hidDevice.opened) {
        console.warn("❌ HID device not connected");
        alert("Please connect HID device first!");
        return;
    }

    console.log(`\n🔄 Testing Player ${playerIndex + 1} LED ${state ? "ON" : "OFF"}...`);
    console.log("Report ID: 0 (7 bytes as discovered)");
    
    const reportId = 0;
    const attempts = [
        // Attempt 1: Single bit per player in byte 0
        { data: new Uint8Array([state ? (1 << playerIndex) : 0, 0, 0, 0, 0, 0, 0]), desc: "Bit flags in byte 0" },
        
        // Attempt 2: Byte per player
        { data: (() => { const arr = new Uint8Array(7); arr[playerIndex] = state ? 0xff : 0x00; return arr; })(), desc: "Byte per player (0-3)" },
        
        // Attempt 3: Byte per player offset by 1
        { data: (() => { const arr = new Uint8Array(7); arr[playerIndex + 1] = state ? 0xff : 0x00; return arr; })(), desc: "Byte per player (1-4)" },
        
        // Attempt 4: All player states in bytes 0-3
        { data: (() => { const arr = new Uint8Array(7); for(let i=0; i<4; i++) arr[i] = (i===playerIndex && state) ? 0x01 : 0x00; return arr; })(), desc: "All player states" },
    ];

    for (let i = 0; i < attempts.length; i++) {
        try {
            await hidDevice.sendReport(reportId, attempts[i].data);
            const hex = Array.from(attempts[i].data).map(b => '0x' + b.toString(16).padStart(2, '0')).join(' ');
            console.log(`✓ Attempt ${i+1} (${attempts[i].desc}): ${hex}`);
            console.log(`  👀 DID PLAYER ${playerIndex + 1} LED LIGHT UP?`);
            await new Promise(r => setTimeout(r, 500));
        } catch (err) {
            console.log(`✗ Attempt ${i+1} failed: ${err.message}`);
        }
    }
    
    console.log(`\n📊 Test complete. If LED lit up, note which attempt worked!`);
}

// Test usage:
// await testPlayerLED(0, true);  // Player 1 ON
// await testPlayerLED(0, false); // Player 1 OFF
