import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly mercadoPagoUrl = ' https://api.mercadopago.com/v1/payments';

  constructor(private configService: ConfigService) {}

  async createpixPayment(
    transactionAmount: number,
    description: string,
    payerEmail: string,
  ) {
    // leitura do token
    const accessToken = this.configService.get<string>(
      'MERCADO_PAGO_ACCESS_TOKEN',
    );

    if (!accessToken) {
      this.logger.error('Token do Mercado Pago não configurado');

      throw new BadRequestException(
        'Erro Interno de configuração do pagamento',
      );
    }

    try {
      const response = await axios.post(
        this.mercadoPagoUrl,
        {
          transaction_amount: transactionAmount,
          description: description,
          payment_method_id: 'pix',
          payer: {
            email: payerEmail,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'Application/json',
            'X-Idempotency-Key': `PAY-${Date.now()}`,
          },
        },
      );

      return {
        id: response.data.id,
        status: response.data.status,
        qr_code: response.data.point_of_interaction.transaction_data.qr_code, // código copia e cola
        qr_code_base64:
          response.data.point_of_interaction.transaction_data.qr_code_base64, // imagem qrcode
        ticket_url:
          response.data.point_of_interaction.transaction_data.ticket_url, // link comprovante
      };
    } catch (error) {
      this.logger.error(
        `Erro no Mercado Pago: ${JSON.stringify(error.response?.data || error.message)}`,
      );

      // fallback - se der erro, joga exceção para avisar o usuário
      throw new BadRequestException(
        'Falha ao gerar PIX no Mercado Pago. Tente novamente mais tarde',
      );
    }
  }
}
