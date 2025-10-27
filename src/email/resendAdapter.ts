import { Resend } from 'resend'
import type { EmailAdapter } from 'payload'

export const resendAdapter = ({
  apiKey,
  defaultFromAddress,
  defaultFromName,
}: {
  apiKey: string
  defaultFromAddress: string
  defaultFromName: string
}): EmailAdapter => {
  return () => {
    const resend = new Resend(apiKey)

    return {
      name: 'resend',
      defaultFromAddress,
      defaultFromName,
      sendEmail: async (message) => {
        return await resend.emails.send({
          from: message.from
            ? typeof message.from === 'string'
              ? message.from
              : `${message.from.name} <${message.from.address}>`
            : `${defaultFromName} <${defaultFromAddress}>`,
          to: Array.isArray(message.to)
            ? message.to.map((recipient) =>
                typeof recipient === 'string' ? recipient : recipient.address,
              )
            : typeof message.to === 'string'
              ? message.to
              : message.to?.address || '',
          subject: message.subject || '',
          html: message.html as string,
          text: message.text as string,
        })
      },
    }
  }
}
