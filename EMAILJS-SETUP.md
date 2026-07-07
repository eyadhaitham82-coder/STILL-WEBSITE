# EmailJS setup for STILL checkout

When a customer **places an order**, they get an automatic **order confirmation email** at the address they entered.

---

## What to send / configure in EmailJS

### 1. From EmailJS dashboard → **Account** → **API Keys**

- **Public Key** (starts with something like `user_...` or a long string)

### 2. **Email Services**

- **Service ID** (e.g. `service_xxxxx`) — Gmail, Outlook, etc. connected to EmailJS

### 3. **Email Templates** → create a template for the customer

**Template ID** (e.g. `template_xxxxx`)

In the template editor:

| Field | Value |
|--------|--------|
| **To Email** | `{{to_email}}` |
| **Subject** | e.g. `Your STILL order {{order_id}}` |
| **Reply To** | `{{reply_to}}` (optional) |

**Body** (example — you can style it):

```
Hi {{customer_name}},

Thank you for your order with STILL!

Order: {{order_id}}
Total: {{order_subtotal}}

Items:
{{order_items}}

Shipping
Phone: {{phone}}
Address: {{address}}, {{city}}

Payment: {{payment_method}}
Notes: {{notes}}

We will contact you soon.

— STILL
```

Template variables must use **exactly** these names:

- `to_email`
- `customer_name`
- `order_id`
- `order_items`
- `order_subtotal`
- `phone`
- `address`
- `city`
- `payment_method`
- `notes`
- `reply_to`

### 4. (Optional) Second template for **you** (new order alert)

- Duplicate the template, change subject to `New order {{order_id}}`
- **To Email**: your shop email, or use `{{to_email}}` and we send with `ownerEmail` in config
- Share **owner Template ID** and your **shop email** if you want this

---

## On your computer

1. Copy the config file:

   ```powershell
   cd c:\STILL-website
   copy js\emailjs-config.example.js js\emailjs-config.js
   ```

2. Edit `js\emailjs-config.js` and paste your real keys.

3. Deploy (include `js/emailjs-config.js` on Netlify — it is only ignored from **Git** if you prefer not to publish keys; for Netlify you must upload the file or set keys in the deployed site).

   **Security note:** EmailJS public keys are meant for browser use. Never put private/secret keys in the website.

4. In EmailJS → **Account** → **Security**, add your site domain:
   - `https://stilleg.netlify.app`
   - `http://localhost:8080` (for local testing)

---

## Test

1. Place a test order on checkout with your real email.
2. Check inbox (and spam).
3. EmailJS dashboard → **Email History** for errors.

If email fails, the order still submits to Netlify; the customer sees a message that confirmation email could not be sent.
