import { AppSettings } from './../app.config';
import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable()
export class ReportsService {

  constructor(private http: Http) {

  }

  getUserBranch(user_id: string) {
    const headers = new Headers();
    let key = JSON.parse(localStorage.getItem("parkingUser")).token;
    headers.append("x-access-token", key);
    headers.append('Content-Type', 'application/json');
    return this.http.get('/service/userBranch/' + user_id, { headers: headers })
      .catch(this.handleError);
  }

  getPaymentReport(branch_id: string, datefrom: string, dateto: string) {
    const headers = new Headers();
    let key = JSON.parse(localStorage.getItem("parkingUser")).token;
    headers.append("x-access-token", key);
    headers.append('Content-Type', 'application/json');
    headers.append("branch_id", branch_id.toString());
    return this.http.get('/service/report/payment/' + branch_id + '?datefrom=' + datefrom + '&dateto=' + dateto, { headers: headers }).toPromise().then(response => {
      return response.json();
    }).catch(this.handleError);
  }

  getPaymentOverall(branch_id: string, datefrom: string, dateto: string) {
    const headers = new Headers();
    let key = JSON.parse(localStorage.getItem("parkingUser")).token;
    headers.append("x-access-token", key);
    headers.append('Content-Type', 'application/json');
    headers.append("branch_id", branch_id.toString());
    return this.http.get('/service/report/paymentOverall/' + branch_id + '?datefrom=' + datefrom + '&dateto=' + dateto, { headers: headers }).toPromise().then(response => {
      return response.json();
    }).catch(this.handleError);
  }

  getPaymentDetailed(branch_id: string, datefrom: string, dateto: string) {
    const headers = new Headers();
    let key = JSON.parse(localStorage.getItem("parkingUser")).token;
    headers.append("x-access-token", key);
    headers.append('Content-Type', 'application/json');
    headers.append("branch_id", branch_id.toString());
    return this.http.get('/service/report/paymentDetailed/' + branch_id + '?datefrom=' + datefrom + '&dateto=' + dateto, { headers: headers }).toPromise().then(response => {
      return response.json();
    }).catch(this.handleError);
  }

  private handleError(error: any) {
    return Observable.throw(error.json());
  }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
}