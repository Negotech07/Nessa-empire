
const bookingForm = document.getElementById("bookingForm");

const WHATSAPP_NUM = "2347031137848";

if (bookingForm) {

    bookingForm.addEventListener("submit", function(event) {

        event.preventDefault();

        // Get form details
        const name = document.getElementById("bookingName").value.trim();
        const phone = document.getElementById("bookingPhone").value.trim();
        const date = document.getElementById("bookingDate").value;
        const time = document.getElementById("bookingTime").value;
        const service = document.getElementById("services").value;
        const additionalMessage = document.getElementById("bookingMessage").value.trim();

        // Format date
        const formattedDate = new Date(date + "T00:00:00")
            .toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric"
            });

        // Format time
        const formattedTime = new Date("1970-01-01T" + time)
            .toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true
            });

        // Build WhatsApp message
        let message = "Hello Nessa's Empire! I would like to book an appointment.\n\n";

        message += "BOOKING DETAILS\n";
        message += "Full Name: " + name + "\n";
        message += "Phone Number: " + phone + "\n";
        message += "Preferred Date: " + formattedDate + "\n";
        message += "Preferred Time: " + formattedTime + "\n";
        message += "Service: " + service + "\n";

        if (additionalMessage) {
            message += "\nAdditional Message:\n" + additionalMessage + "\n";
        }

        message += "\nPlease confirm if this appointment is available. Thank you!";

        // Create WhatsApp URL
        const whatsappURL =
            "https://wa.me/" +
            WHATSAPP_NUM +
            "?text=" +
            encodeURIComponent(message);

        // Open WhatsApp
        window.open(whatsappURL, "_blank");

    });

}
