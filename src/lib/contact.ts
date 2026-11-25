/** Site contact details — used by the landing page and footer. Edit here once. */
export const CONTACT = {
  /** WhatsApp number with country code, digits only */
  whatsapp: '918381001406',
  whatsappLink(text: string) {
    return `https://wa.me/${this.whatsapp}?text=${encodeURIComponent(text)}`
  },
}
