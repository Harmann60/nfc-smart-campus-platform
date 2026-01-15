# Engineering Systems, Variables, and Parameters

## 1. Engineering Systems Involved
To solve the problems identified earlier, the proposed solution combines several engineering systems that work together as one integrated platform.

### 1.1 NFC-Based Identification System
This system is used to identify students using **NFC-enabled ID cards**. Each card contains a **Unique Identification Number (UID)**. When the card is tapped on an NFC reader, the UID is read and used to securely identify the student.

### 1.2 Client Application System
A simple client application runs on devices such as a **PC, tablet, or kiosk** connected to a USB NFC reader. This application reads NFC card data and sends it to the backend server for processing.

### 1.3 SaaS Backend System
The backend system is the **core of the platform**. It handles all major operations such as student authentication, attendance validation, canteen payments, and library management. It acts as the central control unit of the entire system.

### 1.4 Database Management System
This system stores all important data, including:
* Student details & authentication credentials
* Wallet balances & transaction history
* Attendance records
* Library book information
It ensures that data is saved securely and can be accessed when needed.

### 1.5 Network Communication System
This system enables **secure communication** between the client application and the backend server. Data is exchanged through **RESTful APIs** using standard internet protocols.

---

## 2. Engineering Variables
Engineering variables are values that change during system operation and affect how the system behaves.

### Identification Variables
* **Student NFC UID:** The unique hardware ID of the card.
* **Student ID:** The logical ID assigned by the institution.
* **Authentication Status:** Verified / Failed.

### Transaction Variables
* **Wallet Balance:** Current funds available.
* **Transaction Amount:** Cost of the current purchase.
* **Transaction Type:** Canteen payment, Fine payment, etc.
* **Transaction Time:** Timestamp of the event.

### Attendance Variables
* **Attendance Time:** Exact time of the tap.
* **Lecture / Session ID:** Which class the attendance is for.
* **Attendance Status:** Present / Absent / Late.

### Library Variables
* **Book ID:** Unique barcode/RFID of the book.
* **Book Issue Date:** When the book was borrowed.
* **Book Return Date:** When the book is due.
* **Fine Amount:** Calculated based on delay (if any).

---

## 3. Engineering Parameters
Engineering parameters are predefined values that control system performance, accuracy, and reliability.

### System Parameters
* **NFC Reader Detection Range:** (e.g., < 4 cm).
* **NFC Reading Response Time:** (e.g., < 200 ms).
* **API Response Time:** Target latency for server confirmation.
* **Database Access Speed:** Efficiency of query retrieval.

### Network Parameters
* **Network Delay (Latency):** Allowable lag between client and server.
* **Internet Availability:** Uptime requirements.
* **Reliability of Data Transfer:** Packet loss handling mechanisms.

### Security Parameters
* **Authentication Timeout Duration:** Time allowed before a session expires.
* **User Access Control Levels:** Admin vs. Student vs. Staff permissions.
* **Data Validation Rules:** Criteria for accepting input data.

### Operational Parameters
* **Max Transaction Attempts:** Limit on retries to prevent fraud.
* **Allowed Attendance Window:** Time range (e.g., first 15 mins) for marking presence.
* **Wallet Balance Limits:** Minimum/Maximum balance allowed.

---

## 4. Interpretation and Relevance
Clearly identifying the engineering systems, variables, and parameters helps in designing a **reliable and efficient smart campus solution**. This structured approach ensures:
* Smooth system operation.
* Better security and access control.
* Accurate data handling.
* Easy scalability matching real-world campus activities.
