/**
 * Sends order confirmation via EmailJS after checkout.
 * Requires js/emailjs-config.js (copy from emailjs-config.example.js).
 */
async function sendSomewhereOrderEmails(order) {
    const cfg = window.STILL_EMAILJS;
    if (!cfg || !cfg.publicKey || cfg.publicKey.includes('YOUR_')) {
        console.warn('SOMEWHERE EmailJS: config missing. Copy js/emailjs-config.example.js to js/emailjs-config.js');
        return { customer: false, owner: false, skipped: true };
    }
    if (typeof emailjs === 'undefined') {
        console.warn('SOMEWHERE EmailJS: SDK not loaded');
        return { customer: false, owner: false, skipped: true };
    }

    emailjs.init({ publicKey: cfg.publicKey });

    const templateParams = {
        // Names used in many EmailJS templates (including name / email / order_id)
        name: order.customerName,
        email: order.email,
        order_id: order.orderId,
        // Same data with longer names (see EMAILJS-SETUP.md)
        to_email: order.email,
        customer_name: order.customerName,
        order_items: order.orderItems,
        order_subtotal: order.orderSubtotal,
        phone: order.phone,
        address: order.address,
        city: order.city,
        payment_method: order.paymentMethod,
        notes: order.notes || '(none)',
        reply_to: order.email
    };

    const results = { customer: false, owner: false, skipped: false };

    try {
        await emailjs.send(cfg.serviceId, cfg.customerTemplateId, templateParams);
        results.customer = true;
    } catch (err) {
        console.error('SOMEWHERE EmailJS customer email failed:', err);
    }

    if (cfg.ownerTemplateId && cfg.ownerEmail && !cfg.ownerTemplateId.includes('YOUR_')) {
        try {
            await emailjs.send(cfg.serviceId, cfg.ownerTemplateId, {
                ...templateParams,
                to_email: cfg.ownerEmail
            });
            results.owner = true;
        } catch (err) {
            console.error('SOMEWHERE EmailJS owner email failed:', err);
        }
    }

    return results;
}
