import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  constructor() {}

  exportToCsv(data: any[], fileName: string) {
    const csvData = this.convertToCsv(data);

    // Create a Blob containing the CSV data
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });

    // Create a download link
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  private convertToCsv(data: any[]): string {
    // const csvHeader = Object.keys(data[0]).join(',');
    // const csvRows = data.map((item) => Object.values(item).join(','));
    // return csvHeader + '\n' + csvRows.join('\n');

    // Define the headers for your CSV
    const csvHeader = 'X,Y,X2,Y2';

    // Map each item in the data array to extract the desired properties
    const csvRows = data.map((item) => {
      // Extract the properties you want
      const { start, end } = item;
      const X = start.x || '';
      const Y = start.y || '';
      const X2 = end.x || '';
      const Y2 = end.y || '';

      // Join the extracted properties as a CSV row
      return `${X},${Y},${X2},${Y2}`;
    });

    // Join the header and rows with newline characters to form the CSV content
    return csvHeader + '\n' + csvRows.join('\n');
  }
}
