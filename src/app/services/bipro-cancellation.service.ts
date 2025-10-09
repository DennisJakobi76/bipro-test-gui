import { Injectable } from '@angular/core';
import { Customer } from '../models/customer.model';
import { CurrentPolicy } from '../models/current-policy.model';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BiproCancellationService {
  constructor(private http: HttpClient) {
    // HttpClient wird über Dependency Injection bereitgestellt
  }

  /**
   * Starts the complete BiPRO cancellation process
   * @param customer Customer data
   * @param currentPolicy Current policy data
   */
  async startBiproCancellation(
    customer: Customer,
    currentPolicy: CurrentPolicy
  ): Promise<void> {
    try {
      // Erstelle Kündigung per REST an Java-Microservice
      await this.createCancellationPDF(customer, currentPolicy);

      // // Mappe Kündigungsdaten auf BiPRO-Template des Vorversicherers als XML per REST an Java-Microservice
      // await this.mapCancellationToBiPROTemplate(customer, currentPolicy);

      // // Sende Kündigungsantrag an Java-Microservice
      // await this.sendCancellationRequest(customer, currentPolicy);

      // console.log('BiPRO cancellation process completed successfully');
    } catch (error) {
      console.error('Error during BiPRO cancellation process:', error);
      throw error;
    }
  }

  /**
   * Creates cancellation PDF with customer and policy data
   * @param customer Customer data
   * @param currentPolicy Current policy data
   */
  private async createCancellationPDF(
    customer: Customer,
    currentPolicy: CurrentPolicy
  ): Promise<void> {
    console.log('Sende Daten an Backend zur PDF-Erstellung:', {
      customer: `${customer.firstName} ${customer.lastName}`,
      policy: currentPolicy.policyNumber,
    });

    try {
      // Transformiere die Daten in das Backend-Format
      const requestBody = {
        customer: {
          name: `${customer.firstName} ${customer.lastName}`,
          address: `${customer.street} ${customer.houseNumber}, ${customer.postalCode} ${customer.city}`,
        },
        policy: {
          policyNumber: currentPolicy.policyNumber,
          productName: currentPolicy.productName,
          endDate: currentPolicy.endDate,
          companyAddress: currentPolicy.insuranceCompany,
        },
      };

      const pdfBlob = await firstValueFrom(
        this.http.post(
          'http://localhost:8080/api/cancellation/preview',
          requestBody,
          { responseType: 'blob' }
        )
      );

      const pdfUrl = URL.createObjectURL(pdfBlob);

      const previewWindow = window.open(pdfUrl, '_blank');
      if (!previewWindow) {
        throw new Error(
          'Popup-Blocker aktiv? Fenster konnte nicht geöffnet werden.'
        );
      }
      setTimeout(() => {
        URL.revokeObjectURL(pdfUrl);
      }, 60000);
    } catch (error) {
      console.error('Fehler beim Laden der PDF-Vorschau:', error);
      alert('Fehler beim Laden der PDF-Vorschau.');
    }
  }

  /**
   * Maps cancellation data to BiPRO template
   * @param customer Customer data
   * @param currentPolicy Current policy data
   */
  private async mapCancellationToBiPROTemplate(
    customer: Customer,
    currentPolicy: CurrentPolicy
  ): Promise<void> {
    console.log('Mapping cancellation data to BiPRO template for:', {
      customer: `${customer.firstName} ${customer.lastName}`,
      policy: currentPolicy.policyNumber,
      insuranceCompany: currentPolicy.insuranceCompany,
    });

    // TODO: Implementierung der Mapping-Funktionalität per REST-Call
    // Beispiel für zukünftigen REST-Call:
    // const response = await this.http.post('/api/cancellation/map-to-bipro', {
    //   customer,
    //   currentPolicy
    // }).toPromise();
  }

  /**
   * Sends cancellation request to insurance company
   * @param customer Customer data
   * @param currentPolicy Current policy data
   */
  private async sendCancellationRequest(
    customer: Customer,
    currentPolicy: CurrentPolicy
  ): Promise<void> {
    console.log('Sending cancellation request for:', {
      customer: `${customer.firstName} ${customer.lastName}`,
      policy: currentPolicy.policyNumber,
      insuranceCompany: currentPolicy.insuranceCompany,
    });

    // TODO: Implementierung der Sende-Funktionalität per REST-Call
    // Beispiel für zukünftigen REST-Call:
    // const response = await this.http.post('/api/cancellation/send', {
    //   customer,
    //   currentPolicy
    // }).toPromise();
  }
}
