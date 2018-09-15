export const mockResponse = (
  body = {},
  customOptions = {},
  delay = 3000
) => async (endpoint, options) => {
  const fakeResponse = new Response(JSON.stringify(body), {
    headers: { "Content-Type": "application/json" },
    code: 200,
    ...customOptions
  });
  return await new Promise(resolve =>
    setTimeout(resolve.bind(this, fakeResponse), delay)
  );
};
