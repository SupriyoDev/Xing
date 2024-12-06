export function createWelcomeEmailTemplate(name, profileUrl) {
  return `  
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Our Platform</title>
    <style type="text/css">
        /* Reset styles */
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; }

        /* Responsive styles */
        img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        table { border-collapse: collapse !important; }
        body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }

        /* Email body styles */
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
    </style>
</head>
<body style="margin: 0; padding: 0;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
            <td style="padding: 20px; background-color: #f4f4f4;">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" align="center" style="background-color: white; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #0077B5; padding: 40px 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; line-height: 1.3;">Welcome to Our Professional Network, ${name}!</h1>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px; background-color: white;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td style="color: #333; font-size: 16px; line-height: 1.6;">
                                        <p style="margin: 0 0 20px 0;">Hi {{name}},</p>
                                        
                                        <p style="margin: 0 0 20px 0;">We're thrilled to have you join our professional community! Your journey to expanding your network and opportunities starts now.</p>
                                        
                                        <h2 style="color: #0077B5; font-size: 20px; margin: 0 0 15px 0;">Get Started in 3 Easy Steps:</h2>
                                        
                                        <ol style="margin: 0 0 20px 20px; padding: 0; color: #333;">
                                            <li style="margin-bottom: 10px;">
                                                <strong>Complete Your Profile</strong><br>
                                                Add your work experience, skills, and a professional photo.
                                            </li>
                                            <li style="margin-bottom: 10px;">
                                                <strong>Connect with Colleagues</strong><br>
                                                Start building your professional network.
                                            </li>
                                            <li style="margin-bottom: 10px;">
                                                <strong>Explore Opportunities</strong><br>
                                                Discover jobs, resources, and professional growth tools.
                                            </li>
                                        </ol>
                                        
                                        <p style="margin: 0 0 20px 0;">Need help? Our support team is always ready to assist you.</p>
                                    </td>
                                </tr>
                                
                                <!-- Call to Action -->
                                <tr>
                                    <td style="padding: 20px 0;">
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                            <tr>
                                                <td align="center">
                                                    <a href="${profileUrl}" style="background-color: #0077B5; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block;">
                                                        Complete Your Profile
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f4f4f4; padding: 20px 30px; text-align: center; font-size: 12px; color: #666;">
                            <p style="margin: 0;">© {{currentYear}} Your Company Name. All rights reserved.</p>
                            <p style="margin: 10px 0 0;">If you did not sign up for our service, please ignore this email.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;
}
