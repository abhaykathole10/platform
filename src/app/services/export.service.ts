import { Injectable } from '@angular/core';
import { DataItem } from '../models/event-data.model';

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

  private convertToCsv(data: DataItem[]): string {
    // Define the headers for your CSV
    const csvHeader = 'Team,Jersey,Name,Event,Sub-Tag,x1,y1,x2,y2';

    // Map each item in the data array to extract the desired properties
    const csvRows = data.map((item) => {
      const { team, jersey, name, event, subtags, start, end } = item;

      // Join the subtags array into a single comma-separated string and wrap it in double quotes
      const formattedSubtags = `"${subtags.join(', ')}"`;

      // Extract x and y from start and end coordinates
      const x1 = start.x || '';
      const y1 = start.y || '';
      const x2 = end.x || '';
      const y2 = end.y || '';

      // Join the extracted properties as a CSV row
      return `${team},${jersey},${name},${event},${formattedSubtags},${x1},${y1},${x2},${y2}`;
    });

    // Join the header and rows with newline characters to form the CSV content
    return csvHeader + '\n' + csvRows.join('\n');
  }
}
