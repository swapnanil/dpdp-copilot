export function renderEvidenceHtml({ org, request, evidence }) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>DPDP Evidence Report</title>
  <style>
    body {
      font-family: Inter, Arial, sans-serif;
      padding: 40px;
      color: #111;
    }
    h1 {
      font-size: 22px;
      margin-bottom: 20px;
    }
    .meta {
      margin-bottom: 20px;
      font-size: 13px;
    }
    .section {
      margin-top: 24px;
    }
    .box {
      background: #f7f7f7;
      padding: 12px;
      border-radius: 6px;
      font-size: 13px;
      white-space: pre-wrap;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
      font-size: 13px;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    th {
      background: #f0f0f0;
    }
    .badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 12px;
      background: #e6f4ea;
      color: #137333;
      font-size: 12px;
      margin-left: 6px;
    }
  </style>
</head>

<body>
  <h1>DPDP Compliance Evidence Report</h1>

  <div class="meta">
    <div><strong>Organization:</strong> ${org.name}</div>
  </div>


  <div class="meta">
    <div><strong>Request ID:</strong> ${request.id}</div>
    <div><strong>Type:</strong> ${request.type}</div>
    <div><strong>Status:</strong> ${request.sla_status}</div>
    <div><strong>Created:</strong> ${new Date(request.created_at).toLocaleString()}</div>
  </div>

  <div class="section">
    <h3>Original Message</h3>
    <div class="box">${request.message}</div>
  </div>

  ${
    request.suggested_reply
      ? `
    <div class="section">
      <h3>Suggested Reply</h3>
      <div class="box">${request.suggested_reply}</div>
    </div>
  `
      : ''
  }

  <div class="section">
    <h3>Evidence Timeline</h3>
    <table>
      <thead>
        <tr>
          <th>Timestamp</th>
          <th>Event</th>
        </tr>
      </thead>
      <tbody>
        ${evidence
          .map(
            e => `
          <tr>
            <td>${new Date(e.created_at).toISOString()}</td>
            <td>${e.event_type}</td>
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>
  </div>
</body>
</html>
`
}
