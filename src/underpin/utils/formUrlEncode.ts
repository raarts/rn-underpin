// encode an object so it can be used in a POST form.
const formUrlEncode = (obj: object): string => {
  const formBody: string[] = [];
  Object.entries(obj).forEach(([key, value]) => {
    const encodedKey = encodeURIComponent(key);
    const encodedValue = encodeURIComponent(value || 'null');
    formBody.push(`${encodedKey}=${encodedValue}`);
  });
  return formBody.join('&');
};

export default formUrlEncode;
