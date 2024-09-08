import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import * as fileSaver from 'file-saver';

@Injectable({
    providedIn: 'root'
})
export class GeneralService {

    constructor(
        private httpClient: HttpClient,
        private toastr: ToastrService
    ) { }

    // General method to send any object to the backend
    sendParameterToBackend(obj: any, apiEndpoint: string) {
        this.httpClient.post(apiEndpoint, obj).subscribe(
            (res: any) => {
                if (res.isValidTransaction === false) {
                    // Handle failure (e.g., show a toaster message)
                    this.toastr.error('Transaction failed', 'Error', { timeOut: 3000, progressBar: true });
                } else {
                    this.downloadInputOutputFile(res.transactionHeaderMessage);
                    // Handle success (e.g., show a toaster message)
                    this.toastr.success('Transaction successful', 'Success', { timeOut: 3000, progressBar: true });
                }
            },
            (error: any) => {
                // Handle error
                this.toastr.error('An error occurred', 'Error', { timeOut: 3000, progressBar: true });
            }
        );
    }

    // General method to download a file
    downloadInputOutputFile(filePath: string) {
        if (!filePath) {
            this.toastr.warning('Please select a valid file', 'Warning', { timeOut: 3000, progressBar: true });
            return;
        }
        this.httpClient.get(filePath, { responseType: 'blob' }).subscribe(
            (res: Blob) => this.downloadFile(res, filePath),
            (err: any) => {
                this.toastr.error('File not found', 'Error', { timeOut: 3000, progressBar: true });
            }
        );
    }

    // General method to handle file download
    private downloadFile(res: Blob, path: string) {
        let fileName = this.extractFileName(path);
        fileSaver.saveAs(this.createBlob(res), fileName);
    }

    // Helper method to extract file name from path
    private extractFileName(path: string): string {
        return path ? path.substring(path.lastIndexOf('\\') + 1) || 'template' : 'template';
    }

    // General method to create a Blob object
    private createBlob(response: any): Blob {
        return new Blob([response], { type: response.type });
    }
}
