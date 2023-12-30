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
    const csvHeader =
      'Team,Time,Jersey,Player,Event,X,Y,endX,endY,Foot,Outcome,Key Pass,Assist,Through Pass,Clearance,Take On,Hand Foul,Goal Area';

    // Map each item in the data array to extract the desired properties
    const csvRows = data.map((item) => {
      const {
        team,
        time,
        jersey,
        name,
        event,
        start,
        end,
        subEvents,
        goalArea,
      } = item;

      // Extract x and y from start and end coordinates
      const X = start.x || '';
      const Y = start.y || '';
      const endX = end.x || '';
      const endY = end.y || '';

      // Extract foot, outcome, keypass, assist, throughpass from subEvents
      const foot = subEvents.foot || '';
      const outcome = subEvents.outcome || '';
      const keypass = subEvents.keypass || '';
      const assist = subEvents.assist || '';
      const throughpass = subEvents.throughpass || '';
      const clearance = subEvents.clearance || '';
      const takeon = subEvents.takeon || '';
      const handfoul = subEvents.handfoul || '';

      // Join the extracted properties as a CSV row
      return `${team},${time},${jersey},${name},${event},${X},${Y},${endX},${endY},${foot},${outcome},${keypass},${assist},${throughpass},${clearance},${takeon},${handfoul},${goalArea}`;
    });

    // Join the header and rows with newline characters to form the CSV content
    return csvHeader + '\n' + csvRows.join('\n');
  }
}
