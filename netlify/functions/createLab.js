const { headers, connectToDatabase, createLab } = require('../../public/helpers/db');

exports.handler = async function (event) {
  const handleCors = (statusCode, body) => ({
    statusCode,
    headers: headers,
    body: JSON.stringify(body),
  });

  // Handle preflight request
  if (event.httpMethod === 'OPTIONS') {
    return handleCors(200, {});
  }

  try {
    const body = JSON.parse(event.body);
    const db = await connectToDatabase();
    const response = await createLab(db, body);

    if (response.success) {
      return handleCors(200, response);
    } else {
      return handleCors(401, response);
    }
  } catch {
    return handleCors(500, {
      error: 'Internal server error',
    });
  }
}