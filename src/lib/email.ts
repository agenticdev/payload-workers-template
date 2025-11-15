import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface SendContactEmailParams {
  firstName: string
  lastName: string
  email: string
  subject: string
  message: string
}

export async function sendContactEmail({
  firstName,
  lastName,
  email,
  subject,
  message,
}: SendContactEmailParams) {
  const fromEmail = process.env.DEFAULT_FROM_EMAIL || 'noreply@example.com'
  const fromName = process.env.DEFAULT_FROM_NAME || 'Contact Form'

  try {
    const { data, error } = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: [email], // Send confirmation to the user
      subject: `Contact Form: ${subject}`,
      html: `
        <h2>Thank you for contacting us!</h2>
        <p>We received your message and will get back to you soon.</p>
        <hr />
        <h3>Your Message:</h3>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    })

    if (error) {
      console.error('Error sending email:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error: 'Failed to send email' }
  }
}
