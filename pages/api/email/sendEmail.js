import { sendEmail } from "lib/email/nodemailer"

export default async function(req, res) {
    const fields = req.body

    const response = sendEmail(fields.from, fields.to, fields.subject, fields.template, fields.data)

    res.status(200).json({emailResponse: response})
}