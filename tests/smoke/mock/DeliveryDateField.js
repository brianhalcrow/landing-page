import React from 'react';

const DeliveryDateField = ({ selectedDate, setSelectedDate, minDate, maxDate, isWeekday }) => (
  <div data-testid="mock-delivery-date-field">
    <p>Delivery Date Field Mock</p>
    <p>Selected Date: {selectedDate?.toString()}</p>
    <button onClick={() => setSelectedDate(new Date())}>Set Date</button>
  </div>
);

export default DeliveryDateField;
