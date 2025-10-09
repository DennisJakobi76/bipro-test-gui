import { Injectable } from '@angular/core';
import { Customer } from '../models/customer.model';
import { CurrentPolicy } from '../models/current-policy.model';

@Injectable({
  providedIn: 'root',
})
export class BiproCancellationService {
  constructor() {}

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

      // Mappe Kündigungsdaten auf BiPRO-Template des Vorversicherers als XML per REST an Java-Microservice
      await this.mapCancellationToBiPROTemplate(customer, currentPolicy);

      // Sende Kündigungsantrag an Java-Microservice
      await this.sendCancellationRequest(customer, currentPolicy);

      console.log('BiPRO cancellation process completed successfully');
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
    console.log('Creating cancellation PDF for:', {
      customer: `${customer.firstName} ${customer.lastName}`,
      policy: currentPolicy.policyNumber,
    });

    // TODO: Implementierung der PDF-Erstellung per REST-Call
    // Beispiel für zukünftigen REST-Call:
    // const response = await this.http.post('/api/cancellation/pdf', {
    //   customer,
    //   currentPolicy
    // }).toPromise();
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
