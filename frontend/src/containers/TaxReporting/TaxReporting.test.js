import React from 'react';
import { render } from '@testing-library/react';
import { generatePdf } from './TaxReporting';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


const mockText = jest.fn();
const mockAutoTable = jest.fn();
const mockSave = jest.fn();

jest.mock("jspdf", () => {
  return jest.fn().mockImplementation(() => ({
    text: mockText,
    autoTable: mockAutoTable,
    save: mockSave,
  }));
});
describe('generatePdf', () => {
    it("should create a PDF document with the correct title", () => {
        const donations = [
          { charityName: "Charity 1", date: "2022-01-01", amount: 10.99, paymentMethod: "Credit Card", paymentStatus: "Paid" },
          { charityName: "Charity 2", date: "2022-02-01", amount: 20.99, paymentMethod: "Bank Transfer", paymentStatus: "Pending" },
        ];
        const yearLabel = "2022-2023";
    
        const doc = generatePdf(donations, yearLabel); // invoke
    
        const instance = jsPDF.mock.results[0].value;
        expect(instance.text).toHaveBeenCalledWith(`Donations for Tax Year ${yearLabel}`, 10, 10);
        expect(instance.autoTable).toHaveBeenCalledTimes(1);
        expect(instance.save).toHaveBeenCalledWith(`donations-${yearLabel}.pdf`);
      });

    

  it('should save the PDF document with the correct filename', () => {
    const donations = [
      { charityName: 'Charity 1', date: '2022-01-01', amount: 10.99, paymentMethod: 'Credit Card', paymentStatus: 'Paid' },
      { charityName: 'Charity 2', date: '2022-02-01', amount: 20.99, paymentMethod: 'Bank Transfer', paymentStatus: 'Pending' },
    ];
    const yearLabel = '2022-2023';
    const doc = generatePdf(donations, yearLabel);
    
  });
});
