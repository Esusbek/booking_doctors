export const Appointment = ({date, comment, status, patientName, doctorName}) => {
    <div class="Appoint-box">
        <div class="Appoint-date">{date}</div>
        <div class="Appoint-comment">{comment}</div>
        <div class="Appoint-status">{status}</div>
        <div class="Appoint-patient">{patientName}</div>
        <div class="Appoint-doctor">{doctorName}</div>
    </div>
}