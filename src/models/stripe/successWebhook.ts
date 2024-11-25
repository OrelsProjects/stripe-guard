export interface StripeSuccessWebhook {
    id: string;
    object: 'event';
    api_version: string;
    created: number;
    data: {
        object: {
            id: string;
            object: 'payment_intent';
            amount: number;
            amount_capturable: number;
            amount_details: {
                tip: Record<string, unknown>;
            };
            amount_received: number;
            application: null;
            application_fee_amount: null;
            automatic_payment_methods: null;
            canceled_at: null;
            cancellation_reason: null;
            capture_method: string;
            client_secret: string;
            confirmation_method: string;
            created: number;
            currency: string;
            customer: null;
            description: string;
            invoice: null;
            last_payment_error: null;
            latest_charge: string;
            livemode: boolean;
            metadata: Record<string, unknown>;
            next_action: null;
            on_behalf_of: null;
            payment_method: string;
            payment_method_configuration_details: null;
            payment_method_options: {
                card: {
                    installments: null;
                    mandate_options: null;
                    network: null;
                    request_three_d_secure: string;
                };
            };
            payment_method_types: string[];
            processing: null;
            receipt_email: null;
            review: null;
            setup_future_usage: null;
            shipping: {
                address: {
                    city: string;
                    country: string;
                    line1: string;
                    line2: null;
                    postal_code: string;
                    state: string;
                };
                carrier: null;
                name: string;
                phone: null;
                tracking_number: null;
            };
            source: null;
            statement_descriptor: null;
            statement_descriptor_suffix: null;
            status: 'succeeded';
            transfer_data: null;
            transfer_group: null;
        };
    };
    livemode: boolean;
    pending_webhooks: number;
    request: {
        id: string;
        idempotency_key: string;
    };
    type: 'payment_intent.succeeded';
}