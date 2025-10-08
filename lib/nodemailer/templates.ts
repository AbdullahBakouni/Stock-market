import { formatMarketCap } from "../utils.ts";

export const WELCOME_EMAIL_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="x-apple-disable-message-reformatting">
    <title>Welcome to Signalist</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:AllowPNG/>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style type="text/css">
        /* Dark mode styles */
        @media (prefers-color-scheme: dark) {
            .email-container {
                background-color: #141414 !important;
                border: 1px solid #30333A !important;
            }
            .dark-bg {
                background-color: #050505 !important;
            }
            .dark-text {
                color: #ffffff !important;
            }
            .dark-text-secondary {
                color: #9ca3af !important;
            }
            .dark-text-muted {
                color: #6b7280 !important;
            }
            .dark-border {
                border-color: #30333A !important;
            }
        }

        @media only screen and (max-width: 600px) {
            .email-container {
                width: 100% !important;
                margin: 0 !important;
            }
            .mobile-padding {
                padding: 24px !important;
            }
            .mobile-header-padding {
                padding: 24px 24px 12px 24px !important;
            }
            .mobile-text {
                font-size: 14px !important;
                line-height: 1.5 !important;
            }
            .mobile-title {
                font-size: 24px !important;
                line-height: 1.3 !important;
            }
            .mobile-button {
                width: 100% !important;
                text-align: center !important;
            }
            .mobile-button a {
                width: calc(100% - 64px) !important;
                display: block !important;
                text-align: center !important;
            }
            .mobile-outer-padding {
                padding: 20px 10px !important;
            }
            .dashboard-preview {
                padding: 0 15px 30px 15px !important;
            }
        }
        @media only screen and (max-width: 480px) {
            .mobile-title {
                font-size: 22px !important;
            }
            .mobile-padding {
                padding: 15px !important;
            }
            .mobile-header-padding {
                padding: 15px 15px 8px 15px !important;
            }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #050505; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #050505;">
        <tr>
            <td align="center" class="mobile-outer-padding" style="padding: 40px 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" class="email-container" style="max-width: 600px; background-color: #141414; border-radius: 8px; border: 1px solid #30333A;">

                    <!-- Header with Logo -->
                    <tr>
                        <td align="left" class="mobile-header-padding" style="padding: 40px 40px 20px 40px;">
                            <img src="https://ik.imagekit.io/a6fkjou7d/logo.png?updatedAt=1756378431634" alt="Signalist Logo" width="150" style="max-width: 100%; height: auto;">
                        </td>
                    </tr>

                    <!-- Dashboard Preview Image -->
                    <tr>
                        <td align="center" class="dashboard-preview" style="padding: 40px 40px 0px 40px;">
                            <img src="https://ik.imagekit.io/a6fkjou7d/dashboard-preview.png?updatedAt=1756378548102" alt="Signalist Dashboard Preview" width="100%" style="max-width: 520px; width: 100%; height: auto; border-radius: 12px; border: 1px solid #30333A;">
                        </td>
                    </tr>

                    <!-- Main Content -->
                    <tr>
                        <td class="mobile-padding" style="padding: 40px 40px 40px 40px;">

                            <!-- Welcome Heading -->
                            <h1 class="mobile-title dark-text" style="margin: 0 0 30px 0; font-size: 24px; font-weight: 600; color: #FDD458; line-height: 1.2;">
                                Welcome aboard {{name}}
                            </h1>

                            <!-- Intro Text -->
                            {{intro}}

                            <!-- Feature List Label -->
                            <p class="mobile-text dark-text-secondary" style="margin: 0 0 15px 0; font-size: 16px; line-height: 1.6; color: #CCDADC; font-weight: 600;">
                                Here's what you can do right now:
                            </p>

                            <!-- Feature List -->
                            <ul class="mobile-text dark-text-secondary" style="margin: 0 0 30px 0; padding-left: 20px; font-size: 16px; line-height: 1.6; color: #CCDADC;">
                                <li style="margin-bottom: 12px;">Set up your watchlist to follow your favorite stocks</li>
                                <li style="margin-bottom: 12px;">Create price and volume alerts so you never miss a move</li>
                                <li style="margin-bottom: 12px;">Explore the dashboard for trends and the latest market news</li>
                            </ul>

                            <!-- Additional Text -->
                            <p class="mobile-text dark-text-secondary" style="margin: 0 0 40px 0; font-size: 16px; line-height: 1.6; color: #CCDADC;">
                                We'll keep you informed with timely updates, insights, and alerts — so you can focus on making the right calls.
                            </p>

                            <!-- CTA Button -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 0 40px 0; width: 100%;">
                                <tr>
                                    <td align="center">
                                        <a href="https://stock-market-dev.vercel.app/" style="display: block; width: 100%; background: linear-gradient(135deg, #FDD458 0%, #E8BA40 100%); color: #000000; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-size: 16px; font-weight: 500; line-height: 1; text-align: center; box-sizing: border-box;">
                                            Go to Dashboard
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <!-- Footer Text -->
                            <p class="mobile-text dark-text-muted" style="margin: 40px 0 0 0; font-size: 14px; line-height: 1.5; color: #CCDADC !important; text-align: center;">
                               Signalist HQ, 200 Market Street, San Francisco, CA 94105<br>
                                <a href="#" style="color: #CCDADC !important; text-decoration: underline;">Unsubscribe</a> |
                                <a href="https://stock-market-dev.vercel.app/" style="color: #CCDADC !important; text-decoration: underline;">Visit Signalist</a><br>
                                © 2025 Signalist
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
export const NEWS_SUMMARY_EMAIL_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="x-apple-disable-message-reformatting">
    <title>Market News Summary Today</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:AllowPNG/>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style type="text/css">
        /* Dark mode styles */
        @media (prefers-color-scheme: dark) {
            .email-container {
                background-color: #141414 !important;
                border: 1px solid #30333A !important;
            }
            .dark-bg {
                background-color: #050505 !important;
            }
            .dark-text {
                color: #ffffff !important;
            }
            .dark-text-secondary {
                color: #9ca3af !important;
            }
            .dark-text-muted {
                color: #6b7280 !important;
            }
            .dark-border {
                border-color: #30333A !important;
            }
            .dark-cta {
                background-color: #1f2937 !important;
                border: 1px solid #374151 !important;
            }
        }

        @media only screen and (max-width: 600px) {
            .email-container {
                width: 100% !important;
                margin: 0 !important;
            }
            .mobile-padding {
                padding: 24px !important;
            }
            .mobile-header-padding {
                padding: 24px 24px 12px 24px !important;
            }
            .mobile-text {
                font-size: 14px !important;
                line-height: 1.5 !important;
            }
            .mobile-title {
                font-size: 24px !important;
                line-height: 1.3 !important;
            }
            .mobile-news-title {
                font-size: 16px !important;
                line-height: 1.3 !important;
            }
            .mobile-outer-padding {
                padding: 20px 10px !important;
            }
        }
        @media only screen and (max-width: 480px) {
            .mobile-title {
                font-size: 22px !important;
            }
            .mobile-padding {
                padding: 15px !important;
            }
            .mobile-header-padding {
                padding: 15px 15px 8px 15px !important;
            }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #050505; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #050505;">
        <tr>
            <td align="center" class="mobile-outer-padding" style="padding: 40px 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" class="email-container" style="max-width: 600px; background-color: #141414; border-radius: 8px; border: 1px solid #30333A;">

                    <!-- Header with Logo -->
                    <tr>
                        <td align="left" class="mobile-header-padding" style="padding: 40px 40px 20px 40px;">
                            <img src="https://ik.imagekit.io/a6fkjou7d/logo.png?updatedAt=1756378431634" alt="Signalist Logo" width="150" style="max-width: 100%; height: auto;">
                        </td>
                    </tr>

                    <!-- Main Content -->
                    <tr>
                        <td class="mobile-padding" style="padding: 40px 40px 40px 40px;">

                            <!-- Header -->
                            <h1 class="mobile-title dark-text" style="margin: 0 0 20px 0; font-size: 24px; font-weight: 600; color: #FDD458; line-height: 1.2;">
                                Market News Summary Today
                            </h1>

                            <!-- Date -->
                            <p class="mobile-text dark-text-muted" style="margin: 0 0 30px 0; font-size: 14px; line-height: 1.4; color: #6b7280;">
                                {{date}}
                            </p>

                            <!-- News Summary -->
                            {{newsContent}}

                            <!-- Footer Text -->
                            <div style="text-align: center; margin: 40px 0 0 0;">
                                <p style="margin: 0 0 10px 0; font-size: 14px; line-height: 1.5; color: #CCDADC !important;">
                                    You're receiving this because you subscribed to Signalist news updates.
                                </p>
                                <p style="margin: 0 0 10px 0; font-size: 14px; line-height: 1.5; color: #CCDADC !important;">
                                    <a href="#" style="color: #CCDADC !important; text-decoration: underline;">Unsubscribe</a> |
                                    <a href="https://signalist.app" style="color: #CCDADC !important; text-decoration: underline;">Visit Signalist</a>
                                </p>
                                <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #CCDADC !important;">
                                    © 2025 Signalist
                                </p>
                            </div>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

export const PRICE_VOLUME_MARKETCAP_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Stock Alert - Signalist</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #000000;
            color: #ffffff;
            padding: 20px;
            line-height: 1.6;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #000000;
        }

        .header {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 30px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .bell-icon {
            font-size: 32px;
        }

        .email-card {
            background-color: #1a1a1a;
            border-radius: 16px;
            padding: 40px;
        }

        .logo {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 40px;
        }

        .logo-icon {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #10b981 0%, #3b82f6 50%, #8b5cf6 100%);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
        }

        .logo-text {
            font-size: 28px;
            font-weight: bold;
        }

        .alert-banner {
            background-color: #059669;
            border-radius: 12px;
            padding: 32px;
            text-align: center;
            margin-bottom: 20px;
        }

        .alert-banner h2 {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 8px;
        }

        .alert-banner .timestamp {
            font-size: 18px;
            opacity: 0.9;
        }

        .stock-info {
            background-color: #2a2a2a;
            border-radius: 12px;
            padding: 32px;
            text-align: center;
            margin-bottom: 20px;
        }

        .stock-info h3 {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 16px;
        }

        .stock-info .label {
            font-size: 16px;
            color: #d1d5db;
            margin-bottom: 8px;
        }

        .stock-info .price {
            font-size: 42px;
            font-weight: bold;
            color: #10b981;
        }

        .alert-details {
            background-color: #2a2a2a;
            border-radius: 12px;
            padding: 32px;
            margin-bottom: 20px;
        }

        .alert-details h4 {
            font-size: 22px;
            font-weight: bold;
            margin-bottom: 16px;
        }

        .alert-details p {
            margin-bottom: 16px;
            font-size: 16px;
            color: #d1d5db;
        }

        .alert-details ul {
            list-style: none;
            padding-left: 0;
        }

        .alert-details li {
            margin-bottom: 8px;
            font-size: 16px;
            padding-left: 20px;
            position: relative;
        }

        .alert-details li::before {
            content: "•";
            position: absolute;
            left: 0;
            color: #10b981;
            font-weight: bold;
        }

        .alert-details strong {
            color: #ffffff;
        }

        .change-positive {
            color: #10b981;
        }

        .opportunity-alert {
            background-color: #2a2a2a;
            border-radius: 12px;
            padding: 32px;
            margin-bottom: 20px;
        }

        .opportunity-alert h4 {
            font-size: 22px;
            font-weight: bold;
            color: #fbbf24;
            margin-bottom: 16px;
        }

        .opportunity-alert p {
            font-size: 16px;
            color: #d1d5db;
            line-height: 1.6;
        }

        .cta-button {
            display: block;
            width: 100%;
            background-color: #fbbf24;
            color: #000000;
            text-align: center;
            padding: 18px;
            border-radius: 12px;
            text-decoration: none;
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 30px;
            transition: background-color 0.3s;
        }

        .cta-button:hover {
            background-color: #f59e0b;
        }

        .signature {
            font-size: 16px;
            margin-bottom: 40px;
        }

        .footer {
            text-align: center;
            padding-top: 30px;
            border-top: 1px solid #2a2a2a;
        }

        .footer p {
            font-size: 14px;
            color: #9ca3af;
            margin-bottom: 16px;
        }

        .footer-links {
            margin-bottom: 16px;
        }

        .footer-links a {
            color: #fbbf24;
            text-decoration: underline;
            margin: 0 8px;
            font-size: 14px;
        }

        .copyright {
            font-size: 14px;
            color: #9ca3af;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <span class="bell-icon">🔔</span>
            <span>[Stock Ticker] just hit your alert</span>
        </div>

        <div class="email-card">
            <div class="logo">
                <div class="logo-icon">📊</div>
                <div class="logo-text">Signalist</div>
            </div>

            <div class="alert-banner">
                <h2>Price Above Reached</h2>
                <div class="timestamp">5/11/2025, 10:34:52 AM</div>
            </div>

            <div class="stock-info">
                <h3>MSFT - Microsoft Corp</h3>
                <div class="label">Current Price:</div>
                <div class="price">$352.52</div>
            </div>

            <div class="alert-details">
                <h4>Alert Details:</h4>
                <p>Your alert for <strong>Microsoft Corp (MSFT)</strong> just triggered:</p>
                <ul>
                    <li>Condition: <strong>Price > $240.60</strong></li>
                    <li>Current Price: <strong>$242.24</strong></li>
                    <li>Change: <strong class="change-positive">+1.4%</strong></li>
                </ul>
            </div>

            <div class="opportunity-alert">
                <h4>Opportunity Alert!</h4>
                <p>MSFT has reached your target price! This could be good time to review your position and consider taking profits or adjusting your strategy.</p>
            </div>

            <a href="#" class="cta-button">View Dashboard</a>

            <div class="signature">
                Stay sharp,<br>
                Signalist
            </div>

            <div class="footer">
                <p>You're receiving this email because you signed up for Signalist.</p>
                <div class="footer-links">
                    <a href="#">Unsubscribe</a>
                    <span style="color: #9ca3af;">•</span>
                    <a href="#">Visit Signalist</a>
                </div>
                <div class="copyright">© 2025 Signalist</div>
            </div>
        </div>
    </div>
</body>
</html>`;

export function generatePriceVolumeMarketCapTemplate({
  stockName,
  stockSymbol,
  alertType,
  conditionType,
  threshold,
  currentValue,
  percentChange,
  timestamp,
  aiMessage,
}: {
  stockName: string;
  stockSymbol: string;
  alertType: "price" | "marketCap";
  conditionType: "greater" | "less" | "equal";
  threshold: number;
  currentValue: number;
  percentChange: string;
  timestamp: string;
  aiMessage: string;
}) {
  const label =
    alertType === "price"
      ? "Price"
      : alertType === "marketCap"
        ? "Market Cap"
        : "";

  const formattedValue =
    alertType === "price"
      ? `$${currentValue.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : formatMarketCap(currentValue);

  const mainColor = conditionType === "less" ? "#DA3747" : "#138656";
  const changeValue = parseFloat(percentChange.replace("%", ""));
  const changeColor = changeValue < 0 ? "#DA3747" : "#138656";
  const formattedChange = percentChange;
  const conditionText =
    conditionType === "greater"
      ? "Above"
      : conditionType === "less"
        ? "Below"
        : "Equal To";

  const formattedThreshold =
    alertType === "price"
      ? `$${threshold.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : formatMarketCap(threshold);

  return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="format-detection" content="telephone=no">
      <meta name="x-apple-disable-message-reformatting">
      <title>${stockSymbol} ${label} ${conditionText}</title>
      <!--[if mso]>
       <noscript>
           <xml>
               <o:OfficeDocumentSettings>
                   <o:AllowPNG/>
                   <o:PixelsPerInch>96</o:PixelsPerInch>
               </o:OfficeDocumentSettings>
           </xml>
       </noscript>
       <![endif]-->
      <style type="text/css">
          /* Dark mode styles */
          @media (prefers-color-scheme: dark) {
              .email-container {
                  background-color: #141414 !important;
                  border: 1px solid #30333A !important;
              }
              .dark-bg {
                  background-color: #050505 !important;
              }
              .dark-text {
                  color: #ffffff !important;
              }
              .dark-text-secondary {
                  color: #9ca3af !important;
              }
              .dark-text-muted {
                  color: #6b7280 !important;
              }
              .dark-border {
                  border-color: #30333A !important;
              }
              .dark-info-box {
                  background-color: #1f2937 !important;
                  border: 1px solid #374151 !important;
              }
          }

          @media only screen and (max-width: 600px) {
              .email-container {
                  width: 100% !important;
                  margin: 0 !important;
              }
              .mobile-padding {
                  padding: 24px !important;
              }
              .mobile-header-padding {
                  padding: 24px 24px 12px 24px !important;
              }
              .mobile-text {
                  font-size: 14px !important;
                  line-height: 1.5 !important;
              }
              .mobile-title {
                  font-size: 24px !important;
                  line-height: 1.3 !important;
              }
              .mobile-button {
                  width: 100% !important;
                  text-align: center !important;
              }
              .mobile-button a {
                  width: calc(100% - 32px) !important;
                  display: block !important;
                  text-align: center !important;
              }
              .mobile-outer-padding {
                  padding: 20px 10px !important;
              }
              .mobile-price {
                  font-size: 28px !important;
              }
          }
          @media only screen and (max-width: 480px) {
              .mobile-title {
                  font-size: 22px !important;
              }
              .mobile-padding {
                  padding: 15px !important;
              }
              .mobile-header-padding {
                  padding: 15px 15px 8px 15px !important;
              }
              .mobile-price {
                  font-size: 24px !important;
              }
          }
      </style>
  </head>
  <body style="margin: 0; padding: 0; background-color: #050505; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #050505;">
          <tr>
              <td align="center" class="mobile-outer-padding" style="padding: 40px 20px;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" class="email-container" style="max-width: 600px; background-color: #141414; border-radius: 8px; border: 1px solid #30333A;">

                      <!-- Header with Logo -->
                      <tr>
                          <td align="left" class="mobile-header-padding" style="padding: 40px 40px 20px 40px;">
                              <img src="https://ik.imagekit.io/a6fkjou7d/logo.png?updatedAt=1756378431634" alt="Signalist Logo" width="150" style="max-width: 100%; height: auto;">
                          </td>
                      </tr>

                      <!-- Alert Header -->
                      <tr>
                          <td class="mobile-padding" style="padding: 0 40px 20px 40px;">
                          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                            <tr>
                              <td align="center" style="background-color:${mainColor}; border-radius:8px; padding:20px;">
                                <h1 style="margin:0; font-size:24px; font-weight:700; color:#ffffff;">
                                  ${label} ${conditionText} Threshold
                                </h1>
                                <p style="margin:0; font-size:16px; color:#ffffff; opacity:0.9;">
                                  ${timestamp}
                                </p>
                              </td>
                            </tr>
                          </table>

                          </td>
                      </tr>

                      <!-- Main Content -->
                      <tr>
                          <td class="mobile-padding" style="padding: 0 40px 40px 40px;">

                              <!-- Stock Info -->
                              <div class="dark-bg" style="text-align: center; padding: 30px 20px; background-color: #212328; border-radius: 8px; margin-bottom: 10px;">
                                  <h2 class="dark-text" style="margin: 0 0 10px 0; font-size: 28px; font-weight: 700; color: #ffffff;">

                                  ${stockSymbol}
                                  </h2>
                                  <p class="dark-text-muted" style="margin: 0 0 20px 0; font-size: 16px; color: #6b7280;">
                                     ${stockName}
                                  </p>

                                  <!-- Current Price -->
                                  <div style="margin-bottom:20px;">
                                    <p style="margin:0 0 5px 0; font-size:14px; color:#9ca3af; text-transform:uppercase; letter-spacing:0.5px;">
                                      Current ${label}
                                    </p>
                                    <p style="margin:0; font-size:36px; font-weight:700; color:${mainColor};">
                                      ${formattedValue}
                                    </p>
                                    <p style="margin:5px 0 0 0; font-size:16px; font-weight:500; color:${changeColor};">
                                      ${formattedChange}
                                    </p>
                                  </div>
                              </div>

                              <!-- Alert Details -->
                              <div class="dark-info-box" style="background-color: #212328; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                                  <h3 class="dark-text" style="margin: 0 0 15px 0; font-size: 18px; font-weight: 600; color: #ffffff;">
                                      Alert Details
                                  </h3>
                                  <p class="mobile-text dark-text-secondary" style="margin: 0 0 10px 0; font-size: 16px; line-height: 1.5; color: #9ca3af;">
                                  <strong>Condition:</strong> ${label} ${conditionText} ${formattedThreshold}
                                  </p>
                                  <p class="mobile-text dark-text-secondary" style="margin: 0 0 10px 0; font-size: 16px; line-height: 1.5; color: #9ca3af;">
                                  <strong>Current Value:</strong> ${formattedValue}
                                  </p>
                              </div>

                              <!-- Success Message -->
                              <div style="background-color: #050505; border: 1px solid #374151; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                                  <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600; color: #E8BA40;">
                                      Opportunity Alert!
                                  </h3>
                                  <p class="mobile-text" style="margin: 0; font-size: 14px; line-height: 1.5; color: #ccdadc;">
                                 ${aiMessage}
                              </div>

                              <!-- Action Button -->
                              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 30px;">
                                  <tr>
                                      <td align="center">
                                          <a href="https://stock-market-dev.vercel.app/" style="display: block; width: 100%; max-width: 100%; box-sizing: border-box; color: #000000; background-color: #E8BA40; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-size: 16px; font-weight: 500; line-height: 1; text-align: center;">
                                              View Dashboard
                                          </a>
                                      </td>
                                  </tr>
                              </table>

                               <!-- Footer Text -->
                              <div style="text-align: center; margin: 40px 0 0 0;">
                                  <p style="margin: 0 0 10px 0; font-size: 14px; line-height: 1.5; color: #CCDADC !important;">
                                      You're receiving this because you subscribed to Signalist news updates.
                                  </p>
                                  <p style="margin: 0 0 10px 0; font-size: 14px; line-height: 1.5; color: #CCDADC !important;">
                                      <a href="#" style="color: #CCDADC !important; text-decoration: underline;">Unsubscribe</a> |
                                      <a href="https://signalist.app" style="color: #CCDADC !important; text-decoration: underline;">Visit Signalist</a>
                                  </p>
                                  <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #CCDADC !important;">
                                      © 2025 Signalist
                                  </p>
                              </div>
                          </td>
                      </tr>

                  </table>
              </td>
          </tr>
      </table>
  </body>
  </html>`;
}
