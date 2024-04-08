// Variables to select specific elements from the HTML document
const chargeStatus = document.querySelector('#battery dd:nth-of-type(1)');
const chargeLevel = document.querySelector('#battery dd:nth-of-type(2) output');
const chargeMeter = document.querySelector('#battery dd:nth-of-type(2) progress');

// Function to update battery status and fetch image from RoboHash API
function updateBatteryStatus(battery) {
    // Update the charging status
    chargeStatus.textContent = battery.charging ? "Charging..." : "Discharging...";

    // Update the charge level
    const batteryPercentage = Math.round(battery.level * 100);
    chargeLevel.textContent = batteryPercentage + "%";
    chargeMeter.value = batteryPercentage;

    // Fetch image from RoboHash API
    fetch("https://robohash.org/dude")
        .then(response => {
            if (response.ok) {
                return response.blob();
            } else {
                throw new Error('Network response was not ok.');
            }
        })
        .then(blob => {
            const imageURL = URL.createObjectURL(blob);
            const imgElement = document.createElement('img');
            imgElement.src = imageURL;
            // Replace existing image with the new one
            const existingImage = document.querySelector('#battery-image');
            if (existingImage) {
                existingImage.parentNode.replaceChild(imgElement, existingImage);
            } else {
                // Append image to the HTML document
                document.body.appendChild(imgElement);
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

// Check for Battery API support and retrieve battery information
if ('getBattery' in navigator) {
    navigator.getBattery().then(battery => {
        // Update battery information when the promise resolves
        updateBatteryStatus(battery);
        
        // Add event listeners for changes in charging status and charge level
        battery.addEventListener("chargingchange", () => {
            updateBatteryStatus(battery);
        });
        
        battery.addEventListener("levelchange", () => {
            updateBatteryStatus(battery);
        });
    });
} else {
    console.error('Battery API not supported in this browser.');
}
