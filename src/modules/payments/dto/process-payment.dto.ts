import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Max, Min } from 'class-validator';

type AdditionalInfoItem = {
  id: string;
  title: string;
  description: string;
  picture_url: string;
  category_id: string;
  quantity: number;
  unit_price: number;
};

type AdditionalInfoPayer = {
  first_name: string;
  last_name: string;
  phone: {
    area_code: number;
    number: string;
  };
  address: AdditionalInfoPayerAddress;
};

type AdditionalInfoPayerAddress = {
  zip_code: string;
  street_name: string;
  street_number: number;
};

type AdditionalInfoShipmentAddress = {
  zip_code: string;
  state_name: string;
  city_name: string;
  street_name: string;
  street_number: number;
};

export class ProcessPaymentDto {
  @ApiProperty()
  @IsNotEmpty()
  token: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @Min(1)
  @Max(12)
  installments: number;

  /**
   * card flag
   * @param issuer_id
   */
  @ApiProperty()
  @IsNotEmpty()
  issuer_id: string;

  @ApiProperty()
  @IsNotEmpty()
  payment_method_id: string;

  @ApiProperty()
  @IsNotEmpty()
  transaction_amount: number;

  /**
   * description that appears in bank transaction
   * @param statement_descriptor
   */
  @ApiProperty()
  statement_descriptor: string;

  /**
   * webhook link to reciev payment events
   * @param notification_url
   */
  @ApiProperty()
  notification_url: string;

  @ApiProperty()
  additional_info?: {
    items: AdditionalInfoItem[];
    payer: AdditionalInfoPayer;
    shipments: {
      receiver_address: AdditionalInfoShipmentAddress;
    };
    barcode: Record<string, unknown>;
  };

  @ApiProperty()
  external_reference: string;

  @ApiProperty()
  metadata: Record<string, unknown>;

  @ApiProperty()
  order: {
    type: 'mercadopago';
  };

  @ApiProperty()
  payer: {
    id: string;
    entity_type: 'individual';
    type: 'customer';
    identification?: {
      type: string;
      number: string;
    };
  };
}
