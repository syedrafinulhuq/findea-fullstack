# API Examples

## Register

```bash
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"customer@example.com","password":"Customer@123","firstName":"Customer"}'
```

## Create order

```bash
curl -X POST http://localhost:4000/api/v1/orders \
  -H 'Content-Type: application/json' \
  -d '{
    "customerEmail":"customer@example.com",
    "customerName":"Customer One",
    "customerPhone":"01700000000",
    "shippingLine1":"House 1, Road 2",
    "shippingCity":"Dhaka",
    "items":[{"productId":"REPLACE_PRODUCT_ID","quantity":1}]
  }'
```

## Initialize Flutterwave payment

```bash
curl -X POST http://localhost:4000/api/v1/payments/initialize \
  -H 'Content-Type: application/json' \
  -d '{"orderId":"REPLACE_ORDER_ID"}'
```
