import { Injectable } from '@angular/core';
import { Customer } from '../models/customer.model';
import { CurrentPolicy } from '../models/current-policy.model';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BiproCancellationService {
  private generatedPdfBlob: Blob | null = null;
  private pdfGenerationTimestamp: number | null = null;

  // NEU: XML-Response vorhalten
  private generatedXml: string | null = null;
  private xmlGenerationTimestamp: number | null = null;

  constructor(private http: HttpClient) {}

  /**
   * Starts the complete BiPRO process
   * @param customer Customer data
   * @param currentPolicy Current policy data
   */
  async startBipro(
    customer: Customer,
    currentPolicy: CurrentPolicy
  ): Promise<void> {
    try {
      // 1) Kündigungs-PDF erstellen
      const pdfBlob = await this.createCancellationPDF(customer, currentPolicy);

      // 2) BiPRO-Mapping (PDF + Daten -> XML) an 8081 senden und XML speichern
      await this.mapCancellationToBiPROTemplate(
        customer,
        currentPolicy,
        pdfBlob
      );

      // 3) Bearbeitung durch Vorversicherer mocken
      await this.startCancellationProcessingMock(this.generatedXml);

      // console.log('BiPRO cancellation process completed successfully');
    } catch (error) {
      console.error('Error during BiPRO cancellation process:', error);
      throw error;
    }
  }

  /** Returns the last generated PDF blob */
  getGeneratedPdf(): Blob | null {
    return this.generatedPdfBlob;
  }

  /** Returns the timestamp when the PDF was generated */
  getPdfGenerationTimestamp(): number | null {
    return this.pdfGenerationTimestamp;
  }

  /** Checks if a PDF has been generated */
  hasPdfGenerated(): boolean {
    return this.generatedPdfBlob !== null;
  }

  /** NEU: Gibt das letzte erzeugte XML zurück */
  getGeneratedXml(): string | null {
    return this.generatedXml;
  }

  /** NEU: Gibt den Timestamp der XML-Erzeugung zurück */
  getXmlGenerationTimestamp(): number | null {
    return this.xmlGenerationTimestamp;
  }

  /** NEU: Prüft, ob XML vorliegt */
  hasXmlGenerated(): boolean {
    return this.generatedXml !== null;
  }

  /** Downloads the generated PDF */
  downloadGeneratedPdf(filename: string = 'kuendigung.pdf'): void {
    if (!this.generatedPdfBlob) {
      throw new Error(
        'Kein PDF verfügbar. Bitte erst eine Kündigung erstellen.'
      );
    }

    const url = URL.createObjectURL(this.generatedPdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /** Opens the generated PDF in a new window */
  previewGeneratedPdf(): void {
    if (!this.generatedPdfBlob) {
      throw new Error(
        'Kein PDF verfügbar. Bitte erst eine Kündigung erstellen.'
      );
    }

    const url = URL.createObjectURL(this.generatedPdfBlob);
    const previewWindow = window.open(url, '_blank');
    if (!previewWindow) {
      throw new Error(
        'Popup-Blocker aktiv? Fenster konnte nicht geöffnet werden.'
      );
    }

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 60000);
  }

  /** Clears the stored PDF and XML from memory */
  clearGeneratedPdf(): void {
    this.generatedPdfBlob = null;
    this.pdfGenerationTimestamp = null;
  }

  /** NEU: Nur XML löschen */
  clearGeneratedXml(): void {
    this.generatedXml = null;
    this.xmlGenerationTimestamp = null;
  }

  /** NEU: Alles leeren */
  clearAllArtifacts(): void {
    this.clearGeneratedPdf();
    this.clearGeneratedXml();
  }

  /**
   * Generates a new PDF without showing the preview
   */
  async generatePdfOnly(
    customer: Customer,
    currentPolicy: CurrentPolicy
  ): Promise<Blob> {
    return await this.createCancellationPDF(customer, currentPolicy, false);
  }

  /**
   * Creates cancellation PDF with customer and policy data
   */
  private async createCancellationPDF(
    customer: Customer,
    currentPolicy: CurrentPolicy,
    showPreview: boolean = true
  ): Promise<Blob> {
    console.log('Sende Daten an Backend zur PDF-Erstellung:', {
      customer: `${customer.firstName} ${customer.lastName}`,
      policy: currentPolicy.policyNumber,
    });

    try {
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
          {
            responseType: 'blob',
          }
        )
      );

      this.generatedPdfBlob = pdfBlob;
      this.pdfGenerationTimestamp = Date.now();

      if (showPreview) {
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const previewWindow = window.open(pdfUrl, '_blank');
        if (!previewWindow) {
          throw new Error(
            'Popup-Blocker aktiv? Fenster konnte nicht geöffnet werden.'
          );
        }
        setTimeout(() => URL.revokeObjectURL(pdfUrl), 60000);
      }

      return pdfBlob;
    } catch (error) {
      console.error('Fehler beim Laden der PDF-Vorschau:', error);
      alert('Fehler beim Laden der PDF-Vorschau.');
      throw error;
    }
  }

  /**
   * Maps cancellation data to BiPRO template (PDF + Daten -> XML)
   * @param customer Customer data
   * @param currentPolicy Current policy data
   * @param pdf PDF blob (z. B. aus createCancellationPDF)
   * @returns XML-String
   */
  private async mapCancellationToBiPROTemplate(
    customer: Customer,
    currentPolicy: CurrentPolicy,
    pdf: Blob
  ): Promise<string> {
    console.log('Mapping cancellation data to BiPRO template für:', {
      customer: `${customer.firstName} ${customer.lastName}`,
      policy: currentPolicy.policyNumber,
      insuranceCompany: currentPolicy.insuranceCompany,
    });

    try {
      // multipart/form-data aufbauen
      const formData = new FormData();

      // Datei anhängen – Dateiname optional, hilft aber serverseitig
      const pdfFileName =
        (currentPolicy.policyNumber
          ? `cancellation_${currentPolicy.policyNumber}`
          : 'cancellation') + '.pdf';
      formData.append('pdf', pdf, pdfFileName);

      // Customer/Policy als JSON-Strings beifügen
      formData.append(
        'customer',
        new Blob([JSON.stringify(customer)], { type: 'application/json' })
      );
      formData.append(
        'policy',
        new Blob([JSON.stringify(currentPolicy)], { type: 'application/json' })
      );

      // WICHTIG: responseType 'text', weil der Server XML liefert (Content-Type text/xml oder application/xml)
      const xmlResponse = await firstValueFrom(
        this.http.post('http://localhost:8081/api/pdf-xml', formData, {
          responseType: 'text',
        })
      );

      // XML für spätere Verwendung speichern
      this.generatedXml = xmlResponse;
      this.xmlGenerationTimestamp = Date.now();

      console.log(this.generatedXml);

      return xmlResponse;
    } catch (error) {
      console.error('Fehler beim BiPRO-Mapping (PDF->XML):', error);
      alert('Fehler beim BiPRO-Mapping (PDF->XML).');
      throw error;
    }
  }

  /**
   * Starts the cancellation processing process
   */
  private async startCancellationProcessingMock(
    generatedXml: string | null
  ): Promise<void> {}
  //TODO: implementieren
}
